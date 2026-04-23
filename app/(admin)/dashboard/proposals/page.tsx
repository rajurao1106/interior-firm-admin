// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Plus, Search, FileText, Loader2, X, Trash2, Edit3, Save, ChevronDown } from "lucide-react";
// import {
//   getAllProposals, getProposalTemplates, createProposal, updateProposal, deleteProposal,
//   type Proposal, type ProposalFormData, type ProposalTemplate,
// } from "@/services/proposalService";
// import { getProjectsByClient } from "@/services/projectService";
// import type { Project } from "@/services/projectService";

// const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
//   draft:    { label: "Draft",    color: "#6B6259", bg: "#F5F2ED" },
//   sent:     { label: "Sent",     color: "#3B82F6", bg: "#EFF6FF" },
//   accepted: { label: "Accepted", color: "#10B981", bg: "#ECFDF5" },
//   rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
// };

// // ─── Default CLIENT_ID — apna actual UUID daalo yahan ──────────────────────────
// const DEFAULT_CLIENT_ID = "b9879cb1-bb1a-47aa-bfcf-f8cdb04dcb2e";

// const blankForm: ProposalFormData = {
//   project: "",
//   template: "",
//   prop_number: "",
//   title: "",
//   content: "",
//   status: "draft",
//   valid_until: "",
//   notes: "",
// };

// export default function ProposalsPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery]   = useState("");
//   const [editId, setEditId]             = useState<string | null>(null);
//   const [proposals, setProposals]       = useState<Proposal[]>([]);
//   const [templates, setTemplates]       = useState<ProposalTemplate[]>([]);
//   const [projects, setProjects]         = useState<Project[]>([]);
//   const [loading, setLoading]           = useState(true);
//   const [saving, setSaving]             = useState(false);
//   const [formData, setFormData]         = useState<ProposalFormData>(blankForm);

//   // Optional fields toggle state
//   const [showTemplate,   setShowTemplate]   = useState(false);
//   const [showValidUntil, setShowValidUntil] = useState(false);
//   const [showNotes,      setShowNotes]      = useState(false);

//   // ─── Fetch all data ─────────────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [proposalList, templateList, projectList] = await Promise.all([
//         getAllProposals(),
//         getProposalTemplates(),
//         getProjectsByClient(DEFAULT_CLIENT_ID),
//       ]);
//       setProposals(proposalList);
//       setTemplates(templateList);
//       setProjects(projectList);
//     } catch (e) {
//       console.error("Fetch error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ─── Template auto-fill ──────────────────────────────────────────────────────
//   const handleTemplateSelect = (templateId: string) => {
//     const tpl = templates.find(t => t.id === templateId);
//     setFormData(prev => ({
//       ...prev,
//       template: templateId,
//       content: tpl?.content ?? prev.content,
//     }));
//   };

//   // ─── Modal helpers ────────────────────────────────────────────────────────────
//   const openNew = () => {
//     setFormData(blankForm);
//     setEditId(null);
//     setShowTemplate(false);
//     setShowValidUntil(false);
//     setShowNotes(false);
//     setIsModalOpen(true);
//   };

//   const openEdit = (p: Proposal) => {
//     setFormData({
//       project:     p.project,
//       template:    p.template ?? "",
//       prop_number: p.prop_number,
//       title:       p.title,
//       content:     p.content,
//       status:      p.status,
//       valid_until: p.valid_until ?? "",
//       notes:       p.notes ?? "",
//     });
//     setEditId(p.id);
//     setShowTemplate(!!p.template);
//     setShowValidUntil(!!p.valid_until);
//     setShowNotes(!!p.notes);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditId(null);
//     setFormData(blankForm);
//   };

