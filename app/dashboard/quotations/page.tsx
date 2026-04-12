"use client";

import { Plus, Search, Filter, Download, Eye, MoreHorizontal, ChevronDown, Copy } from "lucide-react";

const quotations = [
  {
    number: "QUOTE-2024-006",
    version: "v1",
    client: "Mr. Sharma",
    project: "Living Room Redesign",
    items: 8,
    subtotal: "₹70,000",
    gst: "₹11,340",
    total: "₹74,340",
    validUntil: "Feb 15, 2024",
    status: "approved",
    initial: "S",
  },
  {
    number: "QUOTE-2024-005",
    version: "v2",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    items: 12,
    subtotal: "₹1,85,000",
    gst: "₹30,000",
    total: "₹2,15,000",
    validUntil: "Feb 10, 2024",
    status: "sent",
    initial: "K",
  },
  {
    number: "QUOTE-2024-004",
    version: "v1",
    client: "Mr. Verma",
    project: "Villa Interior",
    items: 15,
    subtotal: "₹1,60,000",
    gst: "₹28,500",
    total: "₹1,88,500",
    validUntil: "Jan 30, 2024",
    status: "superseded",
    initial: "V",
  },
  {
    number: "QUOTE-2024-003",
    version: "v1",
    client: "Ms. Patel",
    project: "Kitchen Redesign",
    items: 6,
    subtotal: "₹48,000",
    gst: "₹7,000",
    total: "₹55,000",
    validUntil: "Feb 28, 2024",
    status: "draft",
    initial: "P",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: "Approved", color: "#10B981", bg: "#ECFDF5" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
  superseded: { label: "Superseded", color: "#9CA3AF", bg: "#F9FAFB" },
};

export default function QuotationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Quotations</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Build and manage itemized quotes with GST</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={15} />
          New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Quoted", value: "₹5,32,840", color: "#C8922A" },
          { label: "Approved", value: "8", color: "#10B981" },
          { label: "Pending Approval", value: "4", color: "#3B82F6" },
          { label: "Drafts", value: "3", color: "#6B7280" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#EDE8DF] p-4">
            <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[12px] text-[#9A8F82] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
          <input type="text" placeholder="Search quotations..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
        <select className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] outline-none">
          <option>All Status</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Approved</option>
        </select>
        <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] hover:bg-[#FAF8F5]">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Quote #", "Client", "Project", "Items", "Subtotal", "GST", "Grand Total", "Valid Until", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, i) => {
              const st = statusConfig[q.status];
              return (
                <tr key={i} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-[#C8922A]">{q.number}</p>
                      <p className="text-[11px] text-[#9A8F82]">{q.version}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center">
                        {q.initial}
                      </div>
                      <span className="text-[13px] font-medium text-[#1C1C1C]">{q.client}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6B6259]">{q.project}</td>
                  <td className="px-4 py-4 text-[13px] text-[#1C1C1C] font-medium">{q.items}</td>
                  <td className="px-4 py-4 text-[13px] text-[#6B6259]">{q.subtotal}</td>
                  <td className="px-4 py-4 text-[13px] text-[#6B6259]">{q.gst}</td>
                  <td className="px-4 py-4 text-[13px] font-bold text-[#1C1C1C]">{q.total}</td>
                  <td className="px-4 py-4 text-[12px] text-[#9A8F82]">{q.validUntil}</td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#C8922A] transition-colors" title="Preview">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#1C1C1C] transition-colors" title="Download PDF">
                        <Download size={13} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#1C1C1C] transition-colors" title="Revise">
                        <Copy size={13} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] transition-colors">
                        <MoreHorizontal size={13} />
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
