"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Building2, Phone, Mail, X, CreditCard, Loader2
} from "lucide-react";

const statusConfig = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  on_hold: { label: "On Hold", color: "#F59E0B", bg: "#FFFBEB" },
  completed: { label: "Completed", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ClientsPage() {
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    billing_address: "",
    site_address: "",
    gstin: ""
  });

  // 1. Fetch Clients from API
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/clients/");
      const data = await response.json();
      
      // Map API fields to UI fields
      const formattedClients = data.results.map(client => ({
        id: client.id,
        name: client.full_name,
        email: client.email,
        phone: client.phone,
        projects: client.project_count || 0,
        totalBilled: "₹0", // Placeholder
        outstanding: "₹0", // Placeholder
        status: "active",
        initial: client.full_name.charAt(0).toUpperCase()
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle API Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/clients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        
        const newClientUI = {
          id: result.id,
          name: result.full_name,
          email: result.email,
          phone: result.phone,
          projects: 0,
          totalBilled: "₹0",
          outstanding: "₹0",
          status: "active",
          initial: result.full_name.charAt(0).toUpperCase()
        };

        setClients([newClientUI, ...clients]);
        setIsModalOpen(false);
        setFormData({ full_name: "", email: "", phone: "", billing_address: "", site_address: "", gstin: "" });
      } else {
        const errorData = await response.json();
        alert("Error saving client: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-[#FAF8F5] min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1C1C1C]">Clients</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">Manage your client relationships</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add New Client
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 flex-1 max-w-xs focus-within:ring-1 ring-[#C8922A]">
          <Search size={14} className="text-[#9A8F82]" />
          <input
            type="text"
            placeholder="Search clients..."
            className="bg-transparent text-[13px] text-[#1C1C1C] placeholder-[#9A8F82] outline-none flex-1"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-[#6B6259] hover:bg-[#F5F2ED]">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-[#EDE8DF] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE8DF] bg-[#FAF8F5]">
              {["Client", "Contact", "Projects", "Total Billed", "Outstanding", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F2ED]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#9A8F82]">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-[13px]">Loading clients...</span>
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-[#9A8F82] text-[13px]">
                  No clients found. Add your first client to get started.
                </td>
              </tr>
            ) : (
              clients.map((c) => {
                const st = statusConfig[c.status] || statusConfig.active;
                return (
                  <tr key={c.id || c.email} className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FDF3E3] text-[#C8922A] font-bold text-[14px] flex items-center justify-center shrink-0 border border-[#F5E6CC]">
                          {c.initial}
                        </div>
                        <span className="text-[13px] font-semibold text-[#1C1C1C]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#6B6259]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5"><Mail size={11} className="text-[#9A8F82]" /> {c.email}</div>
                        <div className="flex items-center gap-1.5"><Phone size={11} className="text-[#9A8F82]" /> {c.phone}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-[#1C1C1C] font-medium">
                        <Building2 size={13} className="text-[#9A8F82]" /> {c.projects}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-[#1C1C1C]">{c.totalBilled}</td>
                    <td className="px-5 py-4 text-[13px] font-semibold" style={{ color: c.outstanding === "₹0" ? "#10B981" : "#EF4444" }}>
                      {c.outstanding}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight" style={{ color: st.color, backgroundColor: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1 hover:bg-[#F5F2ED] rounded-md transition-colors text-[#9A8F82]">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD CLIENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FAF8F5]">
              <h2 className="text-lg font-bold text-[#1C1C1C]">Create New Client</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-[#9A8F82] hover:text-red-500 transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form id="clientForm" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase">Full Name *</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Srivastava"
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A] transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#6B6259] uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase">Billing Address</label>
                <textarea 
                  rows={2}
                  name="billing_address"
                  value={formData.billing_address}
                  onChange={handleChange}
                  placeholder="Enter registered address"
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A] resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase">Site Address</label>
                <textarea 
                  rows={2}
                  name="site_address"
                  value={formData.site_address}
                  onChange={handleChange}
                  placeholder="May differ from billing address"
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#6B6259] uppercase flex items-center gap-1.5">
                  GSTIN <span className="text-[10px] font-normal lowercase text-[#9A8F82]">(Optional)</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82]" size={14} />
                  <input 
                    type="text" 
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] focus:ring-1 focus:ring-[#C8922A] uppercase"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#EDE8DF] bg-[#FAF8F5] flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-[13px] font-semibold text-[#6B6259] hover:text-[#1C1C1C]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="clientForm"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}