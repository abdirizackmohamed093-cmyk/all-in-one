"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      // Clean up Firebase error messages for a premium user experience
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("The email or password entered is incorrect.");
      } else {
        setError(err.message || "An authentication error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </header>

      {/* Login Card Form */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full border border-neutral-200 rounded p-8 sm:p-10 shadow-sm bg-neutral-50/30">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-neutral-900">Welcome Back</h1>
            <p className="text-xs text-neutral-400 uppercase tracking-widest mt-2">Access your luxury showroom portfolio</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-neutral-200 rounded pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-neutral-200 rounded pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-sans font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500">
              New to the platform?{" "}
              <Link href="/signup" className="font-bold text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simple Space Balance Footer */}
      <footer className="py-6 text-center text-[10px] text-neutral-400 tracking-wider">
        © {new Date().getFullYear()} ALL_IN_ONE_SHOP. Secure Authentication.
      </footer>
    </div>
  );
}