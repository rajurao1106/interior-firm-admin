"use client";

import { Search, Download, Eye, Filter, Clock, FileText, Receipt, CreditCard, Users } from "lucide-react";

const history = [
  {
    docNumber: "INV-2024-012",
    type: "Invoice",
    action: "PDF Sent",
    client: "Mr. Sharma",
    project: "Living Room Redesign",
    user: "Admin",
    timestamp: "Jan 22, 2024 · 12:30 PM",
    icon: Receipt,
    iconColor: "#C8922A",
    iconBg: "#FDF3E3",
  },
  {
    docNumber: "QUOTE-2024-006",
    type: "Quotation",
    action: "Status → Approved",
    client: "Mr. Sharma",
    project: "Living Room Redesign",
    user: "Admin",
    timestamp: "Jan 20, 2024 · 03:15 PM",
    icon: FileText,
    iconColor: "#10B981",
    iconBg: "#ECFDF5",
  },
  {
    docNumber: "PAY-2024-004",
    type: "Payment",
    action: "₹1,20,500 Recorded",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    user: "Admin",
    timestamp: "Jan 20, 2024 · 11:45 AM",
    icon: CreditCard,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    docNumber: "QUOTE-2024-005",
    type: "Quotation",
    action: "Version 2 Created",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    user: "Admin",
    timestamp: "Jan 18, 2024 · 02:00 PM",
    icon: FileText,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
  },
  {
    docNumber: "CLIENT-008",
    type: "Client",
    action: "New Client Added",
    client: "Ms. Patel",
    project: "—",
    user: "Admin",
    timestamp: "Jan 18, 2024 · 09:30 AM",
    icon: Users,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
  },
  {
    docNumber: "INV-2024-011",
    type: "Invoice",
    action: "Status → Paid",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    user: "Admin",
    timestamp: "Jan 20, 2024 · 12:00 PM",
    icon: Receipt,
    iconColor: "#10B981",
    iconBg: "#ECFDF5",
  },
];

export default function HistoryPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Document History</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Complete audit trail of all system activity</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] text-[#6B6259] text-[13px] font-medium px-4 py-2.5 rounded-lg hover:bg-[#FAF8F5]">
          <Download size={14} />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
          <input type="text" placeholder="Search history..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
        <select className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] outline-none">
          <option>All Types</option>
          <option>Invoice</option>
          <option>Quotation</option>
          <option>Payment</option>
          <option>Client</option>
          <option>Proposal</option>
        </select>
        <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] hover:bg-[#FAF8F5]">
          <Filter size={14} /> Date Range
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Document", "Type", "Action", "Client", "Project", "By", "Timestamp", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#9A8F82] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => {
              const Icon = item.icon;
              return (
                <tr key={i} className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: item.iconBg }}
                      >
                        <Icon size={14} style={{ color: item.iconColor }} />
                      </div>
                      <span className="text-[13px] font-semibold text-[#1C1C1C]">{item.docNumber}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{item.type}</td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-medium text-[#1C1C1C]">{item.action}</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{item.client}</td>
                  <td className="px-5 py-4 text-[13px] text-[#6B6259]">{item.project}</td>
                  <td className="px-5 py-4 text-[13px] text-[#9A8F82]">{item.user}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9A8F82]">
                      <Clock size={11} />
                      {item.timestamp}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#9A8F82] hover:text-[#C8922A]">
                      <Eye size={13} />
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
