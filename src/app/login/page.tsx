"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B14] p-4 font-sans text-slate-200">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-[#0C0F1E]/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_24px_rgba(124,58,237,0.4)]">
            <Scale size={24} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-100 mb-2 tracking-tight">Chào mừng trở lại</h1>
        <p className="text-sm text-center text-slate-400 mb-8">Đăng nhập để truy cập LegalLens ZenAI</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Đăng nhập"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Chưa có tài khoản? <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
