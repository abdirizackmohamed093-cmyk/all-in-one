"use client";

import React from "react";

export default function AdminDashboardPage() {
  // Analytical mock indicators designed to match active operational scaling data fields
  const performanceKPIs = [
    { title: "Gross Revenue", value: "KSh 1,240,500", trend: "+14.2% vs last month", color: "text-emerald-400" },
    { title: "Active Orders", value: "48 Pending", trend: "12 marked express delivery", color: "text-amber-400" },
    { title: "Total Customers", value: "1,820 Users", trend: "+24 new signups today", color: "text-blue-400" },
    { title: "Conversion Velocity", value: "3.42%", trend: "Industry benchmarks high (+0.8%)", color: "text-accent" },
  ];

  const recentTransactions = [
    { id: "AIO-9082", customer: "Mwangi Kamau", product: "The Heritage Burgundy Blazer", amount: "KSh 18,500", status: "Processing", date: "Today, 14:22" },
    { id: "AIO-9081", customer: "Amina Omondi", product: "Minimalist Gold Chronograph", amount: "KSh 24,000", status: "Dispatched", date: "Today, 11:05" },
    { id: "AIO-9080", customer: "David Kiprop", product: "Wireless Noise-Cancelling Pods x2", amount: "KSh 59,998", status: "Delivered", date: "Yesterday, 17:45" },
    { id: "AIO-9079", customer: "Grace Nafula", product: "Classic Pebble Leather Tote", amount: "KSh 14,500", status: "Processing", date: "Yesterday, 13:10" },
  ];

  return (
    <div className="space-y-10">
      {/* Visual Header Node Greeting */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Operational Overview</h1>
        <p className="text-xs font-light text-white/50 mt-1">
          Real-time analytical trends for the ALL IN ONE platform in Kenya.
        </p>
      </div>

      {/* KPI Performance Metrics Grid Frame */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceKPIs.map((kpi, idx) => (
          <div key={idx} className="bg-[#14171A] border border-white/5 rounded p-6 space-y-3 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">{kpi.title}</span>
            <div className={`text-2xl font-light tracking-tight ${kpi.color}`}>{kpi.value}</div>
            <p className="text-[11px] font-light text-white/50">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Operational Logs & Transaction Matrix Grid splits */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side Table Framework - Recent Live Orders */}
        <div className="xl:col-span-2 bg-[#14171A] border border-white/5 rounded p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-white/80 font-semibold">Live Fulfillment Stream</h3>
            <button className="text-[11px] font-medium uppercase tracking-wider text-accent hover:underline">Manage All Logs</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider text-[10px] font-medium">
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Curated Product</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-mono text-accent">{tx.id}</td>
                    <td className="py-4 font-normal">{tx.customer}</td>
                    <td className="py-4 text-white/60">{tx.product}</td>
                    <td className="py-4 font-medium">{tx.amount}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide uppercase ${
                        tx.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        tx.status === "Dispatched" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Frame - Operations System Controls Checklist */}
        <div className="bg-[#14171A] border border-white/5 rounded p-6 space-y-6 shadow-xl">
          <h3 className="text-xs uppercase tracking-widest text-white/80 font-semibold">Terminal Tasks</h3>
          
          <ul className="space-y-4 text-xs font-light text-white/70">
            <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded">
              <span className="text-amber-400 text-sm font-bold leading-none">&bull;</span>
              <div>
                <p className="font-medium text-white/90">Review Inventory Alert</p>
                <p className="text-[11px] text-white/40 mt-0.5">Elite Electronics Stock drop warning (&lt; 5 units).</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded">
              <span className="text-emerald-400 text-sm font-bold leading-none">&bull;</span>
              <div>
                <p className="font-medium text-white/90">Database Baseline Sync</p>
                <p className="text-[11px] text-white/40 mt-0.5">Firebase storage synchronization routines passing clean.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded">
              <span className="text-blue-400 text-sm font-bold leading-none">&bull;</span>
              <div>
                <p className="font-medium text-white/90">Promo Engine Validation</p>
                <p className="text-[11px] text-white/40 mt-0.5">Nairobi region express-checkout coupons checked.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