//   // ─── Submit ──────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     // Strip empty optional fields so backend doesn't complain
//     const payload: ProposalFormData = {
//       ...formData,
//       template:    showTemplate   ? formData.template    : "",
//       valid_until: showValidUntil ? formData.valid_until : "",
//       notes:       showNotes      ? formData.notes       : "",
//     };
//     try {
//       if (editId) { await updateProposal(editId, payload); }
//       else        { await createProposal(payload); }
//       await fetchData();
//       closeModal();
//     } catch (err: any) {
//       alert("Error: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this proposal?")) return;
//     try {
//       await deleteProposal(id);
//       setProposals(prev => prev.filter(p => p.id !== id));
//     } catch (err: any) {
//       alert("Delete failed: " + err.message);
//     }
//   };

//   const filtered = proposals.filter(p =>
//     p.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.prop_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.title?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#FCFBF9] p-6 md:p-10 font-sans text-[#1C1C1C]">

//       {/* ─── Header ─────────────────────────────────────────────────────────── */}
//       <div className="flex justify-between items-end mb-10">
//         <div>
//           <h1 className="text-3xl font-black tracking-tighter">Proposals</h1>
//           <p className="text-[#9A8F82] font-medium">Create and manage client proposals</p>
//         </div>
//         <button onClick={openNew} className="bg-[#C8922A] hover:bg-[#B07A20] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#C8922A]/20">
//           <Plus size={20} strokeWidth={3} /> New Proposal
//         </button>
//       </div>

//       {/* ─── Table ──────────────────────────────────────────────────────────── */}
//       <div className="bg-white border border-[#EDE8DF] rounded-[32px] overflow-hidden shadow-sm">
//         <div className="p-6 border-b border-[#EDE8DF]">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={18} />
//             <input type="text" placeholder="Search by client, number, or title..." className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-[#FAF8F5] border-b border-[#EDE8DF] text-[11px] font-black text-[#9A8F82] uppercase tracking-[2px]">
//                 <th className="px-8 py-5">Document</th>
//                 <th className="px-8 py-5">Client / Project</th>
//                 <th className="px-8 py-5">Status</th>
//                 <th className="px-8 py-5">Valid Until</th>
//                 <th className="px-8 py-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#F5F2ED]">
//               {loading ? (
//                 <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#C8922A]" /></td></tr>
//               ) : filtered.length === 0 ? (
//                 <tr><td colSpan={5} className="py-20 text-center text-[#9A8F82]">No proposals found.</td></tr>
//               ) : filtered.map(p => (
//                 <tr key={p.id} className="hover:bg-[#FCFBF9] transition-colors group">
//                   <td className="px-8 py-6">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-[#FDF3E3] rounded-xl flex items-center justify-center text-[#C8922A]"><FileText size={18} /></div>
//                       <div>
//                         <p className="font-bold text-[14px]">#{p.prop_number}</p>
//                         <p className="text-[12px] text-[#9A8F82]">{p.title}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6">
//                     <p className="font-bold text-[14px]">{p.client_name || "—"}</p>
//                     <p className="text-[12px] text-[#6B6259]">{p.project_name || "—"}</p>
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
//                       style={{ backgroundColor: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
//                       {statusConfig[p.status]?.label ?? p.status}
//                     </span>
//                   </td>
//                   <td className="px-8 py-6 text-[13px] text-[#6B6259]">
//                     {p.valid_until || "—"}
//                   </td>
//                   <td className="px-8 py-6 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                       <button onClick={() => openEdit(p)} className="p-2 hover:bg-white border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#C8922A] shadow-sm"><Edit3 size={14} /></button>
//                       <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-white border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-red-500 shadow-sm"><Trash2 size={14} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ─── Create / Edit Modal ─────────────────────────────────────────────── */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
//           <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]">

//             {/* Modal Header */}
//             <div className="p-6 border-b border-[#EDE8DF] flex justify-between items-center bg-[#FCFBF9] rounded-t-[32px] flex-shrink-0">
//               <div>
//                 <h2 className="font-black text-xl">{editId ? "Edit Proposal" : "New Proposal"}</h2>
//                 <p className="text-[12px] text-[#9A8F82] mt-0.5">Fill in the required fields below</p>
//               </div>
//               <button onClick={closeModal} className="text-[#9A8F82] hover:text-black transition-colors"><X size={24} /></button>
//             </div>

