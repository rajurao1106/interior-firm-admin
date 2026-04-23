// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft, Mail, Phone, Calendar, CreditCard, Loader2, MapPin,
//   Briefcase, Plus, X, Layout, AlertCircle, Home, Edit2, Trash2,
//   FileText, ScrollText, Receipt, Send, CheckCircle, RotateCcw,
//   ChevronUp, ChevronDown, FileStack, IndianRupee, Clock, Banknote,
//   BadgeCheck, RefreshCw
// } from "lucide-react";
// import { getClientById, getProposalsByClient, getQuotationsByClient } from "@/services/clientService";
// const API = "http://127.0.0.1:8000/api/v1";
// const inputCls = "w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] transition-colors";

// const projectBadge = (s: string) => ({ completed:"bg-green-100 text-green-700", active:"bg-blue-100 text-blue-700", on_hold:"bg-amber-100 text-amber-700" }[s] || "bg-gray-100 text-gray-700");
// const proposalBadge = (s: string) => ({ draft:"bg-gray-100 text-gray-600", sent:"bg-blue-100 text-blue-700", approved:"bg-green-100 text-green-700", rejected:"bg-red-100 text-red-600" }[s] || "bg-gray-100 text-gray-700");
// const quoteBadge = (s: string) => ({ draft:"bg-gray-100 text-gray-600", sent:"bg-blue-100 text-blue-700", approved:"bg-green-100 text-green-700", rejected:"bg-red-100 text-red-600", revised:"bg-purple-100 text-purple-700" }[s] || "bg-gray-100 text-gray-700");
// const invoiceBadge = (s: string) => ({ draft:"bg-gray-100 text-gray-600", sent:"bg-blue-100 text-blue-700", paid:"bg-green-100 text-green-700", partial:"bg-amber-100 text-amber-700", overdue:"bg-red-100 text-red-600", cancelled:"bg-gray-200 text-gray-500" }[s] || "bg-gray-100 text-gray-700");
// const invoiceTypeBadge = (t: string) => ({ full:"bg-indigo-100 text-indigo-700", advance:"bg-cyan-100 text-cyan-700", milestone:"bg-purple-100 text-purple-700", final:"bg-teal-100 text-teal-700" }[t] || "bg-gray-100 text-gray-700");

// const fmt = (n: any) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// const EMPTY_ITEM = () => ({ _key: Math.random(), description: "", category: "Furniture", quantity: "1", unit: "sqft", rate: "", sort_order: 1 });

// export default function ClientDetails() {
//   const { id } = useParams();
//   const clientId = Array.isArray(id) ? id[0] : id;
//   const router = useRouter();

//   const [client, setClient] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("projects");

//   // Project state
//   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//   const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);
//   const [projectApiError, setProjectApiError] = useState<any>(null);
//   const [editingProjectId, setEditingProjectId] = useState<any>(null);
//   const [projectForm, setProjectForm] = useState({ name:"", property_type:"apartment", style_category:"modern", area_sqft:"", budget_range:"", start_date:"", expected_end_date:"", status:"active", notes:"" });

//   // Proposal state
//   const [proposals, setProposals] = useState<any[]>([]);
//   const [templates, setTemplates] = useState<any[]>([]);
//   const [proposalsLoading, setProposalsLoading] = useState(false);
//   const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
//   const [templateForm, setTemplateForm] = useState({ name:"", description:"", content:"" });
//   const [templateSubmitting, setTemplateSubmitting] = useState(false);
//   const [templateError, setTemplateError] = useState<any>(null);
//   const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
//   const [proposalMode, setProposalMode] = useState("template");
//   const [proposalForm, setProposalForm] = useState({ project:"", title:"", use_template:"", content:"", valid_until:"", notes:"" });
//   const [proposalSubmitting, setProposalSubmitting] = useState(false);
//   const [proposalError, setProposalError] = useState<any>(null);

//   // Quotation state
//   const [quotations, setQuotations] = useState<any[]>([]);
//   const [quotationsLoading, setQuotationsLoading] = useState(false);
//   const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
//   const [quoteSubmitting, setQuoteSubmitting] = useState(false);
//   const [quoteError, setQuoteError] = useState<any>(null);
//   const [quoteForm, setQuoteForm] = useState({ project:"", valid_until:"", discount_type:"percentage", discount_value:"0", cgst_rate:"9", sgst_rate:"9", igst_rate:"0", notes:"" });
//   const [quoteItems, setQuoteItems] = useState([EMPTY_ITEM()]);
//   const [taxMode, setTaxMode] = useState("cgst_sgst");
//   const [viewingQuote, setViewingQuote] = useState<any>(null);
//   const [quoteDetailLoading, setQuoteDetailLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Invoice state
//   const [invoices, setInvoices] = useState<any[]>([]);
//   const [invoicesLoading, setInvoicesLoading] = useState(false);
//   const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
//   const [invoiceSubmitting, setInvoiceSubmitting] = useState(false);
//   const [invoiceError, setInvoiceError] = useState<any>(null);
//   const [invoiceForm, setInvoiceForm] = useState({
//     quotation_id: "",
//     invoice_type: "full",
//     milestone_label: "",
//     milestone_percentage: 100,
//     invoice_date: new Date().toISOString().split("T")[0],
//     due_days: 15,
//     notes: ""
//   });
//   const [viewingInvoice, setViewingInvoice] = useState<any>(null);
//   const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(false);
//   const [invoiceActionLoading, setInvoiceActionLoading] = useState(false);

//   // ── Fetch ──────────────────────────────────────────────────────────────────const fetchClientData = async () => {
// const fetchClientData = async () => {
//   try {
//     const data = await getClientById(clientId as string);
//     setClient(data);
//   } catch (e) {
//     console.error("Client fetch failed:", e);
//   } finally {
//     setLoading(false);
//   }
// };
//   const fetchProposals = async (clientData: any) => {
//     setProposalsLoading(true);
//     try {
//       const clientProjectIds: string[] = (clientData?.projects || []).map((p: any) => p.id);
//       const data = await getProposalsByClient(clientId);
// setProposals(data);
//       const d = await r.json();
//       const allProposals = d.results || d;
//       const filtered = allProposals.filter((proposal: any) =>
//         clientProjectIds.includes(proposal.project) || clientProjectIds.includes(proposal.project_id)
//       );
//       setProposals(filtered);
//     } catch (e) { console.error(e); } finally { setProposalsLoading(false); }
//   };

//   const fetchTemplates = async () => {
//     try {
//       const r = await fetch(`${API}/proposals/templates/`);
//       const d = await r.json();
//       setTemplates(d.results || d);
//     } catch (e) { console.error(e); }
//   };

//   const fetchQuotations = async (clientData: any) => {
//     setQuotationsLoading(true);
//     try {
//       const clientProjectIds: string[] = (clientData?.projects || []).map((p: any) => p.id);
//       const data = await getProposalsByClient(clientId);
// setProposals(data);
//       const d = await r.json();
//       const allQuotations = d.results || d;
//       const filtered = allQuotations.filter((quotation: any) =>
//         clientProjectIds.includes(quotation.project) || clientProjectIds.includes(quotation.project_id)
//       );
//       setQuotations(filtered);
//     } catch (e) { console.error(e); } finally { setQuotationsLoading(false); }
//   };

//   const fetchQuoteDetail = async (qid: any) => {
//     setQuoteDetailLoading(true);
//     try {
//       const r = await fetch(`${API}/quotations/${qid}/`);
//       setViewingQuote(await r.json());
//     } catch (e) { console.error(e); } finally { setQuoteDetailLoading(false); }
//   };

//   // ── Invoice fetch ──────────────────────────────────────────────────────────
//   const fetchInvoices = async (clientData: any) => {
//     setInvoicesLoading(true);
//     try {
//       const clientProjectIds: string[] = (clientData?.projects || []).map((p: any) => String(p.id));
//       const r = await fetch(`${API}/invoices/`);
//       const d = await r.json();
//       const all = d.results || d;
//       // Filter invoices belonging to this client's projects
//       const filtered = all.filter((inv: any) =>
//         clientProjectIds.includes(String(inv.project))
//       );
//       setInvoices(filtered);
//     } catch (e) { console.error(e); } finally { setInvoicesLoading(false); }
//   };

//   const fetchInvoiceDetail = async (iid: any) => {
//     setInvoiceDetailLoading(true);
//     try {
//       const r = await fetch(`${API}/invoices/${iid}/`);
//       setViewingInvoice(await r.json());
//     } catch (e) { console.error(e); } finally { setInvoiceDetailLoading(false); }
//   };


//   useEffect(() => { fetchClientData(); }, [clientId]);

//   useEffect(() => {
//     if (!client) return;
//     if (activeTab === "proposals") { fetchProposals(client); fetchTemplates(); }
//     if (activeTab === "quotations") fetchQuotations(client);
//     if (activeTab === "invoices") { fetchInvoices(client); fetchQuotations(client); }
//   }, [activeTab, client]);

//   // ── Project handlers ───────────────────────────────────────────────────────
//   const handleProjectInputChange = (e: any) => {
//     const { name, value } = e.target;
//     setProjectForm(p => ({ ...p, [name]: value }));
//     setProjectApiError(null);
//   };

//   const handleEditClick = (proj: any) => {
//     setEditingProjectId(proj.id);
//     setProjectForm({
//       name: proj.name, property_type: proj.property_type, style_category: proj.style_category || "modern",
//       area_sqft: proj.area_sqft, budget_range: proj.budget_range, start_date: proj.start_date,
//       expected_end_date: proj.expected_end_date, status: proj.status, notes: proj.notes || ""
//     });
//     setIsProjectModalOpen(true);
//   };

//   const handleDeleteProject = async (pid: any) => {
//     if (!confirm("Delete this project?")) return;
//     const r = await fetch(`${API}/clients/${id}/projects/${pid}/`, { method: "DELETE" });
//     if (r.ok) fetchClientData(); else alert("Failed.");
//   };

//   const handleProjectSubmit = async (e: any) => {
//     e.preventDefault();
//     setIsProjectSubmitting(true);
//     setProjectApiError(null);
//     const payload = { ...projectForm, client: id, area_sqft: projectForm.area_sqft ? parseFloat(projectForm.area_sqft) : null };
//     const url = editingProjectId ? `${API}/clients/${id}/projects/${editingProjectId}/` : `${API}/clients/${id}/projects/`;
//     try {
//       const r = await fetch(url, { method: editingProjectId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       const result = await r.json();
//       if (r.ok) { await fetchClientData(); closeProjectModal(); } else { setProjectApiError(result); }
//     } catch { setProjectApiError({ detail: "Connection error." }); } finally { setIsProjectSubmitting(false); }
//   };

//   const closeProjectModal = () => {
//     setIsProjectModalOpen(false);
//     setEditingProjectId(null);
//     setProjectForm({ name: "", property_type: "apartment", style_category: "modern", area_sqft: "", budget_range: "", start_date: "", expected_end_date: "", status: "active", notes: "" });
//   };

//   // ── Template handlers ──────────────────────────────────────────────────────
//   const handleTemplateSubmit = async (e: any) => {
//     e.preventDefault();
//     setTemplateSubmitting(true);
//     setTemplateError(null);
//     try {
//       const r = await fetch(`${API}/proposals/templates/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(templateForm) });
//       const result = await r.json();
//       if (r.ok) { await fetchTemplates(); setIsTemplateModalOpen(false); setTemplateForm({ name: "", description: "", content: "" }); }
//       else { setTemplateError(result); }
//     } catch { setTemplateError({ detail: "Connection error." }); } finally { setTemplateSubmitting(false); }
//   };

//   // ── Proposal handlers ──────────────────────────────────────────────────────
//   const openProposalModal = () => {
//     setProposalForm({ project: client?.projects?.[0]?.id || "", title: "", use_template: "", content: "", valid_until: "", notes: "" });
//     setProposalError(null);
//     setIsProposalModalOpen(true);
//   };

//   const handleProposalSubmit = async (e: any) => {
//     e.preventDefault();
//     setProposalSubmitting(true);
//     setProposalError(null);
//     const payload = proposalMode === "template"
//       ? { project: proposalForm.project, title: proposalForm.title, use_template: proposalForm.use_template, valid_until: proposalForm.valid_until, notes: proposalForm.notes }
//       : { project: proposalForm.project, title: proposalForm.title, content: proposalForm.content, valid_until: proposalForm.valid_until, notes: proposalForm.notes };
//     try {
//       const r = await fetch(`${API}/proposals/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       const result = await r.json();
//       if (r.ok) { await fetchProposals(client); setIsProposalModalOpen(false); } else { setProposalError(result); }
//     } catch { setProposalError({ detail: "Connection error." }); } finally { setProposalSubmitting(false); }
//   };

//   // ── Quotation handlers ─────────────────────────────────────────────────────
//   const openQuoteModal = () => {
//     setQuoteForm({ project: client?.projects?.[0]?.id || "", valid_until: "", discount_type: "percentage", discount_value: "0", cgst_rate: "9", sgst_rate: "9", igst_rate: "0", notes: "" });
//     setQuoteItems([EMPTY_ITEM()]);
//     setTaxMode("cgst_sgst");
//     setQuoteError(null);
//     setIsQuoteModalOpen(true);
//   };

//   const closeQuoteModal = () => { setIsQuoteModalOpen(false); setQuoteError(null); };

//   const addItem = () => setQuoteItems(p => [...p, { ...EMPTY_ITEM(), sort_order: p.length + 1 }]);
//   const removeItem = (key: any) => setQuoteItems(p => p.filter(i => i._key !== key));
//   const updateItem = (key: any, field: string, val: any) => setQuoteItems(p => p.map(i => i._key === key ? { ...i, [field]: val } : i));

//   const moveItem = (key: any, dir: number) => {
//     setQuoteItems(p => {
//       const idx = p.findIndex(i => i._key === key);
//       const next = idx + dir;
//       if (next < 0 || next >= p.length) return p;
//       const arr = [...p];
//       [arr[idx], arr[next]] = [arr[next], arr[idx]];
//       return arr.map((i, n) => ({ ...i, sort_order: n + 1 }));
//     });
//   };

//   const calcTotals = useCallback(() => {
//     const subtotal = quoteItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0), 0);
//     const dv = parseFloat(quoteForm.discount_value) || 0;
//     const discAmt = quoteForm.discount_type === "percentage" ? subtotal * dv / 100 : dv;
//     const taxable = Math.max(0, subtotal - discAmt);
//     let cgst = 0, sgst = 0, igst = 0;
//     if (taxMode === "cgst_sgst") { cgst = taxable * (parseFloat(quoteForm.cgst_rate) || 0) / 100; sgst = taxable * (parseFloat(quoteForm.sgst_rate) || 0) / 100; }
//     else { igst = taxable * (parseFloat(quoteForm.igst_rate) || 0) / 100; }
//     return { subtotal, discAmt, taxable, cgst, sgst, igst, total: taxable + cgst + sgst + igst };
//   }, [quoteItems, quoteForm, taxMode]);

//   const totals = calcTotals();

//   const handleQuoteSubmit = async (e: any) => {
//     e.preventDefault();
//     setQuoteSubmitting(true);
//     setQuoteError(null);
//     const payload = {
//       project: quoteForm.project, valid_until: quoteForm.valid_until || undefined,
//       discount_type: quoteForm.discount_type, discount_value: quoteForm.discount_value,
//       cgst_rate: taxMode === "cgst_sgst" ? quoteForm.cgst_rate : "0",
//       sgst_rate: taxMode === "cgst_sgst" ? quoteForm.sgst_rate : "0",
//       igst_rate: taxMode === "igst" ? quoteForm.igst_rate : "0",
//       notes: quoteForm.notes,
//       items: quoteItems.map((i, n) => ({ description: i.description, category: i.category, quantity: i.quantity, unit: i.unit, rate: i.rate, sort_order: n + 1 }))
//     };
//     try {
//       const r = await fetch(`${API}/quotations/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       const result = await r.json();
//       if (r.ok) { await fetchQuotations(client); closeQuoteModal(); } else { setQuoteError(result); }
//     } catch { setQuoteError({ detail: "Connection error." }); } finally { setQuoteSubmitting(false); }
//   };

