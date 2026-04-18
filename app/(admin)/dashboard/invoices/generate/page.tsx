"use client";

import { useState } from "react";
<<<<<<< HEAD
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
=======
import { Zap, ChevronDown, Eye, Download } from "lucide-react";

const milestones = [
  { id: "1", label: "Advance on Booking", percentage: 10 },
  { id: "2", label: "After Layout Approval", percentage: 20 },
  { id: "3", label: "Before 3D Handover", percentage: 25 },
  { id: "4", label: "Before Execution Start", percentage: 25 },
  { id: "5", label: "During Execution", percentage: 15 },
  { id: "6", label: "Final Handover", percentage: 5 },
];

const invoiceTypes = [
  "advance", "design_fee", "site_visit", "material",
  "execution", "running_bill", "final", "balance", "proforma", "credit_note"
];

const GRAND_TOTAL = 74340;

export default function GenerateInvoicePage() {
  const [selectedQuotation, setSelectedQuotation] = useState("QUOTE-2024-006");
  const [selectedMilestone, setSelectedMilestone] = useState(milestones[0]);
  const [invoiceType, setInvoiceType] = useState("advance");
  const [invoiceDate, setInvoiceDate] = useState("2024-01-15");
  const [notes, setNotes] = useState("Please pay within 15 days.");
  const [generated, setGenerated] = useState(false);

  const invoiceAmount = (GRAND_TOTAL * selectedMilestone.percentage) / 100;
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Generate Invoice</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Auto-generate from an approved quotation</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-5">
            <p className="text-[14px] font-bold text-[#1C1C1C] mb-4">Invoice Details</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Select Quotation</label>
                <select
                  value={selectedQuotation}
                  onChange={(e) => setSelectedQuotation(e.target.value)}
                  className="w-full border border-[#EDE8DF] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]"
                >
                  <option value="QUOTE-2024-006">QUOTE-2024-006 · Mr. Sharma · ₹74,340</option>
                  <option value="QUOTE-2024-005">QUOTE-2024-005 · Mrs. Kapoor · ₹2,15,000</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Invoice Type</label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full border border-[#EDE8DF] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]"
                >
                  {invoiceTypes.map((t) => (
                    <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full border border-[#EDE8DF] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-[#EDE8DF] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Milestone Picker */}
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-5">
            <p className="text-[14px] font-bold text-[#1C1C1C] mb-4">Select Billing Milestone</p>
            <div className="space-y-2">
              {milestones.map((m) => {
                const amount = (GRAND_TOTAL * m.percentage) / 100;
                const active = selectedMilestone.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMilestone(m)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                      active
                        ? "border-[#C8922A] bg-[#FDF3E3]"
                        : "border-[#EDE8DF] hover:border-[#C8922A40] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div>
                      <p className={`text-[13px] font-semibold ${active ? "text-[#C8922A]" : "text-[#1C1C1C]"}`}>
                        {m.label}
                      </p>
                      <p className="text-[11px] text-[#9A8F82]">{m.percentage}% of Grand Total</p>
                    </div>
                    <span className={`text-[14px] font-bold ${active ? "text-[#C8922A]" : "text-[#1C1C1C]"}`}>
                      {fmt(amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-5">
            <p className="text-[14px] font-bold text-[#1C1C1C] mb-4">Invoice Preview</p>

            {/* Mini invoice mockup */}
            <div className="border border-[#EDE8DF] rounded-xl overflow-hidden">
              <div className="bg-[#C8922A] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-[14px]">InteriorBill Pro</p>
                    <p className="text-white/70 text-[11px]">TAX INVOICE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-[13px]">INV-2024-013</p>
                    <p className="text-white/70 text-[11px]">Date: {invoiceDate || "—"}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <div>
                    <p className="text-[11px] text-[#9A8F82] uppercase tracking-wide mb-1">Bill To</p>
                    <p className="font-semibold text-[#1C1C1C]">Mr. Rajiv Sharma</p>
                    <p className="text-[#6B6259]">Living Room Redesign</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#9A8F82] uppercase tracking-wide mb-1">Milestone</p>
                    <p className="font-semibold text-[#1C1C1C]">{selectedMilestone.label}</p>
                    <p className="text-[#6B6259]">{selectedMilestone.percentage}% of total</p>
                  </div>
                </div>
                <div className="border-t border-[#EDE8DF] pt-3">
                  <div className="flex justify-between text-[12px] text-[#9A8F82] mb-1">
                    <span>Invoice Type</span>
                    <span>{invoiceType.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-[#9A8F82] mb-1">
                    <span>Source Quotation</span>
                    <span className="text-[#C8922A] font-semibold">{selectedQuotation}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-[#9A8F82]">
                    <span>Due Date</span>
                    <span>Jan 30, 2024 (15 days)</span>
                  </div>
                </div>
                <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1C1C1C]">Amount Due</span>
                  <span className="text-[22px] font-bold text-[#C8922A]">{fmt(invoiceAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => setGenerated(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[14px] font-bold py-4 rounded-xl transition-colors"
          >
            <Zap size={16} />
            Generate Invoice
          </button>

          {generated && (
            <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-4">
              <p className="text-[14px] font-bold text-[#10B981] mb-1">✓ Invoice Generated!</p>
              <p className="text-[13px] text-[#065F46]">INV-2024-013 created for {fmt(invoiceAmount)}</p>
              <div className="flex gap-3 mt-3">
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#10B981] hover:underline">
                  <Eye size={13} /> Preview PDF
                </button>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#10B981] hover:underline">
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          )}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
