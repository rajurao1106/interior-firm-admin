"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, X, Loader2, Download, Search } from "lucide-react";

// Matches your API result object exactly
interface Invoice {
  id: string;
  project: string;
  project_name: string;
  client_name: string;
  quotation: string;
  invoice_number: string;
  invoice_type: string;
  invoice_date: string;
  due_date: string;
  status: string;
  milestone_label: string;
  grand_total: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  issued: { label: "Issued", color: "#3B82F6", bg: "#EFF6FF" },
  paid: { label: "Paid", color: "#10B981", bg: "#ECFDF5" },
  overdue: { label: "Overdue", color: "#EF4444", bg: "#FEF2F2" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State initialized with your provided UUIDs
  const [formData, setFormData] = useState({
    project: "4aa33d3c-7d68-4a1b-aae1-49e9c5e5bed6",
    quotation: "6813b175-06d4-43a6-b92f-98ee62c34693",
    project_name: "",
    client_name: "",
    invoice_number: "",
    invoice_type: "full",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: "",
    status: "issued",
    milestone_label: "",
    milestone_percentage: "0.00",
    grand_total: "0.00",
    notes: "",
  });

  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/invoices/");
      const data = await res.json();
      setInvoices(data.results);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/invoices/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInvoices(); // Refresh list after creation
      } else {
        const errData = await res.json();
        alert("Error: " + JSON.stringify(errData));
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (val: string) => "₹" + parseFloat(val || "0").toLocaleString("en-IN");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Invoices</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Manage and track your project billing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
            <tr>
              {["Inv #", "Client", "Project", "Amount", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin inline text-[#C8922A]" /></td></tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors">
                <td className="px-5 py-4 text-[13px] font-bold text-[#C8922A]">#{inv.invoice_number}</td>
                <td className="px-5 py-4 text-[13px] font-medium text-[#1C1C1C]">{inv.client_name}</td>
                <td className="px-5 py-4 text-[13px] text-[#6B6259]">{inv.project_name}</td>
                <td className="px-5 py-4 text-[13px] font-bold text-[#1C1C1C]">{fmt(inv.grand_total)}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight" 
                        style={{ color: statusConfig[inv.status]?.color, backgroundColor: statusConfig[inv.status]?.bg }}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 hover:bg-[#EDE8DF] rounded-md text-[#9A8F82]"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Sidebar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h2 className="text-[18px] font-bold">Create New Invoice</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F3F4F6] rounded-full text-[#9A8F82]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Invoice #</label>
                  <input required type="text" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                    onChange={e => setFormData({...formData, invoice_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Amount (₹)</label>
                  <input required type="number" step="0.01" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                    onChange={e => setFormData({...formData, grand_total: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Client Name</label>
                <input required type="text" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                  onChange={e => setFormData({...formData, client_name: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Project Name</label>
                <input required type="text" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                  onChange={e => setFormData({...formData, project_name: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Milestone Label</label>
                <input required type="text" placeholder="e.g. Design Approval" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                  onChange={e => setFormData({...formData, milestone_label: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Due Date</label>
                <input required type="date" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[14px] outline-none focus:border-[#C8922A]"
                  onChange={e => setFormData({...formData, due_date: e.target.value})} />
              </div>

              <div className="pt-8">
                <button 
                  disabled={submitting}
                  className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:bg-[#EDE8DF] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Generate Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}