//             {/* Modal Body — Scrollable */}
//             <div className="p-8 overflow-y-auto flex-1">
//               <form onSubmit={handleSubmit} className="space-y-6" id="proposal-form">

//                 {/* ── REQUIRED FIELDS ─────────────────────────────────────── */}
//                 <div>
//                   <p className="text-[11px] font-black text-[#C8922A] uppercase tracking-[2px] mb-4 flex items-center gap-2">
//                     <span className="w-4 h-px bg-[#C8922A] block" /> Required Fields
//                   </p>
//                   <div className="space-y-4">

//                     {/* Project */}
//                     <div className="space-y-1.5">
//                       <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">Project <span className="text-red-400">*</span></label>
//                       <div className="relative">
//                         <select
//                           required
//                           value={formData.project}
//                           onChange={e => setFormData({ ...formData, project: e.target.value })}
//                           className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] appearance-none text-[14px] text-[#1C1C1C]"
//                         >
//                           <option value="">Select a project</option>
//                           {projects.map(p => (
//                             <option key={p.id} value={p.id}>{p.name} {p.client_name ? `— ${p.client_name}` : ""}</option>
//                           ))}
//                         </select>
//                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" size={16} />
//                       </div>
//                     </div>

//                     {/* Prop Number */}
//                     <div className="space-y-1.5">
//                       <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">Proposal Number <span className="text-red-400">*</span></label>
//                       <input
//                         required
//                         type="text"
//                         placeholder="e.g. PROP-2024-001"
//                         value={formData.prop_number}
//                         onChange={e => setFormData({ ...formData, prop_number: e.target.value })}
//                         className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] text-[14px] font-mono"
//                       />
//                     </div>

//                     {/* Title */}
//                     <div className="space-y-1.5">
//                       <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">Title <span className="text-red-400">*</span></label>
//                       <input
//                         required
//                         type="text"
//                         placeholder="e.g. Interior Design Proposal for 3BHK Apartment"
//                         value={formData.title}
//                         onChange={e => setFormData({ ...formData, title: e.target.value })}
//                         className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] text-[14px]"
//                       />
//                     </div>

//                     {/* Content */}
//                     <div className="space-y-1.5">
//                       <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">
//                         Content <span className="text-red-400">*</span>
//                         <span className="ml-2 text-[10px] font-medium text-[#9A8F82] normal-case tracking-normal">Placeholders: {"{{client_name}}"}, {"{{project_name}}"}, {"{{firm_name}}"}</span>
//                       </label>
//                       <textarea
//                         required
//                         rows={6}
//                         placeholder="Write your full proposal content here. Use {{client_name}}, {{project_name}}, {{firm_name}} as dynamic placeholders..."
//                         value={formData.content}
//                         onChange={e => setFormData({ ...formData, content: e.target.value })}
//                         className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] text-[14px] resize-none font-mono"
//                       />
//                     </div>

//                     {/* Status */}
//                     <div className="space-y-1.5">
//                       <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">Status <span className="text-red-400">*</span></label>
//                       <div className="grid grid-cols-4 gap-2">
//                         {(["draft", "sent", "accepted", "rejected"] as const).map(s => (
//                           <button
//                             key={s}
//                             type="button"
//                             onClick={() => setFormData({ ...formData, status: s })}
//                             className="py-2.5 rounded-xl text-[12px] font-bold capitalize border-2 transition-all"
//                             style={formData.status === s ? {
//                               backgroundColor: statusConfig[s].bg,
//                               color: statusConfig[s].color,
//                               borderColor: statusConfig[s].color,
//                             } : {
//                               backgroundColor: "transparent",
//                               color: "#9A8F82",
//                               borderColor: "#EDE8DF",
//                             }}
//                           >
//                             {statusConfig[s].label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── OPTIONAL FIELDS ─────────────────────────────────────── */}
//                 <div>
//                   <p className="text-[11px] font-black text-[#9A8F82] uppercase tracking-[2px] mb-3 flex items-center gap-2">
//                     <span className="w-4 h-px bg-[#9A8F82] block" /> Optional Fields
//                   </p>
//                   <div className="space-y-2">

