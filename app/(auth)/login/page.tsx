"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid login credentials");
      }

      // 1. Token Save Karein
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh); // Optional: for token refreshing

      // 2. Redirect to Dashboard
      router.push("/dashboard");
      router.refresh(); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C8922A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C8922A30]">
            <span className="text-white font-bold text-xl">IB</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">InteriorBill Pro</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-1">Welcome back</h2>
          <p className="text-[13px] text-[#9A8F82] mb-6">Sign in to your firm account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-[12px] rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Email</label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-3 focus-within:border-[#C8922A] transition-colors">
                <Mail size={15} className="text-[#9A8F82]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 text-[13px] outline-none bg-transparent"
                  placeholder="admin@yourfirm.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-3 focus-within:border-[#C8922A] transition-colors">
                <Lock size={15} className="text-[#9A8F82]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 text-[13px] outline-none bg-transparent"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:bg-[#D4B47F] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}