//   const handleApprove = async (qid: any) => {
//     if (!confirm("Approve this quotation?")) return;
//     setActionLoading(true);
//     try {
//       const r = await fetch(`${API}/quotations/${qid}/approve/`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (r.ok) { await fetchQuotations(client); if (viewingQuote?.id === qid) fetchQuoteDetail(qid); } else alert("Approve failed.");
//     } catch { alert("Error."); } finally { setActionLoading(false); }
//   };

//   const handleSend = async (qid: any) => {
//     if (!confirm("Mark as Sent?")) return;
//     setActionLoading(true);
//     try {
//       const r = await fetch(`${API}/quotations/${qid}/send/`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (r.ok) { await fetchQuotations(client); if (viewingQuote?.id === qid) fetchQuoteDetail(qid); } else alert("Send failed.");
//     } catch { alert("Error."); } finally { setActionLoading(false); }
//   };

//   const handleRevise = async (qid: any) => {
//     if (!confirm("Create a new revision?")) return;
//     setActionLoading(true);
//     try {
//       const r = await fetch(`${API}/quotations/${qid}/revise/`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (r.ok) { await fetchQuotations(client); setViewingQuote(null); } else alert("Revise failed.");
//     } catch { alert("Error."); } finally { setActionLoading(false); }
//   };

//   const handleDeleteQuote = async (qid: any) => {
//     if (!confirm("Delete this quotation permanently?")) return;
//     try {
//       const r = await fetch(`${API}/quotations/${qid}/`, { method: "DELETE" });
//       if (r.ok) { await fetchQuotations(client); if (viewingQuote?.id === qid) setViewingQuote(null); } else alert("Delete failed.");
//     } catch { alert("Error."); }
//   };

//   // ── Invoice handlers ───────────────────────────────────────────────────────
//   const openInvoiceModal = () => {
//     // Pre-select first approved quotation if available
//     const approvedQuote = quotations.find(q => q.status === "approved");
//     setInvoiceForm({
//       quotation_id: approvedQuote?.id || "",
//       invoice_type: "full",
//       milestone_label: "",
//       milestone_percentage: 100,
//       invoice_date: new Date().toISOString().split("T")[0],
//       due_days: 15,
//       notes: ""
//     });
//     setInvoiceError(null);
//     setIsInvoiceModalOpen(true);
//   };

//   const closeInvoiceModal = () => { setIsInvoiceModalOpen(false); setInvoiceError(null); };

//   const handleInvoiceTypeChange = (type: string) => {
//     const defaults: Record<string, any> = {
//       full: { milestone_label: "", milestone_percentage: 100, due_days: 15 },
//       advance: { milestone_label: "Advance on Booking", milestone_percentage: 10, due_days: 7 },
//       milestone: { milestone_label: "", milestone_percentage: 20, due_days: 15 },
//       final: { milestone_label: "Final Handover", milestone_percentage: 20, due_days: 7 },
//     };
//     setInvoiceForm(p => ({ ...p, invoice_type: type, ...defaults[type] }));
//   };

//   const handleInvoiceSubmit = async (e: any) => {
//     e.preventDefault();
//     setInvoiceSubmitting(true);
//     setInvoiceError(null);
//     const payload = {
//       quotation_id: invoiceForm.quotation_id,
//       invoice_type: invoiceForm.invoice_type,
//       milestone_label: invoiceForm.milestone_label || undefined,
//       milestone_percentage: invoiceForm.milestone_percentage,
//       invoice_date: invoiceForm.invoice_date,
//       due_days: invoiceForm.due_days,
//       notes: invoiceForm.notes || undefined,
//     };
//     try {
//       const r = await fetch(`${API}/invoices/generate/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const result = await r.json();
//       if (r.ok) { await fetchInvoices(client); closeInvoiceModal(); }
//       else { setInvoiceError(result); }
//     } catch { setInvoiceError({ detail: "Connection error." }); } finally { setInvoiceSubmitting(false); }
//   };

//   const handleSendInvoice = async (iid: any) => {
//     if (!confirm("Mark invoice as Sent?")) return;
//     setInvoiceActionLoading(true);
//     try {
//       const r = await fetch(`${API}/invoices/${iid}/send/`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (r.ok) { await fetchInvoices(client); if (viewingInvoice?.id === iid) fetchInvoiceDetail(iid); } else alert("Failed.");
//     } catch { alert("Error."); } finally { setInvoiceActionLoading(false); }
//   };

//   const handleMarkPaid = async (iid: any) => {
//     if (!confirm("Mark invoice as Paid?")) return;
//     setInvoiceActionLoading(true);
//     try {
//       const r = await fetch(`${API}/invoices/${iid}/mark_paid/`, { method: "POST", headers: { "Content-Type": "application/json" } });
//       if (r.ok) { await fetchInvoices(client); if (viewingInvoice?.id === iid) fetchInvoiceDetail(iid); } else alert("Failed.");
//     } catch { alert("Error."); } finally { setInvoiceActionLoading(false); }
//   };

//   const handleDeleteInvoice = async (iid: any) => {
//     if (!confirm("Delete this invoice permanently?")) return;
//     try {
//       const r = await fetch(`${API}/invoices/${iid}/`, { method: "DELETE" });
//       if (r.ok) { await fetchInvoices(client); if (viewingInvoice?.id === iid) setViewingInvoice(null); } else alert("Delete failed.");
//     } catch { alert("Error."); }
//   };

//   // Invoice stats
//   const invoiceStats = {
//     total: invoices.length,
//     totalValue: invoices.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0),
//     paid: invoices.filter(i => i.status === "paid").reduce((s, i) => s + parseFloat(i.grand_total || 0), 0),
//     pending: invoices.filter(i => ["draft","sent","partial"].includes(i.status)).reduce((s, i) => s + parseFloat(i.balance_due || i.grand_total || 0), 0),
//   };

//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
//       <Loader2 className="animate-spin text-[#C8922A]" size={40} />
//     </div>
//   );
//   if (!client) return <div className="p-10 text-center">Client not found.</div>;

