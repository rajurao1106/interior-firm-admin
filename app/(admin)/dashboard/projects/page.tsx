// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { Plus, MapPin, Maximize2, Calendar, Loader2, Eye, ArrowDown, X } from "lucide-react";
// import { getProjectsByClient,getProjects, createProject, updateProject, type Project } from "@/services/projectService";

// const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
//   active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
//   on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
//   completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
// };

// export default function ProjectsPage() {
//   const CLIENT_ID = "b9879cb1-bb1a-47aa-bfcf-f8cdb04dcb2e";

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");

//   const initialFormState: Project = {
//     client: CLIENT_ID,
//     name: "",
//     property_type: "apartment",
//     style_category: "",
//     area_sqft: "",
//     budget_range: "",
//     start_date: new Date().toISOString().split("T")[0],
//     expected_end_date: "",
//     status: "active",
//     notes: ""
//   };

//   const [formData, setFormData] = useState<Project>(initialFormState);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const data = await getProjects(CLIENT_ID);
//       setProjects(data);
//     } catch (e) {
//       console.error("Fetch error:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (formData.id) {
//         await updateProject(CLIENT_ID, formData.id, formData);
//       } else {
//         await createProject(CLIENT_ID, formData);
//       }
//       setIsModalOpen(false);
//       fetchProjects();
//     } catch (e) {
//       console.error("API error:", e);
//       alert("Failed to save. " + (e instanceof Error ? e.message : ""));
//     }
//   };

//   const filteredProjects = useMemo(() => {
//     return projects.filter(p => {
//       const sMatch = statusFilter === "all" || p.status === statusFilter;
//       const tMatch = typeFilter === "all" || p.property_type.toLowerCase() === typeFilter.toLowerCase();
//       return sMatch && tMatch;
//     });
//   }, [projects, statusFilter, typeFilter]);

