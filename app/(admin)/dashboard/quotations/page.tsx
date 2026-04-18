"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Plus, Search, Eye, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
=======
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
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: "Approved", color: "#10B981", bg: "#ECFDF5" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
<<<<<<< HEAD
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/quotations/");
      const data = await res.json();
      setQuotations(data.results || []);
    } catch (err) {
      console.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/quotations/${id}/`, { method: "DELETE" });
      if (res.ok) setQuotations(quotations.filter(q => q.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-[#9A8F82]">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="text-[13px]">Loading quotations...</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">Quotations</h1>
          <p className="text-[14px] text-[#9A8F82]">Manage and track your project estimates</p>
        </div>
        <Link href="/dashboard/quotations/new" className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
          <Plus size={18} /> New Quotation
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
              <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Quote Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Client & Project</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Grand Total</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F2ED]">
            {quotations.map((q) => {
              const st = statusConfig[q.status] || statusConfig.draft;
              return (
                <tr key={q.id} className="hover:bg-[#FAF8F5] transition-colors group">
                  <td className="px-6 py-5">
                    <Link href={`/dashboard/quotations/${q.id}`} className="block">
                      <span className="text-[14px] font-bold text-[#C8922A]">#{q.quote_number}</span>
                      <span className="block text-[11px] text-[#9A8F82] mt-0.5">Version {q.version}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[14px] font-semibold text-[#1C1C1C] block">{q.client_name}</span>
                    <span className="text-[12px] text-[#6B6259]">{q.project_name}</span>
                  </td>
                  <td className="px-6 py-5 font-bold text-[#1C1C1C] text-[14px]">
                    ₹{parseFloat(q.grand_total).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter" style={{ color: st.color, backgroundColor: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/quotations/${q.id}`} className="p-2 text-[#9A8F82] hover:text-[#C8922A] hover:bg-[#FDF3E3] rounded-lg transition-colors">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => handleDelete(q.id)} className="p-2 text-[#9A8F82] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
=======
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
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
<<<<<<< HEAD
        {quotations.length === 0 && (
          <div className="py-20 text-center border-t border-[#F5F2ED]">
            <p className="text-[#9A8F82] text-[14px]">No quotations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
=======
      </div>
    </div>
  );
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
