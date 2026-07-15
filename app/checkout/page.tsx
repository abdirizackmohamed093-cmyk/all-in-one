"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { addOrder } from "@/lib/firebase/orders";
import { Loader2, ShieldCheck, Smartphone, Truck } from "lucide-react";

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
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Checkout
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Complete your order in a few quick steps
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* LEFT — steps */}
          <div className="space-y-6">
            {/* Step 1: Payment */}
            <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-burgundy text-white text-xs font-bold shrink-0">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal">
                  Payment via M-Pesa
                </h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start gap-3 mb-5">
                  <Smartphone className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Buy Goods and Services
                  </p>
                </div>

                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-md px-5 py-4 mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500">
                    Till Number
                  </span>
                  <span className="font-serif text-2xl font-bold text-charcoal tracking-wider">
                    {TILL_NUMBER}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                    M-Pesa Reference Code{" "}
                    <span className="normal-case text-neutral-400 font-normal">
                      (optional, speeds up confirmation)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={mpesaReference}
                    onChange={function (e) {
                      setMpesaReference(e.target.value.toUpperCase());
                    }}
                    placeholder="e.g. UGEJNB5D6G"
                    className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-colors"
                  />
                  <p className="text-xs text-neutral-400 mt-2">
                    You'll receive this in your M-Pesa confirmation SMS after paying.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 2: Delivery details */}
            <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-burgundy text-white text-xs font-bold shrink-0">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal">
                  Delivery Details
                </h2>
              </div>
              <form
                onSubmit={handlePlaceOrder}
                id="checkout-form"
                className="px-6 py-5 space-y-5"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={function (e) {
                      setName(e.target.value);
                    }}
                    placeholder="Your full name"
                    className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-colors"
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
                    onChange={function (e) {
                      setAddress(e.target.value);
                    }}
                    placeholder="Street, town, county"
                    className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-colors"
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
                    onChange={function (e) {
                      setPhone(e.target.value);
                    }}
                    placeholder="07XX XXX XXX"
                    className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-colors"
                  />
                </div>
              </form>
            </section>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-1">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-burgundy" />
                Secure checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Truck className="w-4 h-4 text-burgundy" />
                Nationwide delivery
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Smartphone className="w-4 h-4 text-burgundy" />
                M-Pesa verified
              </div>
            </div>
          </div>

          {/* RIGHT — order summary, sticky */}
          <div className="lg:sticky lg:top-24">
            <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-5 space-y-3 max-h-80 overflow-y-auto">
                {cart.map(function (item) {
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        {item.name}{" "}
                        <span className="text-neutral-400">x{item.quantity}</span>
                      </span>
                      <span className="text-charcoal font-medium shrink-0 ml-3">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-medium">Calculated on dispatch</span>
                </div>
                <div className="flex justify-between pt-2 mt-1 border-t border-neutral-200">
                  <span className="text-sm font-bold text-charcoal">Total</span>
                  <span className="font-serif text-2xl font-bold text-charcoal">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              <div className="px-6 py-5">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={placing}
                  className="w-full py-3.5 bg-burgundy text-white hover:opacity-90 text-xs font-bold tracking-widest uppercase rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {placing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </button>
                <p className="text-[11px] text-neutral-400 text-center mt-3 leading-relaxed">
                  By placing this order you agree to pay via M-Pesa Till{" "}
                  {TILL_NUMBER} and confirm the delivery details above are correct.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}