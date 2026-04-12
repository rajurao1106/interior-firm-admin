"use client";

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
} from "lucide-react";
import "./globals.css";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { label: "Quotations", href: "/dashboard/quotations", icon: Receipt },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "History", href: "/dashboard/history", icon: History },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
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
                  <p className="text-[10px] text-[#9A8F82]">Pro</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
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

            {/* Bottom */}
            <div className="px-3 pb-5 border-t border-[#EDE8DF] pt-4 space-y-0.5">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6259] hover:bg-[#FAF8F5]"
              >
                <Settings size={16} className="text-[#9A8F82]" />
                Settings
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#D04040] hover:bg-[#FFF0F0]">
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-[60px] bg-white border-b border-[#EDE8DF] flex items-center px-6 gap-4 shrink-0">
              <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg px-3 py-2 w-[280px]">
                <span className="text-[#9A8F82]"><Search size={14} /></span>
                <input
                  type="text"
                  placeholder="Search clients, invoices..."
                  className="bg-transparent text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none flex-1"
                />
              </div>

              <div className="flex-1" />

              <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF8F5]">
                <Bell size={18} className="text-[#6B6259]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8922A] rounded-full" />
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FAF8F5]">
                <div className="w-7 h-7 rounded-full bg-[#C8922A] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <span className="text-[13px] font-medium text-[#1C1C1C]">Admin</span>
                <ChevronDown size={14} className="text-[#9A8F82]" />
              </button>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}