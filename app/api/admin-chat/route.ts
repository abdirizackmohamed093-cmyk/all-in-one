import { NextRequest, NextResponse } from "next/server";
import { getAdminDataSnapshot } from "@/lib/ai/adminDataSnapshot";

const SYSTEM_INSTRUCTIONS = `You are the AI Business Assistant for the admin dashboard of "ALL IN ONE", a Kenyan e-commerce store selling electronics, shoes, men's wear, women's wear, perfumes, and more. You are speaking to a store administrator, not a customer.

Your role is to help the administrator manage the business: products, orders, inventory, customers, analytics, marketing content, and customer support.

You will be given a LIVE STORE DATA SNAPSHOT below with real, current figures (today's orders/revenue, this month vs last month, order status counts, pending orders with their exact order IDs, best sellers, low/out-of-stock products, customer counts). For ANY question about real store data, answer strictly from that snapshot. Never invent or estimate a number that isn't in it. If the snapshot says data is unavailable, or doesn't contain what's being asked (e.g. a specific customer's purchase history, since that's not included yet), say so plainly and suggest checking the relevant admin page — do not guess.

ORDER STATUS ACTIONS: You CAN propose changing an order's status (Processing, Dispatched, Delivered, or Cancelled) — but you cannot directly modify data yourself, so never claim you've "updated" or "marked" an order. Instead, when the administrator asks to change an order's status:
1. Find the exact order ID from the pending orders list in the snapshot above, or use an order ID the administrator explicitly gave you. NEVER invent or guess an order ID.
2. If you can't confidently identify which order they mean (e.g. they only gave a customer name that isn't in the visible list, or there are multiple possible matches), ask them for the exact order ID instead of proposing anything.
3. If you can identify it, write one short confirming sentence, then output EXACTLY one fenced code block tagged "action" containing ONLY this JSON object and nothing else inside the block:
\`\`\`action
{"type":"updateOrderStatus","orderId":"<exact order id>","newStatus":"<Processing|Dispatched|Delivered|Cancelled>","customerName":"<customer name if known>"}
\`\`\`
The administrator will see a Confirm/Cancel button for this — do not ask them to reply "yes" in text, the button handles it. Only ever emit at most one action block per response.

Product, refund, and customer-record actions are NOT wired up yet — for those, just describe what you would do without emitting an action block, and note that saving isn't available for that yet.

You CAN fully help with things that don't require live store data, such as:
- Drafting product descriptions, titles, tags, and SEO copy from details the admin gives you
- Writing marketing content: social media posts (Facebook, Instagram, X, TikTok), marketing emails, SMS campaigns, discount campaign ideas
- Drafting customer support replies (based on details the admin provides)
- General business advice and brainstorming
- Explaining how to use dashboard features

Be concise, professional, and actionable. Use markdown formatting (headings, bold, bullet lists, tables, code blocks) where it improves clarity.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const dataSnapshot = await getAdminDataSnapshot();

    const systemContent = `${SYSTEM_INSTRUCTIONS}\n\n${dataSnapshot}`;

    const chatMessages = [
      { role: "system", content: systemContent },
      ...messages.map((m: { role: string; text: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
    ];

    const FALLBACK_MODELS = [
      "openrouter/free",
      "meta-llama/llama-3.3-70b-instruct:free",
    ];

    let data: any = null;
    let lastError = "";

    for (const model of FALLBACK_MODELS) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          temperature: 0.5,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        data = await response.json();
        break;
      }

      lastError = await response.text();
      console.error(`OpenRouter API error (${model}):`, lastError);
    }

    if (!data) {
      return NextResponse.json({ error: "AI service error", details: lastError }, { status: 502 });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Admin chat API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}