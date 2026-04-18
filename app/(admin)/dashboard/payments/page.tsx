"use client";

<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Plus, Search, Download, MoreHorizontal, CheckCircle, Clock, Banknote, Loader2 } from "lucide-react";

// Types based on your API response
interface Invoice {
  id: string;
  project_name: string;
  client_name: string;
  invoice_number: string;
  invoice_type: string;
  invoice_date: string;
  status: string;
  grand_total: string;
  amount_paid: string;
  balance_due: string;
  notes: string;
}

const modeColors: Record<string, { color: string; bg: string }> = {
  "Full": { color: "#3B82F6", bg: "#EFF6FF" },
  "Partial": { color: "#8B5CF6", bg: "#F5F3FF" },
  "Paid": { color: "#10B981", bg: "#ECFDF5" },
  "Pending": { color: "#F59E0B", bg: "#FFFBEB" },
};

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from your API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/invoices/");
        const data = await response.json();
        setInvoices(data.results);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Calculate Summary Totals
  const totalCollected = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount_paid), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + Math.max(0, parseFloat(inv.balance_due)), 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv.grand_total), 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <Loader2 className="animate-spin text-[#C8922A]" size={32} />
        <p className="text-[#9A8F82] text-sm">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Payment Tracker</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Live monitoring of API invoice records</p>
=======
import { Plus, Search, Download, MoreHorizontal, CheckCircle, Clock, Banknote } from "lucide-react";

const payments = [
  {
    ref: "UTR2024011201",
    client: "Mr. Sharma",
    invoice: "INV-2024-012",
    amount: "₹74,340",
    mode: "Bank Transfer",
    date: "Jan 22, 2024",
    remarks: "Full advance payment",
    initial: "S",
  },
  {
    ref: "UPI2024011101",
    client: "Mrs. Kapoor",
    invoice: "INV-2024-011",
    amount: "₹1,20,500",
    mode: "UPI",
    date: "Jan 20, 2024",
    remarks: "Design fee cleared",
    initial: "K",
  },
  {
    ref: "NEFT202401091",
    client: "Ms. Patel",
    invoice: "INV-2024-009",
    amount: "₹27,500",
    mode: "NEFT",
    date: "Jan 18, 2024",
    remarks: "Partial payment",
    initial: "P",
  },
  {
    ref: "CHQ2024012001",
    client: "Mr. Mehta",
    invoice: "INV-2024-007",
    amount: "₹62,000",
    mode: "Cheque",
    date: "Jan 15, 2024",
    remarks: "Cheque #45823",
    initial: "M",
  },
];

const modeColors: Record<string, { color: string; bg: string }> = {
  "Bank Transfer": { color: "#3B82F6", bg: "#EFF6FF" },
  UPI: { color: "#8B5CF6", bg: "#F5F3FF" },
  NEFT: { color: "#10B981", bg: "#ECFDF5" },
  RTGS: { color: "#0EA5E9", bg: "#E0F2FE" },
  Cheque: { color: "#F59E0B", bg: "#FFFBEB" },
  Cash: { color: "#6B7280", bg: "#F3F4F6" },
};

export default function PaymentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Payment Tracker</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Record and monitor all payment transactions</p>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] text-[#6B6259] text-[13px] font-medium px-4 py-2.5 rounded-lg hover:bg-[#FAF8F5]">
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Plus size={15} />
            Record Payment
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4 shadow-sm">
=======
      {/* Summary */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
            <CheckCircle size={22} className="text-[#10B981]" />
          </div>
          <div>
<<<<<<< HEAD
            <p className="text-[24px] font-bold text-[#10B981]">{formatCurrency(totalCollected)}</p>
            <p className="text-[12px] text-[#9A8F82]">Total Collected</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4 shadow-sm">
=======
            <p className="text-[24px] font-bold text-[#10B981]">₹2,84,340</p>
            <p className="text-[12px] text-[#9A8F82]">Total Collected</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
          <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <Clock size={22} className="text-[#EF4444]" />
          </div>
          <div>
<<<<<<< HEAD
            <p className="text-[24px] font-bold text-[#EF4444]">{formatCurrency(totalOutstanding)}</p>
            <p className="text-[12px] text-[#9A8F82]">Outstanding Balance</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4 shadow-sm">
=======
            <p className="text-[24px] font-bold text-[#EF4444]">₹1,02,700</p>
            <p className="text-[12px] text-[#9A8F82]">Outstanding Balance</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
          <div className="w-12 h-12 rounded-xl bg-[#FDF3E3] flex items-center justify-center">
            <Banknote size={22} className="text-[#C8922A]" />
          </div>
          <div>
<<<<<<< HEAD
            <p className="text-[24px] font-bold text-[#C8922A]">{formatCurrency(totalInvoiced)}</p>
=======
            <p className="text-[24px] font-bold text-[#C8922A]">₹3,87,040</p>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
            <p className="text-[12px] text-[#9A8F82]">Total Invoiced</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
<<<<<<< HEAD
          <input type="text" placeholder="Search invoices..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
                {["Invoice #", "Client / Project", "Total Amount", "Paid", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-5 py-4 text-[12px] font-mono text-[#6B6259]">INV-{inv.invoice_number}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center">
                        {inv.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#1C1C1C]">{inv.client_name}</p>
                        <p className="text-[11px] text-[#9A8F82]">{inv.project_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#1C1C1C]">₹{inv.grand_total}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-[#10B981]">₹{inv.amount_paid}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase`} 
                      style={{ 
                        color: inv.status === 'paid' ? '#10B981' : '#F59E0B', 
                        backgroundColor: inv.status === 'paid' ? '#ECFDF5' : '#FFFBEB' 
                      }}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#9A8F82]">{inv.invoice_date}</td>
=======
          <input type="text" placeholder="Search by client, invoice, ref..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
        <select className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] outline-none">
          <option>All Payment Modes</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
          <option>NEFT</option>
          <option>Cheque</option>
          <option>Cash</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Transaction Ref", "Client", "Invoice", "Amount", "Mode", "Date", "Remarks", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => {
              const modeStyle = modeColors[p.mode] || { color: "#6B7280", bg: "#F3F4F6" };
              return (
                <tr key={i} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-5 py-4 text-[12px] font-mono text-[#6B6259]">{p.ref}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center">
                        {p.initial}
                      </div>
                      <span className="text-[13px] font-medium text-[#1C1C1C]">{p.client}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#C8922A]">{p.invoice}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-[#1C1C1C]">{p.amount}</td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: modeStyle.color, backgroundColor: modeStyle.bg }}>
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#9A8F82]">{p.date}</td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{p.remarks}</td>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82]">
                      <MoreHorizontal size={13} />
                    </button>
                  </td>
                </tr>
<<<<<<< HEAD
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
=======
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
