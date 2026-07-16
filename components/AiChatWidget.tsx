"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm the ALL IN ONE assistant. Ask me about payments, delivery, or your order.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sorry, something went wrong. Try WhatsApp: +254732477111",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try WhatsApp: +254732477111",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
          <div className="bg-burgundy text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-sm font-bold">ALL IN ONE Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 h-80 overflow-y-auto px-3 py-3 space-y-2 bg-neutral-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-burgundy text-white rounded-br-none"
                      : "bg-white border border-neutral-200 text-neutral-700 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 px-3 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 p-2 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:border-burgundy"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-burgundy text-white p-2 rounded-md disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 bg-burgundy hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </>
  );
}