//   return (
//     <div className="p-8 bg-[#FAF8F5] min-h-screen font-sans">
//       <div className="flex items-center mb-6">
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-[#9A8F82] hover:text-[#1C1C1C] transition-colors group">
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-sm font-medium">Back to Clients</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* LEFT: Client Info */}
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-sm">
//             <div className="flex flex-col items-center text-center pb-6 border-b border-[#F5F2ED]">
//               <div className="w-20 h-20 rounded-full bg-[#FDF3E3] text-[#C8922A] text-3xl font-bold flex items-center justify-center border-2 border-[#F5E6CC] mb-4 shadow-sm">
//                 {client?.full_name?.charAt(0)?.toUpperCase() || "?"}
//               </div>
//               <h1 className="text-xl font-bold text-[#1C1C1C]">{client.full_name}</h1>
//               <span className="text-[11px] font-bold px-2 py-0.5 mt-2 rounded-full uppercase bg-green-50 text-green-600 border border-green-100">Active Client</span>
//             </div>
//             <div className="pt-6 space-y-5">
//               {[
//                 { icon: <Mail size={16} />, label: "Email Address", value: client.email || "N/A" },
//                 { icon: <Phone size={16} />, label: "Phone Number", value: client.phone },
//                 { icon: <CreditCard size={16} />, label: "GST Number", value: client.gstin || "N/A", upper: true },
//                 { icon: <MapPin size={16} />, label: "Billing Address", value: client.billing_address || "N/A" },
//                 { icon: <Home size={16} />, label: "Site Address", value: client.site_address || "N/A" },
//               ].map(({ icon, label, value, upper }: any) => (
//                 <div key={label} className="flex items-start gap-3">
//                   <div className="p-2 bg-[#FAF8F5] rounded-lg text-[#9A8F82]">{icon}</div>
//                   <div className="flex-1">
//                     <p className="text-[10px] uppercase font-bold text-[#9A8F82] tracking-wider">{label}</p>
//                     <p className={`text-[13px] font-medium text-[#1C1C1C] break-all leading-relaxed ${upper ? "uppercase" : ""}`}>{value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl border border-[#EDE8DF] p-5 shadow-sm">
//             <div className="flex items-center gap-2 text-[#9A8F82] text-[12px] font-semibold uppercase tracking-widest mb-3">
//               <Calendar size={14} /> Account Info
//             </div>
//             <p className="text-[13px] text-[#6B6259]">Created on: <span className="font-bold text-[#1C1C1C]">{new Date(client.created_at).toLocaleDateString()}</span></p>
//           </div>
//         </div>

//         {/* RIGHT: Tabs */}
//         <div className="lg:col-span-2 space-y-5">
//           {/* Tab Bar + Actions */}
//           <div className="flex items-center justify-between flex-wrap gap-3">
//             <div className="flex items-center gap-1 bg-white border border-[#EDE8DF] rounded-xl p-1 shadow-sm flex-wrap">
//               {[
//                 { key: "projects", icon: <Briefcase size={13} />, label: `Projects (${client.project_count})` },
//                 { key: "proposals", icon: <ScrollText size={13} />, label: "Proposals" },
//                 { key: "quotations", icon: <Receipt size={13} />, label: "Quotations" },
//                 { key: "invoices", icon: <FileStack size={13} />, label: "Invoices" },
//               ].map(t => (
//                 <button key={t.key} onClick={() => setActiveTab(t.key)}
//                   className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === t.key ? "bg-[#C8922A] text-white shadow-sm" : "text-[#6B6259] hover:text-[#1C1C1C]"}`}>
//                   {t.icon}{t.label}
//                 </button>
//               ))}
//             </div>
//             {activeTab === "projects" && (
//               <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm">
//                 <Plus size={15} /> Add Project
//               </button>
//             )}
//             {activeTab === "proposals" && (
//               <div className="flex gap-2">
//                 <button onClick={() => setIsTemplateModalOpen(true)} className="flex items-center gap-2 bg-white border border-[#EDE8DF] hover:border-[#C8922A] text-[#6B6259] hover:text-[#C8922A] text-[12px] font-semibold px-3 py-2 rounded-lg transition-all shadow-sm">
//                   <Layout size={14} /> Template
//                 </button>
//                 <button onClick={openProposalModal} className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-all shadow-sm">
//                   <Plus size={14} /> Proposal
//                 </button>
//               </div>
//             )}
//             {activeTab === "quotations" && (
//               <button onClick={openQuoteModal} className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm">
//                 <Plus size={15} /> New Quotation
//               </button>
//             )}
//             {activeTab === "invoices" && (
//               <button onClick={openInvoiceModal} className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm">
//                 <Plus size={15} /> Generate Invoice
//               </button>
//             )}
//           </div>

//           {/* PROJECTS TAB */}
//           {activeTab === "projects" && (
//             <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//               {client.projects?.length > 0 ? (
//                 <table className="w-full text-left">
//                   <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
//                     <tr>
//                       <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Project Details</th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-[#F5F2ED]">
//                     {client.projects.map((p: any) => (
//                       <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
//                         <td className="px-6 py-4">
//                           <p className="text-[13px] font-bold text-[#1C1C1C] capitalize">{p.name}</p>
//                           <p className="text-[11px] text-[#9A8F82] mt-0.5">{p.property_type} • ₹{Number(p.budget_range).toLocaleString("en-IN")}</p>
//                         </td>
//                         <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${projectBadge(p.status)}`}>{p.status}</span></td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <button onClick={() => handleEditClick(p)} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Edit2 size={14} /></button>
//                             <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={14} /></button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : <div className="p-16 text-center text-[#9A8F82] text-sm">No projects found.</div>}
//             </div>
//           )}

//           {/* PROPOSALS TAB */}
//           {activeTab === "proposals" && (
//             <div className="space-y-4">
//               <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//                 <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center gap-2">
//                   <Layout size={14} className="text-[#C8922A]" />
//                   <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Saved Templates</h3>
//                   <span className="ml-auto text-[11px] bg-[#FDF3E3] text-[#C8922A] font-bold px-2 py-0.5 rounded-full">{templates.length}</span>
//                 </div>
//                 {templates.length > 0 ? (
//                   <div className="divide-y divide-[#F5F2ED]">
//                     {templates.map((t: any) => (
//                       <div key={t.id} className="px-6 py-3 flex items-center gap-3 hover:bg-[#FAF8F5]">
//                         <div className="p-2 bg-[#FDF3E3] rounded-lg text-[#C8922A]"><FileText size={13} /></div>
//                         <div>
//                           <p className="text-[13px] font-bold text-[#1C1C1C]">{t.name}</p>
//                           {t.description && <p className="text-[11px] text-[#9A8F82] truncate max-w-xs">{t.description}</p>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : <div className="px-6 py-8 text-center text-[#9A8F82] text-[13px]">No templates yet.</div>}
//               </div>
//               <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//                 <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center gap-2">
//                   <ScrollText size={14} className="text-[#C8922A]" />
//                   <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Proposals</h3>
//                   <span className="ml-auto text-[11px] bg-[#FDF3E3] text-[#C8922A] font-bold px-2 py-0.5 rounded-full">{proposals.length}</span>
//                 </div>
//                 {proposalsLoading
//                   ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
//                   : proposals.length > 0 ? (
//                     <table className="w-full text-left">
//                       <thead className="border-b border-[#EDE8DF]">
//                         <tr>{["Proposal", "Project", "Valid Until", "Status"].map(h => (
//                           <th key={h} className="px-6 py-3 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">{h}</th>
//                         ))}</tr>
//                       </thead>
//                       <tbody className="divide-y divide-[#F5F2ED]">
//                         {proposals.map((p: any) => (
//                           <tr key={p.id} className="hover:bg-[#FAF8F5]">
//                             <td className="px-6 py-4">
//                               <p className="text-[13px] font-bold text-[#1C1C1C]">{p.title}</p>
//                               <p className="text-[11px] text-[#9A8F82]">#{p.prop_number}</p>
//                             </td>
//                             <td className="px-6 py-4">
//                               <p className="text-[13px] text-[#1C1C1C] capitalize">{p.project_name}</p>
//                               {p.template_name && <p className="text-[11px] text-[#9A8F82]">via {p.template_name}</p>}
//                             </td>
//                             <td className="px-6 py-4 text-[13px] text-[#6B6259]">
//                               {p.valid_until ? new Date(p.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${proposalBadge(p.status)}`}>{p.status}</span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   ) : <div className="px-6 py-12 text-center text-[#9A8F82] text-[13px]">No proposals found for this client.</div>}
//               </div>
//             </div>
//           )}

//           {/* QUOTATIONS TAB */}
//           {activeTab === "quotations" && (
//             <div className="space-y-4">
//               {quotationsLoading ? (
//                 <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8922A]" size={28} /></div>
//               ) : quotations.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] p-16 text-center text-[#9A8F82] text-sm shadow-sm">
//                   No quotations yet for this client. Click <strong>New Quotation</strong> to create one.
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//                   <table className="w-full text-left">
//                     <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
//                       <tr>
//                         {["Quote #", "Project", "Tax", "Grand Total", "Status", "Actions"].map((h, i) => (
//                           <th key={h} className={`px-5 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${i >= 3 ? "text-right" : ""} ${i === 5 ? "text-right" : ""}`}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-[#F5F2ED]">
//                       {quotations.map((q: any) => (
//                         <tr key={q.id} className="hover:bg-[#FAF8F5] transition-colors">
//                           <td className="px-5 py-4">
//                             <button onClick={() => fetchQuoteDetail(q.id)} className="text-[13px] font-bold text-[#C8922A] hover:underline">
//                               #{q.quote_number} <span className="text-[11px] text-[#9A8F82] font-normal">v{q.version}</span>
//                             </button>
//                           </td>
//                           <td className="px-5 py-4 text-[13px] text-[#1C1C1C] capitalize">{q.project_name}</td>
//                           <td className="px-5 py-4 text-[11px] text-[#6B6259]">
//                             {parseFloat(q.igst_rate) > 0 ? `IGST ${q.igst_rate}%` : `CGST ${q.cgst_rate}% + SGST ${q.sgst_rate}%`}
//                           </td>
//                           <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-[#1C1C1C]">₹{fmt(q.grand_total)}</span></td>
//                           <td className="px-5 py-4 text-right">
//                             <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${quoteBadge(q.status)}`}>{q.status}</span>
//                           </td>
//                           <td className="px-5 py-4 text-right">
//                             <div className="flex items-center justify-end gap-1.5">
//                               {q.status === "draft" && <button onClick={() => handleSend(q.id)} title="Mark Sent" className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Send size={13} /></button>}
//                               {(q.status === "draft" || q.status === "sent") && <button onClick={() => handleApprove(q.id)} title="Approve" className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"><CheckCircle size={13} /></button>}
//                               {q.status === "approved" && <button onClick={() => handleRevise(q.id)} title="Revise" className="p-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100"><RotateCcw size={13} /></button>}
//                               <button onClick={() => handleDeleteQuote(q.id)} title="Delete" className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={13} /></button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Detail Panel */}
//               {(quoteDetailLoading || viewingQuote) && (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-sm overflow-hidden">
//                   <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center justify-between">
//                     <h3 className="text-[13px] font-bold text-[#1C1C1C]">
//                       {quoteDetailLoading ? "Loading..." : `Quote #${viewingQuote.quote_number} — ${viewingQuote.project_name} (v${viewingQuote.version})`}
//                     </h3>
//                     <button onClick={() => setViewingQuote(null)} className="text-[#9A8F82] hover:text-red-500"><X size={16} /></button>
//                   </div>
//                   {quoteDetailLoading
//                     ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
//                     : viewingQuote && (
//                       <div className="p-6 space-y-5">
//                         {viewingQuote.items?.length > 0 ? (
//                           <div className="overflow-x-auto">
//                             <table className="w-full text-left text-[13px]">
//                               <thead>
//                                 <tr className="border-b border-[#EDE8DF]">
//                                   {["#", "Description", "Category", "Qty", "Unit", "Rate", "Amount"].map(h => (
//                                     <th key={h} className="pb-2 pr-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider whitespace-nowrap">{h}</th>
//                                   ))}
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-[#F5F2ED]">
//                                 {viewingQuote.items.map((it: any, n: number) => (
//                                   <tr key={it.id || n}>
//                                     <td className="py-2.5 pr-4 text-[#9A8F82]">{n + 1}</td>
//                                     <td className="py-2.5 pr-4 font-medium text-[#1C1C1C]">{it.description}</td>
//                                     <td className="py-2.5 pr-4 text-[#6B6259]">{it.category}</td>
//                                     <td className="py-2.5 pr-4 text-[#1C1C1C]">{it.quantity}</td>
//                                     <td className="py-2.5 pr-4 text-[#6B6259]">{it.unit}</td>
//                                     <td className="py-2.5 pr-4 text-[#1C1C1C]">₹{fmt(it.rate)}</td>
//                                     <td className="py-2.5 font-bold text-[#1C1C1C]">₹{fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0))}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         ) : <p className="text-[13px] text-[#9A8F82] italic">No items in this quotation.</p>}
//                         <div className="ml-auto w-72 space-y-1.5 pt-4 border-t border-[#EDE8DF] text-[13px]">
//                           {([
//                             ["Subtotal", `₹${fmt(viewingQuote.subtotal)}`],
//                             [`Discount (${viewingQuote.discount_type === "percentage" ? viewingQuote.discount_value + "%" : "₹" + fmt(viewingQuote.discount_value)})`, `-₹${fmt(viewingQuote.discount_amount)}`],
//                             ["Taxable Amount", `₹${fmt(viewingQuote.taxable_amount)}`],
//                             parseFloat(viewingQuote.cgst_amount) > 0 && [`CGST @ ${viewingQuote.cgst_rate}%`, `₹${fmt(viewingQuote.cgst_amount)}`],
//                             parseFloat(viewingQuote.sgst_amount) > 0 && [`SGST @ ${viewingQuote.sgst_rate}%`, `₹${fmt(viewingQuote.sgst_amount)}`],
//                             parseFloat(viewingQuote.igst_amount) > 0 && [`IGST @ ${viewingQuote.igst_rate}%`, `₹${fmt(viewingQuote.igst_amount)}`],
//                           ] as any[]).filter(Boolean).map(([label, val]: any) => (
//                             <div key={label} className="flex justify-between text-[#6B6259]">
//                               <span>{label}</span><span className="font-medium text-[#1C1C1C]">{val}</span>
//                             </div>
//                           ))}
//                           <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#EDE8DF] text-[#1C1C1C]">
//                             <span>Grand Total</span><span>₹{fmt(viewingQuote.grand_total)}</span>
//                           </div>
//                         </div>
//                         {viewingQuote.notes && (
//                           <div className="bg-[#FAF8F5] rounded-lg px-4 py-3 text-[13px] text-[#6B6259] border border-[#EDE8DF]">
//                             <span className="font-bold text-[#9A8F82] uppercase text-[10px] block mb-1 tracking-wide">Notes</span>
//                             {viewingQuote.notes}
//                           </div>
//                         )}
//                         <div className="flex gap-2 pt-2 flex-wrap">
//                           {viewingQuote.status === "draft" && <button onClick={() => handleSend(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-semibold hover:bg-blue-100 transition-colors"><Send size={13} /> Mark as Sent</button>}
//                           {(viewingQuote.status === "draft" || viewingQuote.status === "sent") && <button onClick={() => handleApprove(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[12px] font-semibold hover:bg-green-100 transition-colors"><CheckCircle size={13} /> Approve</button>}
//                           {viewingQuote.status === "approved" && <button onClick={() => handleRevise(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[12px] font-semibold hover:bg-purple-100 transition-colors"><RotateCcw size={13} /> Revise</button>}
//                           <button onClick={() => handleDeleteQuote(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[12px] font-semibold hover:bg-red-100 transition-colors ml-auto"><Trash2 size={13} /> Delete</button>
//                         </div>
//                       </div>
//                     )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── INVOICES TAB ───────────────────────────────────────────────── */}
//           {activeTab === "invoices" && (
//             <div className="space-y-4">
//               {/* Stats Row */}
//               <div className="grid grid-cols-3 gap-3">
//                 {[
//                   { label: "Total Invoiced", value: `₹${fmt(invoiceStats.totalValue)}`, icon: <IndianRupee size={14} />, color: "text-[#C8922A]", bg: "bg-[#FDF3E3]" },
//                   { label: "Amount Received", value: `₹${fmt(invoiceStats.paid)}`, icon: <BadgeCheck size={14} />, color: "text-green-600", bg: "bg-green-50" },
//                   { label: "Balance Pending", value: `₹${fmt(invoiceStats.pending)}`, icon: <Clock size={14} />, color: "text-amber-600", bg: "bg-amber-50" },
//                 ].map(s => (
//                   <div key={s.label} className="bg-white border border-[#EDE8DF] rounded-xl p-4 shadow-sm">
//                     <div className={`inline-flex p-2 ${s.bg} rounded-lg ${s.color} mb-2`}>{s.icon}</div>
//                     <p className="text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">{s.label}</p>
//                     <p className={`text-[15px] font-bold ${s.color} mt-0.5`}>{s.value}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Invoice List */}
//               {invoicesLoading ? (
//                 <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8922A]" size={28} /></div>
//               ) : invoices.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] p-16 text-center shadow-sm">
//                   <div className="w-12 h-12 bg-[#FDF3E3] rounded-full flex items-center justify-center mx-auto mb-3">
//                     <FileStack size={22} className="text-[#C8922A]" />
//                   </div>
//                   <p className="text-[#9A8F82] text-sm font-medium">No invoices yet.</p>
//                   <p className="text-[#9A8F82] text-[12px] mt-1">Generate one from an approved quotation.</p>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//                   <table className="w-full text-left">
//                     <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
//                       <tr>
//                         {["Invoice #", "Project", "Type", "Date", "Due Date", "Grand Total", "Status", "Actions"].map((h, i) => (
//                           <th key={h} className={`px-4 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${i >= 5 ? "text-right" : ""}`}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-[#F5F2ED]">
//                       {invoices.map((inv: any) => (
//                         <tr key={inv.id} className="hover:bg-[#FAF8F5] transition-colors">
//                           <td className="px-4 py-4">
//                             <button onClick={() => fetchInvoiceDetail(inv.id)} className="text-[13px] font-bold text-[#C8922A] hover:underline">
//                               #{inv.invoice_number}
//                             </button>
//                           </td>
//                           <td className="px-4 py-4 text-[13px] text-[#1C1C1C] capitalize">{inv.project_name}</td>
//                           <td className="px-4 py-4">
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${invoiceTypeBadge(inv.invoice_type)}`}>
//                               {inv.invoice_type}
//                             </span>
//                             {inv.milestone_label && <p className="text-[10px] text-[#9A8F82] mt-0.5 truncate max-w-[100px]">{inv.milestone_label}</p>}
//                           </td>
//                           <td className="px-4 py-4 text-[12px] text-[#6B6259]">
//                             {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
//                           </td>
//                           <td className="px-4 py-4 text-[12px] text-[#6B6259]">
//                             {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
//                           </td>
//                           <td className="px-4 py-4 text-right">
//                             <p className="text-[13px] font-bold text-[#1C1C1C]">₹{fmt(inv.grand_total)}</p>
//                             {parseFloat(inv.balance_due) > 0 && parseFloat(inv.balance_due) !== parseFloat(inv.grand_total) && (
//                               <p className="text-[10px] text-amber-600 font-medium">Bal: ₹{fmt(inv.balance_due)}</p>
//                             )}
//                           </td>
//                           <td className="px-4 py-4 text-right">
//                             <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${invoiceBadge(inv.status)}`}>{inv.status}</span>
//                           </td>
//                           <td className="px-4 py-4 text-right">
//                             <div className="flex items-center justify-end gap-1.5">
//                               {inv.status === "draft" && (
//                                 <button onClick={() => handleSendInvoice(inv.id)} title="Mark Sent" className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Send size={13} /></button>
//                               )}
//                               {(inv.status === "sent" || inv.status === "partial") && (
//                                 <button onClick={() => handleMarkPaid(inv.id)} title="Mark Paid" className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"><Banknote size={13} /></button>
//                               )}
//                               <button onClick={() => handleDeleteInvoice(inv.id)} title="Delete" className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={13} /></button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Invoice Detail Panel */}
//               {(invoiceDetailLoading || viewingInvoice) && (
//                 <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-sm overflow-hidden">
//                   <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center justify-between">
//                     <h3 className="text-[13px] font-bold text-[#1C1C1C]">
//                       {invoiceDetailLoading ? "Loading..." : `Invoice #${viewingInvoice.invoice_number} — ${viewingInvoice.project_name}`}
//                     </h3>
//                     <button onClick={() => setViewingInvoice(null)} className="text-[#9A8F82] hover:text-red-500"><X size={16} /></button>
//                   </div>
//                   {invoiceDetailLoading
//                     ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
//                     : viewingInvoice && (
//                       <div className="p-6 space-y-5">
//                         {/* Invoice meta */}
//                         <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] rounded-xl p-4 border border-[#EDE8DF] text-[13px]">
//                           <div>
//                             <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Client</p>
//                             <p className="font-semibold text-[#1C1C1C]">{viewingInvoice.client_name}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Invoice Type</p>
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${invoiceTypeBadge(viewingInvoice.invoice_type)}`}>{viewingInvoice.invoice_type}</span>
//                             {viewingInvoice.milestone_label && <span className="ml-2 text-[12px] text-[#6B6259]">— {viewingInvoice.milestone_label}</span>}
//                           </div>
//                           <div>
//                             <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Invoice Date</p>
//                             <p className="text-[#1C1C1C]">{viewingInvoice.invoice_date ? new Date(viewingInvoice.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Due Date</p>
//                             <p className="text-[#1C1C1C]">{viewingInvoice.due_date ? new Date(viewingInvoice.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p>
//                           </div>
//                           {parseFloat(viewingInvoice.milestone_percentage) > 0 && (
//                             <div>
//                               <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Milestone %</p>
//                               <p className="text-[#1C1C1C] font-semibold">{viewingInvoice.milestone_percentage}%</p>
//                             </div>
//                           )}
//                           <div>
//                             <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Status</p>
//                             <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${invoiceBadge(viewingInvoice.status)}`}>{viewingInvoice.status}</span>
//                           </div>
//                         </div>

