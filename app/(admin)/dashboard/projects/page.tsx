"use client";

<<<<<<< HEAD
import { useState, useEffect, useMemo } from "react";
import { Plus, Search, MapPin, Maximize2, Calendar, Loader2, Eye, ArrowDown, X } from "lucide-react";

// Matches your API JSON structure
interface Project {
  id?: string;
  client: string;
  client_name?: string;
  name: string;
  property_type: string;
  style_category: string;
  area_sqft: number | string | null;
  budget_range: string;
  start_date: string;
  expected_end_date: string;
  status: string;
  notes: string;
}
=======
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
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ProjectsPage() {
<<<<<<< HEAD
  const CLIENT_ID = "b9879cb1-bb1a-47aa-bfcf-f8cdb04dcb2e";
  const BASE_URL = "http://127.0.0.1:8000/api/v1";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sidebar states
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const initialFormState: Project = {
    client: CLIENT_ID,
    name: "",
    property_type: "apartment",
    style_category: "",
    area_sqft: "",
    budget_range: "",
    start_date: new Date().toISOString().split("T")[0],
    expected_end_date: "",
    status: "active",
    notes: ""
  };

  const [formData, setFormData] = useState<Project>(initialFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/clients/${CLIENT_ID}/projects/`);
      const data = await res.json();
      setProjects(data.results || []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If ID exists, we use the detail endpoint for PUT. 
    // Usually: /api/v1/projects/{id}/
    const url = formData.id 
      ? `${BASE_URL}/clients/${CLIENT_ID}/projects/${formData.id}/` 
      : `${BASE_URL}/clients/${CLIENT_ID}/projects/`;
    
    const method = formData.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchProjects(); // Refresh list
      } else {
        const errorData = await response.json();
        console.error("Save failed:", errorData);
        alert("Failed to save. Check console for details.");
      }
    } catch (e) {
      console.error("API error:", e);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const sMatch = statusFilter === "all" || p.status === statusFilter;
      const tMatch = typeFilter === "all" || p.property_type.toLowerCase() === typeFilter.toLowerCase();
      return sMatch && tMatch;
    });
  }, [projects, statusFilter, typeFilter]);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB]">
      {/* SIDEBAR FILTER - IMAGE THEME */}
      <div className="w-[240px] flex-shrink-0 ">
        <div className="bg-[#ffe0a6] px-4 py-3 text-[13px] font-bold tracking-wider ">
          FILTER
        </div>
        <div className="p-5 space-y-8">
          <button className="flex items-center gap-2 text-[#4A90E2] text-[14px] hover:opacity-80">
            <Eye size={16} /> <span className="underline">Show counts</span>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2  text-[14px] font-medium">
              <ArrowDown size={14} className="text-[#4A90E2]" /> By status
            </div>
            <ul className="space-y-2 ml-4">
              {['all', 'active', 'on_hold', 'completed'].map((s) => (
                <li key={s} 
                    onClick={() => setStatusFilter(s)}
                    className={`cursor-pointer text-[14px] capitalize ${statusFilter === s ? " font-bold underline" : "text-[#4A90E2] hover:underline"}`}>
                  {s.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2  text-[14px] font-medium">
              <ArrowDown size={14} className="text-[#4A90E2]" /> By property type
            </div>
            <ul className="space-y-2 ml-4">
              {['all', 'Apartment', 'Villa', 'Office', 'Commercial'].map((t) => (
                <li key={t} 
                    onClick={() => setTypeFilter(t.toLowerCase())}
                    className={`cursor-pointer text-[14px] ${typeFilter === t.toLowerCase() ? " font-bold underline" : "text-[#4A90E2] hover:underline"}`}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-[#1C1C1C]">Projects</h1>
            <p className="text-[#9A8F82] text-[14px]">Manage your client projects and details</p>
          </div>
          <button 
            onClick={() => {
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#C8922A]  px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#B07A20] transition-all"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#C8922A]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredProjects.map((p) => (
              <div key={p.id} 
                onClick={() => { setFormData(p); setIsModalOpen(true); }}
                className="bg-white border border-[#EDE8DF] rounded-2xl p-6 hover:border-[#C8922A] cursor-pointer transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center font-bold text-[#C8922A] text-lg">
                      {p.client_name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1C1C1C] text-[16px]">{p.name}</h3>
                      <p className="text-[#9A8F82] text-[13px]">{p.client_name}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" 
                        style={{ backgroundColor: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                    {statusConfig[p.status]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-[13px] text-[#6B6259]">
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-[#9A8F82]"/> {p.property_type}</div>
                  <div className="flex items-center gap-2"><Maximize2 size={16} className="text-[#9A8F82]"/> {p.area_sqft || '0'} sqft</div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-[#9A8F82]"/> {p.start_date}</div>
                  <div className="font-bold text-[#C8922A]">Budget: {p.budget_range || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#1C1C1C]">{formData.id ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9A8F82] hover:text-black"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Project Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] focus:ring-2 ring-[#C8922A]/20 outline-none focus:border-[#C8922A]" placeholder="Enter project name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Property Type</label>
                  <select value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none bg-white">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Area (sqft)</label>
                  <input type="number" value={formData.area_sqft || ""} onChange={e => setFormData({...formData, area_sqft: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Budget Range</label>
                  <input value={formData.budget_range} onChange={e => setFormData({...formData, budget_range: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]" placeholder="e.g. 5,00,000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Start Date</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">End Date</label>
                  <input type="date" value={formData.expected_end_date} onChange={e => setFormData({...formData, expected_end_date: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none">
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-[#EDE8DF] text-[#6B6259] rounded-xl font-bold text-[14px] hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#C8922A]  rounded-xl font-bold text-[14px] shadow-lg shadow-[#C8922A]/20 hover:bg-[#B07A20]">
                  {formData.id ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
=======
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
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
