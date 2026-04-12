"use client";

import { Plus, Search, Filter, MoreHorizontal, ExternalLink, Building2, Phone, Mail } from "lucide-react";

const clients = [
  {
    name: "Mr. Rajiv Sharma",
    email: "rajiv.sharma@email.com",
    phone: "+91 98765 43210",
    projects: 3,
    totalBilled: "₹3,45,000",
    outstanding: "₹74,340",
    status: "active",
    initial: "R",
  },
  {
    name: "Mrs. Priya Kapoor",
    email: "priya.kapoor@email.com",
    phone: "+91 87654 32109",
    projects: 1,
    totalBilled: "₹2,15,000",
    outstanding: "₹0",
    status: "active",
    initial: "P",
  },
  {
    name: "Mr. Arjun Verma",
    email: "arjun.verma@email.com",
    phone: "+91 76543 21098",
    projects: 2,
    totalBilled: "₹1,88,500",
    outstanding: "₹38,200",
    status: "on_hold",
    initial: "A",
  },
  {
    name: "Ms. Neha Patel",
    email: "neha.patel@email.com",
    phone: "+91 65432 10987",
    projects: 1,
    totalBilled: "₹55,000",
    outstanding: "₹27,500",
    status: "active",
    initial: "N",
  },
  {
    name: "Mr. Suresh Mehta",
    email: "suresh.mehta@email.com",
    phone: "+91 54321 09876",
    projects: 4,
    totalBilled: "₹6,20,000",
    outstanding: "₹0",
    status: "completed",
    initial: "S",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ClientsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Clients</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Manage your client relationships</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={15} />
          Add New Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
          <input
            type="text"
            placeholder="Search clients..."
            className="bg-transparent text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none flex-1"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] hover:bg-[#FAF8F5]">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Client", "Contact", "Projects", "Total Billed", "Outstanding", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[12px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => {
              const st = statusConfig[c.status];
              return (
                <tr key={i} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FDF3E3] text-[#C8922A] font-bold text-[14px] flex items-center justify-center shrink-0">
                        {c.initial}
                      </div>
                      <span className="text-[13px] font-semibold text-[#1C1C1C]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[12px] text-[#6B6259]">
                        <Mail size={11} className="text-[#9A8F82]" /> {c.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#6B6259]">
                        <Phone size={11} className="text-[#9A8F82]" /> {c.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-[13px] text-[#1C1C1C] font-medium">
                      <Building2 size={13} className="text-[#9A8F82]" /> {c.projects}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#1C1C1C]">{c.totalBilled}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold" style={{ color: c.outstanding === "₹0" ? "#10B981" : "#EF4444" }}>
                    {c.outstanding}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-[#9A8F82] hover:text-[#C8922A] transition-colors">
                        <ExternalLink size={14} />
                      </button>
                      <button className="text-[#9A8F82] hover:text-[#1C1C1C] transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
