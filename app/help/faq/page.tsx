import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I pay for my order?",
    a: "We accept M-Pesa via Buy Goods (Till Number). At checkout, you'll see our Till Number — pay through Lipa na M-Pesa, then optionally enter your M-Pesa confirmation code so we can verify your payment faster.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery timelines depend on your location. Once your order is marked \"Dispatched\" in your account, it's on its way. You can check your order status anytime under My Orders.",
  },
  {
    q: "How do I track my order?",
    a: "Log in and go to My Orders from the account menu. Every order shows its current status: Processing, Dispatched, or Delivered.",
  },
  {
    q: "Can I cancel or change my order after placing it?",
    a: "Contact us on WhatsApp as soon as possible after placing your order. If it hasn't been dispatched yet, we can usually make changes or cancel it.",
  },
  {
    q: "What if my M-Pesa payment isn't confirmed?",
    a: "If you entered your M-Pesa reference code at checkout, we can confirm faster. If not, reach out to us on WhatsApp with your order number and payment details and we'll verify it manually.",
  },
  {
    q: "Do you accept returns?",
    a: "If an item arrives damaged or incorrect, contact us on WhatsApp within 24 hours of delivery with photos of the item, and we'll sort it out.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-2">
        Help &amp; FAQ
      </h1>
      <p className="text-sm text-neutral-500 mb-10">
        Answers to common questions about ordering, payment, and delivery.
      </p>

      <div className="space-y-6">
        {faqs.map((item, idx) => (
          <div key={idx} className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-bold text-neutral-900 mb-2">{item.q}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-burgundy/20 bg-burgundy/5 rounded-lg p-6 flex items-start gap-4">
        <MessageCircle className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-neutral-900 mb-1">
            Still need help?
          </p>
          <p className="text-sm text-neutral-600 mb-3">
            Message us directly on WhatsApp and we'll respond as soon as we can.
          </p>
          
           <a href="https://wa.me/254732477111" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-burgundy text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity">
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}