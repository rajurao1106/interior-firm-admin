"use client";

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

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
            <CheckCircle size={22} className="text-[#10B981]" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#10B981]">₹2,84,340</p>
            <p className="text-[12px] text-[#9A8F82]">Total Collected</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <Clock size={22} className="text-[#EF4444]" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#EF4444]">₹1,02,700</p>
            <p className="text-[12px] text-[#9A8F82]">Outstanding Balance</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FDF3E3] flex items-center justify-center">
            <Banknote size={22} className="text-[#C8922A]" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#C8922A]">₹3,87,040</p>
            <p className="text-[12px] text-[#9A8F82]">Total Invoiced</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
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
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82]">
                      <MoreHorizontal size={13} />
                    </button>
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
