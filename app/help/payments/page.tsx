import Link from "next/link";
import { ArrowLeft, Smartphone, ShieldCheck, MessageCircle } from "lucide-react";

export default function PaymentsHelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-2">
        How Payments Work
      </h1>
      <p className="text-sm text-neutral-500 mb-10">
        We currently accept payment via M-Pesa only.
      </p>

      <div className="space-y-6">
        <div className="border border-neutral-200 rounded-lg p-6 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-burgundy">1</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">
              Add items to your cart and go to Checkout
            </h2>
            <p className="text-sm text-neutral-600">
              Fill in your delivery details as usual.
            </p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-lg p-6 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-burgundy">2</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">
              Pay via M-Pesa Buy Goods
            </h2>
            <p className="text-sm text-neutral-600">
              On the checkout page, go to your M-Pesa menu &rarr; Lipa na M-Pesa
              &rarr; Buy Goods and Services &rarr; enter our Till Number shown on
              the checkout page.
            </p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-lg p-6 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-burgundy">3</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">
              Enter your M-Pesa reference code (optional but recommended)
            </h2>
            <p className="text-sm text-neutral-600">
              You'll get a confirmation SMS from M-Pesa with a reference code
              (e.g. UGEJNB5D6G). Entering it at checkout helps us confirm your
              payment and process your order faster.
            </p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-lg p-6 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-burgundy">4</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">
              Place your order
            </h2>
            <p className="text-sm text-neutral-600">
              Once submitted, track its status anytime under My Orders in your
              account.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 text-sm text-neutral-500">
        <ShieldCheck className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
        <p>
          We never ask for your M-Pesa PIN. Only send payment through the
          official Buy Goods flow on your own phone.
        </p>
      </div>

      <div className="mt-10 border border-burgundy/20 bg-burgundy/5 rounded-lg p-6 flex items-start gap-4">
        <MessageCircle className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-neutral-900 mb-1">
            Payment not going through, or unconfirmed?
          </p>
          <p className="text-sm text-neutral-600 mb-3">
            Message us on WhatsApp with your order details and we'll help right away.
          </p>
          
           <a href="https://wa.me/254732477111" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-burgundy text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity">
            <Smartphone className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}