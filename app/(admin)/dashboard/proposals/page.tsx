"use client";

import React, { useState, useMemo } from "react";
import {
  Plus, Search, Download, Eye, MoreHorizontal, FileText,
  Loader2, X, ChevronRight, Filter, Trash2, Edit3, Save, ArrowLeft
} from "lucide-react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

// --- API Configurations ---
const API_BASE = "http://127.0.0.1:8000/api/v1";

const api = {
  fetchProposals: async () => {
    const { data } = await axios.get(`${API_BASE}/proposals/`);
    return data.results;
  },
  fetchTemplates: async () => {
    const { data } = await axios.get(`${API_BASE}/proposals/templates/`);
    return data.results;
  },
  createProposal: async (payload: any) => {
    const { data } = await axios.post(`${API_BASE}/proposals/`, payload);
    return data;
  },
  updateProposal: async ({ id, payload }: { id: string; payload: any }) => {
    const { data } = await axios.patch(`${API_BASE}/proposals/${id}/`, payload);
    return data;
  },
  deleteProposal: async (id: string) => {
    await axios.delete(`${API_BASE}/proposals/${id}/`);
    return id;
  },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#6B6259", bg: "#F5F2ED" },
  sent: { label: "Sent", color: "#C8922A", bg: "#FDF3E3" },
  accepted: { label: "Accepted", color: "#10B981", bg: "#ECFDF5" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
};

const queryClient = new QueryClient();

export default function InteriorBillProposalsFull() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProposalsManager />
    </QueryClientProvider>
  );
}

function ProposalsManager() {
  const qc = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1); // 1: List, 2: Select Template, 3: Form
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    project: "4aa33d3c-7d68-4a1b-aae1-49e9c5e5bed6", // Default UUID from your data
    template: "",
    prop_number: "",
    title: "",
    content: "",
    status: "draft",
    valid_until: "",
    notes: ""
  });

  // --- Queries ---
  const { data: proposals, isLoading: loadingProps } = useQuery({ queryKey: ["proposals"], queryFn: api.fetchProposals });
  const { data: templates } = useQuery({ queryKey: ["templates"], queryFn: api.fetchTemplates });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: api.createProposal,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["proposals"] }); resetForm(); }
  });

  const updateMutation = useMutation({
    mutationFn: api.updateProposal,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["proposals"] }); resetForm(); }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteProposal,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["proposals"] }); }
  });

  const resetForm = () => {
    setFormData({ project: "4aa33d3c-7d68-4a1b-aae1-49e9c5e5bed6", template: "", prop_number: "", title: "", content: "", status: "draft", valid_until: "", notes: "" });
    setEditId(null);
    setStep(1);
    setIsModalOpen(false);
  };

  const handleEdit = (p: any) => {
    setFormData({
      project: p.project,
      template: p.template,
      prop_number: p.prop_number,
      title: p.title,
      content: p.content,
      status: p.status,
      valid_until: p.valid_until,
      notes: p.notes
    });
    setEditId(p.id);
    setStep(3);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateMutation.mutate({ id: editId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProposals = proposals?.filter((p: any) =>
    p.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.prop_number?.includes(searchQuery)
  ) || [];

  return (
    <div className="min-h-screen bg-[#FCFBF9] p-6 md:p-10 font-sans text-[#1C1C1C]">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">InteriorBill Pro</h1>
          <p className="text-[#9A8F82] font-medium">Proposals & Narrative Management</p>
        </div>
        <button 
          onClick={() => { setStep(2); setIsModalOpen(true); }}
          className="bg-[#C8922A] hover:bg-[#B07A20] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#C8922A]/20"
        >
          <Plus size={20} strokeWidth={3} /> New Proposal
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white border border-[#EDE8DF] rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#EDE8DF] bg-white flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={18} />
            <input 
              type="text" 
              placeholder="Search proposals..." 
              className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/10 transition-all"
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
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2ED]">
              {loadingProps ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#C8922A]" /></td></tr>
              ) : filteredProposals.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#FCFBF9] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FDF3E3] rounded-xl flex items-center justify-center text-[#C8922A]"><FileText size={18} /></div>
                      <div>
                        <p className="font-bold text-[14px]">{p.prop_number}</p>
                        <p className="text-[12px] text-[#9A8F82]">{p.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-[14px]">{p.client_name}</p>
                    <p className="text-[12px] text-[#6B6259]">{p.project_name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-[#C8922A] shadow-sm"><Edit3 size={14} /></button>
                      <button onClick={() => deleteMutation.mutate(p.id)} className="p-2 hover:bg-white border border-[#EDE8DF] rounded-lg text-[#6B6259] hover:text-red-500 shadow-sm"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CRUD Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EDE8DF] flex justify-between items-center bg-[#FCFBF9]">
              <div className="flex items-center gap-3">
                {step > 2 && <button onClick={() => setStep(2)} className="p-2 hover:bg-[#EDE8DF] rounded-full"><ArrowLeft size={18}/></button>}
                <h2 className="font-black text-xl">{editId ? 'Edit Proposal' : 'New Proposal'}</h2>
              </div>
              <button onClick={resetForm} className="text-[#9A8F82] hover:text-black"><X size={24}/></button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Step 2: Select Template */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-[#9A8F82] uppercase tracking-widest mb-4">Choose a Template</p>
                  {templates?.map((t: any) => (
                    <button 
                      key={t.id} 
                      onClick={() => { setFormData({...formData, template: t.id}); setStep(3); }}
                      className="w-full flex items-center justify-between p-5 border-2 border-[#EDE8DF] rounded-2xl hover:border-[#C8922A] hover:bg-[#FDF3E3]/40 transition-all group"
                    >
                      <span className="font-bold group-hover:text-[#C8922A]">{t.name}</span>
                      <ChevronRight size={18} className="text-[#CDC5BD]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Form */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Prop Number</label>
                      <input required className="w-full p-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/20" 
                             value={formData.prop_number} onChange={e => setFormData({...formData, prop_number: e.target.value})} placeholder="e.g. 123" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Title</label>
                      <input required className="w-full p-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/20" 
                             value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Main Title" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Content</label>
                    <textarea required className="w-full p-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/20 min-h-[100px]" 
                              value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Detailed narrative content..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Valid Until</label>
                      <input type="date" className="w-full p-3 bg-[#FAF8F5] rounded-xl outline-none focus:ring-2 focus:ring-[#C8922A]/20" 
                             value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Status</label>
                      <select className="w-full p-3 bg-[#FAF8F5] rounded-xl outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="w-full py-4 bg-[#C8922A] text-white rounded-2xl font-bold shadow-lg shadow-[#C8922A]/20 hover:bg-[#B07A20] transition-all flex items-center justify-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                    {editId ? 'Update Proposal' : 'Save Proposal'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}