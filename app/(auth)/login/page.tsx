"use client";

import { useState } from "react";
<<<<<<< HEAD
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
=======
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FDF3E3] rounded-full opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FDF3E3] rounded-full opacity-40" />
      </div>

      <div className="w-full max-w-[400px] relative">
        {/* Logo */}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C8922A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C8922A30]">
            <span className="text-white font-bold text-xl">IB</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">InteriorBill Pro</h1>
<<<<<<< HEAD
        </div>

=======
          <p className="text-[13px] text-[#9A8F82] mt-1">Proposal · Quotation · Invoice</p>
        </div>

        {/* Card */}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-1">Welcome back</h2>
          <p className="text-[13px] text-[#9A8F82] mb-6">Sign in to your firm account</p>

<<<<<<< HEAD
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
=======
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-3 focus-within:border-[#C8922A] transition-colors">
                <Mail size={15} className="text-[#9A8F82] shrink-0" />
                <input
                  type="email"
                  placeholder="admin@yourfirm.com"
                  className="flex-1 text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none bg-transparent"
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                />
              </div>
            </div>

            <div>
<<<<<<< HEAD
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
=======
              <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-3 focus-within:border-[#C8922A] transition-colors">
                <Lock size={15} className="text-[#9A8F82] shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9A8F82] hover:text-[#1C1C1C] transition-colors"
                >
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:bg-[#D4B47F] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
=======
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#C8922A]" />
                <span className="text-[12px] text-[#6B6259]">Remember me</span>
              </label>
              <button className="text-[12px] text-[#C8922A] hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <Link href="/dashboard">
              <button className="w-full bg-[#C8922A] hover:bg-[#B07A20] text-white font-semibold text-[14px] py-3 rounded-xl transition-colors mt-2">
                Sign In
              </button>
            </Link>

            <div className="pt-4 text-center border-t border-[#F5F2ED] mt-4">
              <p className="text-[13px] text-[#9A8F82]">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#C8922A] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#9A8F82] mt-5">
          InteriorBill Pro v1.0 · For Interior Design Firms
        </p>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
      </div>
    </div>
  );
}