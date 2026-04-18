"use client";

<<<<<<< HEAD
import { useEffect, useState, use } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuotationEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [quotation, setQuotation] = useState<any>({
    quote_number: "", client_name: "", project_name: "", status: "draft",
    discount_type: "percentage", discount_value: "0", cgst_rate: "9", sgst_rate: "9", notes: ""
  });
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (id === "new") { setLoading(false); return; }
    fetch(`http://127.0.0.1:8000/api/v1/quotations/${id}/`)
      .then(res => res.json())
      .then(data => {
        setQuotation(data);
        setItems(data.items || []);
        setLoading(false);
      }).catch(() => router.push("/dashboard/quotations"));
  }, [id, router]);

  // Calculations Logic
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)), 0);
  const disc = parseFloat(quotation.discount_value || 0);
  const discountAmount = quotation.discount_type === "fixed" ? disc : (subtotal * disc) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxRate = parseFloat(quotation.cgst_rate) + parseFloat(quotation.sgst_rate);
  const totalTax = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + totalTax;

  const handleSave = async () => {
    setSaving(true);
    const isNew = id === "new";
    const url = isNew ? "http://127.0.0.1:8000/api/v1/quotations/" : `http://127.0.0.1:8000/api/v1/quotations/${id}/`;
    
    const payload = {
      ...quotation,
      items: items,
      subtotal: subtotal.toFixed(2),
      total_tax: totalTax.toFixed(2),
      taxable_amount: taxableAmount.toFixed(2),
      grand_total: grandTotal.toFixed(2)
    };

    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(isNew ? "Quotation Created!" : "Quotation Updated!");
        router.push("/dashboard/quotations");
      }
    } catch (err) { alert("Error saving data"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#C8922A]" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/quotations" className="flex items-center gap-2 text-[#9A8F82] hover:text-[#C8922A] transition-colors font-medium text-[14px]">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#1C1C1C] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-black disabled:opacity-50 transition-all">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {id === "new" ? "Create Quotation" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-sm grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#9A8F82] uppercase block mb-1">Client Name</label>
              <input value={quotation.client_name} onChange={e => setQuotation({...quotation, client_name: e.target.value})} className="w-full text-[15px] font-semibold outline-none border-b border-transparent focus:border-[#C8922A] py-1 transition-all" placeholder="Enter client name..." />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#9A8F82] uppercase block mb-1">Project Name</label>
              <input value={quotation.project_name} onChange={e => setQuotation({...quotation, project_name: e.target.value})} className="w-full text-[15px] font-semibold outline-none border-b border-transparent focus:border-[#C8922A] py-1 transition-all" placeholder="Enter project name..." />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-4 p-4 bg-[#FAF8F5] border-b border-[#EDE8DF] text-[10px] font-bold text-[#9A8F82] uppercase">
              <div>Item Description</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Rate (₹)</div>
              <div className="text-right">Total</div>
              <div />
            </div>
            <div className="divide-y divide-[#F5F2ED]">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-4 p-4 items-center group transition-colors hover:bg-[#FAF8F5]/50">
                  <input value={item.description} onChange={e => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} className="text-[13px] bg-transparent outline-none font-medium" placeholder="Describe work..." />
                  <input type="number" value={item.quantity} onChange={e => { const n = [...items]; n[idx].quantity = e.target.value; setItems(n); }} className="text-[13px] bg-transparent outline-none text-center" />
                  <input type="number" value={item.rate} onChange={e => { const n = [...items]; n[idx].rate = e.target.value; setItems(n); }} className="text-[13px] bg-transparent outline-none text-right font-medium" />
                  <div className="text-right text-[13px] font-bold text-[#1C1C1C]">₹{(parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)).toLocaleString()}</div>
                  <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-[#C8C0B5] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button onClick={() => setItems([...items, { description: "", quantity: 1, rate: 0 }])} className="w-full p-4 text-[13px] text-[#C8922A] font-bold flex items-center justify-center gap-2 hover:bg-[#FDF3E3] transition-colors border-t border-[#F5F2ED]">
              <Plus size={16} /> Add Work Item
            </button>
          </div>
        </div>

        {/* Totals Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-sm">
            <h3 className="text-[12px] font-bold text-[#1C1C1C] uppercase mb-4 tracking-wider">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px] text-[#6B6259]"><span>Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-red-500">Discount ({quotation.discount_type === 'percentage' ? '%' : '₹'})</span>
                <input type="number" className="w-20 text-right text-[14px] font-medium bg-[#FAF8F5] rounded px-2 py-1 outline-none border border-[#EDE8DF]" value={quotation.discount_value} onChange={e => setQuotation({...quotation, discount_value: e.target.value})} />
              </div>
              <div className="pt-3 border-t border-[#F5F2ED] flex justify-between text-[14px] text-[#6B6259]"><span>Taxable Amount</span><span>₹{taxableAmount.toLocaleString()}</span></div>
              <div className="flex justify-between text-[14px] text-[#6B6259]"><span>GST ({taxRate}%)</span><span>₹{totalTax.toLocaleString()}</span></div>
              <div className="pt-4 border-t border-[#EDE8DF] flex justify-between items-center">
                <span className="text-[15px] font-bold text-[#1C1C1C]">Grand Total</span>
                <span className="text-[22px] font-extrabold text-[#C8922A]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-sm">
            <label className="text-[11px] font-bold text-[#9A8F82] uppercase block mb-2">Terms & Notes</label>
            <textarea value={quotation.notes} onChange={e => setQuotation({...quotation, notes: e.target.value})} className="w-full text-[13px] bg-transparent outline-none min-h-[100px] resize-none" placeholder="e.g. 50% advance, 50% on completion..." />
=======
import { useState } from "react";
import { Plus, Trash2, Save, Send, Eye, ChevronDown, GripVertical } from "lucide-react";

type LineItem = {
  id: number;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  rate: number;
  gstRate: number;
};

const initialItems: LineItem[] = [
  { id: 1, description: "Living Room False Ceiling Design", category: "design_services", quantity: 1, unit: "lot", rate: 15000, gstRate: 18 },
  { id: 2, description: "Modular TV Unit with Back Panel", category: "modular", quantity: 1, unit: "piece", rate: 22000, gstRate: 18 },
  { id: 3, description: "Sofa Reupholstery & Cushions", category: "decor", quantity: 1, unit: "lot", rate: 12000, gstRate: 18 },
  { id: 4, description: "Flooring (Vitrified Tiles)", category: "execution", quantity: 800, unit: "sqft", rate: 25, gstRate: 18 },
];

const categories = ["design_services", "modular", "execution", "decor"];
const units = ["sqft", "per_space", "piece", "lot", "set"];

export default function QuotationBuilderPage() {
  const [items, setItems] = useState<LineItem[]>(initialItems);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [gstMode, setGstMode] = useState<"cgst_sgst" | "igst">("cgst_sgst");

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = discountType === "percentage" ? (subtotal * discountValue) / 100 : discountValue;
  const taxableAmount = subtotal - discountAmount;
  const totalTax = (taxableAmount * 18) / 100;
  const grandTotal = taxableAmount + totalTax;

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", category: "design_services", quantity: 1, unit: "lot", rate: 0, gstRate: 18 }]);
  };

  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[22px] font-bold text-[#1C1C1C]">Quotation Builder</h1>
            <span className="text-[11px] font-semibold bg-[#EFF6FF] text-[#3B82F6] px-2.5 py-1 rounded-full">QUOTE-2024-006 · v1</span>
          </div>
          <p className="text-[13px] text-[#9A8F82]">Mr. Sharma · Living Room Redesign</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] text-[#6B6259] text-[13px] font-medium px-4 py-2.5 rounded-lg hover:bg-[#FAF8F5]">
            <Eye size={14} /> Preview PDF
          </button>
          <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] text-[#6B6259] text-[13px] font-medium px-4 py-2.5 rounded-lg hover:bg-[#FAF8F5]">
            <Save size={14} /> Save Draft
          </button>
          <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg">
            <Send size={14} /> Send to Client
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Line Items */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-[#EDE8DF]">
            {/* Table header */}
            <div className="grid grid-cols-[24px_1fr_120px_80px_70px_100px_80px_36px] gap-3 px-4 py-3 bg-[#FAF8F5] border-b border-[#EDE8DF] text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide rounded-t-xl">
              <div />
              <div>Description</div>
              <div>Category</div>
              <div>Qty</div>
              <div>Unit</div>
              <div>Rate (₹)</div>
              <div>Amount</div>
              <div />
            </div>

            {/* Items */}
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-[24px_1fr_120px_80px_70px_100px_80px_36px] gap-3 px-4 py-3 border-b border-[#F5F2ED] last:border-0 items-center hover:bg-[#FAF8F5] transition-colors group"
              >
                <button className="text-[#C8C0B5] hover:text-[#9A8F82] cursor-grab">
                  <GripVertical size={14} />
                </button>

                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="text-[13px] text-[#1C1C1C] bg-transparent border-b border-transparent focus:border-[#C8922A] outline-none py-0.5 transition-colors"
                  placeholder="Item description..."
                />

                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, "category", e.target.value)}
                  className="text-[12px] text-[#6B6259] bg-transparent border border-transparent focus:border-[#EDE8DF] rounded-lg px-2 py-1 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.replace("_", " ")}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  className="text-[13px] text-[#1C1C1C] bg-transparent border border-transparent focus:border-[#EDE8DF] rounded-lg px-2 py-1 outline-none text-center"
                />

                <select
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                  className="text-[12px] text-[#6B6259] bg-transparent border border-transparent focus:border-[#EDE8DF] rounded-lg px-2 py-1 outline-none"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                  className="text-[13px] text-[#1C1C1C] bg-transparent border border-transparent focus:border-[#EDE8DF] rounded-lg px-2 py-1 outline-none text-right"
                />

                <span className="text-[13px] font-semibold text-[#1C1C1C] text-right">
                  {fmt(item.quantity * item.rate)}
                </span>

                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[#FEF2F2] text-[#9A8F82] hover:text-[#EF4444] transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            {/* Add row */}
            <div className="px-4 py-3 border-t border-[#EDE8DF]">
              <button
                onClick={addItem}
                className="flex items-center gap-2 text-[13px] text-[#C8922A] hover:underline font-medium"
              >
                <Plus size={13} /> Add Line Item
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4 bg-white rounded-xl border border-[#EDE8DF] p-4">
            <label className="block text-[12px] font-semibold text-[#6B6259] mb-2 uppercase tracking-wide">Notes / Terms</label>
            <textarea
              rows={3}
              placeholder="Payment terms, scope notes, exclusions..."
              className="w-full text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none resize-none bg-transparent"
            />
          </div>
        </div>

        {/* GST Summary Panel */}
        <div className="w-[260px] shrink-0 space-y-4">
          {/* GST Mode */}
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-4">
            <p className="text-[12px] font-semibold text-[#6B6259] uppercase tracking-wide mb-3">GST Mode</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGstMode("cgst_sgst")}
                className={`py-2 rounded-lg text-[12px] font-semibold transition-all ${
                  gstMode === "cgst_sgst"
                    ? "bg-[#FDF3E3] text-[#C8922A] border border-[#C8922A]"
                    : "bg-[#FAF8F5] text-[#6B6259] border border-[#EDE8DF]"
                }`}
              >
                CGST + SGST
              </button>
              <button
                onClick={() => setGstMode("igst")}
                className={`py-2 rounded-lg text-[12px] font-semibold transition-all ${
                  gstMode === "igst"
                    ? "bg-[#FDF3E3] text-[#C8922A] border border-[#C8922A]"
                    : "bg-[#FAF8F5] text-[#6B6259] border border-[#EDE8DF]"
                }`}
              >
                IGST
              </button>
            </div>
          </div>

          {/* Discount */}
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-4">
            <p className="text-[12px] font-semibold text-[#6B6259] uppercase tracking-wide mb-3">Discount</p>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setDiscountType("percentage")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  discountType === "percentage"
                    ? "bg-[#FDF3E3] text-[#C8922A]"
                    : "bg-[#FAF8F5] text-[#6B6259]"
                }`}
              >
                %
              </button>
              <button
                onClick={() => setDiscountType("fixed")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  discountType === "fixed"
                    ? "bg-[#FDF3E3] text-[#C8922A]"
                    : "bg-[#FAF8F5] text-[#6B6259]"
                }`}
              >
                ₹ Fixed
              </button>
            </div>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#1C1C1C] outline-none focus:border-[#C8922A] text-center"
            />
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-4 space-y-3">
            <p className="text-[12px] font-semibold text-[#6B6259] uppercase tracking-wide">Summary</p>
            {[
              { label: "Subtotal", value: fmt(subtotal) },
              {
                label: `Discount (${discountType === "percentage" ? `${discountValue}%` : "Fixed"})`,
                value: `- ${fmt(discountAmount)}`,
                red: true,
              },
              { label: "Taxable Amount", value: fmt(taxableAmount) },
              ...(gstMode === "cgst_sgst"
                ? [
                    { label: "CGST (9%)", value: fmt(totalTax / 2) },
                    { label: "SGST (9%)", value: fmt(totalTax / 2) },
                  ]
                : [{ label: "IGST (18%)", value: fmt(totalTax) }]),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[12px] text-[#9A8F82]">{row.label}</span>
                <span className={`text-[13px] font-medium ${(row as any).red ? "text-[#EF4444]" : "text-[#1C1C1C]"}`}>
                  {row.value}
                </span>
              </div>
            ))}
            <div className="border-t border-[#EDE8DF] pt-3 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#1C1C1C]">Grand Total</span>
              <span className="text-[18px] font-bold text-[#C8922A]">{fmt(grandTotal)}</span>
            </div>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
