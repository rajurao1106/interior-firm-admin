"use client";

import { Plus, Search, MapPin, Maximize2, Calendar, MoreHorizontal } from "lucide-react";

const projects = [
  {
    name: "Living Room Redesign",
    client: "Mr. Sharma",
    type: "Apartment",
    style: "Modern",
    area: "800 sqft",
    budget: "₹1,50,000",
    startDate: "Jan 10, 2024",
    endDate: "Mar 30, 2024",
    status: "active",
    billed: "₹74,340",
    initial: "S",
    color: "#3B82F6",
  },
  {
    name: "Office Renovation",
    client: "Mrs. Kapoor",
    type: "Office",
    style: "Contemporary",
    area: "2,400 sqft",
    budget: "₹5,00,000",
    startDate: "Dec 01, 2023",
    endDate: "Apr 15, 2024",
    status: "active",
    billed: "₹2,15,000",
    initial: "K",
    color: "#8B5CF6",
  },
  {
    name: "Villa Interior",
    client: "Mr. Verma",
    type: "Villa",
    style: "Traditional",
    area: "4,200 sqft",
    budget: "₹8,00,000",
    startDate: "Nov 15, 2023",
    endDate: "May 30, 2024",
    status: "on_hold",
    billed: "₹1,88,500",
    initial: "V",
    color: "#F59E0B",
  },
  {
    name: "Kitchen Redesign",
    client: "Ms. Patel",
    type: "Apartment",
    style: "Minimalist",
    area: "180 sqft",
    budget: "₹80,000",
    startDate: "Jan 20, 2024",
    endDate: "Feb 28, 2024",
    status: "active",
    billed: "₹55,000",
    initial: "P",
    color: "#10B981",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Projects</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Track all active and completed projects</p>
        </div>
        <button className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={15} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-[#9A8F82]" />
          <input type="text" placeholder="Search projects..." className="bg-transparent text-[13px] outline-none flex-1 placeholder-[#9A8F82]" />
        </div>
        <select className="bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] outline-none">
          <option>All Types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Office</option>
          <option>Commercial</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-5">
        {projects.map((p, i) => {
          const st = statusConfig[p.status];
          return (
            <div key={i} className="bg-white rounded-xl border border-[#EDE8DF] p-5 hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[14px]" style={{ backgroundColor: p.color }}>
                    {p.initial}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1C1C1C]">{p.name}</p>
                    <p className="text-[12px] text-[#9A8F82]">{p.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                    {st.label}
                  </span>
                  <button className="text-[#9A8F82] hover:text-[#1C1C1C]">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6B6259]">
                  <MapPin size={12} className="text-[#9A8F82]" />
                  {p.type} · {p.style}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#6B6259]">
                  <Maximize2 size={12} className="text-[#9A8F82]" />
                  {p.area}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#6B6259]">
                  <Calendar size={12} className="text-[#9A8F82]" />
                  {p.startDate}
                </div>
                <div className="text-[12px] text-[#6B6259]">Budget: {p.budget}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F5F2ED]">
                <span className="text-[12px] text-[#9A8F82]">Total Billed</span>
                <span className="text-[14px] font-bold text-[#C8922A]">{p.billed}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
