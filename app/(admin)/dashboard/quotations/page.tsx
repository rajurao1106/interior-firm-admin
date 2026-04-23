
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Plus, Trash2, Loader2, Edit3, X,
//   FileSpreadsheet, Printer, Mail, MessageCircle,
//   CheckCircle, RotateCcw, Search, ChevronDown, User, Building2
// } from "lucide-react";

// // ─── SERVICES ─────────────────────────────────────────────────────────────────
// import {
//   getAllQuotations,
//   getQuotationById,
//   createQuotation,
//   updateQuotation,
//   deleteQuotation,
//   approveQuotation,
//   reviseQuotation,
//   type Quotation,
//   type QuotationItem,
// } from "@/services/quotationService";

// import { getAllClients, type Client } from "@/services/clientService";

// // ─── CONFIG ───────────────────────────────────────────────────────────────────
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return (
//     localStorage.getItem("access") ||
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("token")
//   );
// }

// function getAuthHeaders(): HeadersInit {
//   const token = getToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// interface Project {
//   id: string;
//   name: string;
//   property_type: string;
//   status: string;
// }

// interface ClientWithProjects extends Client {
//   projects?: Project[];
// }

// // ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
// const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
//   approved: { label: "Approved", color: "#10B981", bg: "#ECFDF5" },
//   sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
//   draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
//   rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
//   superseded: { label: "Superseded", color: "#9CA3AF", bg: "#F9FAFB" },
// };

// const EMPTY_ITEM: QuotationItem = {
//   description: "",
//   category: "",
//   quantity: "1",
//   unit: "lot",
//   rate: "",
//   sort_order: 0,
// };

// // ─── TOAST ────────────────────────────────────────────────────────────────────
// function Toast({
//   message,
//   type,
//   onClose,
// }: {
//   message: string;
//   type: "success" | "error" | "info";
//   onClose: () => void;
// }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);
//   const bg = { success: "#10B981", error: "#EF4444", info: "#C8922A" }[type];
//   return (
//     <div
//       className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-[13px] font-semibold animate-in slide-in-from-bottom-4"
//       style={{ backgroundColor: bg }}
//     >
//       {message}
//       <button onClick={onClose}>
//         <X size={14} />
//       </button>
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export default function QuotationsPage() {
//   const [quotations, setQuotations] = useState<Quotation[]>([]);
//   const [clients, setClients] = useState<ClientWithProjects[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecking, setAuthChecking] = useState(true);
//   const [search, setSearch] = useState("");
//   const [toast, setToast] = useState<{
//     message: string;
//     type: "success" | "error" | "info";
//   } | null>(null);
//   const [actionId, setActionId] = useState<string | null>(null);

//   // Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Form
//   const [selectedClientId, setSelectedClientId] = useState("");
//   const [selectedClient, setSelectedClient] = useState<ClientWithProjects | null>(null);
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [items, setItems] = useState<QuotationItem[]>([{ ...EMPTY_ITEM }]);
//   const [formMeta, setFormMeta] = useState({
//     valid_until: "",
//     discount_type: "fixed",
//     discount_value: "0",
//     cgst_rate: "9",
//     sgst_rate: "9",
//     igst_rate: "0",
//     notes: "",
//     status: "draft",
//   });

//   const showToast = (message: string, type: "success" | "error" | "info") =>
//     setToast({ message, type });

//   // ── Auth Check ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = getToken();
//       if (!token) {
//         console.warn("⚠️ No token found, redirecting to login...");
//         window.location.href = "/login";
//         return;
//       }
//       console.log("✅ Token found");
//       setAuthChecking(false);
//     };
//     const timer = setTimeout(checkAuth, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!authChecking) {
//       fetchQuotations();
//       fetchClients();
//     }
//   }, [authChecking]);

//   // ── Fetch Quotations ───────────────────────────────────────────────────────────
//   const fetchQuotations = async () => {
//     try {
//       const data = await getAllQuotations();
//       setQuotations(data);
//     } catch (err: any) {
//       console.error("Failed to load quotations:", err);
//       if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
//         ["access", "access_token", "token", "refresh"].forEach((k) =>
//           localStorage.removeItem(k)
//         );
//         window.location.href = "/login";
//       } else {
//         showToast("Failed to load quotations", "error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Fetch Clients with Projects ────────────────────────────────────────────────
//   async function fetchClients() {
//     try {
//       const clientsData = await getAllClients();
      
//       // Fetch projects for each client
//       const clientsWithProjects = await Promise.all(
//         clientsData.map(async (client) => {
//           try {
//             const res = await fetch(`${API_BASE}/clients/${client.id}/projects/`, {
//               headers: getAuthHeaders(),
//             });
//             if (res.ok) {
//               const projectsData = await res.json();
//               return {
//                 ...client,
//                 projects: projectsData.results ?? projectsData ?? [],
//               };
//             }
//             return { ...client, projects: [] };
//           } catch {
//             return { ...client, projects: [] };
//           }
//         })
//       );

//       setClients(clientsWithProjects);
//     } catch (err) {
//       console.error("Failed to fetch clients:", err);
//       showToast("Failed to load clients", "error");
//     }
//   }

//   // ── Client select ──────────────────────────────────────────────────────────────
//   function handleClientChange(clientId: string) {
//     setSelectedClientId(clientId);
//     setSelectedProjectId("");
//     const client = clients.find((c) => c.id === clientId) || null;
//     setSelectedClient(client);
//   }

//   // ── Item helpers ───────────────────────────────────────────────────────────────
//   function addItem() {
//     setItems((prev) => [...prev, { ...EMPTY_ITEM, sort_order: prev.length }]);
//   }

//   function removeItem(idx: number) {
//     setItems((prev) => prev.filter((_, i) => i !== idx));
//   }

//   function updateItem(idx: number, field: keyof QuotationItem, value: string) {
//     setItems((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], [field]: value };
//       return next;
//     });
//   }

//   function itemAmount(item: QuotationItem): number {
//     const q = parseFloat(item.quantity || "0");
//     const r = parseFloat(item.rate || "0");
//     return isNaN(q) || isNaN(r) ? 0 : q * r;
//   }

//   // Live totals
//   function computeTotals() {
//     const subtotal = items.reduce((s, it) => s + itemAmount(it), 0);
//     const dv = parseFloat(formMeta.discount_value || "0") || 0;
//     const discountAmt =
//       formMeta.discount_type === "percentage" ? (subtotal * dv) / 100 : dv;
//     const taxable = subtotal - discountAmt;
//     const cgst =
//       parseFloat(formMeta.igst_rate) > 0
//         ? 0
//         : (taxable * parseFloat(formMeta.cgst_rate || "0")) / 100;
//     const sgst =
//       parseFloat(formMeta.igst_rate) > 0
//         ? 0
//         : (taxable * parseFloat(formMeta.sgst_rate || "0")) / 100;
//     const igst =
//       parseFloat(formMeta.igst_rate) > 0
//         ? (taxable * parseFloat(formMeta.igst_rate || "0")) / 100
//         : 0;
//     const totalTax = cgst + sgst + igst;
//     return {
//       subtotal,
//       discountAmt,
//       taxable,
//       cgst,
//       sgst,
//       igst,
//       totalTax,
//       grand: taxable + totalTax,
//     };
//   }

//   const totals = computeTotals();
//   const fmt = (n: number) =>
//     "₹" +
//     n.toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   // ── Open Create modal ──────────────────────────────────────────────────────────
//   function openCreate() {
//     setEditingId(null);
//     setSelectedClientId("");
//     setSelectedClient(null);
//     setSelectedProjectId("");
//     setItems([{ ...EMPTY_ITEM }]);
//     setFormMeta({
//       valid_until: "",
//       discount_type: "fixed",
//       discount_value: "0",
//       cgst_rate: "9",
//       sgst_rate: "9",
//       igst_rate: "0",
//       notes: "",
//       status: "draft",
//     });
//     setIsModalOpen(true);
//   }

//   // ── Open Edit modal ────────────────────────────────────────────────────────────
//   async function openEdit(id: string) {
//     try {
//       const q = await getQuotationById(id);

//       let matchedClient: ClientWithProjects | null = null;
//       let matchedClientId = "";
      
//       for (const c of clients) {
//         if (c.projects?.some((p) => p.id === q.project)) {
//           matchedClient = c;
//           matchedClientId = c.id;
//           break;
//         }
//       }

//       setEditingId(id);
//       setSelectedClientId(matchedClientId);
//       setSelectedClient(matchedClient);
//       setSelectedProjectId(q.project);
//       setItems(
//         q.items?.length
//           ? q.items.map((it) => ({
//               id: it.id,
//               description: it.description,
//               category: it.category || "",
//               quantity: String(it.quantity),
//               unit: it.unit || "lot",
//               rate: String(it.rate),
//               amount: String(it.amount),
//               sort_order: it.sort_order || 0,
//             }))
//           : [{ ...EMPTY_ITEM }]
//       );
//       setFormMeta({
//         valid_until: q.valid_until || "",
//         discount_type: q.discount_type || "fixed",
//         discount_value: String(q.discount_value || "0"),
//         cgst_rate: String(q.cgst_rate || "9"),
//         sgst_rate: String(q.sgst_rate || "9"),
//         igst_rate: String(q.igst_rate || "0"),
//         notes: q.notes || "",
//         status: q.status || "draft",
//       });
//       setIsModalOpen(true);
//     } catch (err: any) {
//       showToast("Failed to load quotation details", "error");
//     }
//   }

//   // ── Submit ─────────────────────────────────────────────────────────────────────
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!selectedProjectId) {
//       showToast("Please select a project", "error");
//       return;
//     }
//     if (items.length === 0 || !items[0].description) {
//       showToast("Add at least one line item", "error");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         project: selectedProjectId,
//         ...formMeta,
//         items: items.map((it, idx) => ({
//           ...(it.id ? { id: it.id } : {}),
//           description: it.description,
//           category: it.category,
//           quantity: it.quantity,
//           unit: it.unit,
//           rate: it.rate,
//           sort_order: idx,
//         })),
//       };

//       if (editingId) {
//         await updateQuotation(editingId, payload);
//         showToast("Quotation updated!", "success");
//       } else {
//         await createQuotation(payload);
//         showToast("Quotation created!", "success");
//       }

//       setIsModalOpen(false);
//       fetchQuotations();
//     } catch (err: any) {
//       console.error("Submit error:", err);
//       showToast("Error: " + err.message, "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ── Delete ─────────────────────────────────────────────────────────────────────
//   async function handleDelete(id: string) {
//     if (!confirm("Delete this quotation?")) return;
//     try {
//       await deleteQuotation(id);
//       showToast("Deleted", "info");
//       fetchQuotations();
//     } catch (err: any) {
//       showToast("Delete failed", "error");
//     }
//   }

//   // ── Approve ────────────────────────────────────────────────────────────────────
//   async function handleApprove(id: string) {
//     setActionId(`approve_${id}`);
//     try {
//       await approveQuotation(id);
//       showToast("Approved!", "success");
//       fetchQuotations();
//     } catch (err: any) {
//       showToast(err.message || "Approval failed", "error");
//     } finally {
//       setActionId(null);
//     }
//   }

//   // ── Revise ─────────────────────────────────────────────────────────────────────
//   async function handleRevise(id: string) {
//     if (!confirm("Create a new version?")) return;
//     setActionId(`revise_${id}`);
//     try {
//       await reviseQuotation(id);
//       showToast("New version created!", "success");
//       fetchQuotations();
//     } catch (err: any) {
//       showToast("Revision failed", "error");
//     } finally {
//       setActionId(null);
//     }
//   }

//   // ── PDF ────────────────────────────────────────────────────────────────────────
//   async function handleDownloadPDF(id: string, qNum: string) {
//     setActionId(`pdf_${id}`);
//     try {
//       const res = await fetch(`${API_BASE}/quotations/${id}/pdf/`, {
//         headers: getAuthHeaders(),
//       });
      
//       if (!res.ok) {
//         throw new Error(`PDF generation failed: ${res.status}`);
//       }
      
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${qNum}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       showToast("PDF downloaded!", "success");
//     } catch (err: any) {
//       console.error("PDF download error:", err);
//       showToast("PDF download failed - check backend logs", "error");
//     } finally {
//       setActionId(null);
//     }
//   }

//   // ── Excel ──────────────────────────────────────────────────────────────────────
//   function handleDownloadExcel(q: Quotation) {
//     const rows = [
//       ["QUOTATION"],
//       [""],
//       ["Quote Number", q.quote_number],
//       ["Version", q.version],
//       ["Client", q.client_name],
//       ["Project", q.project_name],
//       ["Status", q.status],
//       ["Valid Until", q.valid_until || "—"],
//       [""],
//       ["LINE ITEMS"],
//       ["#", "Description", "Category", "Qty", "Unit", "Rate (₹)", "Amount (₹)"],
//       ...(q.items || []).map((it, i) => [
//         i + 1,
//         it.description,
//         it.category,
//         it.quantity,
//         it.unit,
//         it.rate,
//         it.amount,
//       ]),
//       [""],
//       ["Subtotal", "", "", "", "", "", q.subtotal],
//       ["Discount", "", "", "", "", "", q.discount_amount],
//       ["Taxable Amount", "", "", "", "", "", q.taxable_amount],
//       ...(parseFloat(q.cgst_amount || "0") > 0 ? [["CGST", "", "", "", "", "", q.cgst_amount]] : []),
//       ...(parseFloat(q.sgst_amount || "0") > 0 ? [["SGST", "", "", "", "", "", q.sgst_amount]] : []),
//       ...(parseFloat(q.igst_amount || "0") > 0 ? [["IGST", "", "", "", "", "", q.igst_amount]] : []),
//       ["Grand Total", "", "", "", "", "", q.grand_total],
//     ];
//     const csv = rows
//       .map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${q.quote_number}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     showToast("Excel downloaded!", "success");
//   }

//   // ── Email ──────────────────────────────────────────────────────────────────────
//   async function handleSendEmail(id: string) {
//     setActionId(`email_${id}`);
//     try {
//       const res = await fetch(`${API_BASE}/notifications/email/quotation/${id}/send/`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//       });
//       showToast(res.ok ? "Emailed to client!" : "Email failed", res.ok ? "success" : "error");
//     } catch {
//       showToast("Email failed", "error");
//     } finally {
//       setActionId(null);
//     }
//   }

//   // ── WhatsApp ───────────────────────────────────────────────────────────────────
//   async function handleSendWhatsApp(id: string) {
//     setActionId(`wa_${id}`);
//     try {
//       const res = await fetch(`${API_BASE}/notifications/whatsapp/quotation/${id}/send/`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//       });
//       showToast(res.ok ? "WhatsApp sent!" : "WhatsApp failed", res.ok ? "success" : "error");
//     } catch {
//       showToast("WhatsApp failed", "error");
//     } finally {
//       setActionId(null);
//     }
//   }

//   const filtered = quotations.filter(
//     (q) =>
//       q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
//       q.client_name?.toLowerCase().includes(search.toLowerCase()) ||
//       q.project_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const selectedClientProjects = selectedClient?.projects || [];

//   // Auth loading screen
//   if (authChecking) {
//     return (
//       <div className="min-h-screen bg-[#FCFBF9] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="animate-spin inline text-[#C8922A] mb-4" size={40} />
//           <p className="text-[#9A8F82] text-[14px]">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen bg-[#FCFBF9]">
//       {toast && (
//         <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
//       )}

//       {/* ── Header ── */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-[24px] font-bold text-[#1C1C1C]">Quotations</h1>
//           <p className="text-[13px] text-[#9A8F82] mt-0.5">
//             Manage estimates, GST calculations & client approvals
//           </p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
//         >
//           <Plus size={16} /> New Quotation
//         </button>
//       </div>

//       {/* ── Search ── */}
//       <div className="relative mb-6 max-w-sm">
//         <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82]" />
//         <input
//           placeholder="Search quotations..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A]"
//         />
//       </div>

//       {/* ── Table ── */}
//       <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
//               {["Quote", "Client & Project", "Grand Total", "Status", "Actions"].map((h) => (
//                 <th
//                   key={h}
//                   className={`px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${
//                     h === "Actions" ? "text-right" : ""
//                   }`}
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#F5F2ED]">
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="py-20 text-center">
//                   <Loader2 className="animate-spin inline text-[#C8922A]" size={24} />
//                 </td>
//               </tr>
//             ) : filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="py-20 text-center text-[#9A8F82] text-[14px]">
//                   No quotations found. Create your first one!
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((q) => {
//                 const st = statusConfig[q.status] || statusConfig.draft;
//                 return (
//                   <tr key={q.id} className="hover:bg-[#FAF8F5] transition-colors">
//                     <td className="px-6 py-4">
//                       <p className="text-[13px] font-bold text-[#C8922A]">{q.quote_number}</p>
//                       <p className="text-[11px] text-[#9A8F82]">v{q.version}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-[13px] font-semibold text-[#1C1C1C]">{q.client_name}</p>
//                       <p className="text-[12px] text-[#6B6259]">{q.project_name}</p>
//                     </td>
//                     <td className="px-6 py-4 font-bold text-[#1C1C1C] text-[14px]">
//                       ₹{parseFloat(q.grand_total || "0").toLocaleString("en-IN")}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight"
//                         style={{ color: st.color, backgroundColor: st.bg }}
//                       >
//                         {st.label}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           onClick={() => openEdit(q.id)}
//                           title="Edit"
//                           className="p-2 text-[#9A8F82] hover:text-[#C8922A] hover:bg-[#FDF3E3] rounded-lg transition-colors"
//                         >
//                           <Edit3 size={14} />
//                         </button>

//                         {["draft", "sent"].includes(q.status) && (
//                           <button
//                             onClick={() => handleApprove(q.id)}
//                             title="Approve"
//                             disabled={actionId === `approve_${q.id}`}
//                             className="p-2 text-[#9A8F82] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors disabled:opacity-50"
//                           >
//                             {actionId === `approve_${q.id}` ? (
//                               <Loader2 size={14} className="animate-spin" />
//                             ) : (
//                               <CheckCircle size={14} />
//                             )}
//                           </button>
//                         )}

//                         {["approved", "sent"].includes(q.status) && (
//                           <button
//                             onClick={() => handleRevise(q.id)}
//                             title="Revise"
//                             disabled={actionId === `revise_${q.id}`}
//                             className="p-2 text-[#9A8F82] hover:text-[#C8922A] hover:bg-[#FDF3E3] rounded-lg transition-colors disabled:opacity-50"
//                           >
//                             {actionId === `revise_${q.id}` ? (
//                               <Loader2 size={14} className="animate-spin" />
//                             ) : (
//                               <RotateCcw size={14} />
//                             )}
//                           </button>
//                         )}

//                         <button
//                           onClick={() => handleDownloadPDF(q.id, q.quote_number)}
//                           title="Download PDF"
//                           disabled={actionId === `pdf_${q.id}`}
//                           className="p-2 text-[#9A8F82] hover:text-[#1C1C1C] hover:bg-[#F5F2ED] rounded-lg transition-colors disabled:opacity-50"
//                         >
//                           {actionId === `pdf_${q.id}` ? (
//                             <Loader2 size={14} className="animate-spin" />
//                           ) : (
//                             <Printer size={14} />
//                           )}
//                         </button>

//                         <button
//                           onClick={() => handleDownloadExcel(q)}
//                           title="Download Excel"
//                           className="p-2 text-[#9A8F82] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors"
//                         >
//                           <FileSpreadsheet size={14} />
//                         </button>

//                         <button
//                           onClick={() => handleSendEmail(q.id)}
//                           title="Send Email"
//                           disabled={actionId === `email_${q.id}`}
//                           className="p-2 text-[#9A8F82] hover:text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
//                         >
//                           {actionId === `email_${q.id}` ? (
//                             <Loader2 size={14} className="animate-spin" />
//                           ) : (
//                             <Mail size={14} />
//                           )}
//                         </button>

//                         <button
//                           onClick={() => handleSendWhatsApp(q.id)}
//                           title="Send WhatsApp"
//                           disabled={actionId === `wa_${q.id}`}
//                           className="p-2 text-[#9A8F82] hover:text-[#25D366] hover:bg-[#ECFDF5] rounded-lg transition-colors disabled:opacity-50"
//                         >
//                           {actionId === `wa_${q.id}` ? (
//                             <Loader2 size={14} className="animate-spin" />
//                           ) : (
//                             <MessageCircle size={14} />
//                           )}
//                         </button>

//                         <button
//                           onClick={() => handleDelete(q.id)}
//                           title="Delete"
//                           className="p-2 text-[#9A8F82] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           MODAL: Create / Edit Quotation
//       ══════════════════════════════════════════════════ */}
//       {isModalOpen && (
//         <div 
//           className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setIsModalOpen(false);
//           }}
//         >
//           <div 
//             className="relative w-full max-w-4xl my-8 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* ── Fixed Header ── */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FCFBF9] flex-shrink-0 sticky top-0 z-10">
//               <div>
//                 <h2 className="text-[18px] font-bold text-[#1C1C1C]">
//                   {editingId ? "Edit Quotation" : "New Quotation"}
//                 </h2>
//                 <p className="text-[12px] text-[#9A8F82] mt-0.5">
//                   {editingId ? "Update quotation details" : "Create new estimate for client"}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-[#EDE8DF] rounded-full text-[#9A8F82] transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* ── Scrollable Content ── */}
//             <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
//               <div className="px-6 py-6 space-y-6">
                
//                 {/* Client & Project Selection */}
//                 <div className="space-y-4">
//                   <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">
//                     Client & Project
//                   </h3>

//                   {/* Client Dropdown */}
//                   <div>
//                     <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-2">
//                       Client *
//                     </label>
//                     <div className="relative">
//                       <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none z-10" />
//                       <select
//                         required
//                         value={selectedClientId}
//                         onChange={(e) => handleClientChange(e.target.value)}
//                         className="w-full pl-10 pr-10 py-3 border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] appearance-none cursor-pointer"
//                       >
//                         <option value="">Select client...</option>
//                         {clients.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.full_name}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* Client Details Card */}
//                   {selectedClient && (
//                     <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
//                       <div>
//                         <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Phone</p>
//                         <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5">{selectedClient.phone || "—"}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Email</p>
//                         <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5 truncate">{selectedClient.email || "—"}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-[#9A8F82] uppercase">GSTIN</p>
//                         <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5">{selectedClient.gstin || "Not registered"}</p>
//                       </div>
//                       <div className="col-span-3">
//                         <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Billing Address</p>
//                         <p className="text-[12px] text-[#1C1C1C] mt-0.5">{selectedClient.billing_address}</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Project Dropdown */}
//                   <div>
//                     <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-2">
//                       Project *
//                     </label>
//                     <div className="relative">
//                       <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none z-10" />
//                       <select
//                         required
//                         value={selectedProjectId}
//                         onChange={(e) => setSelectedProjectId(e.target.value)}
//                         disabled={!selectedClientId}
//                         className="w-full pl-10 pr-10 py-3 border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <option value="">
//                           {selectedClientId ? "Select project..." : "Select client first"}
//                         </option>
//                         {selectedClientProjects.map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.name} ({p.property_type})
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Line Items */}
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">
//                       Line Items
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addItem}
//                       className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C8922A] hover:text-[#B07A20] transition-colors"
//                     >
//                       <Plus size={14} /> Add Item
//                     </button>
//                   </div>

//                   {items.map((item, idx) => (
//                     <div key={idx} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF] space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-[11px] font-bold text-[#9A8F82] uppercase">Item {idx + 1}</span>
//                         {items.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(idx)}
//                             className="text-[#9A8F82] hover:text-red-500 transition-colors"
//                           >
//                             <X size={14} />
//                           </button>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="col-span-2">
//                           <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">
//                             Description *
//                           </label>
//                           <input
//                             required
//                             value={item.description}
//                             onChange={(e) => updateItem(idx, "description", e.target.value)}
//                             placeholder="e.g. Modular Kitchen"
//                             className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Category</label>
//                           <input
//                             value={item.category}
//                             onChange={(e) => updateItem(idx, "category", e.target.value)}
//                             placeholder="Furniture"
//                             className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Unit</label>
//                           <select
//                             value={item.unit}
//                             onChange={(e) => updateItem(idx, "unit", e.target.value)}
//                             className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white cursor-pointer"
//                           >
//                             {["lot", "sqft", "nos", "rft", "per_space", "piece", "kg", "meter"].map((u) => (
//                               <option key={u} value={u}>{u}</option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Quantity *</label>
//                           <input
//                             required
//                             type="number"
//                             min="0.01"
//                             step="0.01"
//                             value={item.quantity}
//                             onChange={(e) => updateItem(idx, "quantity", e.target.value)}
//                             className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Rate (₹) *</label>
//                           <input
//                             required
//                             type="number"
//                             min="0"
//                             step="0.01"
//                             value={item.rate}
//                             onChange={(e) => updateItem(idx, "rate", e.target.value)}
//                             className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white"
//                           />
//                         </div>
//                         <div className="col-span-2 flex justify-end">
//                           <span className="text-[13px] font-bold text-[#1C1C1C]">
//                             Amount: {fmt(itemAmount(item))}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Discount & GST */}
//                 <div className="space-y-4">
//                   <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">
//                     Discount & GST
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Discount Type</label>
//                       <select
//                         value={formMeta.discount_type}
//                         onChange={(e) => setFormMeta({ ...formMeta, discount_type: e.target.value })}
//                         className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] cursor-pointer"
//                       >
//                         <option value="fixed">Fixed (₹)</option>
//                         <option value="percentage">Percentage (%)</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">
//                         Discount Value {formMeta.discount_type === "percentage" ? "(%)" : "(₹)"}
//                       </label>
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={formMeta.discount_value}
//                         onChange={(e) => setFormMeta({ ...formMeta, discount_value: e.target.value })}
//                         className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-4">
//                     {[
//                       ["cgst_rate", "CGST (%)"],
//                       ["sgst_rate", "SGST (%)"],
//                       ["igst_rate", "IGST (%)"],
//                     ].map(([key, label]) => (
//                       <div key={key}>
//                         <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">{label}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           max="28"
//                           step="0.01"
//                           value={formMeta[key as keyof typeof formMeta]}
//                           onChange={(e) => setFormMeta({ ...formMeta, [key]: e.target.value })}
//                           className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Live Totals */}
//                 <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EDE8DF] space-y-2">
//                   <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest mb-3">Live Summary</h3>
//                   {[
//                     ["Subtotal", fmt(totals.subtotal)],
//                     ["Discount", `-${fmt(totals.discountAmt)}`],
//                     ["Taxable Amount", fmt(totals.taxable)],
//                     ...(totals.cgst > 0 ? [["CGST", fmt(totals.cgst)]] : []),
//                     ...(totals.sgst > 0 ? [["SGST", fmt(totals.sgst)]] : []),
//                     ...(totals.igst > 0 ? [["IGST", fmt(totals.igst)]] : []),
//                   ].map(([label, val]) => (
//                     <div key={label} className="flex justify-between text-[13px]">
//                       <span className="text-[#6B6259]">{label}</span>
//                       <span className="text-[#1C1C1C] font-medium">{val}</span>
//                     </div>
//                   ))}
//                   <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[#EDE8DF] mt-2">
//                     <span>Grand Total</span>
//                     <span className="text-[#C8922A]">{fmt(totals.grand)}</span>
//                   </div>
//                 </div>

//                 {/* Other Details */}
//                 <div className="space-y-4">
//                   <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Other Details</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Valid Until</label>
//                       <input
//                         type="date"
//                         value={formMeta.valid_until}
//                         onChange={(e) => setFormMeta({ ...formMeta, valid_until: e.target.value })}
//                         className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Status</label>
//                       <select
//                         value={formMeta.status}
//                         onChange={(e) => setFormMeta({ ...formMeta, status: e.target.value })}
//                         className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] cursor-pointer"
//                       >
//                         <option value="draft">Draft</option>
//                         <option value="sent">Sent</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Notes</label>
//                     <textarea
//                       value={formMeta.notes}
//                       onChange={(e) => setFormMeta({ ...formMeta, notes: e.target.value })}
//                       rows={3}
//                       placeholder="Payment terms, conditions..."
//                       className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] resize-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>

//             {/* ── Fixed Footer ── */}
//             <div className="px-6 py-4 border-t border-[#EDE8DF] bg-[#FCFBF9] flex-shrink-0 sticky bottom-0">
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[14px]"
//               >
//                 {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
//                 {editingId ? "Update Quotation" : "Create Quotation"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Plus, Trash2, Loader2, Edit3, X,
  FileSpreadsheet, Printer, Mail, MessageCircle,
  CheckCircle, RotateCcw, Search, ChevronDown, User, Building2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  approveQuotation,
  reviseQuotation,
  downloadQuotationPdf,
  type Quotation,
  type QuotationItem,
} from "@/services/quotationService";

import { getAllClients, type Client } from "@/services/clientService";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Matches quotationService — "access" first (SimpleJWT default)
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  property_type: string;
  status: string;
}

