"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/context/AuthContext";
import {
  Send,
  Bot,
  User,
  Copy,
  RotateCcw,
  Trash2,
  Moon,
  Sun,
  Check,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

type OrderStatus = "Processing" | "Dispatched" | "Delivered" | "Cancelled";

type OrderStatusAction = {
  type: "updateOrderStatus";
  orderId: string;
  newStatus: OrderStatus;
  customerName?: string;
};

type ActionState = "pending" | "confirmed" | "cancelled" | "error";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  action?: OrderStatusAction | null;
  actionState?: ActionState;
};

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  text: "Welcome back! I'm your AI Business Assistant. I can help draft product copy, marketing content, customer replies, answer questions about your live store data, and update order statuses. What would you like to do today?",
};

const SUGGESTED_PROMPTS = [
  "Show today's sales",
  "Which products need restocking?",
  "Show pending orders",
  "Write a Facebook post for a discount campaign",
  "Draft an SEO meta description for a product",
  "Write a reply to a customer complaint",
];

const ALLOWED_STATUSES: OrderStatus[] = ["Processing", "Dispatched", "Delivered", "Cancelled"];

function extractAction(rawText: string): { cleanText: string; action: OrderStatusAction | null } {
  const match = rawText.match(/```action\s*([\s\S]*?)```/);
  if (!match) return { cleanText: rawText, action: null };

  try {
    const parsed = JSON.parse(match[1].trim());
    if (
      parsed?.type === "updateOrderStatus" &&
      typeof parsed.orderId === "string" &&
      ALLOWED_STATUSES.includes(parsed.newStatus)
    ) {
      const cleanText = rawText.replace(match[0], "").trim();
      return {
        cleanText,
        action: {
          type: "updateOrderStatus",
          orderId: parsed.orderId,
          newStatus: parsed.newStatus,
          customerName: typeof parsed.customerName === "string" ? parsed.customerName : undefined,
        },
      };
    }
  } catch {
    // Malformed JSON from the model — just show the text as-is, no action card.
  }
  return { cleanText: rawText, action: null };
}

export default function AdminAIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminAiDarkMode");
    if (stored === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("adminAiDarkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendToAI(history: Message[]) {
    setIsTyping(true);
    try {
      const res = await fetch("/api/admin-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      const rawReply: string =
        data.reply || "Sorry, something went wrong. Please try again.";
      const { cleanText, action } = extractAction(rawReply);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: cleanText,
          action,
          actionState: action ? "pending" : undefined,
        },
      ]);
    } catch (err) {
      console.error("Admin AI request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Sorry, I ran into an error reaching the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    sendToAI(updated);
  }

  function handleRegenerate() {
    if (isTyping) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const cutIndex = messages.length - 1 - lastUserIdx;
    const trimmed = messages.slice(0, cutIndex + 1);
    setMessages(trimmed);
    sendToAI(trimmed);
  }

  function handleClear() {
    setMessages([GREETING]);
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleConfirmAction(messageId: string) {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.action) return;

    if (!user) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, actionState: "error" } : m))
      );
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin-actions/update-order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          orderId: msg.action.orderId,
          newStatus: msg.action.newStatus,
        }),
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, actionState: res.ok ? "confirmed" : "error" } : m
        )
      );
    } catch (err) {
      console.error("Failed to confirm order status action:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, actionState: "error" } : m))
      );
    }
  }

  function handleCancelAction(messageId: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, actionState: "cancelled" } : m))
    );
  }

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-[calc(100vh-8rem)] flex-col rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-charcoal dark:text-white">
                AI Business Assistant
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Products &middot; Orders &middot; Marketing &middot; Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={!hasUserMessages || isTyping}
              title="Regenerate last response"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setDarkMode((d) => !d)}
              title="Toggle dark mode"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    m.role === "assistant"
                      ? "bg-burgundy text-white"
                      : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  {m.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div
                  className={`group relative max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === "assistant"
                      ? "bg-neutral-100 text-charcoal dark:bg-neutral-800 dark:text-neutral-100"
                      : "bg-burgundy text-white"
                  }`}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-pre:rounded-md prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                  </div>

                  {m.action && (
                    <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700/60 dark:bg-amber-900/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={15}
                          className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                        />
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                          Update order <span className="font-mono">{m.action.orderId}</span>
                          {m.action.customerName ? ` (${m.action.customerName})` : ""} to{" "}
                          <strong>{m.action.newStatus}</strong>?
                        </p>
                      </div>

                      {(!m.actionState || m.actionState === "pending") && (
                        <div className="mt-2.5 flex gap-2">
                          <button
                            onClick={() => handleConfirmAction(m.id)}
                            className="rounded-md bg-burgundy px-3 py-1.5 text-xs font-semibold text-white hover:bg-burgundy/90"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleCancelAction(m.id)}
                            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {m.actionState === "confirmed" && (
                        <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          ✓ Order updated
                        </p>
                      )}
                      {m.actionState === "cancelled" && (
                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          Cancelled — no changes made.
                        </p>
                      )}
                      {m.actionState === "error" && (
                        <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">
                          Something went wrong — please try again.
                        </p>
                      )}
                    </div>
                  )}

                  {m.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="absolute -bottom-2 -right-2 rounded-full border border-neutral-200 bg-white p-1.5 text-neutral-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-charcoal dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-burgundy text-white">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Suggested prompts */}
        {!hasUserMessages && (
          <div className="border-t border-neutral-200 px-5 py-3 dark:border-neutral-700">
            <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:border-burgundy hover:text-burgundy dark:border-neutral-700 dark:text-neutral-300"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-neutral-200 px-5 py-4 dark:border-neutral-700">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your store..."
              rows={1}
              className="max-h-32 flex-1 resize-none rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-burgundy text-white hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}