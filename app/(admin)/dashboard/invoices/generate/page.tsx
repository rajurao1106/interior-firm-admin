"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ChevronLeft, Eye, Download, CheckCircle2 } from "lucide-react";

const milestones = [
  { label: "Advance on Booking", percentage: 10 },
  { label: "After Layout Approval", percentage: 20 },
  { label: "Before 3D Handover", percentage: 25 },
  { label: "Final Handover", percentage: 5 },
];

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    project: "4aa33d3c-7d68-4a1b-aae1-49e9c5e5bed6", // Replace with dynamic selection logic
    quotation: "6813b175-06d4-43a6-b92f-98ee62c34693",
    invoice_type: "advance",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    milestone_label: milestones[0].label,
    milestone_percentage: milestones[0].percentage,
    notes: "Please pay within 7 days."
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/invoices/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          invoice_number: Math.floor(Math.random() * 1000).toString(), // Backend usually handles this
          grand_total: "15000.00", // Example calc: (ProjectTotal * percentage) / 100
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/invoices"), 2000);
      }
    } catch (err) {
      console.error("Failed to generate invoice", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-[13px] text-[#9A8F82] mb-4 hover:text-[#1C1C1C]">
        <ChevronLeft size={14} /> Back to Invoices
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">Generate Invoice</h1>
          <p className="text-[14px] text-[#9A8F82]">Create a new billing request from an approved quote</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-[#EDE8DF]">
            <h3 className="text-[14px] font-bold mb-4">Invoice Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Invoice Type</label>
                <select 
                  className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A]"
                  onChange={(e) => setFormData({...formData, invoice_type: e.target.value})}
                >
                  <option value="advance">Advance Payment</option>
                  <option value="running_bill">Running Bill</option>
                  <option value="final">Final Settlement</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Date</label>
                  <input type="date" value={formData.invoice_date} className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-1.5">Due Date</label>
                  <input type="date" onChange={(e) => setFormData({...formData, due_date: e.target.value})} className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px]" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-[#EDE8DF]">
            <h3 className="text-[14px] font-bold mb-4">Select Milestone</h3>
            <div className="grid gap-3">
              {milestones.map((m) => (
                <button 
                  key={m.label}
                  onClick={() => setFormData({...formData, milestone_label: m.label, milestone_percentage: m.percentage})}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.milestone_label === m.label ? 'border-[#C8922A] bg-[#FDF3E3]' : 'border-[#EDE8DF] hover:bg-[#FAF8F5]'}`}
                >
                  <span className="text-[13px] font-medium">{m.label}</span>
                  <span className="text-[13px] font-bold text-[#C8922A]">{m.percentage}%</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1C1C1C] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] text-white/50 uppercase tracking-widest mb-1">Preview Amount</p>
              <h2 className="text-[32px] font-bold">₹15,000.00</h2>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-white/50">Milestone</span>
                  <span>{formData.milestone_label}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-white/50">Type</span>
                  <span className="capitalize">{formData.invoice_type}</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#C8922A] rounded-full blur-[80px] opacity-20"></div>
          </div>

          <button 
            disabled={loading || success}
            onClick={handleGenerate}
            className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:bg-[#EDE8DF] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8922A]/20"
          >
            {loading ? "Processing..." : success ? <><CheckCircle2 size={18}/> Generated!</> : <><Zap size={18}/> Generate & Save Invoice</>}
          </button>
        </div>
      </div>
    </div>
  );
}