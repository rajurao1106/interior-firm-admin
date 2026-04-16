"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Receipt,
  CreditCard,
  History,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  Lock,
} from "lucide-react";
import "./../globals.css";

// Nav items definition with 'adminOnly' flag
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { label: "Clients", href: "/dashboard/clients", icon: Users, adminOnly: false },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen, adminOnly: false },
  { label: "Proposals", href: "/dashboard/proposals", icon: FileText, adminOnly: false },
  { label: "Quotations", href: "/dashboard/quotations", icon: Receipt, adminOnly: true },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt, adminOnly: true },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard, adminOnly: true },
  { label: "History", href: "/dashboard/history", icon: History, adminOnly: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Real scenario mein yahan hum 'jwt-decode' library use karke 
    // localStorage se token nikal kar role extract karenge.
    const token = localStorage.getItem("token"); 
    
    // Demo logic: Maan lijiye humne role 'admin' ya 'designer' store kiya hai
    const storedRole = localStorage.getItem("userRole") || "designer"; 
    setUserRole(storedRole);
  }, []);

  const isAdmin = userRole === "admin" || userRole !== "owner";

  return (
    <div className="flex h-screen bg-[#FAF8F5] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-[#EDE8DF] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#EDE8DF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C8922A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1C1C1C] leading-tight">InteriorBill</p>
              <p className="text-[10px] text-[#9A8F82] uppercase tracking-wider">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item) => {
            // Role Check: Agar item adminOnly hai aur user admin nahi hai, to hide karein
            if (item.adminOnly && !isAdmin) return null;

            const Icon = item.icon;
            const active = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition-all ${
                  active
                    ? "bg-[#FDF3E3] text-[#C8922A] font-semibold"
                    : "text-[#6B6259] hover:bg-[#FAF8F5] hover:text-[#1C1C1C]"
                }`}
              >
                <Icon size={16} className={active ? "text-[#C8922A]" : "text-[#9A8F82]"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-5 border-t border-[#EDE8DF] pt-4 space-y-0.5">
          {/* Settings: Sirf Admin ko dikhega */}
          {isAdmin && (
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                pathname === "/dashboard/settings" ? "bg-[#FDF3E3] text-[#C8922A]" : "text-[#6B6259] hover:bg-[#FAF8F5]"
              }`}
            >
              <Settings size={16} className="text-[#9A8F82]" />
              Settings
            </Link>
          )}
          
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#D04040] hover:bg-[#FFF0F0]"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-[60px] bg-white border-b border-[#EDE8DF] flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg px-3 py-2 w-[280px]">
            <span className="text-[#9A8F82]"><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none flex-1"
            />
          </div>

          <div className="flex-1" />

          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF8F5]">
            <Bell size={18} className="text-[#6B6259]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8922A] rounded-full" />
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#EDE8DF]">
            <div className="w-7 h-7 rounded-full bg-[#C8922A] flex items-center justify-center text-white text-xs font-bold">
              {userRole?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1C1C1C] leading-none">
                {isAdmin ? "Administrator" : "Designer"}
              </span>
              <span className="text-[10px] text-[#9A8F82]">Active Now</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          {/* Global Protection: Agar Junior Designer manual URL se restricted page par jaye */}
          {(pathname.includes("settings") || pathname.includes("invoices")) && !isAdmin ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Lock size={48} className="text-[#9A8F82] mb-4" />
              <h2 className="text-xl font-bold text-[#1C1C1C]">Access Denied</h2>
              <p className="text-[#6B6259]">You don't have permission to view this section.</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}