//                         {/* Items table */}
//                         {viewingInvoice.items?.length > 0 ? (
//                           <div className="overflow-x-auto">
//                             <table className="w-full text-left text-[13px]">
//                               <thead>
//                                 <tr className="border-b border-[#EDE8DF]">
//                                   {["#", "Description", "Category", "Qty", "Unit", "Rate", "Amount"].map(h => (
//                                     <th key={h} className="pb-2 pr-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider whitespace-nowrap">{h}</th>
//                                   ))}
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-[#F5F2ED]">
//                                 {viewingInvoice.items.map((it: any, n: number) => (
//                                   <tr key={it.id || n}>
//                                     <td className="py-2.5 pr-4 text-[#9A8F82]">{n + 1}</td>
//                                     <td className="py-2.5 pr-4 font-medium text-[#1C1C1C]">{it.description}</td>
//                                     <td className="py-2.5 pr-4 text-[#6B6259]">{it.category}</td>
//                                     <td className="py-2.5 pr-4 text-[#1C1C1C]">{it.quantity}</td>
//                                     <td className="py-2.5 pr-4 text-[#6B6259]">{it.unit}</td>
//                                     <td className="py-2.5 pr-4 text-[#1C1C1C]">₹{fmt(it.rate)}</td>
//                                     <td className="py-2.5 font-bold text-[#1C1C1C]">₹{fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0))}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         ) : <p className="text-[13px] text-[#9A8F82] italic">No line items.</p>}

//                         {/* Totals */}
//                         <div className="ml-auto w-72 space-y-1.5 pt-4 border-t border-[#EDE8DF] text-[13px]">
//                           {([
//                             ["Subtotal", `₹${fmt(viewingInvoice.subtotal)}`],
//                             parseFloat(viewingInvoice.cgst_amount) > 0 && [`CGST @ ${viewingInvoice.cgst_rate || ""}%`, `₹${fmt(viewingInvoice.cgst_amount)}`],
//                             parseFloat(viewingInvoice.sgst_amount) > 0 && [`SGST @ ${viewingInvoice.sgst_rate || ""}%`, `₹${fmt(viewingInvoice.sgst_amount)}`],
//                             parseFloat(viewingInvoice.igst_amount) > 0 && [`IGST @ ${viewingInvoice.igst_rate || ""}%`, `₹${fmt(viewingInvoice.igst_amount)}`],
//                             parseFloat(viewingInvoice.total_tax) > 0 && ["Total Tax", `₹${fmt(viewingInvoice.total_tax)}`],
//                           ] as any[]).filter(Boolean).map(([label, val]: any) => (
//                             <div key={label} className="flex justify-between text-[#6B6259]">
//                               <span>{label}</span><span className="font-medium text-[#1C1C1C]">{val}</span>
//                             </div>
//                           ))}
//                           <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#EDE8DF] text-[#1C1C1C]">
//                             <span>Grand Total</span><span>₹{fmt(viewingInvoice.grand_total)}</span>
//                           </div>
//                           {parseFloat(viewingInvoice.amount_paid) > 0 && (
//                             <div className="flex justify-between text-green-600">
//                               <span className="font-medium">Amount Paid</span><span className="font-bold">₹{fmt(viewingInvoice.amount_paid)}</span>
//                             </div>
//                           )}
//                           {parseFloat(viewingInvoice.balance_due) > 0 && (
//                             <div className="flex justify-between text-amber-600 font-bold">
//                               <span>Balance Due</span><span>₹{fmt(viewingInvoice.balance_due)}</span>
//                             </div>
//                           )}
//                         </div>

//                         {viewingInvoice.notes && (
//                           <div className="bg-[#FAF8F5] rounded-lg px-4 py-3 text-[13px] text-[#6B6259] border border-[#EDE8DF]">
//                             <span className="font-bold text-[#9A8F82] uppercase text-[10px] block mb-1 tracking-wide">Notes</span>
//                             {viewingInvoice.notes}
//                           </div>
//                         )}

//                         <div className="flex gap-2 pt-2 flex-wrap">
//                           {viewingInvoice.status === "draft" && (
//                             <button onClick={() => handleSendInvoice(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-semibold hover:bg-blue-100 transition-colors">
//                               <Send size={13} /> Mark as Sent
//                             </button>
//                           )}
//                           {(viewingInvoice.status === "sent" || viewingInvoice.status === "partial") && (
//                             <button onClick={() => handleMarkPaid(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[12px] font-semibold hover:bg-green-100 transition-colors">
//                               <Banknote size={13} /> Mark as Paid
//                             </button>
//                           )}
//                           <button onClick={() => handleDeleteInvoice(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[12px] font-semibold hover:bg-red-100 transition-colors ml-auto">
//                             <Trash2 size={13} /> Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* PROJECT MODAL */}
//       {isProjectModalOpen && (
//         <Modal title={editingProjectId ? "Update Project" : "Add New Project"} onClose={closeProjectModal} maxW="max-w-2xl">
//           <form onSubmit={handleProjectSubmit} className="p-6 grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
//             {projectApiError && <ErrorBanner error={projectApiError} cls="col-span-2" />}
//             <FF label="Project Name *" cls="col-span-2">
//               <input required name="name" value={projectForm.name} onChange={handleProjectInputChange} placeholder="Project name" className={inputCls} />
//             </FF>
//             <FF label="Property Type">
//               <select name="property_type" value={projectForm.property_type} onChange={handleProjectInputChange} className={inputCls}>
//                 {["apartment", "villa", "office", "bungalow"].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
//               </select>
//             </FF>
//             <FF label="Area (Sq. Ft.)">
//               <input type="number" name="area_sqft" value={projectForm.area_sqft} onChange={handleProjectInputChange} placeholder="1200" className={inputCls} />
//             </FF>
//             <FF label="Budget (₹)">
//               <input type="number" name="budget_range" value={projectForm.budget_range} onChange={handleProjectInputChange} placeholder="500000" className={inputCls} />
//             </FF>
//             <FF label="Status">
//               <select name="status" value={projectForm.status} onChange={handleProjectInputChange} className={inputCls}>
//                 <option value="active">Active</option>
//                 <option value="completed">Completed</option>
//                 <option value="on_hold">On Hold</option>
//               </select>
//             </FF>
//             <FF label="Start Date">
//               <input type="date" name="start_date" value={projectForm.start_date} onChange={handleProjectInputChange} className={inputCls} />
//             </FF>
//             <FF label="End Date">
//               <input type="date" name="expected_end_date" value={projectForm.expected_end_date} onChange={handleProjectInputChange} className={inputCls} />
//             </FF>
//             <div className="col-span-2 pt-4 border-t border-[#F5F2ED]">
//               <MFooter onCancel={closeProjectModal} isSubmitting={isProjectSubmitting} label={editingProjectId ? "Update Project" : "Save Project"} />
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* TEMPLATE MODAL */}
//       {isTemplateModalOpen && (
//         <Modal title="Create New Template" onClose={() => { setIsTemplateModalOpen(false); setTemplateError(null); }} maxW="max-w-2xl">
//           <form onSubmit={handleTemplateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
//             {templateError && <ErrorBanner error={templateError} />}
//             <FF label="Template Name *">
//               <input required value={templateForm.name} onChange={e => setTemplateForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Residential Standard" className={inputCls} />
//             </FF>
//             <FF label="Description">
//               <input value={templateForm.description} onChange={e => setTemplateForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" className={inputCls} />
//             </FF>
//             <FF label="Content *">
//               <textarea required rows={10} value={templateForm.content} onChange={e => setTemplateForm(p => ({ ...p, content: e.target.value }))} placeholder={"Dear {{client_name}},\n\n..."} className={`${inputCls} resize-none font-mono text-[12px]`} />
//               <p className="text-[11px] text-[#9A8F82] mt-1">
//                 Vars: <code className="bg-[#F5F2ED] px-1 rounded">{"{{client_name}}"}</code>{" "}
//                 <code className="bg-[#F5F2ED] px-1 rounded">{"{{project_name}}"}</code>{" "}
//                 <code className="bg-[#F5F2ED] px-1 rounded">{"{{property_type}}"}</code>
//               </p>
//             </FF>
//             <div className="pt-4 border-t border-[#F5F2ED]">
//               <MFooter onCancel={() => setIsTemplateModalOpen(false)} isSubmitting={templateSubmitting} label="Save Template" />
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* PROPOSAL MODAL */}
//       {isProposalModalOpen && (
//         <Modal title="Create Proposal" onClose={() => setIsProposalModalOpen(false)} maxW="max-w-2xl">
//           <div className="px-6 pt-5">
//             <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-1 w-fit mb-4">
//               {["template", "manual"].map(m => (
//                 <button key={m} type="button" onClick={() => setProposalMode(m)}
//                   className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${proposalMode === m ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>
//                   {m === "template" ? "From Template" : "Manual"}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <form onSubmit={handleProposalSubmit} className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
//             {proposalError && <ErrorBanner error={proposalError} />}
//             <FF label="Project *">
//               <select required value={proposalForm.project} onChange={e => setProposalForm(p => ({ ...p, project: e.target.value }))} className={inputCls}>
//                 <option value="">— Select —</option>
//                 {client.projects?.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
//               </select>
//             </FF>
//             <FF label="Title *">
//               <input required value={proposalForm.title} onChange={e => setProposalForm(p => ({ ...p, title: e.target.value }))} placeholder="Interior Design Proposal..." className={inputCls} />
//             </FF>
//             {proposalMode === "template"
//               ? <FF label="Template *">
//                 <select required value={proposalForm.use_template} onChange={e => setProposalForm(p => ({ ...p, use_template: e.target.value }))} className={inputCls}>
//                   <option value="">— Select —</option>
//                   {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
//                 </select>
//               </FF>
//               : <FF label="Content *">
//                 <textarea required rows={7} value={proposalForm.content} onChange={e => setProposalForm(p => ({ ...p, content: e.target.value }))} placeholder={"Dear Client,\n\n..."} className={`${inputCls} resize-none font-mono text-[12px]`} />
//               </FF>
//             }
//             <div className="grid grid-cols-2 gap-4">
//               <FF label="Valid Until">
//                 <input type="date" value={proposalForm.valid_until} onChange={e => setProposalForm(p => ({ ...p, valid_until: e.target.value }))} className={inputCls} />
//               </FF>
//               <FF label="Notes">
//                 <input value={proposalForm.notes} onChange={e => setProposalForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" className={inputCls} />
//               </FF>
//             </div>
//             <div className="pt-4 border-t border-[#F5F2ED]">
//               <MFooter onCancel={() => setIsProposalModalOpen(false)} isSubmitting={proposalSubmitting} label="Create Proposal" />
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* QUOTATION MODAL */}
//       {isQuoteModalOpen && (
//         <Modal title="Create New Quotation" onClose={closeQuoteModal} maxW="max-w-4xl">
//           <form onSubmit={handleQuoteSubmit} className="max-h-[88vh] overflow-y-auto">
//             <div className="px-6 pt-5 pb-5 grid grid-cols-3 gap-4 border-b border-[#EDE8DF]">
//               {quoteError && <ErrorBanner error={quoteError} cls="col-span-3" />}
//               <FF label="Project *" cls="col-span-1">
//                 <select required value={quoteForm.project} onChange={e => setQuoteForm(p => ({ ...p, project: e.target.value }))} className={inputCls}>
//                   <option value="">— Select —</option>
//                   {client.projects?.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
//                 </select>
//               </FF>
//               <FF label="Valid Until">
//                 <input type="date" value={quoteForm.valid_until} onChange={e => setQuoteForm(p => ({ ...p, valid_until: e.target.value }))} className={inputCls} />
//               </FF>
//               <FF label="Discount Type">
//                 <select value={quoteForm.discount_type} onChange={e => setQuoteForm(p => ({ ...p, discount_type: e.target.value }))} className={inputCls}>
//                   <option value="percentage">Percentage (%)</option>
//                   <option value="fixed">Fixed Amount (₹)</option>
//                 </select>
//               </FF>
//               <FF label={`Discount Value ${quoteForm.discount_type === "percentage" ? "%" : "₹"}`}>
//                 <input type="number" min="0" value={quoteForm.discount_value} onChange={e => setQuoteForm(p => ({ ...p, discount_value: e.target.value }))} className={inputCls} />
//               </FF>
//               <div className="col-span-2 flex flex-col justify-end gap-2">
//                 <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide">Tax Mode</label>
//                 <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-1 w-fit">
//                   <button type="button" onClick={() => setTaxMode("cgst_sgst")} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${taxMode === "cgst_sgst" ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>CGST + SGST</button>
//                   <button type="button" onClick={() => setTaxMode("igst")} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${taxMode === "igst" ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>IGST (Outstation)</button>
//                 </div>
//               </div>
//               {taxMode === "cgst_sgst" ? (
//                 <>
//                   <FF label="CGST Rate (%)"><input type="number" min="0" max="28" value={quoteForm.cgst_rate} onChange={e => setQuoteForm(p => ({ ...p, cgst_rate: e.target.value }))} className={inputCls} /></FF>
//                   <FF label="SGST Rate (%)"><input type="number" min="0" max="28" value={quoteForm.sgst_rate} onChange={e => setQuoteForm(p => ({ ...p, sgst_rate: e.target.value }))} className={inputCls} /></FF>
//                 </>
//               ) : (
//                 <FF label="IGST Rate (%)" cls="col-span-2">
//                   <input type="number" min="0" max="28" value={quoteForm.igst_rate} onChange={e => setQuoteForm(p => ({ ...p, igst_rate: e.target.value }))} className={inputCls} />
//                 </FF>
//               )}
//               <FF label="Notes" cls="col-span-3">
//                 <input value={quoteForm.notes} onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. Prices valid for 30 days..." className={inputCls} />
//               </FF>
//             </div>
//             <div className="px-6 py-5 border-b border-[#EDE8DF]">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Line Items</h3>
//                 <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C8922A] hover:underline"><Plus size={13} /> Add Item</button>
//               </div>
//               <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider px-2 mb-1">
//                 <div className="col-span-1 text-center">#</div>
//                 <div className="col-span-4">Description</div>
//                 <div className="col-span-2">Category</div>
//                 <div className="col-span-1">Qty</div>
//                 <div className="col-span-1">Unit</div>
//                 <div className="col-span-2">Rate (₹)</div>
//                 <div className="col-span-1 text-right">Amount</div>
//               </div>
//               <div className="space-y-2">
//                 {quoteItems.map((item, idx) => {
//                   const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
//                   return (
//                     <div key={item._key} className="grid grid-cols-12 gap-2 items-center bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl px-3 py-2">
//                       <div className="col-span-1 flex flex-col items-center gap-0">
//                         <button type="button" onClick={() => moveItem(item._key, -1)} disabled={idx === 0} className="text-[#9A8F82] hover:text-[#C8922A] disabled:opacity-20"><ChevronUp size={12} /></button>
//                         <span className="text-[10px] text-[#9A8F82] font-bold leading-none">{idx + 1}</span>
//                         <button type="button" onClick={() => moveItem(item._key, 1)} disabled={idx === quoteItems.length - 1} className="text-[#9A8F82] hover:text-[#C8922A] disabled:opacity-20"><ChevronDown size={12} /></button>
//                       </div>
//                       <div className="col-span-4"><input required value={item.description} onChange={e => updateItem(item._key, "description", e.target.value)} placeholder="Description" className={`${inputCls} text-[12px] py-1.5`} /></div>
//                       <div className="col-span-2">
//                         <select value={item.category} onChange={e => updateItem(item._key, "category", e.target.value)} className={`${inputCls} text-[12px] py-1.5`}>
//                           {["Furniture", "Civil", "Electrical", "Flooring", "Plumbing", "HVAC", "Painting", "Package", "Other"].map(c => <option key={c}>{c}</option>)}
//                         </select>
//                       </div>
//                       <div className="col-span-1"><input type="number" min="0" value={item.quantity} onChange={e => updateItem(item._key, "quantity", e.target.value)} className={`${inputCls} text-[12px] py-1.5`} /></div>
//                       <div className="col-span-1">
//                         <select value={item.unit} onChange={e => updateItem(item._key, "unit", e.target.value)} className={`${inputCls} text-[12px] py-1.5`}>
//                           {["sqft", "rft", "lot", "nos", "unit", "kg", "set"].map(u => <option key={u}>{u}</option>)}
//                         </select>
//                       </div>
//                       <div className="col-span-2"><input type="number" min="0" value={item.rate} onChange={e => updateItem(item._key, "rate", e.target.value)} placeholder="0" className={`${inputCls} text-[12px] py-1.5`} /></div>
//                       <div className="col-span-1 flex items-center justify-end gap-1">
//                         <span className="text-[12px] font-bold text-[#1C1C1C]">₹{fmt(amount)}</span>
//                         {quoteItems.length > 1 && <button type="button" onClick={() => removeItem(item._key)} className="text-red-400 hover:text-red-600 ml-1"><X size={13} /></button>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="px-6 py-5 bg-[#FAF8F5] flex items-end justify-between gap-6">
//               <div className="space-y-1 text-[12px] min-w-[240px]">
//                 <div className="flex justify-between text-[#6B6259]"><span>Subtotal</span><span className="font-semibold text-[#1C1C1C]">₹{fmt(totals.subtotal)}</span></div>
//                 <div className="flex justify-between text-[#6B6259]"><span>Discount</span><span className="font-semibold text-red-500">-₹{fmt(totals.discAmt)}</span></div>
//                 <div className="flex justify-between text-[#6B6259]"><span>Taxable</span><span className="font-semibold text-[#1C1C1C]">₹{fmt(totals.taxable)}</span></div>
//                 {taxMode === "cgst_sgst" ? (
//                   <>
//                     <div className="flex justify-between text-[#6B6259]"><span>CGST @ {quoteForm.cgst_rate}%</span><span className="font-semibold">₹{fmt(totals.cgst)}</span></div>
//                     <div className="flex justify-between text-[#6B6259]"><span>SGST @ {quoteForm.sgst_rate}%</span><span className="font-semibold">₹{fmt(totals.sgst)}</span></div>
//                   </>
//                 ) : (
//                   <div className="flex justify-between text-[#6B6259]"><span>IGST @ {quoteForm.igst_rate}%</span><span className="font-semibold">₹{fmt(totals.igst)}</span></div>
//                 )}
//                 <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#C8922A]/30 text-[#C8922A]">
//                   <span>Grand Total</span><span>₹{fmt(totals.total)}</span>
//                 </div>
//               </div>
//               <MFooter onCancel={closeQuoteModal} isSubmitting={quoteSubmitting} label="Save Quotation" />
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* ── INVOICE GENERATE MODAL ─────────────────────────────────────────── */}
//       {isInvoiceModalOpen && (
//         <Modal title="Generate Invoice" onClose={closeInvoiceModal} maxW="max-w-lg">
//           <form onSubmit={handleInvoiceSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
//             {invoiceError && <ErrorBanner error={invoiceError} />}