//                     {/* Template toggle */}
//                     <div className="border border-[#EDE8DF] rounded-xl overflow-hidden">
//                       <button type="button" onClick={() => setShowTemplate(v => !v)}
//                         className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-colors">
//                         <span className="text-[13px] font-semibold text-[#6B6259]">📄 Template</span>
//                         <span className="text-[11px] text-[#C8922A] font-bold">{showTemplate ? "Remove" : "+ Add"}</span>
//                       </button>
//                       {showTemplate && (
//                         <div className="px-4 py-3 border-t border-[#EDE8DF]">
//                           {templates.length === 0 ? (
//                             <p className="text-[13px] text-[#9A8F82] italic">No templates found. Create templates in your backend first.</p>
//                           ) : (
//                             <div className="relative">
//                               <select
//                                 value={formData.template}
//                                 onChange={e => handleTemplateSelect(e.target.value)}
//                                 className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] appearance-none text-[14px]"
//                               >
//                                 <option value="">No template</option>
//                                 {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                               </select>
//                               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" size={16} />
//                               {formData.template && (
//                                 <p className="text-[11px] text-[#9A8F82] mt-1">✓ Template selected — content has been auto-filled above</p>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Valid Until toggle */}
//                     <div className="border border-[#EDE8DF] rounded-xl overflow-hidden">
//                       <button type="button" onClick={() => setShowValidUntil(v => !v)}
//                         className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-colors">
//                         <span className="text-[13px] font-semibold text-[#6B6259]">📅 Valid Until</span>
//                         <span className="text-[11px] text-[#C8922A] font-bold">{showValidUntil ? "Remove" : "+ Add"}</span>
//                       </button>
//                       {showValidUntil && (
//                         <div className="px-4 py-3 border-t border-[#EDE8DF]">
//                           <input
//                             type="date"
//                             value={formData.valid_until}
//                             onChange={e => setFormData({ ...formData, valid_until: e.target.value })}
//                             className="w-full p-3 bg-white border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] text-[14px]"
//                           />
//                         </div>
//                       )}
//                     </div>

//                     {/* Notes toggle */}
//                     <div className="border border-[#EDE8DF] rounded-xl overflow-hidden">
//                       <button type="button" onClick={() => setShowNotes(v => !v)}
//                         className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-colors">
//                         <span className="text-[13px] font-semibold text-[#6B6259]">📝 Internal Notes</span>
//                         <span className="text-[11px] text-[#C8922A] font-bold">{showNotes ? "Remove" : "+ Add"}</span>
//                       </button>
//                       {showNotes && (
//                         <div className="px-4 py-3 border-t border-[#EDE8DF]">
//                           <textarea
//                             rows={3}
//                             placeholder="Internal notes (not visible to client)..."
//                             value={formData.notes}
//                             onChange={e => setFormData({ ...formData, notes: e.target.value })}
//                             className="w-full p-3 bg-white border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] text-[14px] resize-none"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//               </form>
//             </div>

//             {/* Modal Footer — Sticky */}
//             <div className="p-6 border-t border-[#EDE8DF] flex gap-3 bg-white rounded-b-[32px] flex-shrink-0">
//               <button type="button" onClick={closeModal} className="flex-1 py-3 border-2 border-[#EDE8DF] text-[#6B6259] font-bold rounded-2xl hover:bg-[#FAF8F5] transition-colors">
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="proposal-form"
//                 disabled={saving}
//                 className="flex-1 py-3 bg-[#C8922A] text-white font-black rounded-2xl shadow-lg shadow-[#C8922A]/20 hover:bg-[#B07A20] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
//               >
//                 {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
//                 {editId ? "Update Proposal" : "Create Proposal"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Loader2,
  X,
  Trash2,
  Edit3,
  Save,
  ChevronDown,
  Printer,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getAllProposals,
  getProposalTemplates,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  downloadProposalPdf,
  sendProposalEmail,
  sendProposalWhatsApp,
  type Proposal,
  type ProposalFormData,
  type ProposalTemplate,
} from "@/services/proposalService";