//   return (
//     <div className="flex min-h-screen bg-[#FBFBFB]">
//       {/* SIDEBAR FILTER */}
//       <div className="w-[240px] flex-shrink-0">
//         <div className="bg-[#ffe0a6] px-4 py-3 text-[13px] font-bold tracking-wider">FILTER</div>
//         <div className="p-5 space-y-8">
//           <button className="flex items-center gap-2 text-[#4A90E2] text-[14px] hover:opacity-80">
//             <Eye size={16} /> <span className="underline">Show counts</span>
//           </button>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-[14px] font-medium">
//               <ArrowDown size={14} className="text-[#4A90E2]" /> By status
//             </div>
//             <ul className="space-y-2 ml-4">
//               {['all', 'active', 'on_hold', 'completed'].map((s) => (
//                 <li key={s}
//                   onClick={() => setStatusFilter(s)}
//                   className={`cursor-pointer text-[14px] capitalize ${statusFilter === s ? "font-bold underline" : "text-[#4A90E2] hover:underline"}`}>
//                   {s.replace('_', ' ')}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-[14px] font-medium">
//               <ArrowDown size={14} className="text-[#4A90E2]" /> By property type
//             </div>
//             <ul className="space-y-2 ml-4">
//               {['all', 'Apartment', 'Villa', 'Office', 'Commercial'].map((t) => (
//                 <li key={t}
//                   onClick={() => setTypeFilter(t.toLowerCase())}
//                   className={`cursor-pointer text-[14px] ${typeFilter === t.toLowerCase() ? "font-bold underline" : "text-[#4A90E2] hover:underline"}`}>
//                   {t}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 p-8 overflow-y-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-[26px] font-bold text-[#1C1C1C]">Projects</h1>
//             <p className="text-[#9A8F82] text-[14px]">Manage your client projects and details</p>
//           </div>
//           <button
//             onClick={() => { setFormData(initialFormState); setIsModalOpen(true); }}
//             className="flex items-center gap-2 bg-[#C8922A] text-white px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#B07A20] transition-all"
//           >
//             <Plus size={18} /> New Project
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#C8922A]" size={40} /></div>
//         ) : (
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             {filteredProjects.map((p) => (
//               <div key={p.id}
//                 onClick={() => { setFormData(p); setIsModalOpen(true); }}
//                 className="bg-white border border-[#EDE8DF] rounded-2xl p-6 hover:border-[#C8922A] cursor-pointer transition-all shadow-sm hover:shadow-md"
//               >
//                 <div className="flex justify-between items-start mb-5">
//                   <div className="flex gap-4">
//                     <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center font-bold text-[#C8922A] text-lg">
//                       {p.client_name?.charAt(0).toUpperCase() || 'P'}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-[#1C1C1C] text-[16px]">{p.name}</h3>
//                       <p className="text-[#9A8F82] text-[13px]">{p.client_name}</p>
//                     </div>
//                   </div>
//                   <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
//                     style={{ backgroundColor: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
//                     {statusConfig[p.status]?.label}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-y-4 text-[13px] text-[#6B6259]">
//                   <div className="flex items-center gap-2"><MapPin size={16} className="text-[#9A8F82]" /> {p.property_type}</div>
//                   <div className="flex items-center gap-2"><Maximize2 size={16} className="text-[#9A8F82]" /> {p.area_sqft || '0'} sqft</div>
//                   <div className="flex items-center gap-2"><Calendar size={16} className="text-[#9A8F82]" /> {p.start_date}</div>
//                   <div className="font-bold text-[#C8922A]">Budget: {p.budget_range || 'N/A'}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* CREATE / EDIT MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
//             <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center sticky top-0 bg-white">
//               <h2 className="text-[20px] font-bold text-[#1C1C1C]">{formData.id ? "Edit Project" : "New Project"}</h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-[#9A8F82] hover:text-black"><X size={24} /></button>
//             </div>

//             <form onSubmit={handleSave} className="p-8 space-y-6">
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Project Name</label>
//                   <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] focus:ring-2 ring-[#C8922A]/20 outline-none focus:border-[#C8922A]" placeholder="Enter project name" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Property Type</label>
//                   <select value={formData.property_type} onChange={e => setFormData({ ...formData, property_type: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none bg-white">
//                     <option value="apartment">Apartment</option>
//                     <option value="villa">Villa</option>
//                     <option value="office">Office</option>
//                     <option value="commercial">Commercial</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Area (sqft)</label>
//                   <input type="number" value={formData.area_sqft || ""} onChange={e => setFormData({ ...formData, area_sqft: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Budget Range</label>
//                   <input value={formData.budget_range} onChange={e => setFormData({ ...formData, budget_range: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]" placeholder="e.g. 5,00,000" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Start Date</label>
//                   <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">End Date</label>
//                   <input type="date" value={formData.expected_end_date} onChange={e => setFormData({ ...formData, expected_end_date: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none" />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Status</label>
//                 <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none">
//                   <option value="active">Active</option>
//                   <option value="on_hold">On Hold</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>

//               <div className="flex gap-4 pt-6">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-[#EDE8DF] text-[#6B6259] rounded-xl font-bold text-[14px] hover:bg-gray-50">Cancel</button>
//                 <button type="submit" className="flex-1 py-3 bg-[#C8922A] text-white rounded-xl font-bold text-[14px] shadow-lg shadow-[#C8922A]/20 hover:bg-[#B07A20]">
//                   {formData.id ? "Update Project" : "Create Project"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, MapPin, Maximize2, Calendar, Loader2, Eye, ArrowDown, X } from "lucide-react";
import { useParams } from "next/navigation";

import { getProjectsByClient, getProjects, createProject, updateProject, type Project } from "@/services/projectService";
import { getAllClients, type Client } from "@/services/clientService";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ProjectsPage() {
  const params = useParams<{ clientId?: string }>();
  const routeClientId = params?.clientId; // undefined on /projects, defined on /clients/[clientId]/projects

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const emptyForm: Project = useMemo(
    () => ({
      client: routeClientId ?? "", // global page: user will select
      name: "",
      property_type: "apartment",
      style_category: "",
      area_sqft: "",
      budget_range: "",
      start_date: new Date().toISOString().split("T")[0],
      expected_end_date: "",
      status: "active",
      notes: "",
    }),
    [routeClientId]
  );

  const [formData, setFormData] = useState<Project>(emptyForm);

  useEffect(() => {
    setFormData(emptyForm);
  }, [emptyForm]);

  const fetchClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (e) {
      console.error("Clients fetch error:", e);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = routeClientId ? await getProjectsByClient(routeClientId) : await getProjects();
      setProjects(Array.isArray(data) ? data : ((data as any)?.results ?? []));
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (!routeClientId) fetchClients(); // dropdown only in global mode
  }, [routeClientId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const clientId = routeClientId ?? formData.client;
      if (!clientId) {
        alert("Please select a client");
        return;
      }

      if (formData.id) {
        // update: clientId route se aayega, nahi to project ke client se
        await updateProject(clientId, formData.id, formData);
      } else {
        await createProject(clientId, formData);
      }

      setIsModalOpen(false);
      await fetchProjects();
    } catch (e) {
      console.error("API error:", e);
      alert("Failed to save. " + (e instanceof Error ? e.message : ""));
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const status = (p.status ?? "").toLowerCase();
      const type = (p.property_type ?? "").toLowerCase();

      const sMatch = statusFilter === "all" || status === statusFilter;
      const tMatch = typeFilter === "all" || type === typeFilter;

      return sMatch && tMatch;
    });
  }, [projects, statusFilter, typeFilter]);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB]">
      {/* SIDEBAR FILTER */}
      <div className="w-[240px] flex-shrink-0">
        <div className="bg-[#ffe0a6] px-4 py-3 text-[13px] font-bold tracking-wider">FILTER</div>
        <div className="p-5 space-y-8">
          <button className="flex items-center gap-2 text-[#4A90E2] text-[14px] hover:opacity-80">
            <Eye size={16} /> <span className="underline">Show counts</span>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[14px] font-medium">
              <ArrowDown size={14} className="text-[#4A90E2]" /> By status
            </div>
            <ul className="space-y-2 ml-4">
              {["all", "active", "on_hold", "completed"].map((s) => (
                <li
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`cursor-pointer text-[14px] capitalize ${
                    statusFilter === s ? "font-bold underline" : "text-[#4A90E2] hover:underline"
                  }`}
                >
                  {s.replace("_", " ")}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[14px] font-medium">
              <ArrowDown size={14} className="text-[#4A90E2]" /> By property type
            </div>
            <ul className="space-y-2 ml-4">
              {["all", "Apartment", "Villa", "Office", "Commercial"].map((t) => (
                <li
                  key={t}
                  onClick={() => setTypeFilter(t.toLowerCase())}
                  className={`cursor-pointer text-[14px] ${
                    typeFilter === t.toLowerCase() ? "font-bold underline" : "text-[#4A90E2] hover:underline"
                  }`}
                >
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
            <h1 className="text-[26px] font-bold text-[#1C1C1C]">
              {routeClientId ? "Client Projects" : "Projects"}
            </h1>
            <p className="text-[#9A8F82] text-[14px]">
              {routeClientId ? "Projects under selected client" : "Manage all projects"}
            </p>
          </div>

          <button
            onClick={() => {
              setFormData(emptyForm);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#C8922A] text-white px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#B07A20] transition-all"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-[#C8922A]" size={40} />
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-[#6B6259]">No projects found.</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id ?? `${p.name}-${p.start_date}`}
                    onClick={() => {
                      setFormData({
                        ...p,
                        client: p.client ?? routeClientId ?? "", // ensure client present for global edit
                      });
                      setIsModalOpen(true);
                    }}
                    className="bg-white border border-[#EDE8DF] rounded-2xl p-6 hover:border-[#C8922A] cursor-pointer transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center font-bold text-[#C8922A] text-lg">
                          {(p.client_name?.[0] ?? p.name?.[0] ?? "P").toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1C1C1C] text-[16px]">{p.name}</h3>
                          <p className="text-[#9A8F82] text-[13px]">{p.client_name ?? ""}</p>
                        </div>
                      </div>

                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: statusConfig[p.status]?.bg ?? "#F3F4F6",
                          color: statusConfig[p.status]?.color ?? "#6B7280",
                        }}
                      >
                        {statusConfig[p.status]?.label ?? p.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 text-[13px] text-[#6B6259]">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#9A8F82]" /> {p.property_type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize2 size={16} className="text-[#9A8F82]" /> {p.area_sqft || "0"} sqft
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#9A8F82]" /> {p.start_date || "-"}
                      </div>
                      <div className="font-bold text-[#C8922A]">Budget: {p.budget_range || "N/A"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#1C1C1C]">
                {formData.id ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9A8F82] hover:text-black">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              {/* ✅ Client dropdown only in global mode */}
              {!routeClientId && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Client</label>
                  <select
                    required
                    value={formData.client || ""}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none bg-white"
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Project Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Property Type</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none bg-white"
                  >
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
                  <input
                    type="number"
                    value={formData.area_sqft || ""}
                    onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Budget Range</label>
                  <input
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none focus:border-[#C8922A]"
                    placeholder="e.g. 5-8 Lakhs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">End Date</label>
                  <input
                    type="date"
                    value={formData.expected_end_date || ""}
                    onChange={(e) => setFormData({ ...formData, expected_end_date: e.target.value })}
                    className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase tracking-wide">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[14px] outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-[#EDE8DF] text-[#6B6259] rounded-xl font-bold text-[14px] hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#C8922A] text-white rounded-xl font-bold text-[14px] hover:bg-[#B07A20]"
                >
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