//             {/* Invoice Type Selector */}
//             <div>
//               <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide block mb-2">Invoice Type</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {[
//                   { value: "full", label: "Full (100%)", desc: "Complete invoice for full amount" },
//                   { value: "advance", label: "Advance", desc: "Advance payment on booking" },
//                   { value: "milestone", label: "Milestone", desc: "Partial milestone payment" },
//                   { value: "final", label: "Final", desc: "Final invoice on handover" },
//                 ].map(t => (
//                   <button key={t.value} type="button" onClick={() => handleInvoiceTypeChange(t.value)}
//                     className={`text-left p-3 rounded-xl border-2 transition-all ${invoiceForm.invoice_type === t.value ? "border-[#C8922A] bg-[#FDF3E3]" : "border-[#EDE8DF] bg-white hover:border-[#C8922A]/40"}`}>
//                     <p className={`text-[12px] font-bold ${invoiceForm.invoice_type === t.value ? "text-[#C8922A]" : "text-[#1C1C1C]"}`}>{t.label}</p>
//                     <p className="text-[10px] text-[#9A8F82] mt-0.5">{t.desc}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quotation Select */}
//             <FF label="Quotation (Approved) *">
//               <select required value={invoiceForm.quotation_id} onChange={e => setInvoiceForm(p => ({ ...p, quotation_id: e.target.value }))} className={inputCls}>
//                 <option value="">— Select Quotation —</option>
//                 {quotations.map((q: any) => (
//                   <option key={q.id} value={q.id}>
//                     #{q.quote_number} v{q.version} — {q.project_name} (₹{fmt(q.grand_total)}) [{q.status}]
//                   </option>
//                 ))}
//               </select>
//               {quotations.filter(q => q.status === "approved").length === 0 && (
//                 <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
//                   <AlertCircle size={11} /> No approved quotations found. Approve a quotation first.
//                 </p>
//               )}
//             </FF>

//             {/* Milestone Label — show for advance/milestone/final */}
//             {invoiceForm.invoice_type !== "full" && (
//               <FF label={`Milestone Label ${invoiceForm.invoice_type === "milestone" ? "*" : ""}`}>
//                 <input
//                   value={invoiceForm.milestone_label}
//                   onChange={e => setInvoiceForm(p => ({ ...p, milestone_label: e.target.value }))}
//                   placeholder={invoiceForm.invoice_type === "advance" ? "Advance on Booking" : invoiceForm.invoice_type === "final" ? "Final Handover" : "e.g. Design & Layout Approval"}
//                   className={inputCls}
//                 />
//               </FF>
//             )}

//             {/* Milestone % — show for advance/milestone/final */}
//             {invoiceForm.invoice_type !== "full" && (
//               <FF label="Milestone Percentage (%)">
//                 <input
//                   type="number" min="1" max="100"
//                   value={invoiceForm.milestone_percentage}
//                   onChange={e => setInvoiceForm(p => ({ ...p, milestone_percentage: Number(e.target.value) }))}
//                   className={inputCls}
//                 />
//                 <p className="text-[11px] text-[#9A8F82] mt-1">This % of quotation grand total will be invoiced.</p>
//               </FF>
//             )}

//             <div className="grid grid-cols-2 gap-4">
//               <FF label="Invoice Date *">
//                 <input type="date" required value={invoiceForm.invoice_date} onChange={e => setInvoiceForm(p => ({ ...p, invoice_date: e.target.value }))} className={inputCls} />
//               </FF>
//               <FF label="Due In (Days)">
//                 <input type="number" min="0" value={invoiceForm.due_days} onChange={e => setInvoiceForm(p => ({ ...p, due_days: Number(e.target.value) }))} className={inputCls} />
//               </FF>
//             </div>

//             <FF label="Notes">
//               <input value={invoiceForm.notes} onChange={e => setInvoiceForm(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. Please pay within 15 days of invoice date." className={inputCls} />
//             </FF>

//             <div className="pt-4 border-t border-[#F5F2ED]">
//               <MFooter onCancel={closeInvoiceModal} isSubmitting={invoiceSubmitting} label="Generate Invoice" />
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // ── Shared helpers ─────────────────────────────────────────────────────────────
// function Modal({ title, onClose, children, maxW = "max-w-2xl" }: any) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className={`bg-white rounded-2xl w-full ${maxW} shadow-2xl overflow-hidden`}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FAF8F5]">
//           <h2 className="text-[15px] font-bold text-[#1C1C1C]">{title}</h2>
//           <button onClick={onClose} className="text-[#9A8F82] hover:text-red-500 transition-colors"><X size={20} /></button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// function FF({ label, children, cls = "" }: any) {
//   return (
//     <div className={`space-y-1.5 ${cls}`}>
//       <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide">{label}</label>
//       {children}
//     </div>
//   );
// }

// function ErrorBanner({ error, cls = "" }: any) {
//   return (
//     <div className={`bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-red-600 text-[13px] ${cls}`}>
//       <AlertCircle size={15} className="mt-0.5 shrink-0" />
//       <span>{typeof error === "string" ? error : JSON.stringify(error)}</span>
//     </div>
//   );
// }

// function MFooter({ onCancel, isSubmitting, label }: any) {
//   return (
//     <div className="flex justify-end gap-3">
//       <button type="button" onClick={onCancel} className="px-4 py-2 text-[13px] font-semibold text-[#6B6259] hover:text-[#1C1C1C] transition-colors">Cancel</button>
//       <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#C8922A] text-white text-[13px] font-semibold rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2 hover:bg-[#B07A20] transition-colors">
//         {isSubmitting && <Loader2 size={13} className="animate-spin" />}
//         {isSubmitting ? "Processing..." : label}
//       </button>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, Calendar, CreditCard, Loader2, MapPin,
  Briefcase, Plus, X, Layout, AlertCircle, Home, Edit2, Trash2,
  FileText, ScrollText, Receipt, Send, CheckCircle, RotateCcw,
  ChevronUp, ChevronDown, FileStack, IndianRupee, Clock, Banknote,
  BadgeCheck,
} from "lucide-react";
import {
  getClientById,
  getProposalsByClient,
  getProposalTemplates,
  createProposalTemplate,
  createProposal,
  getQuotationsByClient,
  getQuotationById,
  createQuotation,
  deleteQuotation,
  sendQuotation,
  approveQuotation,
  reviseQuotation,
  getInvoicesByClient,
  getInvoiceById,
  generateInvoice,
  sendInvoice,
  markInvoicePaid,
  deleteInvoice,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByClient,
} from "@/services/clientService";

const inputCls =
  "w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-lg text-[14px] outline-none focus:border-[#C8922A] transition-colors";

const projectBadge = (s: string) =>
  ({ completed: "bg-green-100 text-green-700", active: "bg-blue-100 text-blue-700", on_hold: "bg-amber-100 text-amber-700" }[s] || "bg-gray-100 text-gray-700");