import { getAllClients, type Client } from "@/services/clientService";
import { getProjectsByClient, type Project } from "@/services/projectService";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#6B6259", bg: "#F5F2ED" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  accepted: { label: "Accepted", color: "#10B981", bg: "#ECFDF5" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
};

const blankForm: ProposalFormData = {
  project: "",
  title: "",
  content: "",
  status: "draft",
  valid_until: "",
  notes: "",
  use_template: "",
};

export default function ProposalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProposalFormData>(blankForm);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [showTemplate, setShowTemplate] = useState(false);
  const [showValidUntil, setShowValidUntil] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [proposalList, templateList, clientList] = await Promise.all([
        getAllProposals(),
        getProposalTemplates(),
        getAllClients(),
      ]);
      setProposals(proposalList);
      setTemplates(templateList);
      setClients(clientList);
    } catch (e) {
      console.error(e);
      alert("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadProjectsForClient = useCallback(async (clientId: string) => {
    if (!clientId) {
      setProjects([]);
      return;
    }
    try {
      const list = await getProjectsByClient(clientId);
      setProjects(list);
    } catch (e) {
      console.error(e);
      setProjects([]);
    }
  }, []);

  const openNew = () => {
    setEditId(null);
    setFormData(blankForm);
    setSelectedClientId("");
    setProjects([]);
    setShowTemplate(false);
    setShowValidUntil(false);
    setShowNotes(false);
    setIsModalOpen(true);
  };

  const openEdit = async (p: Proposal) => {
    setEditId(p.id);

    const cid = p.client_id ?? "";
    setSelectedClientId(cid);
    await loadProjectsForClient(cid);

    setFormData({
      project: p.project,
      title: p.title ?? "",
      content: p.content ?? "",
      status: p.status ?? "draft",
      valid_until: p.valid_until ?? "",
      notes: p.notes ?? "",
      use_template: p.template ?? "",
    });

    setShowTemplate(!!p.template);
    setShowValidUntil(!!p.valid_until);
    setShowNotes(!!p.notes);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData(blankForm);
    setSelectedClientId("");
    setProjects([]);
  };

  const handleTemplateSelect = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    setFormData((prev) => ({
      ...prev,
      use_template: templateId,
      content: tpl?.content ?? prev.content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.project) {
      alert("Please select a project");
      setSaving(false);
      return;
    }
    if (!showTemplate && !formData.content) {
      alert("Content is required (or select a template)");
      setSaving(false);
      return;
    }

    const payload: ProposalFormData = {
      project: formData.project,
      title: formData.title,
      status: formData.status ?? "draft",

      content: showTemplate ? (formData.content || undefined) : formData.content,
      use_template: showTemplate ? (formData.use_template || undefined) : undefined,
      valid_until: showValidUntil ? (formData.valid_until || undefined) : undefined,
      notes: showNotes ? (formData.notes || undefined) : undefined,
    };

    try {
      if (editId) await updateProposal(editId, payload);
      else await createProposal(payload);

      await fetchData();
      closeModal();
    } catch (err: any) {
      alert("Error: " + (err?.message || "Failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this proposal?")) return;
    try {
      await deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const markStatus = async (id: string, st: "sent" | "accepted" | "rejected") => {
    setActionId(`${st}_${id}`);
    try {
      await updateProposalStatus(id, st);
      await fetchData();
    } catch (e: any) {
      alert(e?.message || "Status update failed");
    } finally {
      setActionId(null);
    }
  };

  const handleDownloadPdf = async (p: Proposal) => {
    setActionId(`pdf_${p.id}`);
    try {
      const blob = await downloadProposalPdf(p.id);
      const filename = `${(p.prop_number || p.id).replace(/[^\w.-]+/g, "_")}.pdf`;

      const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e: any) {
      alert(e?.message || "PDF download failed");
    } finally {
      setActionId(null);
    }
  };

  const handleDownloadCsv = (p: Proposal) => {
    const rows = [
      ["Proposal Number", p.prop_number ?? ""],
      ["Title", p.title ?? ""],
      ["Client", p.client_name ?? ""],
      ["Project", p.project_name ?? ""],
      ["Status", p.status ?? ""],
      ["Valid Until", p.valid_until ?? ""],
      ["Notes", p.notes ?? ""],
      ["Content", p.content ?? ""],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p.prop_number || p.id).replace(/[^\w.-]+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async (id: string) => {
    setActionId(`email_${id}`);
    try {
      await sendProposalEmail(id);
      alert("✅ Proposal emailed to client!");
    } catch (e: any) {
      alert(e?.message || "Email failed");
    } finally {
      setActionId(null);
    }
  };

  const handleSendWhatsApp = async (id: string) => {
    setActionId(`wa_${id}`);
    try {
      await sendProposalWhatsApp(id);
      alert("✅ Proposal sent on WhatsApp!");
    } catch (e: any) {
      alert(e?.message || "WhatsApp failed");
    } finally {
      setActionId(null);
    }
  };
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return proposals.filter((p) => {
      return (
        (p.client_name ?? "").toLowerCase().includes(q) ||
        (p.prop_number ?? "").toLowerCase().includes(q) ||
        (p.title ?? "").toLowerCase().includes(q)
      );
    });
  }, [proposals, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FCFBF9] p-6 md:p-10 text-[#1C1C1C]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Proposals</h1>
          <p className="text-[#9A8F82] font-medium">Create and manage client proposals</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#C8922A] hover:bg-[#B07A20] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> New Proposal
        </button>
      </div>

      <div className="bg-white border border-[#EDE8DF] rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#EDE8DF]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={18} />
            <input
              type="text"
              placeholder="Search by client, number, or title..."
              className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] rounded-xl outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EDE8DF] text-[11px] font-black text-[#9A8F82] uppercase tracking-[2px]">
                <th className="px-8 py-5">Document</th>
                <th className="px-8 py-5">Client / Project</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Valid Until</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F5F2ED]">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#C8922A]" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-[#9A8F82]">No proposals found.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FCFBF9] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#FDF3E3] rounded-xl flex items-center justify-center text-[#C8922A]">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[14px]">#{p.prop_number ?? "—"}</p>
                          <p className="text-[12px] text-[#9A8F82]">{p.title}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <p className="font-bold text-[14px]">{p.client_name || "—"}</p>
                      <p className="text-[12px] text-[#6B6259]">{p.project_name || "—"}</p>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{ backgroundColor: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}
                      >
                        {statusConfig[p.status]?.label ?? p.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-[13px] text-[#6B6259]">{p.valid_until || "—"}</td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEdit(p)} className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#C8922A]" title="Edit">
                          <Edit3 size={14} />
                        </button>

                        {p.status === "draft" && (
                          <button
                            onClick={() => markStatus(p.id, "sent")}
                            disabled={actionId === `sent_${p.id}`}
                            className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#3B82F6] disabled:opacity-50"
                            title="Mark Sent"
                          >
                            {actionId === `sent_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          </button>
                        )}

                        {p.status === "sent" && (
                          <>
                            <button
                              onClick={() => markStatus(p.id, "accepted")}
                              disabled={actionId === `accepted_${p.id}`}
                              className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#10B981] disabled:opacity-50"
                              title="Accept"
                            >
                              {actionId === `accepted_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            </button>
                            <button
                              onClick={() => markStatus(p.id, "rejected")}
                              disabled={actionId === `rejected_${p.id}`}
                              className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#EF4444] disabled:opacity-50"
                              title="Reject"
                            >
                              {actionId === `rejected_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDownloadPdf(p)}
                          disabled={actionId === `pdf_${p.id}`}
                          className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#1C1C1C] disabled:opacity-50"
                          title="PDF"
                        >
                          {actionId === `pdf_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        </button>

                        <button onClick={() => handleDownloadCsv(p)} className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#10B981]" title="CSV">
                          <FileSpreadsheet size={14} />
                        </button>

                        <button
                          onClick={() => handleSendEmail(p.id)}
                          disabled={actionId === `email_${p.id}`}
                          className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#3B82F6] disabled:opacity-50"
                          title="Send Email (Backend)"
                        >
                          {actionId === `email_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        </button>

                        <button
                          onClick={() => handleSendWhatsApp(p.id)}
                          disabled={actionId === `wa_${p.id}`}
                          className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#25D366] disabled:opacity-50"
                          title="Send WhatsApp (Backend)"
                        >
                          {actionId === `wa_${p.id}` ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                        </button>

                        <button onClick={() => handleDelete(p.id)} className="p-2 border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-red-500" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-[#EDE8DF] flex justify-between items-center bg-[#FCFBF9] rounded-t-[32px]">
              <div>
                <h2 className="font-black text-xl">{editId ? "Edit Proposal" : "New Proposal"}</h2>
                <p className="text-[12px] text-[#9A8F82] mt-0.5">Client → Project select karo</p>
              </div>
              <button onClick={closeModal} className="text-[#9A8F82] hover:text-black"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-6" id="proposal-form">
                {/* Client */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">
                    Client <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={selectedClientId}
                      onChange={async (e) => {
                        const cid = e.target.value;
                        setSelectedClientId(cid);
                        setFormData((prev) => ({ ...prev, project: "" }));
                        await loadProjectsForClient(cid);
                      }}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] appearance-none"
                    >
                      <option value="">Select a client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Project */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">
                    Project <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      disabled={!selectedClientId}
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] appearance-none disabled:opacity-60"
                    >
                      <option value="">{selectedClientId ? "Select a project" : "Select client first"}</option>
                      {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A]"
                  />
                </div>

                {/* Template toggle */}
                <div className="border border-[#EDE8DF] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowTemplate((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF8F5] hover:bg-[#F5F2ED]"
                  >
                    <span className="text-[13px] font-semibold text-[#6B6259]">Template</span>
                    <span className="text-[11px] text-[#C8922A] font-bold">{showTemplate ? "Remove" : "+ Add"}</span>
                  </button>

                  {showTemplate && (
                    <div className="px-4 py-3 border-t border-[#EDE8DF]">
                      <div className="relative">
                        <select
                          value={formData.use_template ?? ""}
                          onChange={(e) => handleTemplateSelect(e.target.value)}
                          className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] appearance-none"
                        >
                          <option value="">No template</option>
                          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" size={16} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-black text-[#6B6259] uppercase tracking-wider">
                    Content {showTemplate ? "(optional)" : "*"}
                  </label>
                  <textarea
                    required={!showTemplate}
                    rows={6}
                    value={formData.content ?? ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl outline-none focus:border-[#C8922A] resize-none font-mono"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#EDE8DF] flex gap-3 bg-white rounded-b-[32px]">
              <button type="button" onClick={closeModal} className="flex-1 py-3 border-2 border-[#EDE8DF] text-[#6B6259] font-bold rounded-2xl hover:bg-[#FAF8F5]">
                Cancel
              </button>
              <button
                type="submit"
                form="proposal-form"
                disabled={saving}
                className="flex-1 py-3 bg-[#C8922A] text-white font-black rounded-2xl hover:bg-[#B07A20] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editId ? "Update Proposal" : "Create Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}