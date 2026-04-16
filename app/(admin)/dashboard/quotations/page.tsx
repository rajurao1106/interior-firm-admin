"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Eye, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: "Approved", color: "#10B981", bg: "#ECFDF5" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
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
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {quotations.length === 0 && (
          <div className="py-20 text-center border-t border-[#F5F2ED]">
            <p className="text-[#9A8F82] text-[14px]">No quotations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}