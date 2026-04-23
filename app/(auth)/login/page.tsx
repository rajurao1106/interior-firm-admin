// "use client";

// import { useState } from "react";
// import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { loginUser } from "@/services/authService";

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const tokens = await loginUser(formData);
//       localStorage.setItem("token", tokens.access);
//       localStorage.setItem("refresh", tokens.refresh);
//       router.push("/dashboard");
//       router.refresh();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo / Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C8922A] rounded-2xl mb-4 shadow-lg shadow-[#C8922A]/30">
//             <span className="text-white text-2xl font-black">IB</span>
//           </div>
//           <h1 className="text-2xl font-black text-[#1C1C1C]">Welcome back</h1>
//           <p className="text-[#9A8F82] text-sm mt-1">Sign in to your InteriorBill account</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-sm p-8">
//           {error && (
//             <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-[#6B6259] uppercase tracking-widest">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={16} />
//                 <input
//                   required
//                   type="email"
//                   placeholder="you@firm.com"
//                   value={formData.email}
//                   onChange={e => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-[14px] outline-none focus:border-[#C8922A] focus:ring-4 focus:ring-[#C8922A]/5 transition-all"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-[#6B6259] uppercase tracking-widest">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={16} />
//                 <input
//                   required
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={e => setFormData({ ...formData, password: e.target.value })}
//                   className="w-full pl-10 pr-12 py-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-[14px] outline-none focus:border-[#C8922A] focus:ring-4 focus:ring-[#C8922A]/5 transition-all"
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82] hover:text-[#1C1C1C]">
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 bg-[#C8922A] hover:bg-[#B07A20] text-white font-black rounded-xl shadow-lg shadow-[#C8922A]/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In"}
//             </button>
//           </form>

//           <p className="text-center text-[13px] text-[#9A8F82] mt-6">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" className="text-[#C8922A] font-bold hover:underline">Create one</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

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
      const tokens = await loginUser(formData);
      
      // 🔥 FIX: Set BOTH "access" (primary) AND "token" (fallback)
      localStorage.setItem("access", tokens.access);        // ✅ Primary key
      localStorage.setItem("token", tokens.access);         // ✅ Fallback for old code
      localStorage.setItem("access_token", tokens.access);  // ✅ Extra fallback
      localStorage.setItem("refresh", tokens.refresh);
      
      console.log("✅ Login successful, tokens saved:");
      console.log("access:", tokens.access.substring(0, 30) + "...");
      
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
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C8922A] rounded-2xl mb-4 shadow-lg shadow-[#C8922A]/30">
            <span className="text-white text-2xl font-black">IB</span>
          </div>
          <h1 className="text-2xl font-black text-[#1C1C1C]">Welcome back</h1>
          <p className="text-[#9A8F82] text-sm mt-1">
            Sign in to your InteriorBill account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#6B6259] uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82]"
                  size={16}
                />
                <input
                  required
                  type="email"
                  placeholder="you@firm.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-[14px] outline-none focus:border-[#C8922A] focus:ring-4 focus:ring-[#C8922A]/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#6B6259] uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82]"
                  size={16}
                />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-[14px] outline-none focus:border-[#C8922A] focus:ring-4 focus:ring-[#C8922A]/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A8F82] hover:text-[#1C1C1C]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8922A] hover:bg-[#B07A20] text-white font-black rounded-xl shadow-lg shadow-[#C8922A]/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#9A8F82] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#C8922A] font-bold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}