"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  CreditCard,
  AlertCircle,
  Plus,
  ExternalLink,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

const kpiCards = [
  {
    label: "Total Invoiced",
    value: "₹12.4L",
    change: "+11%",
    up: true,
    icon: DollarSign,
    color: "#C8922A",
    bg: "#FDF3E3",
  },
  {
    label: "New Quotations",
    value: "24",
    change: "+13%",
    up: true,
    icon: FileText,
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    label: "Payments Received",
    value: "18",
    change: "+12%",
    up: true,
    icon: CreditCard,
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    label: "Overdue",
    value: "7",
    change: "-09%",
    up: false,
    icon: AlertCircle,
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    label: "Collected",
    value: "12",
    change: "+10%",
    up: true,
    icon: TrendingUp,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const chartData = [
  { month: "Jan", invoiced: 20, collected: 15 },
  { month: "Feb", invoiced: 35, collected: 28 },
  { month: "Mar", invoiced: 28, collected: 22 },
  { month: "Apr", invoiced: 48, collected: 38 },
  { month: "May", invoiced: 42, collected: 35 },
  { month: "Jun", invoiced: 60, collected: 50 },
  { month: "Jul", invoiced: 75, collected: 62 },
  { month: "Aug", invoiced: 85, collected: 70 },
  { month: "Sep", invoiced: 72, collected: 65 },
  { month: "Oct", invoiced: 90, collected: 78 },
  { month: "Nov", invoiced: 82, collected: 74 },
  { month: "Dec", invoiced: 95, collected: 88 },
];

const recentActivity = [
  {
    title: "Invoice INV-2024-012 sent",
    subtitle: "Mr. Sharma · Living Room Redesign · ₹74,340",
    time: "12:30 PM",
    avatar: "S",
  },
  {
    title: "Quotation approved",
    subtitle: "Mrs. Kapoor · Office Renovation · ₹2,15,000",
    time: "11:45 AM",
    avatar: "K",
  },
  {
    title: "Payment recorded",
    subtitle: "Mr. Verma · Villa Interior · ₹50,000 via UPI",
    time: "10:20 AM",
    avatar: "V",
  },
  {
    title: "New project created",
    subtitle: "Ms. Patel · Kitchen Redesign · Apartment",
    time: "09:15 AM",
    avatar: "P",
  },
];

const recentInvoices = [
  {
    number: "INV-2024-012",
    client: "Mr. Sharma",
    project: "Living Room Redesign",
    stage: "Advance",
    amount: "₹74,340",
    status: "issued",
    date: "Jan 22 - PDF Sent",
  },
  {
    number: "INV-2024-011",
    client: "Mrs. Kapoor",
    project: "Office Renovation",
    stage: "Design Fee",
    amount: "₹1,20,500",
    status: "paid",
    date: "Jan 20 - Paid",
  },
  {
    number: "INV-2024-010",
    client: "Mr. Verma",
    project: "Villa Interior",
    stage: "Final",
    amount: "₹38,200",
    status: "overdue",
    date: "Jan 15 - Overdue",
  },
  {
    number: "INV-2024-009",
    client: "Ms. Patel",
    project: "Kitchen Redesign",
    stage: "Milestone 2",
    amount: "₹55,000",
    status: "partially_paid",
    date: "Jan 18 - Partial",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  issued: { label: "Issued", color: "#3B82F6", bg: "#EFF6FF" },
  paid: { label: "Paid", color: "#10B981", bg: "#ECFDF5" },
  overdue: { label: "Overdue", color: "#EF4444", bg: "#FEF2F2" },
  partially_paid: { label: "Partial", color: "#F59E0B", bg: "#FFFBEB" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 shadow-sm text-xs">
        <p className="font-semibold text-[#1C1C1C] mb-1">{label}</p>
        <p className="text-[#C8922A]">Invoiced: ₹{payload[0]?.value}K</p>
        <p className="text-[#10B981]">Collected: ₹{payload[1]?.value}K</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Dashboard Overview</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Welcome back — here's your billing summary</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={15} />
          New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 border border-[#EDE8DF] hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon size={15} style={{ color: card.color }} />
                </div>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                    card.up ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  {card.change}
                  {card.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                </span>
              </div>
              <p className="text-[22px] font-bold text-[#1C1C1C] leading-tight">{card.value}</p>
              <p className="text-[12px] text-[#9A8F82] mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-[#EDE8DF] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#1C1C1C]">Performance Analytics</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="flex items-center gap-1.5 text-[12px] text-[#9A8F82]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8922A] inline-block" />
                  Invoiced
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#9A8F82]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                  Collected
                </span>
              </div>
            </div>
            <select className="text-[12px] text-[#6B6259] bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg px-3 py-1.5 outline-none">
              <option>This Year</option>
              <option>This Month</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="invoicedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8922A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C8922A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9A8F82" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9A8F82" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x="Aug"
                stroke="#C8922A"
                strokeDasharray="4 4"
                label={{ value: "₹85K", position: "top", fontSize: 11, fill: "#C8922A" }}
              />
              <Area
                type="monotone"
                dataKey="invoiced"
                stroke="#C8922A"
                strokeWidth={2.5}
                fill="url(#invoicedGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#C8922A" }}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#collectedGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[#1C1C1C]">Recent Activity</h2>
            <button className="text-[#9A8F82] hover:text-[#1C1C1C]">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FDF3E3] text-[#C8922A] font-bold text-[12px] flex items-center justify-center shrink-0">
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#1C1C1C] truncate">{item.title}</p>
                  <p className="text-[11px] text-[#9A8F82] truncate">{item.subtitle}</p>
                </div>
                <span className="text-[11px] text-[#9A8F82] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE8DF]">
          <h2 className="text-[15px] font-semibold text-[#1C1C1C]">Recent Invoices</h2>
          <button className="flex items-center gap-1 text-[13px] text-[#C8922A] hover:underline font-medium">
            View all <ExternalLink size={13} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Invoice #", "Client", "Project", "Stage", "Amount", "Status", "Last Activity"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[12px] font-semibold text-[#9A8F82] uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((inv, i) => {
              const st = statusConfig[inv.status];
              return (
                <tr
                  key={i}
                  className="border-b border-[#F5F2ED] last:border-0 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-[#C8922A]">{inv.number}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center">
                        {inv.client[3]}
                      </div>
                      <span className="text-[13px] text-[#1C1C1C] font-medium">{inv.client}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B6259]">{inv.project}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B6259]">{inv.stage}</td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-[#1C1C1C]">{inv.amount}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: st.color, backgroundColor: st.bg }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-[#9A8F82]">{inv.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
