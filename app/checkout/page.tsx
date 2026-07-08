"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Nairobi",
    address: "",
    notes: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // This framework hook will connect to our Firestore order placement routine next
    console.log("Order submission payload built successfully:", { formData, cart, total: cartTotal });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
          </Link>
        </div>

        {/* Checkout Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Delivery Processing Matrix (7/12 Width) */}
          <div className="lg:col-span-7 bg-white border border-border rounded p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                Secure Checkout
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded">
                <Lock className="w-3 h-3 text-accent" /> Encrypted Connection
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent">
                1. Delivery Logistics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">First Name</label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Name</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number (M-Pesa Delivery contact)</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="e.g., 0712345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">City / Region</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                    <option value="Other">Other Region</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Physical Street Address / Apartment</label>
                  <input
                    required
                    type="text"
                    name="address"
                    placeholder="e.g., Kilimani, Wood Avenue, Block B Room 4"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Additional Delivery Instructions (Optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Gate codes, landmarks, or specific delivery times..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white transition-all resize-none"
                />
              </div>

              <div className="border-t border-border pt-6 mt-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                  2. Review & Authorized Execution
                </h2>
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-primary text-primary-foreground font-sans tracking-widest text-xs uppercase font-semibold rounded shadow-md hover:bg-primary/95 transition-all duration-300 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  Confirm Order & Proceed to Payment
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: High-End Itemized Ledger (5/12 Width) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-border rounded p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold border-b border-border pb-4 mb-4 tracking-wide">
                Order Ledger Summary
              </h2>

              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No items staged for purchase.</p>
              ) : (
                <div className="divide-y divide-muted max-h-80 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="relative w-14 h-16 bg-muted rounded border border-border overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder-product.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground flex-shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Financial Calculation Matrix */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Express Logistics</span>
                  <span className="text-emerald-600 font-medium uppercase tracking-wider text-xs">
                    {cartTotal >= 10000 ? "Complimentary" : "KES 500"}
                  </span>
                </div>
                <div className="border-t border-muted pt-3 flex justify-between items-center">
                  <span className="font-serif text-base font-semibold text-foreground">Total Ledger</span>
                  <span className="font-serif text-xl font-bold text-foreground">
                    {formatCurrency(cartTotal >= 10000 || cartTotal === 0 ? cartTotal : cartTotal + 500)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Matrix Card */}
            <div className="bg-white border border-border rounded p-4 flex items-start gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Consumer Protection Guarantee</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every order is covered by our delivery assurance system. Transactions remain fully verified before local courier dispatch.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}