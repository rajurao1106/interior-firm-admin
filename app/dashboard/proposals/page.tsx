"use client";

import { Plus, Search, Download, Eye, MoreHorizontal, FileText } from "lucide-react";

const proposals = [
  {
    number: "PROP-2024-004",
    client: "Mr. Sharma",
    project: "Living Room Redesign",
    template: "Residential Premium",
    createdAt: "Jan 08, 2024",
    status: "sent",
    initial: "S",
  },
  {
    number: "PROP-2024-003",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    template: "Commercial Standard",
    createdAt: "Nov 28, 2023",
    status: "accepted",
    initial: "K",
  },
  {
    number: "PROP-2024-002",
    client: "Mr. Verma",
    project: "Villa Interior",
    template: "Luxury Villa",
    createdAt: "Nov 12, 2023",
    status: "accepted",
    initial: "V",
  },
  {
    number: "PROP-2024-001",
    client: "Ms. Patel",
    project: "Kitchen Redesign",
    template: "Residential Standard",
    createdAt: "Jan 18, 2024",
    status: "draft",
    initial: "P",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  accepted: { label: "Accepted", color: "#10B981", bg: "#ECFDF5" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
};

export default function ProposalsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Proposals</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Template-driven documents to win clients</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={15} />
          New Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Proposals", value: "4", color: "#C8922A" },
          { label: "Accepted", value: "2", color: "#10B981" },
          { label: "Sent / Pending", value: "1", color: "#3B82F6" },
          { label: "Drafts", value: "1", color: "#6B7280" },
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
          <input type="text" placeholder="Search proposals..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
        <select className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] outline-none">
          <option>All Status</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Proposal #", "Client", "Project", "Template", "Created", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposals.map((p, i) => {
              const st = statusConfig[p.status];
              return (
                <tr key={i} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#C8922A]" />
                      <span className="text-[13px] font-semibold text-[#C8922A]">{p.number}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center">
                        {p.initial}
                      </div>
                      <span className="text-[13px] font-medium text-[#1C1C1C]">{p.client}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{p.project}</td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{p.template}</td>
                  <td className="px-5 py-4 text-[12px] text-[#9A8F82]">{p.createdAt}</td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#C8922A]">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#1C1C1C]">
                        <Download size={13} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82]">
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