const proposalBadge = (s: string) =>
  ({ draft: "bg-gray-100 text-gray-600", sent: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-600" }[s] || "bg-gray-100 text-gray-700");
const quoteBadge = (s: string) =>
  ({ draft: "bg-gray-100 text-gray-600", sent: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-600", revised: "bg-purple-100 text-purple-700" }[s] || "bg-gray-100 text-gray-700");
const invoiceBadge = (s: string) =>
  ({ draft: "bg-gray-100 text-gray-600", sent: "bg-blue-100 text-blue-700", paid: "bg-green-100 text-green-700", partial: "bg-amber-100 text-amber-700", overdue: "bg-red-100 text-red-600", cancelled: "bg-gray-200 text-gray-500" }[s] || "bg-gray-100 text-gray-700");
const invoiceTypeBadge = (t: string) =>
  ({ full: "bg-indigo-100 text-indigo-700", advance: "bg-cyan-100 text-cyan-700", milestone: "bg-purple-100 text-purple-700", final: "bg-teal-100 text-teal-700" }[t] || "bg-gray-100 text-gray-700");

const fmt = (n: any) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const EMPTY_ITEM = () => ({
  _key: Math.random(), description: "", category: "Furniture",
  quantity: "1", unit: "sqft", rate: "", sort_order: 1,
});

export default function ClientDetails() {
  const { id } = useParams();
  const clientId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  // ── Project state ──────────────────────────────────────────────────────────
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);
  const [projectApiError, setProjectApiError] = useState<any>(null);
  const [editingProjectId, setEditingProjectId] = useState<any>(null);
  const [projectsLoading, setProjectsLoading] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectForm, setProjectForm] = useState({
    name: "", property_type: "apartment", style_category: "modern",
    area_sqft: "", budget_range: "", start_date: "", expected_end_date: "",
    status: "active", notes: "",
  });

  // ── Proposal state ─────────────────────────────────────────────────────────
  const [proposals, setProposals] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: "", description: "", content: "" });
  const [templateSubmitting, setTemplateSubmitting] = useState(false);
  const [templateError, setTemplateError] = useState<any>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalMode, setProposalMode] = useState("template");
  const [proposalForm, setProposalForm] = useState({
    project: "", title: "", use_template: "", content: "", valid_until: "", notes: "",
  });
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalError, setProposalError] = useState<any>(null);

  // ── Quotation state ────────────────────────────────────────────────────────
  const [quotations, setQuotations] = useState<any[]>([]);
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState<any>(null);
  const [quoteForm, setQuoteForm] = useState({
    project: "", valid_until: "", discount_type: "percentage",
    discount_value: "0", cgst_rate: "9", sgst_rate: "9", igst_rate: "0", notes: "",
  });
  const [quoteItems, setQuoteItems] = useState([EMPTY_ITEM()]);
  const [taxMode, setTaxMode] = useState("cgst_sgst");
  const [viewingQuote, setViewingQuote] = useState<any>(null);
  const [quoteDetailLoading, setQuoteDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Invoice state ──────────────────────────────────────────────────────────
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceSubmitting, setInvoiceSubmitting] = useState(false);
  const [invoiceError, setInvoiceError] = useState<any>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    quotation_id: "",
    invoice_type: "full",
    milestone_label: "",
    milestone_percentage: 100,
    invoice_date: new Date().toISOString().split("T")[0],
    due_days: 15,
    notes: "",
  });
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(false);
  const [invoiceActionLoading, setInvoiceActionLoading] = useState(false);
  // ── Fetch helpers ──────────────────────────────────────────────────────────

  const fetchClientData = async () => {
    try {
      const data = await getClientById(clientId as string);
      setClient(data);
    } catch (e) {
      console.error("Client fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const data = await getProjectsByClient(clientId as string);
      setProjects(data);
    } catch (e) {
      console.error("Projects fetch failed:", e);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchProposals = async () => {
    setProposalsLoading(true);
    try {
      const data = await getProposalsByClient(clientId as string);
      setProposals(data);
    } catch (e) {
      console.error("Proposals fetch failed:", e);
    } finally {
      setProposalsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getProposalTemplates();
      setTemplates(data);
    } catch (e) {
      console.error("Templates fetch failed:", e);
    }
  };

  const fetchQuotations = async () => {
    setQuotationsLoading(true);
    try {
      const data = await getQuotationsByClient(clientId as string);
      setQuotations(data);
    } catch (e) {
      console.error("Quotations fetch failed:", e);
    } finally {
      setQuotationsLoading(false);
    }
  };

  const fetchQuoteDetail = async (qid: any) => {
    setQuoteDetailLoading(true);
    try {
      const data = await getQuotationById(qid);
      setViewingQuote(data);
    } catch (e) {
      console.error("Quote detail fetch failed:", e);
    } finally {
      setQuoteDetailLoading(false);
    }
  };

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const data = await getInvoicesByClient(clientId as string);
      setInvoices(data);
    } catch (e) {
      console.error("Invoices fetch failed:", e);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const fetchInvoiceDetail = async (iid: any) => {
    setInvoiceDetailLoading(true);
    try {
      const data = await getInvoiceById(iid);
      setViewingInvoice(data);
    } catch (e) {
      console.error("Invoice detail fetch failed:", e);
    } finally {
      setInvoiceDetailLoading(false);
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  useEffect(() => {
    if (!client) return;
    if (activeTab === "projects") {fetchProjects();}
    if (activeTab === "proposals") { fetchProposals(); fetchTemplates(); }
    if (activeTab === "quotations") fetchQuotations();
    if (activeTab === "invoices") { fetchInvoices(); fetchQuotations(); }
  }, [activeTab, client]);

  // ── Project handlers ───────────────────────────────────────────────────────

  const handleProjectInputChange = (e: any) => {
    const { name, value } = e.target;
    setProjectForm((p) => ({ ...p, [name]: value }));
    setProjectApiError(null);
  };

  const handleEditClick = (proj: any) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      name: proj.name, property_type: proj.property_type,
      style_category: proj.style_category || "modern",
      area_sqft: proj.area_sqft, budget_range: proj.budget_range,
      start_date: proj.start_date, expected_end_date: proj.expected_end_date,
      status: proj.status, notes: proj.notes || "",
    });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (pid: any) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(clientId as string, pid);
      fetchClientData();
    } catch {
      alert("Failed to delete project.");
    }
  };

  const handleProjectSubmit = async (e: any) => {
    e.preventDefault();
    setIsProjectSubmitting(true);
    setProjectApiError(null);
    const payload = {
      ...projectForm,
      client: clientId,
      area_sqft: projectForm.area_sqft ? parseFloat(projectForm.area_sqft) : null,
    };
    try {
      if (editingProjectId) {
        await updateProject(clientId as string, editingProjectId, payload);
      } else {
        await createProject(clientId as string, payload);
      }
      await fetchClientData();
      await fetchProjects();
      closeProjectModal();
    } catch (err) {
      setProjectApiError(err);
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProjectId(null);
    setProjectForm({
      name: "", property_type: "apartment", style_category: "modern",
      area_sqft: "", budget_range: "", start_date: "", expected_end_date: "",
      status: "active", notes: "",
    });
  };

  // ── Template handlers ──────────────────────────────────────────────────────

  const handleTemplateSubmit = async (e: any) => {
    e.preventDefault();
    setTemplateSubmitting(true);
    setTemplateError(null);
    try {
      await createProposalTemplate(templateForm);
      await fetchTemplates();
      setIsTemplateModalOpen(false);
      setTemplateForm({ name: "", description: "", content: "" });
    } catch (err) {
      setTemplateError(err);
    } finally {
      setTemplateSubmitting(false);
    }
  };

  // ── Proposal handlers ──────────────────────────────────────────────────────

  const openProposalModal = () => {
    setProposalForm({
      project: client?.projects?.[0]?.id || "", title: "",
      use_template: "", content: "", valid_until: "", notes: "",
    });
    setProposalError(null);
    setIsProposalModalOpen(true);
  };

  const handleProposalSubmit = async (e: any) => {
    e.preventDefault();
    setProposalSubmitting(true);
    setProposalError(null);
    const payload =
      proposalMode === "template"
        ? { project: proposalForm.project, title: proposalForm.title, use_template: proposalForm.use_template, valid_until: proposalForm.valid_until, notes: proposalForm.notes }
        : { project: proposalForm.project, title: proposalForm.title, content: proposalForm.content, valid_until: proposalForm.valid_until, notes: proposalForm.notes };
    try {
      await createProposal(payload);
      await fetchProposals();
      setIsProposalModalOpen(false);
    } catch (err) {
      setProposalError(err);
    } finally {
      setProposalSubmitting(false);
    }
  };

  // ── Quotation handlers ─────────────────────────────────────────────────────

  const openQuoteModal = () => {
    setQuoteForm({
      project: client?.projects?.[0]?.id || "", valid_until: "",
      discount_type: "percentage", discount_value: "0",
      cgst_rate: "9", sgst_rate: "9", igst_rate: "0", notes: "",
    });
    setQuoteItems([EMPTY_ITEM()]);
    setTaxMode("cgst_sgst");
    setQuoteError(null);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => { setIsQuoteModalOpen(false); setQuoteError(null); };

  const addItem = () =>
    setQuoteItems((p) => [...p, { ...EMPTY_ITEM(), sort_order: p.length + 1 }]);
  const removeItem = (key: any) =>
    setQuoteItems((p) => p.filter((i) => i._key !== key));
  const updateItem = (key: any, field: string, val: any) =>
    setQuoteItems((p) => p.map((i) => (i._key === key ? { ...i, [field]: val } : i)));

  const moveItem = (key: any, dir: number) => {
    setQuoteItems((p) => {
      const idx = p.findIndex((i) => i._key === key);
      const next = idx + dir;
      if (next < 0 || next >= p.length) return p;
      const arr = [...p];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr.map((i, n) => ({ ...i, sort_order: n + 1 }));
    });
  };

  const calcTotals = useCallback(() => {
    const subtotal = quoteItems.reduce(
      (s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.rate) || 0), 0
    );
    const dv = parseFloat(quoteForm.discount_value) || 0;
    const discAmt = quoteForm.discount_type === "percentage" ? (subtotal * dv) / 100 : dv;
    const taxable = Math.max(0, subtotal - discAmt);
    let cgst = 0, sgst = 0, igst = 0;
    if (taxMode === "cgst_sgst") {
      cgst = (taxable * (parseFloat(quoteForm.cgst_rate) || 0)) / 100;
      sgst = (taxable * (parseFloat(quoteForm.sgst_rate) || 0)) / 100;
    } else {
      igst = (taxable * (parseFloat(quoteForm.igst_rate) || 0)) / 100;
    }
    return { subtotal, discAmt, taxable, cgst, sgst, igst, total: taxable + cgst + sgst + igst };
  }, [quoteItems, quoteForm, taxMode]);

  const totals = calcTotals();

  const handleQuoteSubmit = async (e: any) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setQuoteError(null);
    const payload = {
      project: quoteForm.project,
      valid_until: quoteForm.valid_until || undefined,
      discount_type: quoteForm.discount_type,
      discount_value: quoteForm.discount_value,
      cgst_rate: taxMode === "cgst_sgst" ? quoteForm.cgst_rate : "0",
      sgst_rate: taxMode === "cgst_sgst" ? quoteForm.sgst_rate : "0",
      igst_rate: taxMode === "igst" ? quoteForm.igst_rate : "0",
      notes: quoteForm.notes,
      items: quoteItems.map((i, n) => ({
        description: i.description, category: i.category,
        quantity: i.quantity, unit: i.unit, rate: i.rate, sort_order: n + 1,
      })),
    };
    try {
      await createQuotation(payload);
      await fetchQuotations();
      closeQuoteModal();
    } catch (err) {
      setQuoteError(err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleApprove = async (qid: any) => {
    if (!confirm("Approve this quotation?")) return;
    setActionLoading(true);
    try {
      await approveQuotation(qid);
      await fetchQuotations();
      if (viewingQuote?.id === qid) fetchQuoteDetail(qid);
    } catch { alert("Approve failed."); }
    finally { setActionLoading(false); }
  };

  const handleSend = async (qid: any) => {
    if (!confirm("Mark as Sent?")) return;
    setActionLoading(true);
    try {
      await sendQuotation(qid);
      await fetchQuotations();
      if (viewingQuote?.id === qid) fetchQuoteDetail(qid);
    } catch { alert("Send failed."); }
    finally { setActionLoading(false); }
  };

  const handleRevise = async (qid: any) => {
    if (!confirm("Create a new revision?")) return;
    setActionLoading(true);
    try {
      await reviseQuotation(qid);
      await fetchQuotations();
      setViewingQuote(null);
    } catch { alert("Revise failed."); }
    finally { setActionLoading(false); }
  };

  const handleDeleteQuote = async (qid: any) => {
    if (!confirm("Delete this quotation permanently?")) return;
    try {
      await deleteQuotation(qid);
      await fetchQuotations();
      if (viewingQuote?.id === qid) setViewingQuote(null);
    } catch { alert("Delete failed."); }
  };

  // ── Invoice handlers ───────────────────────────────────────────────────────

  const openInvoiceModal = () => {
    const approvedQuote = quotations.find((q) => q.status === "approved");
    setInvoiceForm({
      quotation_id: approvedQuote?.id || "",
      invoice_type: "full",
      milestone_label: "",
      milestone_percentage: 100,
      invoice_date: new Date().toISOString().split("T")[0],
      due_days: 15,
      notes: "",
    });
    setInvoiceError(null);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => { setIsInvoiceModalOpen(false); setInvoiceError(null); };

  const handleInvoiceTypeChange = (type: string) => {
    const defaults: Record<string, any> = {
      full: { milestone_label: "", milestone_percentage: 100, due_days: 15 },
      advance: { milestone_label: "Advance on Booking", milestone_percentage: 10, due_days: 7 },
      milestone: { milestone_label: "", milestone_percentage: 20, due_days: 15 },
      final: { milestone_label: "Final Handover", milestone_percentage: 20, due_days: 7 },
    };
    setInvoiceForm((p) => ({ ...p, invoice_type: type, ...defaults[type] }));
  };

  const handleInvoiceSubmit = async (e: any) => {
    e.preventDefault();
    setInvoiceSubmitting(true);
    setInvoiceError(null);
    const payload = {
      quotation_id: invoiceForm.quotation_id,
      invoice_type: invoiceForm.invoice_type,
      milestone_label: invoiceForm.milestone_label || undefined,
      milestone_percentage: invoiceForm.milestone_percentage,
      invoice_date: invoiceForm.invoice_date,
      due_days: invoiceForm.due_days,
      notes: invoiceForm.notes || undefined,
    };
    try {
      await generateInvoice(payload);
      await fetchInvoices();
      closeInvoiceModal();
    } catch (err) {
      setInvoiceError(err);
    } finally {
      setInvoiceSubmitting(false);
    }
  };

  const handleSendInvoice = async (iid: any) => {
    if (!confirm("Mark invoice as Sent?")) return;
    setInvoiceActionLoading(true);
    try {
      await sendInvoice(iid);
      await fetchInvoices();
      if (viewingInvoice?.id === iid) fetchInvoiceDetail(iid);
    } catch { alert("Failed."); }
    finally { setInvoiceActionLoading(false); }
  };

  const handleMarkPaid = async (iid: any) => {
    if (!confirm("Mark invoice as Paid?")) return;
    setInvoiceActionLoading(true);
    try {
      await markInvoicePaid(iid);
      await fetchInvoices();
      if (viewingInvoice?.id === iid) fetchInvoiceDetail(iid);
    } catch { alert("Failed."); }
    finally { setInvoiceActionLoading(false); }
  };

  const handleDeleteInvoice = async (iid: any) => {
    if (!confirm("Delete this invoice permanently?")) return;
    try {
      await deleteInvoice(iid);
      await fetchInvoices();
      if (viewingInvoice?.id === iid) setViewingInvoice(null);
    } catch { alert("Delete failed."); }
  };

  // ── Invoice stats ──────────────────────────────────────────────────────────

  const invoiceStats = {
    total: invoices.length,
    totalValue: invoices.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0),
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + parseFloat(i.grand_total || 0), 0),
    pending: invoices
      .filter((i) => ["draft", "sent", "partial"].includes(i.status))
      .reduce((s, i) => s + parseFloat(i.balance_due || i.grand_total || 0), 0),
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#C8922A]" size={40} />
      </div>
    );
  if (!client) return <div className="p-10 text-center">Client not found.</div>;

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen font-sans">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#9A8F82] hover:text-[#1C1C1C] transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Clients</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-[#F5F2ED]">
              <div className="w-20 h-20 rounded-full bg-[#FDF3E3] text-[#C8922A] text-3xl font-bold flex items-center justify-center border-2 border-[#F5E6CC] mb-4 shadow-sm">
                {client?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h1 className="text-xl font-bold text-[#1C1C1C]">{client.full_name}</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 mt-2 rounded-full uppercase bg-green-50 text-green-600 border border-green-100">
                Active Client
              </span>
            </div>
            <div className="pt-6 space-y-5">
              {[
                { icon: <Mail size={16} />, label: "Email Address", value: client.email || "N/A" },
                { icon: <Phone size={16} />, label: "Phone Number", value: client.phone },
                { icon: <CreditCard size={16} />, label: "GST Number", value: client.gstin || "N/A", upper: true },
                { icon: <MapPin size={16} />, label: "Billing Address", value: client.billing_address || "N/A" },
                { icon: <Home size={16} />, label: "Site Address", value: client.site_address || "N/A" },
              ].map(({ icon, label, value, upper }: any) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-2 bg-[#FAF8F5] rounded-lg text-[#9A8F82]">{icon}</div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-[#9A8F82] tracking-wider">{label}</p>
                    <p className={`text-[13px] font-medium text-[#1C1C1C] break-all leading-relaxed ${upper ? "uppercase" : ""}`}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#9A8F82] text-[12px] font-semibold uppercase tracking-widest mb-3">
              <Calendar size={14} /> Account Info
            </div>
            <p className="text-[13px] text-[#6B6259]">
              Created on:{" "}
              <span className="font-bold text-[#1C1C1C]">
                {new Date(client.created_at).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT: Tabs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tab Bar + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-white border border-[#EDE8DF] rounded-xl p-1 shadow-sm flex-wrap">
              {[
                { key: "projects", icon: <Briefcase size={13} />, label: `Projects (${client.project_count})` },
                { key: "proposals", icon: <ScrollText size={13} />, label: "Proposals" },
                { key: "quotations", icon: <Receipt size={13} />, label: "Quotations" },
                { key: "invoices", icon: <FileStack size={13} />, label: "Invoices" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === t.key ? "bg-[#C8922A] text-white shadow-sm" : "text-[#6B6259] hover:text-[#1C1C1C]"
                    }`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {activeTab === "projects" && (
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm"
              >
                <Plus size={15} /> Add Project
              </button>
            )}
            {activeTab === "proposals" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="flex items-center gap-2 bg-white border border-[#EDE8DF] hover:border-[#C8922A] text-[#6B6259] hover:text-[#C8922A] text-[12px] font-semibold px-3 py-2 rounded-lg transition-all shadow-sm"
                >
                  <Layout size={14} /> Template
                </button>
                <button
                  onClick={openProposalModal}
                  className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  <Plus size={14} /> Proposal
                </button>
              </div>
            )}
            {activeTab === "quotations" && (
              <button
                onClick={openQuoteModal}
                className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm"
              >
                <Plus size={15} /> New Quotation
              </button>
            )}
            {activeTab === "invoices" && (
              <button
                onClick={openInvoiceModal}
                className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm"
              >
                <Plus size={15} /> Generate Invoice
              </button>
            )}
          </div>

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
              {client.projects?.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Project Details</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2ED]">
                    {client.projects.map((p: any) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-[13px] font-bold text-[#1C1C1C] capitalize">{p.name}</p>
                          <p className="text-[11px] text-[#9A8F82] mt-0.5">
                            {p.property_type} • ₹{Number(p.budget_range).toLocaleString("en-IN")}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${projectBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditClick(p)} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-16 text-center text-[#9A8F82] text-sm">No projects found.</div>
              )}
            </div>
          )}

          {/* PROPOSALS TAB */}
          {activeTab === "proposals" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center gap-2">
                  <Layout size={14} className="text-[#C8922A]" />
                  <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Saved Templates</h3>
                  <span className="ml-auto text-[11px] bg-[#FDF3E3] text-[#C8922A] font-bold px-2 py-0.5 rounded-full">
                    {templates.length}
                  </span>
                </div>
                {templates.length > 0 ? (
                  <div className="divide-y divide-[#F5F2ED]">
                    {templates.map((t: any) => (
                      <div key={t.id} className="px-6 py-3 flex items-center gap-3 hover:bg-[#FAF8F5]">
                        <div className="p-2 bg-[#FDF3E3] rounded-lg text-[#C8922A]"><FileText size={13} /></div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1C1C1C]">{t.name}</p>
                          {t.description && <p className="text-[11px] text-[#9A8F82] truncate max-w-xs">{t.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-[#9A8F82] text-[13px]">No templates yet.</div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center gap-2">
                  <ScrollText size={14} className="text-[#C8922A]" />
                  <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Proposals</h3>
                  <span className="ml-auto text-[11px] bg-[#FDF3E3] text-[#C8922A] font-bold px-2 py-0.5 rounded-full">
                    {proposals.length}
                  </span>
                </div>
                {proposalsLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
                ) : proposals.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="border-b border-[#EDE8DF]">
                      <tr>
                        {["Proposal", "Project", "Valid Until", "Status"].map((h) => (
                          <th key={h} className="px-6 py-3 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F2ED]">
                      {proposals.map((p: any) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]">
                          <td className="px-6 py-4">
                            <p className="text-[13px] font-bold text-[#1C1C1C]">{p.title}</p>
                            <p className="text-[11px] text-[#9A8F82]">#{p.prop_number}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[13px] text-[#1C1C1C] capitalize">{p.project_name}</p>
                            {p.template_name && <p className="text-[11px] text-[#9A8F82]">via {p.template_name}</p>}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-[#6B6259]">
                            {p.valid_until
                              ? new Date(p.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${proposalBadge(p.status)}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center text-[#9A8F82] text-[13px]">
                    No proposals found for this client.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUOTATIONS TAB */}
          {activeTab === "quotations" && (
            <div className="space-y-4">
              {quotationsLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8922A]" size={28} /></div>
              ) : quotations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] p-16 text-center text-[#9A8F82] text-sm shadow-sm">
                  No quotations yet. Click <strong>New Quotation</strong> to create one.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
                      <tr>
                        {["Quote #", "Project", "Tax", "Grand Total", "Status", "Actions"].map((h, i) => (
                          <th key={h} className={`px-5 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${i >= 3 ? "text-right" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F2ED]">
                      {quotations.map((q: any) => (
                        <tr key={q.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="px-5 py-4">
                            <button onClick={() => fetchQuoteDetail(q.id)} className="text-[13px] font-bold text-[#C8922A] hover:underline">
                              #{q.quote_number} <span className="text-[11px] text-[#9A8F82] font-normal">v{q.version}</span>
                            </button>
                          </td>
                          <td className="px-5 py-4 text-[13px] text-[#1C1C1C] capitalize">{q.project_name}</td>
                          <td className="px-5 py-4 text-[11px] text-[#6B6259]">
                            {parseFloat(q.igst_rate) > 0 ? `IGST ${q.igst_rate}%` : `CGST ${q.cgst_rate}% + SGST ${q.sgst_rate}%`}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-[13px] font-bold text-[#1C1C1C]">₹{fmt(q.grand_total)}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${quoteBadge(q.status)}`}>{q.status}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {q.status === "draft" && (
                                <button onClick={() => handleSend(q.id)} title="Mark Sent" className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Send size={13} /></button>
                              )}
                              {(q.status === "draft" || q.status === "sent") && (
                                <button onClick={() => handleApprove(q.id)} title="Approve" className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"><CheckCircle size={13} /></button>
                              )}
                              {q.status === "approved" && (
                                <button onClick={() => handleRevise(q.id)} title="Revise" className="p-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100"><RotateCcw size={13} /></button>
                              )}
                              <button onClick={() => handleDeleteQuote(q.id)} title="Delete" className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Quote Detail Panel */}
              {(quoteDetailLoading || viewingQuote) && (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-[#1C1C1C]">
                      {quoteDetailLoading
                        ? "Loading..."
                        : `Quote #${viewingQuote.quote_number} — ${viewingQuote.project_name} (v${viewingQuote.version})`}
                    </h3>
                    <button onClick={() => setViewingQuote(null)} className="text-[#9A8F82] hover:text-red-500"><X size={16} /></button>
                  </div>
                  {quoteDetailLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
                  ) : viewingQuote && (
                    <div className="p-6 space-y-5">
                      {viewingQuote.items?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[13px]">
                            <thead>
                              <tr className="border-b border-[#EDE8DF]">
                                {["#", "Description", "Category", "Qty", "Unit", "Rate", "Amount"].map((h) => (
                                  <th key={h} className="pb-2 pr-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F2ED]">
                              {viewingQuote.items.map((it: any, n: number) => (
                                <tr key={it.id || n}>
                                  <td className="py-2.5 pr-4 text-[#9A8F82]">{n + 1}</td>
                                  <td className="py-2.5 pr-4 font-medium text-[#1C1C1C]">{it.description}</td>
                                  <td className="py-2.5 pr-4 text-[#6B6259]">{it.category}</td>
                                  <td className="py-2.5 pr-4 text-[#1C1C1C]">{it.quantity}</td>
                                  <td className="py-2.5 pr-4 text-[#6B6259]">{it.unit}</td>
                                  <td className="py-2.5 pr-4 text-[#1C1C1C]">₹{fmt(it.rate)}</td>
                                  <td className="py-2.5 font-bold text-[#1C1C1C]">₹{fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0))}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#9A8F82] italic">No items in this quotation.</p>
                      )}
                      <div className="ml-auto w-72 space-y-1.5 pt-4 border-t border-[#EDE8DF] text-[13px]">
                        {([
                          ["Subtotal", `₹${fmt(viewingQuote.subtotal)}`],
                          [`Discount (${viewingQuote.discount_type === "percentage" ? viewingQuote.discount_value + "%" : "₹" + fmt(viewingQuote.discount_value)})`, `-₹${fmt(viewingQuote.discount_amount)}`],
                          ["Taxable Amount", `₹${fmt(viewingQuote.taxable_amount)}`],
                          parseFloat(viewingQuote.cgst_amount) > 0 && [`CGST @ ${viewingQuote.cgst_rate}%`, `₹${fmt(viewingQuote.cgst_amount)}`],
                          parseFloat(viewingQuote.sgst_amount) > 0 && [`SGST @ ${viewingQuote.sgst_rate}%`, `₹${fmt(viewingQuote.sgst_amount)}`],
                          parseFloat(viewingQuote.igst_amount) > 0 && [`IGST @ ${viewingQuote.igst_rate}%`, `₹${fmt(viewingQuote.igst_amount)}`],
                        ] as any[]).filter(Boolean).map(([label, val]: any) => (
                          <div key={label} className="flex justify-between text-[#6B6259]">
                            <span>{label}</span><span className="font-medium text-[#1C1C1C]">{val}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#EDE8DF] text-[#1C1C1C]">
                          <span>Grand Total</span><span>₹{fmt(viewingQuote.grand_total)}</span>
                        </div>
                      </div>
                      {viewingQuote.notes && (
                        <div className="bg-[#FAF8F5] rounded-lg px-4 py-3 text-[13px] text-[#6B6259] border border-[#EDE8DF]">
                          <span className="font-bold text-[#9A8F82] uppercase text-[10px] block mb-1 tracking-wide">Notes</span>
                          {viewingQuote.notes}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2 flex-wrap">
                        {viewingQuote.status === "draft" && (
                          <button onClick={() => handleSend(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-semibold hover:bg-blue-100">
                            <Send size={13} /> Mark as Sent
                          </button>
                        )}
                        {(viewingQuote.status === "draft" || viewingQuote.status === "sent") && (
                          <button onClick={() => handleApprove(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[12px] font-semibold hover:bg-green-100">
                            <CheckCircle size={13} /> Approve
                          </button>
                        )}
                        {viewingQuote.status === "approved" && (
                          <button onClick={() => handleRevise(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[12px] font-semibold hover:bg-purple-100">
                            <RotateCcw size={13} /> Revise
                          </button>
                        )}
                        <button onClick={() => handleDeleteQuote(viewingQuote.id)} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[12px] font-semibold hover:bg-red-100 ml-auto">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* INVOICES TAB */}
          {activeTab === "invoices" && (
            <div className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Invoiced", value: `₹${fmt(invoiceStats.totalValue)}`, icon: <IndianRupee size={14} />, color: "text-[#C8922A]", bg: "bg-[#FDF3E3]" },
                  { label: "Amount Received", value: `₹${fmt(invoiceStats.paid)}`, icon: <BadgeCheck size={14} />, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Balance Pending", value: `₹${fmt(invoiceStats.pending)}`, icon: <Clock size={14} />, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-[#EDE8DF] rounded-xl p-4 shadow-sm">
                    <div className={`inline-flex p-2 ${s.bg} rounded-lg ${s.color} mb-2`}>{s.icon}</div>
                    <p className="text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider">{s.label}</p>
                    <p className={`text-[15px] font-bold ${s.color} mt-0.5`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Invoice List */}
              {invoicesLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8922A]" size={28} /></div>
              ) : invoices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] p-16 text-center shadow-sm">
                  <div className="w-12 h-12 bg-[#FDF3E3] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileStack size={22} className="text-[#C8922A]" />
                  </div>
                  <p className="text-[#9A8F82] text-sm font-medium">No invoices yet.</p>
                  <p className="text-[#9A8F82] text-[12px] mt-1">Generate one from an approved quotation.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
                      <tr>
                        {["Invoice #", "Project", "Type", "Date", "Due Date", "Grand Total", "Status", "Actions"].map((h, i) => (
                          <th key={h} className={`px-4 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${i >= 5 ? "text-right" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F2ED]">
                      {invoices.map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="px-4 py-4">
                            <button onClick={() => fetchInvoiceDetail(inv.id)} className="text-[13px] font-bold text-[#C8922A] hover:underline">
                              #{inv.invoice_number}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-[13px] text-[#1C1C1C] capitalize">{inv.project_name}</td>
                          <td className="px-4 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${invoiceTypeBadge(inv.invoice_type)}`}>
                              {inv.invoice_type}
                            </span>
                            {inv.milestone_label && (
                              <p className="text-[10px] text-[#9A8F82] mt-0.5 truncate max-w-[100px]">{inv.milestone_label}</p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-[12px] text-[#6B6259]">
                            {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-4 text-[12px] text-[#6B6259]">
                            {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="text-[13px] font-bold text-[#1C1C1C]">₹{fmt(inv.grand_total)}</p>
                            {parseFloat(inv.balance_due) > 0 && parseFloat(inv.balance_due) !== parseFloat(inv.grand_total) && (
                              <p className="text-[10px] text-amber-600 font-medium">Bal: ₹{fmt(inv.balance_due)}</p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${invoiceBadge(inv.status)}`}>{inv.status}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {inv.status === "draft" && (
                                <button onClick={() => handleSendInvoice(inv.id)} title="Mark Sent" className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Send size={13} /></button>
                              )}
                              {(inv.status === "sent" || inv.status === "partial") && (
                                <button onClick={() => handleMarkPaid(inv.id)} title="Mark Paid" className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"><Banknote size={13} /></button>
                              )}
                              <button onClick={() => handleDeleteInvoice(inv.id)} title="Delete" className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Invoice Detail Panel */}
              {(invoiceDetailLoading || viewingInvoice) && (
                <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-[#1C1C1C]">
                      {invoiceDetailLoading ? "Loading..." : `Invoice #${viewingInvoice.invoice_number} — ${viewingInvoice.project_name}`}
                    </h3>
                    <button onClick={() => setViewingInvoice(null)} className="text-[#9A8F82] hover:text-red-500"><X size={16} /></button>
                  </div>
                  {invoiceDetailLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#C8922A]" size={22} /></div>
                  ) : viewingInvoice && (
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] rounded-xl p-4 border border-[#EDE8DF] text-[13px]">
                        <div>
                          <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Client</p>
                          <p className="font-semibold text-[#1C1C1C]">{viewingInvoice.client_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Invoice Type</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${invoiceTypeBadge(viewingInvoice.invoice_type)}`}>{viewingInvoice.invoice_type}</span>
                          {viewingInvoice.milestone_label && <span className="ml-2 text-[12px] text-[#6B6259]">— {viewingInvoice.milestone_label}</span>}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Invoice Date</p>
                          <p className="text-[#1C1C1C]">{viewingInvoice.invoice_date ? new Date(viewingInvoice.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Due Date</p>
                          <p className="text-[#1C1C1C]">{viewingInvoice.due_date ? new Date(viewingInvoice.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p>
                        </div>
                        {parseFloat(viewingInvoice.milestone_percentage) > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Milestone %</p>
                            <p className="text-[#1C1C1C] font-semibold">{viewingInvoice.milestone_percentage}%</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider mb-1">Status</p>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${invoiceBadge(viewingInvoice.status)}`}>{viewingInvoice.status}</span>
                        </div>
                      </div>

                      {viewingInvoice.items?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[13px]">
                            <thead>
                              <tr className="border-b border-[#EDE8DF]">
                                {["#", "Description", "Category", "Qty", "Unit", "Rate", "Amount"].map((h) => (
                                  <th key={h} className="pb-2 pr-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F2ED]">
                              {viewingInvoice.items.map((it: any, n: number) => (
                                <tr key={it.id || n}>
                                  <td className="py-2.5 pr-4 text-[#9A8F82]">{n + 1}</td>
                                  <td className="py-2.5 pr-4 font-medium text-[#1C1C1C]">{it.description}</td>
                                  <td className="py-2.5 pr-4 text-[#6B6259]">{it.category}</td>
                                  <td className="py-2.5 pr-4 text-[#1C1C1C]">{it.quantity}</td>
                                  <td className="py-2.5 pr-4 text-[#6B6259]">{it.unit}</td>
                                  <td className="py-2.5 pr-4 text-[#1C1C1C]">₹{fmt(it.rate)}</td>
                                  <td className="py-2.5 font-bold text-[#1C1C1C]">₹{fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0))}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#9A8F82] italic">No line items.</p>
                      )}

                      <div className="ml-auto w-72 space-y-1.5 pt-4 border-t border-[#EDE8DF] text-[13px]">
                        {([
                          ["Subtotal", `₹${fmt(viewingInvoice.subtotal)}`],
                          parseFloat(viewingInvoice.cgst_amount) > 0 && [`CGST @ ${viewingInvoice.cgst_rate || ""}%`, `₹${fmt(viewingInvoice.cgst_amount)}`],
                          parseFloat(viewingInvoice.sgst_amount) > 0 && [`SGST @ ${viewingInvoice.sgst_rate || ""}%`, `₹${fmt(viewingInvoice.sgst_amount)}`],
                          parseFloat(viewingInvoice.igst_amount) > 0 && [`IGST @ ${viewingInvoice.igst_rate || ""}%`, `₹${fmt(viewingInvoice.igst_amount)}`],
                          parseFloat(viewingInvoice.total_tax) > 0 && ["Total Tax", `₹${fmt(viewingInvoice.total_tax)}`],
                        ] as any[]).filter(Boolean).map(([label, val]: any) => (
                          <div key={label} className="flex justify-between text-[#6B6259]">
                            <span>{label}</span><span className="font-medium text-[#1C1C1C]">{val}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#EDE8DF] text-[#1C1C1C]">
                          <span>Grand Total</span><span>₹{fmt(viewingInvoice.grand_total)}</span>
                        </div>
                        {parseFloat(viewingInvoice.amount_paid) > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="font-medium">Amount Paid</span><span className="font-bold">₹{fmt(viewingInvoice.amount_paid)}</span>
                          </div>
                        )}
                        {parseFloat(viewingInvoice.balance_due) > 0 && (
                          <div className="flex justify-between text-amber-600 font-bold">
                            <span>Balance Due</span><span>₹{fmt(viewingInvoice.balance_due)}</span>
                          </div>
                        )}
                      </div>

                      {viewingInvoice.notes && (
                        <div className="bg-[#FAF8F5] rounded-lg px-4 py-3 text-[13px] text-[#6B6259] border border-[#EDE8DF]">
                          <span className="font-bold text-[#9A8F82] uppercase text-[10px] block mb-1 tracking-wide">Notes</span>
                          {viewingInvoice.notes}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 flex-wrap">
                        {viewingInvoice.status === "draft" && (
                          <button onClick={() => handleSendInvoice(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[12px] font-semibold hover:bg-blue-100">
                            <Send size={13} /> Mark as Sent
                          </button>
                        )}
                        {(viewingInvoice.status === "sent" || viewingInvoice.status === "partial") && (
                          <button onClick={() => handleMarkPaid(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[12px] font-semibold hover:bg-green-100">
                            <Banknote size={13} /> Mark as Paid
                          </button>
                        )}
                        <button onClick={() => handleDeleteInvoice(viewingInvoice.id)} disabled={invoiceActionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[12px] font-semibold hover:bg-red-100 ml-auto">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <Modal title={editingProjectId ? "Update Project" : "Add New Project"} onClose={closeProjectModal} maxW="max-w-2xl">
          <form onSubmit={handleProjectSubmit} className="p-6 grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
            {projectApiError && <ErrorBanner error={projectApiError} cls="col-span-2" />}
            <FF label="Project Name *" cls="col-span-2">
              <input required name="name" value={projectForm.name} onChange={handleProjectInputChange} placeholder="Project name" className={inputCls} />
            </FF>
            <FF label="Property Type">
              <select name="property_type" value={projectForm.property_type} onChange={handleProjectInputChange} className={inputCls}>
                {["apartment", "villa", "office", "bungalow"].map((v) => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </FF>
            <FF label="Area (Sq. Ft.)">
              <input type="number" name="area_sqft" value={projectForm.area_sqft} onChange={handleProjectInputChange} placeholder="1200" className={inputCls} />
            </FF>
            <FF label="Budget (₹)">
              <input type="number" name="budget_range" value={projectForm.budget_range} onChange={handleProjectInputChange} placeholder="500000" className={inputCls} />
            </FF>
            <FF label="Status">
              <select name="status" value={projectForm.status} onChange={handleProjectInputChange} className={inputCls}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </FF>
            <FF label="Start Date">
              <input type="date" name="start_date" value={projectForm.start_date} onChange={handleProjectInputChange} className={inputCls} />
            </FF>
            <FF label="End Date">
              <input type="date" name="expected_end_date" value={projectForm.expected_end_date} onChange={handleProjectInputChange} className={inputCls} />
            </FF>
            <div className="col-span-2 pt-4 border-t border-[#F5F2ED]">
              <MFooter onCancel={closeProjectModal} isSubmitting={isProjectSubmitting} label={editingProjectId ? "Update Project" : "Save Project"} />
            </div>
          </form>
        </Modal>
      )}

      {/* TEMPLATE MODAL */}
      {isTemplateModalOpen && (
        <Modal title="Create New Template" onClose={() => { setIsTemplateModalOpen(false); setTemplateError(null); }} maxW="max-w-2xl">
          <form onSubmit={handleTemplateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {templateError && <ErrorBanner error={templateError} />}
            <FF label="Template Name *">
              <input required value={templateForm.name} onChange={(e) => setTemplateForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Residential Standard" className={inputCls} />
            </FF>
            <FF label="Description">
              <input value={templateForm.description} onChange={(e) => setTemplateForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" className={inputCls} />
            </FF>
            <FF label="Content *">
              <textarea required rows={10} value={templateForm.content} onChange={(e) => setTemplateForm((p) => ({ ...p, content: e.target.value }))} placeholder={"Dear {{client_name}},\n\n..."} className={`${inputCls} resize-none font-mono text-[12px]`} />
              <p className="text-[11px] text-[#9A8F82] mt-1">
                Vars: <code className="bg-[#F5F2ED] px-1 rounded">{"{{client_name}}"}</code>{" "}
                <code className="bg-[#F5F2ED] px-1 rounded">{"{{project_name}}"}</code>{" "}
                <code className="bg-[#F5F2ED] px-1 rounded">{"{{property_type}}"}</code>
              </p>
            </FF>
            <div className="pt-4 border-t border-[#F5F2ED]">
              <MFooter onCancel={() => setIsTemplateModalOpen(false)} isSubmitting={templateSubmitting} label="Save Template" />
            </div>
          </form>
        </Modal>
      )}

      {/* PROPOSAL MODAL */}
      {isProposalModalOpen && (
        <Modal title="Create Proposal" onClose={() => setIsProposalModalOpen(false)} maxW="max-w-2xl">
          <div className="px-6 pt-5">
            <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-1 w-fit mb-4">
              {["template", "manual"].map((m) => (
                <button key={m} type="button" onClick={() => setProposalMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${proposalMode === m ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>
                  {m === "template" ? "From Template" : "Manual"}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleProposalSubmit} className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {proposalError && <ErrorBanner error={proposalError} />}
            <FF label="Project *">
              <select required value={proposalForm.project} onChange={(e) => setProposalForm((p) => ({ ...p, project: e.target.value }))} className={inputCls}>
                <option value="">— Select —</option>
                {client.projects?.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
              </select>
            </FF>
            <FF label="Title *">
              <input required value={proposalForm.title} onChange={(e) => setProposalForm((p) => ({ ...p, title: e.target.value }))} placeholder="Interior Design Proposal..." className={inputCls} />
            </FF>
            {proposalMode === "template" ? (
              <FF label="Template *">
                <select required value={proposalForm.use_template} onChange={(e) => setProposalForm((p) => ({ ...p, use_template: e.target.value }))} className={inputCls}>
                  <option value="">— Select —</option>
                  {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </FF>
            ) : (
              <FF label="Content *">
                <textarea required rows={7} value={proposalForm.content} onChange={(e) => setProposalForm((p) => ({ ...p, content: e.target.value }))} placeholder={"Dear Client,\n\n..."} className={`${inputCls} resize-none font-mono text-[12px]`} />
              </FF>
            )}
            <div className="grid grid-cols-2 gap-4">
              <FF label="Valid Until">
                <input type="date" value={proposalForm.valid_until} onChange={(e) => setProposalForm((p) => ({ ...p, valid_until: e.target.value }))} className={inputCls} />
              </FF>
              <FF label="Notes">
                <input value={proposalForm.notes} onChange={(e) => setProposalForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Optional" className={inputCls} />
              </FF>
            </div>
            <div className="pt-4 border-t border-[#F5F2ED]">
              <MFooter onCancel={() => setIsProposalModalOpen(false)} isSubmitting={proposalSubmitting} label="Create Proposal" />
            </div>
          </form>
        </Modal>
      )}

      {/* QUOTATION MODAL */}
      {isQuoteModalOpen && (
        <Modal title="Create New Quotation" onClose={closeQuoteModal} maxW="max-w-4xl">
          <form onSubmit={handleQuoteSubmit} className="max-h-[88vh] overflow-y-auto">
            <div className="px-6 pt-5 pb-5 grid grid-cols-3 gap-4 border-b border-[#EDE8DF]">
              {quoteError && <ErrorBanner error={quoteError} cls="col-span-3" />}
              <FF label="Project *" cls="col-span-1">
                <select required value={quoteForm.project} onChange={(e) => setQuoteForm((p) => ({ ...p, project: e.target.value }))} className={inputCls}>
                  <option value="">— Select —</option>
                  {client.projects?.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
                </select>
              </FF>
              <FF label="Valid Until">
                <input type="date" value={quoteForm.valid_until} onChange={(e) => setQuoteForm((p) => ({ ...p, valid_until: e.target.value }))} className={inputCls} />
              </FF>
              <FF label="Discount Type">
                <select value={quoteForm.discount_type} onChange={(e) => setQuoteForm((p) => ({ ...p, discount_type: e.target.value }))} className={inputCls}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </FF>
              <FF label={`Discount Value ${quoteForm.discount_type === "percentage" ? "%" : "₹"}`}>
                <input type="number" min="0" value={quoteForm.discount_value} onChange={(e) => setQuoteForm((p) => ({ ...p, discount_value: e.target.value }))} className={inputCls} />
              </FF>
              <div className="col-span-2 flex flex-col justify-end gap-2">
                <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide">Tax Mode</label>
                <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl p-1 w-fit">
                  <button type="button" onClick={() => setTaxMode("cgst_sgst")} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${taxMode === "cgst_sgst" ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>CGST + SGST</button>
                  <button type="button" onClick={() => setTaxMode("igst")} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${taxMode === "igst" ? "bg-white text-[#C8922A] shadow-sm border border-[#EDE8DF]" : "text-[#6B6259]"}`}>IGST (Outstation)</button>
                </div>
              </div>
              {taxMode === "cgst_sgst" ? (
                <>
                  <FF label="CGST Rate (%)"><input type="number" min="0" max="28" value={quoteForm.cgst_rate} onChange={(e) => setQuoteForm((p) => ({ ...p, cgst_rate: e.target.value }))} className={inputCls} /></FF>
                  <FF label="SGST Rate (%)"><input type="number" min="0" max="28" value={quoteForm.sgst_rate} onChange={(e) => setQuoteForm((p) => ({ ...p, sgst_rate: e.target.value }))} className={inputCls} /></FF>
                </>
              ) : (
                <FF label="IGST Rate (%)" cls="col-span-2">
                  <input type="number" min="0" max="28" value={quoteForm.igst_rate} onChange={(e) => setQuoteForm((p) => ({ ...p, igst_rate: e.target.value }))} className={inputCls} />
                </FF>
              )}
              <FF label="Notes" cls="col-span-3">
                <input value={quoteForm.notes} onChange={(e) => setQuoteForm((p) => ({ ...p, notes: e.target.value }))} placeholder="e.g. Prices valid for 30 days..." className={inputCls} />
              </FF>
            </div>

            {/* Line Items */}
            <div className="px-6 py-5 border-b border-[#EDE8DF]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-bold text-[#6B6259] uppercase tracking-widest">Line Items</h3>
                <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C8922A] hover:underline"><Plus size={13} /> Add Item</button>
              </div>
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#9A8F82] uppercase tracking-wider px-2 mb-1">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-2">Rate (₹)</div>
                <div className="col-span-1 text-right">Amount</div>
              </div>
              <div className="space-y-2">
                {quoteItems.map((item, idx) => {
                  const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
                  return (
                    <div key={item._key} className="grid grid-cols-12 gap-2 items-center bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl px-3 py-2">
                      <div className="col-span-1 flex flex-col items-center gap-0">
                        <button type="button" onClick={() => moveItem(item._key, -1)} disabled={idx === 0} className="text-[#9A8F82] hover:text-[#C8922A] disabled:opacity-20"><ChevronUp size={12} /></button>
                        <span className="text-[10px] text-[#9A8F82] font-bold leading-none">{idx + 1}</span>
                        <button type="button" onClick={() => moveItem(item._key, 1)} disabled={idx === quoteItems.length - 1} className="text-[#9A8F82] hover:text-[#C8922A] disabled:opacity-20"><ChevronDown size={12} /></button>
                      </div>
                      <div className="col-span-4"><input required value={item.description} onChange={(e) => updateItem(item._key, "description", e.target.value)} placeholder="Description" className={`${inputCls} text-[12px] py-1.5`} /></div>
                      <div className="col-span-2">
                        <select value={item.category} onChange={(e) => updateItem(item._key, "category", e.target.value)} className={`${inputCls} text-[12px] py-1.5`}>
                          {["Furniture", "Civil", "Electrical", "Flooring", "Plumbing", "HVAC", "Painting", "Package", "Other"].map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-span-1"><input type="number" min="0" value={item.quantity} onChange={(e) => updateItem(item._key, "quantity", e.target.value)} className={`${inputCls} text-[12px] py-1.5`} /></div>
                      <div className="col-span-1">
                        <select value={item.unit} onChange={(e) => updateItem(item._key, "unit", e.target.value)} className={`${inputCls} text-[12px] py-1.5`}>
                          {["sqft", "rft", "lot", "nos", "unit", "kg", "set"].map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2"><input type="number" min="0" value={item.rate} onChange={(e) => updateItem(item._key, "rate", e.target.value)} placeholder="0" className={`${inputCls} text-[12px] py-1.5`} /></div>
                      <div className="col-span-1 flex items-center justify-end gap-1">
                        <span className="text-[12px] font-bold text-[#1C1C1C]">₹{fmt(amount)}</span>
                        {quoteItems.length > 1 && (
                          <button type="button" onClick={() => removeItem(item._key)} className="text-red-400 hover:text-red-600 ml-1"><X size={13} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals + Submit */}
            <div className="px-6 py-5 bg-[#FAF8F5] flex items-end justify-between gap-6">
              <div className="space-y-1 text-[12px] min-w-[240px]">
                <div className="flex justify-between text-[#6B6259]"><span>Subtotal</span><span className="font-semibold text-[#1C1C1C]">₹{fmt(totals.subtotal)}</span></div>
                <div className="flex justify-between text-[#6B6259]"><span>Discount</span><span className="font-semibold text-red-500">-₹{fmt(totals.discAmt)}</span></div>
                <div className="flex justify-between text-[#6B6259]"><span>Taxable</span><span className="font-semibold text-[#1C1C1C]">₹{fmt(totals.taxable)}</span></div>
                {taxMode === "cgst_sgst" ? (
                  <>
                    <div className="flex justify-between text-[#6B6259]"><span>CGST @ {quoteForm.cgst_rate}%</span><span className="font-semibold">₹{fmt(totals.cgst)}</span></div>
                    <div className="flex justify-between text-[#6B6259]"><span>SGST @ {quoteForm.sgst_rate}%</span><span className="font-semibold">₹{fmt(totals.sgst)}</span></div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#6B6259]"><span>IGST @ {quoteForm.igst_rate}%</span><span className="font-semibold">₹{fmt(totals.igst)}</span></div>
                )}
                <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-[#C8922A]/30 text-[#C8922A]">
                  <span>Grand Total</span><span>₹{fmt(totals.total)}</span>
                </div>
              </div>
              <MFooter onCancel={closeQuoteModal} isSubmitting={quoteSubmitting} label="Save Quotation" />
            </div>
          </form>
        </Modal>
      )}

      {/* INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <Modal title="Generate Invoice" onClose={closeInvoiceModal} maxW="max-w-lg">
          <form onSubmit={handleInvoiceSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {invoiceError && <ErrorBanner error={invoiceError} />}
            <div>
              <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide block mb-2">Invoice Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "full", label: "Full (100%)", desc: "Complete invoice for full amount" },
                  { value: "advance", label: "Advance", desc: "Advance payment on booking" },
                  { value: "milestone", label: "Milestone", desc: "Partial milestone payment" },
                  { value: "final", label: "Final", desc: "Final invoice on handover" },
                ].map((t) => (
                  <button key={t.value} type="button" onClick={() => handleInvoiceTypeChange(t.value)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${invoiceForm.invoice_type === t.value ? "border-[#C8922A] bg-[#FDF3E3]" : "border-[#EDE8DF] bg-white hover:border-[#C8922A]/40"}`}>
                    <p className={`text-[12px] font-bold ${invoiceForm.invoice_type === t.value ? "text-[#C8922A]" : "text-[#1C1C1C]"}`}>{t.label}</p>
                    <p className="text-[10px] text-[#9A8F82] mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <FF label="Quotation (Approved) *">
              <select required value={invoiceForm.quotation_id} onChange={(e) => setInvoiceForm((p) => ({ ...p, quotation_id: e.target.value }))} className={inputCls}>
                <option value="">— Select Quotation —</option>
                {quotations.map((q: any) => (
                  <option key={q.id} value={q.id}>
                    #{q.quote_number} v{q.version} — {q.project_name} (₹{fmt(q.grand_total)}) [{q.status}]
                  </option>
                ))}
              </select>
              {quotations.filter((q) => q.status === "approved").length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> No approved quotations found. Approve a quotation first.
                </p>
              )}
            </FF>

            {invoiceForm.invoice_type !== "full" && (
              <FF label={`Milestone Label ${invoiceForm.invoice_type === "milestone" ? "*" : ""}`}>
                <input
                  value={invoiceForm.milestone_label}
                  onChange={(e) => setInvoiceForm((p) => ({ ...p, milestone_label: e.target.value }))}
                  placeholder={
                    invoiceForm.invoice_type === "advance" ? "Advance on Booking" :
                      invoiceForm.invoice_type === "final" ? "Final Handover" :
                        "e.g. Design & Layout Approval"
                  }
                  className={inputCls}
                />
              </FF>
            )}

            {invoiceForm.invoice_type !== "full" && (
              <FF label="Milestone Percentage (%)">
                <input type="number" min="1" max="100" value={invoiceForm.milestone_percentage}
                  onChange={(e) => setInvoiceForm((p) => ({ ...p, milestone_percentage: Number(e.target.value) }))} className={inputCls} />
                <p className="text-[11px] text-[#9A8F82] mt-1">This % of quotation grand total will be invoiced.</p>
              </FF>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FF label="Invoice Date *">
                <input type="date" required value={invoiceForm.invoice_date} onChange={(e) => setInvoiceForm((p) => ({ ...p, invoice_date: e.target.value }))} className={inputCls} />
              </FF>
              <FF label="Due In (Days)">
                <input type="number" min="0" value={invoiceForm.due_days} onChange={(e) => setInvoiceForm((p) => ({ ...p, due_days: Number(e.target.value) }))} className={inputCls} />
              </FF>
            </div>

            <FF label="Notes">
              <input value={invoiceForm.notes} onChange={(e) => setInvoiceForm((p) => ({ ...p, notes: e.target.value }))} placeholder="e.g. Please pay within 15 days." className={inputCls} />
            </FF>

            <div className="pt-4 border-t border-[#F5F2ED]">
              <MFooter onCancel={closeInvoiceModal} isSubmitting={invoiceSubmitting} label="Generate Invoice" />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, maxW = "max-w-2xl" }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl w-full ${maxW} shadow-2xl overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FAF8F5]">
          <h2 className="text-[15px] font-bold text-[#1C1C1C]">{title}</h2>
          <button onClick={onClose} className="text-[#9A8F82] hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FF({ label, children, cls = "" }: any) {
  return (
    <div className={`space-y-1.5 ${cls}`}>
      <label className="text-[11px] font-bold text-[#6B6259] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function ErrorBanner({ error, cls = "" }: any) {
  return (
    <div className={`bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-red-600 text-[13px] ${cls}`}>
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{typeof error === "string" ? error : JSON.stringify(error)}</span>
    </div>
  );
}

function MFooter({ onCancel, isSubmitting, label }: any) {
  return (
    <div className="flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="px-4 py-2 text-[13px] font-semibold text-[#6B6259] hover:text-[#1C1C1C] transition-colors">
        Cancel
      </button>
      <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#C8922A] text-white text-[13px] font-semibold rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2 hover:bg-[#B07A20] transition-colors">
        {isSubmitting && <Loader2 size={13} className="animate-spin" />}
        {isSubmitting ? "Processing..." : label}
      </button>
    </div>
  );
}