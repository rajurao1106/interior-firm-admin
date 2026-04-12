"use client"

import { LayoutDashboard, GitMerge, Users2, Home, Calendar, PieChart, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, active: true },
    { name: 'Projects', icon: <GitMerge /> },
    { name: 'Clients', icon: <Users2 /> },
    { name: 'Quotations', icon: <Home /> },
    { name: 'Invoices', icon: <Calendar /> },
    { name: 'Reports', icon: <PieChart /> },
  ];

  return (
    <aside className="w-72 bg-white h-screen border-r border-slate-100 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-12 px-2">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-black italic">IB</div>
        <span className="text-xl font-bold tracking-tight text-slate-900">InteriorBill<span className="text-amber-500">.</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button 
            key={item.name}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-medium ${
              item.active 
              ? 'bg-gradient-to-r from-amber-50 to-transparent text-amber-700 border-l-4 border-amber-500' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {React.cloneElement(item.icon, { size: 20 })}
            {item.name}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-50 space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-600 font-medium">
          <Settings size={20} />
          Settings
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:text-rose-600 font-medium">
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}