"use client";

import { useState } from "react";
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#C8922A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C8922A30]">
            <span className="text-white font-bold text-xl">IB</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">InteriorBill Pro</h1>
          <p className="text-[13px] text-[#9A8F82] mt-1">Proposal · Quotation · Invoice</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-1">Welcome back</h2>
          <p className="text-[13px] text-[#9A8F82] mb-6">Sign in to your firm account</p>

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
                />
              </div>
            </div>

            <div>
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
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

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
      </div>
    </div>
  );
}