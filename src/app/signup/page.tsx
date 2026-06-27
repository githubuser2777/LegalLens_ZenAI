"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner, ArrowRight, Scales } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md p-8 bg-background border-2 border-foreground">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-foreground text-background">
            <Scales size={28} weight="bold" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-foreground uppercase tracking-tight mb-2">Request Access</h1>
        <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest mb-8">Register for LegalLens ZenAI</p>

        {success ? (
          <div className="text-center bg-emerald-500/10 border border-emerald-500/20 p-6">
            <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2">Registration Logged</h3>
            <p className="text-[10px] font-mono text-muted-foreground mb-6">
              Please verify your clearance level via the email dispatched to you.
            </p>
            <Link href="/login" className="inline-block px-4 py-3 bg-background border border-border hover:border-foreground text-foreground text-xs font-bold uppercase tracking-widest transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                placeholder="operator@legallens.ai"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 p-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Spinner size={18} className="animate-spin" /> : "Request Clearance"}
              {!loading && <ArrowRight size={18} weight="bold" />}
            </button>
          </form>
        )}

        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mt-8">
          Already cleared? <Link href="/login" className="text-foreground hover:underline">Authenticate</Link>
        </p>
      </div>
    </div>
  );
}
