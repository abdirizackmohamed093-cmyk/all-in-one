import { NextRequest, NextResponse } from "next/server";

const SYSTEM_CONTEXT = `You are the AI customer support assistant for "ALL IN ONE", a Kenyan e-commerce store selling electronics, shoes, men's wear, and women's wear. Answer customer questions helpfully, briefly, and in a friendly tone.

Key facts about the store:
- Payment: We only accept M-Pesa. Customers pay via M-Pesa Buy Goods (Till Number 3463030) at checkout, then can optionally enter their M-Pesa confirmation reference code to speed up order confirmation.
- Order tracking: Customers can see their order status (Processing, Dispatched, Delivered) by logging in and going to "My Orders" in their account menu.
- Delivery: Delivery timelines vary by location. Once an order is "Dispatched" it is on its way.
- Cancellations/changes: Customers should contact us on WhatsApp as soon as possible after ordering if they want to cancel or change something.
- Returns: If an item arrives damaged or wrong, customers should contact WhatsApp within 24 hours with photos.
- We never ask for a customer's M-Pesa PIN.
- WhatsApp contact: +254702886362

If a question is outside what you know (e.g. specific stock availability, specific pricing you're not told, or something requiring human judgment), tell the customer to reach out via WhatsApp at +254732477111 for further help. Keep answers concise — 2-4 sentences typically. Do not make up information you don't have.`;

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

    const chatMessages = [
      { role: "system", content: SYSTEM_CONTEXT },
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
          temperature: 0.4,
          max_tokens: 300,
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
      "Sorry, I couldn't generate a response. Please try again or reach us on WhatsApp at +254702886362.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}