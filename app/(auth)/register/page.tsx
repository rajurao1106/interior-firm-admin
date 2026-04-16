"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, UserCircle, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "owner",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Registration failed");
      }

      // On Success: Redirect to login or dashboard
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FDF3E3] rounded-full opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FDF3E3] rounded-full opacity-40" />
      </div>

      <div className="w-full max-w-[420px] relative">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#C8922A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C8922A30]">
            <span className="text-white font-bold text-xl">IB</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">InteriorBill Pro</h1>
          <p className="text-[13px] text-[#9A8F82] mt-1">Proposal · Quotation · Invoice</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-1">Get started</h2>
          <p className="text-[13px] text-[#9A8F82] mb-6">Create your professional profile</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[12px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B6259] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus-within:border-[#C8922A] transition-colors">
                <UserCircle size={16} className="text-[#9A8F82] shrink-0" />
                <input
                  required
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="flex-1 text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B6259] mb-1.5 uppercase tracking-wider">
                Assign Role
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus-within:border-[#C8922A] transition-colors bg-white">
                <ShieldCheck size={16} className="text-[#9A8F82] shrink-0" />
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex-1 text-[13px] text-[#1C1C1C] outline-none bg-transparent cursor-pointer"
                >
                  <option value="owner">Firm Owner (Full Access)</option>
                  <option value="manager">Project Manager (Create/Edit)</option>
                  <option value="accountant">Accountant (Finance/View)</option>
                  <option value="designer">Junior Designer (Read Only)</option>
                </select>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B6259] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus-within:border-[#C8922A] transition-colors">
                <Mail size={16} className="text-[#9A8F82] shrink-0" />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="admin@yourfirm.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B6259] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-2 border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus-within:border-[#C8922A] transition-colors">
                <Lock size={16} className="text-[#9A8F82] shrink-0" />
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9A8F82] hover:text-[#1C1C1C]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#C8922A] hover:bg-[#B07A20] text-white font-semibold text-[14px] py-3 rounded-xl transition-all shadow-md active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="pt-4 text-center border-t border-[#F5F2ED] mt-4">
              <p className="text-[13px] text-[#9A8F82]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#C8922A] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}