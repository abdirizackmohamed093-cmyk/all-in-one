"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail } from "@/services/authService";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State parameters
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLogin) {
      const { user, error: loginError } = await signInWithEmail({ email, password });
      if (loginError) {
        setError(loginError);
      } else if (user) {
        router.push("/"); // Securely route to home storefront catalog upon verification
      }
    } else {
      if (!displayName.trim()) {
        setError("Please enter your elegant name.");
        setLoading(false);
        return;
      }
      const { user, error: signupError } = await signUpWithEmail({ email, password, displayName });
      if (signupError) {
        setError(signupError);
      } else if (user) {
        router.push("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Visual Identity Panel - Displayed beautifully on Desktop views */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_50%)]" />
        
        <div>
          <span className="text-xl font-bold tracking-widest text-accent">ALL IN ONE</span>
        </div>

        <div className="max-w-md z-10">
          <h1 className="text-4xl font-light tracking-tight leading-tight mb-4">
            Everything You Need, <br />
            <span className="font-serif italic text-accent">All in One Place.</span>
          </h1>
          <p className="text-white/80 font-light text-sm leading-relaxed">
            Welcome to Kenya's premium digital storefront destination. Step inside to experience unparalleled curated luxury collections tailored perfectly to your lifestyle.
          </p>
        </div>

        <div>
          <p className="text-xs text-white/40 font-light">&copy; {new Date().getFullYear()} ALL IN ONE Retailers. All rights reserved.</p>
        </div>
      </div>

      {/* Interactive Form Panel */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-light tracking-tight text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-foreground/60 mt-2 font-light">
              {isLogin ? "Sign in to access your luxury collections." : "Register below to experience premier shopping."}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded text-sm text-primary font-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs tracking-wider uppercase font-medium text-foreground/70">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded bg-transparent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-light"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs tracking-wider uppercase font-medium text-foreground/70">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded bg-transparent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-light"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs tracking-wider uppercase font-medium text-foreground/70">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded bg-transparent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-light"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 px-4 rounded text-sm tracking-wider uppercase font-medium hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs tracking-wide text-foreground/60 hover:text-primary transition-colors underline underline-offset-4 font-light"
            >
              {isLogin ? "New to ALL IN ONE? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}