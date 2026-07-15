"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { addOrder } from "@/lib/firebase/orders";
import { Loader2 } from "lucide-react";

const TILL_NUMBER = "4410 4410";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [mpesaReference, setMpesaReference] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async function (e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    const orderId = await addOrder({
      customerId: user.uid,
      customerName: name.trim(),
      customerEmail: user.email || "",
      deliveryAddress: address.trim(),
      phone: phone.trim(),
      mpesaReference: mpesaReference.trim(),
      items: cart.map(function (item) {
        return {
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        };
      }),
      total: cartTotal,
    });

    setPlacing(false);

    if (orderId) {
      clearCart();
      router.push("/order-confirmation?orderId=" + orderId);
    } else {
      setError("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
          Checkout
        </h1>
        <p className="text-neutral-500 text-sm">
          Your cart is empty. Add items before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-8">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
          {error}
        </div>
      )}

      <div className="border border-neutral-200 rounded-md p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
          Order Summary
        </h2>
        <div className="space-y-2">
          {cart.map(function (item) {
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-700">
                  {item.name} x{item.quantity}
                </span>
                <span className="text-neutral-900 font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-neutral-100 mt-4 pt-4 flex justify-between">
          <span className="text-sm font-bold text-neutral-900">Total</span>
          <span className="font-serif text-xl font-bold text-neutral-900">
            {formatCurrency(cartTotal)}
          </span>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-md p-6 mb-6 bg-neutral-50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
          Pay via M-Pesa
        </h2>
        <p className="text-sm text-neutral-700 mb-1">
          Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Buy Goods and Services
        </p>
        <div className="flex items-center justify-between mt-3 mb-1">
          <span className="text-xs uppercase tracking-widest text-neutral-500">Till Number</span>
          <span className="font-serif text-xl font-bold text-neutral-900 tracking-wider">
            {TILL_NUMBER}
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          After paying, you'll get an M-Pesa confirmation SMS with a reference code
          (e.g. UGEJNB5D6G). You can enter it below so we can confirm your payment faster —
          it's optional, but helps us process your order sooner.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-5 border border-neutral-200 rounded-md p-6">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={function (e) { setName(e.target.value); }}
            placeholder="Your full name"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Delivery Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={function (e) { setAddress(e.target.value); }}
            placeholder="Street, town, county"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={function (e) { setPhone(e.target.value); }}
            placeholder="07XX XXX XXX"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            M-Pesa Reference Code <span className="normal-case text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={mpesaReference}
            onChange={function (e) { setMpesaReference(e.target.value.toUpperCase()); }}
            placeholder="e.g. UGEJNB5D6G"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-colors font-mono tracking-wider"
          />
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {placing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Place Order"
          )}
        </button>
      </form>
    </div>
  );
}