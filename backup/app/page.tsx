import React from 'react';
import { 
  LayoutDashboard, FileText, Receipt, Users, 
  Settings, LogOut, Search, Bell, Plus, 
  TrendingUp, FileCheck, Wallet, ArrowUpRight 
} from 'lucide-react';

// --- Sub-Components ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
    active ? 'bg-[#F9EED2] text-brand-900 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'
  }`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-sm tracking-tight">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-brand-50 rounded-lg text-brand-500">
        <Icon size={20} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend > 0 ? `+${trend}%` : `${trend}%`} ↗
      </span>
    </div>
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
  </div>
);

// --- Main Page ---

export default function InteriorAdminUI() {
  return (
    <div className="flex min-h-screen bg-surface font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-orange-100/50 p-6 flex flex-col gap-8 bg-white/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-xl italic">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-900">DesignStudio</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1.5">
          <SidebarItem icon={LayoutDashboard} label="Dashboard Overview" active />
          <SidebarItem icon={Users} label="Client Master" />
          <SidebarItem icon={FileText} label="Design Proposals" />
          <SidebarItem icon={FileCheck} label="Quotations" />
          <SidebarItem icon={Receipt} label="Invoices & GST" />
          <SidebarItem icon={Wallet} label="Payments" />
        </nav>

        <div className="pt-6 border-t border-orange-100 flex flex-col gap-1">
          <SidebarItem icon={Settings} label="Studio Settings" />
          <SidebarItem icon={LogOut} label="Log Out" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects, invoices, clients..." 
              className="w-full bg-white border border-gray-100 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative p-2 bg-white rounded-full border border-gray-100 cursor-pointer shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Interior Admin</p>
                <p className="text-[10px] text-gray-500 font-medium">Sr. Designer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-white shadow-sm" />
            </div>
            <button className="bg-brand-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2">
              <Plus size={18} />
              New Proposal
            </button>
          </div>
        </header>

        {/* DASHBOARD OVERVIEW GRID */}
        <div className="grid grid-cols-5 gap-5 mb-8">
          <StatCard label="Total Revenue" value="₹42.5L" trend={12} icon={TrendingUp} />
          <StatCard label="Active Projects" value="14" trend={5} icon={LayoutDashboard} />
          <StatCard label="Open Proposals" value="08" trend={-2} icon={FileText} />
          <StatCard label="Pending GST" value="₹1.2L" trend={8} icon={Receipt} />
          <StatCard label="Paid This Month" value="₹8.4L" trend={15} icon={Wallet} />
        </div>

        {/* MIDDLE SECTION: ANALYTICS & NEWS */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Revenue Analytics</h3>
              <select className="text-xs font-semibold bg-gray-50 border-none rounded-lg p-2 outline-none">
                <option>This Month</option>
                <option>Last Quarter</option>
              </select>
            </div>
            {/* Placeholder for Chart */}
            <div className="h-64 w-full bg-gradient-to-t from-orange-50/30 to-transparent rounded-xl border-b-2 border-dashed border-gray-100 flex items-end px-4 pb-2 gap-4">
               {[40, 70, 45, 90, 65, 80, 95, 70].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-amber-400/20 hover:bg-amber-400 rounded-t-lg transition-all cursor-pointer group relative">
                    <span className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded tracking-tighter">₹{h}k</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Action Items</h3>
            <div className="space-y-4">
              {[
                { title: "Follow up with Mr. Khanna", sub: "Modular Kitchen Proposal", time: "2:00 PM" },
                { title: "GST Filing Reminder", sub: "March 2026 Quarter", time: "Tomorrow" },
                { title: "Site Visit: Villa 402", sub: "Execution Stage 2", time: "04:30 PM" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-3 hover:bg-brand-50 rounded-2xl transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{item.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1 italic">{item.sub}</p>
                    <p className="text-[10px] font-bold text-amber-600 mt-2">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: RECENT PROJECT TABLE */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Recent Proposals & Invoices</h3>
            <button className="text-xs font-bold text-brand-500 flex items-center gap-1 hover:underline">
              View All History <ArrowUpRight size={14} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">Client / Project</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "Aditi Sharma", project: "Skyline Penthouse", stage: "Quotation", val: "₹12,40,000", status: "Negotiation", date: "Aug 22" },
                { name: "Rahul Varma", project: "Contemporary 3BHK", stage: "Advance Invoice", val: "₹2,50,000", status: "Paid", date: "Aug 20" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-brand-50/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.project}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.stage}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.val}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}