interface ClientWithProjects extends Client {
  projects?: Project[];
}

// ─── Status config ─────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: "Approved", color: "#10B981", bg: "#ECFDF5" },
  sent: { label: "Sent", color: "#3B82F6", bg: "#EFF6FF" },
  draft: { label: "Draft", color: "#6B7280", bg: "#F3F4F6" },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
  superseded: { label: "Superseded", color: "#9CA3AF", bg: "#F9FAFB" },
};

const EMPTY_ITEM: QuotationItem = {
  description: "",
  category: "",
  quantity: "1",
  unit: "lot",
  rate: "",
  sort_order: 0,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const bg = { success: "#10B981", error: "#EF4444", info: "#C8922A" }[type];
  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-[13px] font-semibold"
      style={{ backgroundColor: bg }}
    >
      {message}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuotationsPage() {
  const router = useRouter();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [clients, setClients] = useState<ClientWithProjects[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientWithProjects | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([{ ...EMPTY_ITEM }]);
  const [formMeta, setFormMeta] = useState({
    valid_until: "",
    discount_type: "fixed",
    discount_value: "0",
    cgst_rate: "9",
    sgst_rate: "9",
    igst_rate: "0",
    notes: "",
    status: "draft",
  });

  const showToast = (message: string, type: "success" | "error" | "info") =>
    setToast({ message, type });

  // ── Auth check ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setAuthChecking(false);
  }, []);

  useEffect(() => {
    if (!authChecking) {
      fetchQuotations();
      fetchClients();
    }
  }, [authChecking]);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchQuotations = async () => {
    try {
      const data = await getAllQuotations();
      setQuotations(data);
    } catch (err: any) {
      if (err.message?.includes("401")) {
        ["access", "access_token", "token", "refresh"].forEach((k) => localStorage.removeItem(k));
        window.location.href = "/login";
      } else {
        showToast("Failed to load quotations", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const clientsData = await getAllClients();
      const clientsWithProjects = await Promise.all(
        clientsData.map(async (client) => {
          try {
            const res = await fetch(`${API_BASE}/clients/${client.id}/projects/`, {
              headers: getAuthHeaders(),
            });
            if (res.ok) {
              const d = await res.json();
              return { ...client, projects: d.results ?? d ?? [] };
            }
            return { ...client, projects: [] };
          } catch {
            return { ...client, projects: [] };
          }
        })
      );
      setClients(clientsWithProjects);
    } catch (err) {
      showToast("Failed to load clients", "error");
    }
  };

  // ── Navigate to client detail ─────────────────────────────────────────────────
  const handleRowClick = (q: Quotation) => {
    // quotation mein client_id field hota hai — direct navigate karo
    if (q.client_id) {
      router.push(`/dashboard/clients/${q.client_id}`);
    } else if (q.client) {
      router.push(`/dashboard/clients/${q.client}`);
    } else {
      // client_name se dhundho
      const matched = clients.find(
        (c) => c.full_name?.toLowerCase() === q.client_name?.toLowerCase()
      );
      if (matched) {
        router.push(`/dashboard/clients/${matched.id}`);
      } else {
        showToast("Client page not found", "error");
      }
    }
  };

  // ── Client select ─────────────────────────────────────────────────────────────
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedProjectId("");
    setSelectedClient(clients.find((c) => c.id === clientId) || null);
  };

  // ── Item helpers ──────────────────────────────────────────────────────────────
  const addItem = () =>
    setItems((prev) => [...prev, { ...EMPTY_ITEM, sort_order: prev.length }]);

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof QuotationItem, value: string) =>
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });

  const itemAmount = (item: QuotationItem): number => {
    const q = parseFloat(item.quantity || "0");
    const r = parseFloat(item.rate || "0");
    return isNaN(q) || isNaN(r) ? 0 : q * r;
  };

  // ── Live totals ───────────────────────────────────────────────────────────────
  const computeTotals = () => {
    const subtotal = items.reduce((s, it) => s + itemAmount(it), 0);
    const dv = parseFloat(formMeta.discount_value || "0") || 0;
    const discountAmt = formMeta.discount_type === "percentage" ? (subtotal * dv) / 100 : dv;
    const taxable = subtotal - discountAmt;
    const useIgst = parseFloat(formMeta.igst_rate) > 0;
    const cgst = useIgst ? 0 : (taxable * parseFloat(formMeta.cgst_rate || "0")) / 100;
    const sgst = useIgst ? 0 : (taxable * parseFloat(formMeta.sgst_rate || "0")) / 100;
    const igst = useIgst ? (taxable * parseFloat(formMeta.igst_rate || "0")) / 100 : 0;
    const totalTax = cgst + sgst + igst;
    return { subtotal, discountAmt, taxable, cgst, sgst, igst, totalTax, grand: taxable + totalTax };
  };

  const totals = computeTotals();
  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── Open create modal ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setSelectedClientId("");
    setSelectedClient(null);
    setSelectedProjectId("");
    setItems([{ ...EMPTY_ITEM }]);
    setFormMeta({ valid_until: "", discount_type: "fixed", discount_value: "0", cgst_rate: "9", sgst_rate: "9", igst_rate: "0", notes: "", status: "draft" });
    setIsModalOpen(true);
  };

  // ── Open edit modal ───────────────────────────────────────────────────────────
  const openEdit = async (id: string) => {
    try {
      const q = await getQuotationById(id);
      let matchedClient: ClientWithProjects | null = null;
      let matchedClientId = "";
      for (const c of clients) {
        if (c.projects?.some((p) => p.id === q.project)) {
          matchedClient = c;
          matchedClientId = c.id;
          break;
        }
      }
      setEditingId(id);
      setSelectedClientId(matchedClientId);
      setSelectedClient(matchedClient);
      setSelectedProjectId(q.project);
      setItems(
        q.items?.length
          ? q.items.map((it) => ({
              id: it.id,
              description: it.description,
              category: it.category || "",
              quantity: String(it.quantity),
              unit: it.unit || "lot",
              rate: String(it.rate),
              amount: String(it.amount),
              sort_order: it.sort_order || 0,
            }))
          : [{ ...EMPTY_ITEM }]
      );
      setFormMeta({
        valid_until: q.valid_until || "",
        discount_type: q.discount_type || "fixed",
        discount_value: String(q.discount_value || "0"),
        cgst_rate: String(q.cgst_rate || "9"),
        sgst_rate: String(q.sgst_rate || "9"),
        igst_rate: String(q.igst_rate || "0"),
        notes: q.notes || "",
        status: q.status || "draft",
      });
      setIsModalOpen(true);
    } catch {
      showToast("Failed to load quotation details", "error");
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) { showToast("Please select a project", "error"); return; }
    if (!items[0]?.description) { showToast("Add at least one line item", "error"); return; }
    setSubmitting(true);
    try {
      const payload = {
        project: selectedProjectId,
        ...formMeta,
        items: items.map((it, idx) => ({
          ...(it.id ? { id: it.id } : {}),
          description: it.description,
          category: it.category,
          quantity: it.quantity,
          unit: it.unit,
          rate: it.rate,
          sort_order: idx,
        })),
      };
      if (editingId) {
        await updateQuotation(editingId, payload);
        showToast("Quotation updated!", "success");
      } else {
        await createQuotation(payload);
        showToast("Quotation created!", "success");
      }
      setIsModalOpen(false);
      fetchQuotations();
    } catch (err: any) {
      showToast("Error: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quotation?")) return;
    try {
      await deleteQuotation(id);
      showToast("Deleted", "info");
      fetchQuotations();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // ── Approve ───────────────────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    setActionId(`approve_${id}`);
    try {
      await approveQuotation(id);
      showToast("Approved!", "success");
      fetchQuotations();
    } catch (err: any) {
      showToast(err.message || "Approval failed", "error");
    } finally {
      setActionId(null);
    }
  };

  // ── Revise ────────────────────────────────────────────────────────────────────
  const handleRevise = async (id: string) => {
    if (!confirm("Create a new version?")) return;
    setActionId(`revise_${id}`);
    try {
      await reviseQuotation(id);
      showToast("New version created!", "success");
      fetchQuotations();
    } catch {
      showToast("Revision failed", "error");
    } finally {
      setActionId(null);
    }
  };

  // ── PDF download (auth header ke saath) ───────────────────────────────────────
  // const handleDownloadPDF = async (id: string, qNum: string) => {
  //   setActionId(`pdf_${id}`);
  //   try {
  //     const res = await fetch(`${API_BASE}/quotations/${id}/pdf/`, {
  //       method: "GET",
  //       headers: {
  //         // Content-Type nahi dena PDF ke liye — sirf auth
  //         ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  //       },
  //     });

  //     if (res.status === 401) {
  //       ["access", "access_token", "token"].forEach((k) => localStorage.removeItem(k));
  //       window.location.href = "/login";
  //       return;
  //     }

  //     if (!res.ok) {
  //       const text = await res.text().catch(() => "");
  //       throw new Error(`PDF failed (${res.status}): ${text.slice(0, 100)}`);
  //     }

  //     const blob = await res.blob();
  //     if (blob.size === 0) throw new Error("Empty PDF received from server");

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `Quotation-${qNum}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     setTimeout(() => URL.revokeObjectURL(url), 1000);
  //     showToast("PDF downloaded!", "success");
  //   } catch (err: any) {
  //     console.error("PDF download error:", err);
  //     showToast(err.message || "PDF download failed", "error");
  //   } finally {
  //     setActionId(null);
  //   }
  // };

const handleDownloadPDF = async (id: string, qNum: string) => {
  setActionId(`pdf_${id}`);
  try {
    const blob = await downloadQuotationPdf(id);

    if (!blob || blob.size === 0) throw new Error("Empty PDF received from server");

    const safeName = (qNum || id).replace(/[^\w.-]+/g, "_");
    const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("PDF downloaded!", "success");
  } catch (err: any) {
    console.error("PDF download error:", err);
    showToast(err?.message || "PDF download failed", "error");
  } finally {
    setActionId(null);
  }
};

  // ── Excel / CSV ───────────────────────────────────────────────────────────────
  const handleDownloadExcel = (q: Quotation) => {
    const rows = [
      ["QUOTATION"],
      [],
      ["Quote Number", q.quote_number],
      ["Version", q.version],
      ["Client", q.client_name],
      ["Project", q.project_name],
      ["Status", q.status],
      ["Valid Until", q.valid_until || ""],
      [],
      ["LINE ITEMS"],
      ["#", "Description", "Category", "Qty", "Unit", "Rate (Rs)", "Amount (Rs)"],
      ...(q.items || []).map((it, i) => [i + 1, it.description, it.category, it.quantity, it.unit, it.rate, it.amount]),
      [],
      ["Subtotal", "", "", "", "", "", q.subtotal],
      ["Discount", "", "", "", "", "", q.discount_amount],
      ["Taxable Amount", "", "", "", "", "", q.taxable_amount],
      ...(parseFloat(q.cgst_amount || "0") > 0 ? [["CGST", "", "", "", "", "", q.cgst_amount]] : []),
      ...(parseFloat(q.sgst_amount || "0") > 0 ? [["SGST", "", "", "", "", "", q.sgst_amount]] : []),
      ...(parseFloat(q.igst_amount || "0") > 0 ? [["IGST", "", "", "", "", "", q.igst_amount]] : []),
      ["Grand Total", "", "", "", "", "", q.grand_total],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${q.quote_number}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("CSV downloaded!", "success");
  };

  // ── Email ─────────────────────────────────────────────────────────────────────
  const handleSendEmail = async (id: string) => {
    setActionId(`email_${id}`);
    try {
      const res = await fetch(`${API_BASE}/notifications/email/quotation/${id}/send/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      showToast(res.ok ? "Emailed to client!" : "Email failed", res.ok ? "success" : "error");
    } catch {
      showToast("Email failed", "error");
    } finally {
      setActionId(null);
    }
  };

  // ── WhatsApp ──────────────────────────────────────────────────────────────────
  const handleSendWhatsApp = async (id: string) => {
    setActionId(`wa_${id}`);
    try {
      const res = await fetch(`${API_BASE}/notifications/whatsapp/quotation/${id}/send/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      showToast(res.ok ? "WhatsApp sent!" : "WhatsApp failed", res.ok ? "success" : "error");
    } catch {
      showToast("WhatsApp failed", "error");
    } finally {
      setActionId(null);
    }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filtered = quotations.filter(
    (q) =>
      q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
      q.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      q.project_name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Auth loading ───────────────────────────────────────────────────────────────
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FCFBF9] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C8922A]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#FCFBF9]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C1C1C]">Quotations</h1>
          <p className="text-[13px] text-[#9A8F82] mt-0.5">
            Manage estimates, GST calculations & client approvals
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} /> New Quotation
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82]" />
        <input
          placeholder="Search quotations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#EDE8DF]">
              {["Quote", "Client & Project", "Grand Total", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[11px] font-bold text-[#9A8F82] uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F2ED]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="animate-spin inline text-[#C8922A]" size={24} />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-[#9A8F82] text-[14px]">
                  No quotations found.
                </td>
              </tr>
            ) : (
              filtered.map((q) => {
                const st = statusConfig[q.status] || statusConfig.draft;
                return (
                  <tr key={q.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Quote number — click se client page open */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRowClick(q)}
                        className="flex items-center gap-1.5 group"
                        title="Open client page"
                      >
                        <p className="text-[13px] font-bold text-[#C8922A] group-hover:underline">
                          {q.quote_number}
                        </p>
                        <ExternalLink size={11} className="text-[#9A8F82] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <p className="text-[11px] text-[#9A8F82]">v{q.version}</p>
                    </td>

                    {/* Client & Project — bhi clickable */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRowClick(q)}
                        className="text-left group"
                        title="Open client page"
                      >
                        <p className="text-[13px] font-semibold text-[#1C1C1C] group-hover:text-[#C8922A] transition-colors">
                          {q.client_name}
                        </p>
                        <p className="text-[12px] text-[#6B6259]">{q.project_name}</p>
                      </button>
                    </td>

                    <td className="px-6 py-4 font-bold text-[#1C1C1C] text-[14px]">
                      {fmt(parseFloat(q.grand_total || "0"))}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight"
                        style={{ color: st.color, backgroundColor: st.bg }}
                      >
                        {st.label}
                      </span>
                    </td>

                    {/* Actions — e.stopPropagation() taki row click na ho */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(q.id); }}
                          title="Edit"
                          className="p-2 text-[#9A8F82] hover:text-[#C8922A] hover:bg-[#FDF3E3] rounded-lg transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>

                        {["draft", "sent"].includes(q.status) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(q.id); }}
                            title="Approve"
                            disabled={actionId === `approve_${q.id}`}
                            className="p-2 text-[#9A8F82] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors disabled:opacity-50"
                          >
                            {actionId === `approve_${q.id}` ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                          </button>
                        )}

                        {["approved", "sent"].includes(q.status) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRevise(q.id); }}
                            title="Revise"
                            disabled={actionId === `revise_${q.id}`}
                            className="p-2 text-[#9A8F82] hover:text-[#C8922A] hover:bg-[#FDF3E3] rounded-lg transition-colors disabled:opacity-50"
                          >
                            {actionId === `revise_${q.id}` ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                          </button>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownloadPDF(q.id, q.quote_number); }}
                          title="Download PDF"
                          disabled={actionId === `pdf_${q.id}`}
                          className="p-2 text-[#9A8F82] hover:text-[#1C1C1C] hover:bg-[#F5F2ED] rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionId === `pdf_${q.id}` ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownloadExcel(q); }}
                          title="Download CSV"
                          className="p-2 text-[#9A8F82] hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors"
                        >
                          <FileSpreadsheet size={14} />
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleSendEmail(q.id); }}
                          title="Send Email"
                          disabled={actionId === `email_${q.id}`}
                          className="p-2 text-[#9A8F82] hover:text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionId === `email_${q.id}` ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleSendWhatsApp(q.id); }}
                          title="Send WhatsApp"
                          disabled={actionId === `wa_${q.id}`}
                          className="p-2 text-[#9A8F82] hover:text-[#25D366] hover:bg-[#ECFDF5] rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionId === `wa_${q.id}` ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                          title="Delete"
                          className="p-2 text-[#9A8F82] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal: Create / Edit ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div
            className="relative w-full max-w-4xl my-8 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FCFBF9] flex-shrink-0">
              <div>
                <h2 className="text-[18px] font-bold text-[#1C1C1C]">
                  {editingId ? "Edit Quotation" : "New Quotation"}
                </h2>
                <p className="text-[12px] text-[#9A8F82] mt-0.5">
                  {editingId ? "Update quotation details" : "Create new estimate for client"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[#EDE8DF] rounded-full text-[#9A8F82] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6">

                {/* Client & Project */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Client & Project</h3>

                  <div>
                    <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-2">Client *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none z-10" />
                      <select
                        required
                        value={selectedClientId}
                        onChange={(e) => handleClientChange(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] appearance-none cursor-pointer"
                      >
                        <option value="">Select client...</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.full_name}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" />
                    </div>
                  </div>

                  {selectedClient && (
                    <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
                      <div>
                        <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Phone</p>
                        <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5">{selectedClient.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Email</p>
                        <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5 truncate">{selectedClient.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#9A8F82] uppercase">GSTIN</p>
                        <p className="text-[12px] text-[#1C1C1C] font-medium mt-0.5">{selectedClient.gstin || "Not registered"}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-[10px] font-bold text-[#9A8F82] uppercase">Billing Address</p>
                        <p className="text-[12px] text-[#1C1C1C] mt-0.5">{selectedClient.billing_address}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-[#9A8F82] uppercase mb-2">Project *</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none z-10" />
                      <select
                        required
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        disabled={!selectedClientId}
                        className="w-full pl-10 pr-10 py-3 border border-[#EDE8DF] rounded-xl text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">{selectedClientId ? "Select project..." : "Select client first"}</option>
                        {(selectedClient?.projects || []).map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.property_type})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F82] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Line Items</h3>
                    <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C8922A] hover:text-[#B07A20] transition-colors">
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9A8F82] uppercase">Item {idx + 1}</span>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)} className="text-[#9A8F82] hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Description *</label>
                          <input required value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="e.g. Modular Kitchen" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Category</label>
                          <input value={item.category} onChange={(e) => updateItem(idx, "category", e.target.value)} placeholder="Furniture" className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Unit</label>
                          <select value={item.unit} onChange={(e) => updateItem(idx, "unit", e.target.value)} className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white cursor-pointer">
                            {["lot", "sqft", "nos", "rft", "per_space", "piece", "kg", "meter"].map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Quantity *</label>
                          <input required type="number" min="0.01" step="0.01" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Rate (Rs) *</label>
                          <input required type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(idx, "rate", e.target.value)} className="w-full border border-[#EDE8DF] rounded-lg p-2.5 text-[13px] outline-none focus:border-[#C8922A] bg-white" />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <span className="text-[13px] font-bold text-[#1C1C1C]">Amount: {fmt(itemAmount(item))}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount & GST */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Discount & GST</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Discount Type</label>
                      <select value={formMeta.discount_type} onChange={(e) => setFormMeta({ ...formMeta, discount_type: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] cursor-pointer">
                        <option value="fixed">Fixed (Rs)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Discount Value</label>
                      <input type="number" min="0" step="0.01" value={formMeta.discount_value} onChange={(e) => setFormMeta({ ...formMeta, discount_value: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {([["cgst_rate", "CGST (%)"], ["sgst_rate", "SGST (%)"], ["igst_rate", "IGST (%)"]] as const).map(([key, label]) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">{label}</label>
                        <input type="number" min="0" max="28" step="0.01" value={formMeta[key]} onChange={(e) => setFormMeta({ ...formMeta, [key]: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live totals */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EDE8DF] space-y-2">
                  <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest mb-3">Live Summary</h3>
                  {[
                    ["Subtotal", fmt(totals.subtotal)],
                    ["Discount", `-${fmt(totals.discountAmt)}`],
                    ["Taxable Amount", fmt(totals.taxable)],
                    ...(totals.cgst > 0 ? [["CGST", fmt(totals.cgst)]] : []),
                    ...(totals.sgst > 0 ? [["SGST", fmt(totals.sgst)]] : []),
                    ...(totals.igst > 0 ? [["IGST", fmt(totals.igst)]] : []),
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-[13px]">
                      <span className="text-[#6B6259]">{label}</span>
                      <span className="text-[#1C1C1C] font-medium">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[#EDE8DF] mt-2">
                    <span>Grand Total</span>
                    <span className="text-[#C8922A]">{fmt(totals.grand)}</span>
                  </div>
                </div>

                {/* Other details */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-[#9A8F82] uppercase tracking-widest">Other Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Valid Until</label>
                      <input type="date" value={formMeta.valid_until} onChange={(e) => setFormMeta({ ...formMeta, valid_until: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Status</label>
                      <select value={formMeta.status} onChange={(e) => setFormMeta({ ...formMeta, status: e.target.value })} className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] cursor-pointer">
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#9A8F82] uppercase mb-1.5">Notes</label>
                    <textarea value={formMeta.notes} onChange={(e) => setFormMeta({ ...formMeta, notes: e.target.value })} rows={3} placeholder="Payment terms, conditions..." className="w-full border border-[#EDE8DF] rounded-xl p-3 text-[13px] outline-none focus:border-[#C8922A] bg-[#FAF8F5] resize-none" />
                  </div>
                </div>

              </div>
            </form>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#EDE8DF] bg-[#FCFBF9] flex-shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#C8922A] hover:bg-[#B07A20] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[14px]"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                {editingId ? "Update Quotation" : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}