// // ============================================================
// // 📊 QUOTATION SERVICE
// // Sare Quotation-related API calls yahan hain.
// // ============================================================

// import API_BASE_URL from "@/lib/config";

// const QUOTATIONS_URL = `${API_BASE_URL}/quotations/`;

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type Quotation = {
//   id: string;
//   quote_number: string;
//   version: number;
//   client_name: string;
//   project_name: string;
//   grand_total: string;
//   status: string;
//   created_at?: string;
//   [key: string]: any;
// };

// // ─── Helper ───────────────────────────────────────────────────────────────────

// function getAuthHeaders(): HeadersInit {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// function handleUnauthorized(status: number) {
//   if (status === 401 && typeof window !== "undefined") {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   }
// }

// // ─── GET: Sare quotations lao ─────────────────────────────────────────────────

// export async function getAllQuotations(): Promise<Quotation[]> {
//   const response = await fetch(QUOTATIONS_URL, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   });
//   handleUnauthorized(response.status);
//   if (!response.ok) throw new Error(`Quotations fetch failed: ${response.status}`);
//   const data = await response.json();
//   return (data.results ?? data) as Quotation[];
// }

// // ─── GET: Single quotation lao ────────────────────────────────────────────────

// export async function getQuotationById(id: string): Promise<Quotation> {
//   const response = await fetch(`${QUOTATIONS_URL}${id}/`, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   });
//   handleUnauthorized(response.status);
//   if (!response.ok) throw new Error(`Quotation fetch failed: ${response.status}`);
//   return (await response.json()) as Quotation;
// }

// // ─── POST: Naya quotation banao ───────────────────────────────────────────────

// export async function createQuotation(data: Record<string, any>): Promise<Quotation> {
//   const response = await fetch(QUOTATIONS_URL, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   });
//   handleUnauthorized(response.status);
//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(JSON.stringify(err));
//   }
//   return (await response.json()) as Quotation;
// }

// // ─── PUT: Quotation update karo ───────────────────────────────────────────────

// export async function updateQuotation(id: string, data: Record<string, any>): Promise<Quotation> {
//   const response = await fetch(`${QUOTATIONS_URL}${id}/`, {
//     method: "PUT",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   });
//   handleUnauthorized(response.status);
//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(JSON.stringify(err));
//   }
//   return (await response.json()) as Quotation;
// }

// // ─── DELETE: Quotation delete karo ────────────────────────────────────────────

// export async function deleteQuotation(id: string): Promise<void> {
//   const response = await fetch(`${QUOTATIONS_URL}${id}/`, {
//     method: "DELETE",
//     headers: getAuthHeaders(),
//   });
//   handleUnauthorized(response.status);
//   if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
// }
// ============================================================
// 📊 QUOTATION SERVICE — Fixed token key + full API coverage
// ============================================================

import API_BASE_URL from "@/lib/config";

const QUOTATIONS_URL = `${API_BASE_URL}/quotations/`;

export type QuotationItem = {
  id?: string;
  description: string;
  category: string;
  quantity: string;
  unit: string;
  rate: string;
  amount?: string;
  sort_order: number;
};

export type Quotation = {
  id: string;
  quote_number: string;
  version: number;
  client_name: string;
  project_name: string;
  project: string;
  grand_total: string;
  subtotal: string;
  discount_type: string;
  discount_value: string;
  discount_amount: string;
  taxable_amount: string;
  cgst_rate: string; sgst_rate: string; igst_rate: string;
  cgst_amount: string; sgst_amount: string; igst_amount: string;
  total_tax: string;
  valid_until: string;
  notes: string;
  status: string;
  items: QuotationItem[];
  created_at?: string;
  [key: string]: any;
};

// Supports "access", "access_token", "token" key names
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access") || localStorage.getItem("access_token") || localStorage.getItem("token");
}

function getAuthHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = getToken();
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function handleUnauthorized(status: number) {
  if (status === 401 && typeof window !== "undefined") {
    ["access","access_token","token"].forEach(k => localStorage.removeItem(k));
    window.location.href = "/login";
  }
}

export async function getAllQuotations(): Promise<Quotation[]> {
  const res = await fetch(QUOTATIONS_URL, { headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? data) as Quotation[];
}

export async function getQuotationById(id: string): Promise<Quotation> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/`, { headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json() as Promise<Quotation>;
}

export async function createQuotation(data: Record<string, any>): Promise<Quotation> {
  const res = await fetch(QUOTATIONS_URL, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) });
  handleUnauthorized(res.status);
  if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
  return res.json() as Promise<Quotation>;
}

export async function updateQuotation(id: string, data: Record<string, any>): Promise<Quotation> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(data) });
  handleUnauthorized(res.status);
  if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
  return res.json() as Promise<Quotation>;
}

export async function deleteQuotation(id: string): Promise<void> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/`, { method: "DELETE", headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}

export async function approveQuotation(id: string): Promise<Quotation> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/approve/`, { method: "POST", headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) { const e = await res.json(); throw new Error(e.detail || "Approval failed"); }
  return res.json() as Promise<Quotation>;
}

export async function reviseQuotation(id: string): Promise<Quotation> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/revise/`, { method: "POST", headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) throw new Error("Revision failed");
  return res.json() as Promise<Quotation>;
}

export async function getQuotationVersions(id: string): Promise<Quotation[]> {
  const res = await fetch(`${QUOTATIONS_URL}${id}/versions/`, { headers: getAuthHeaders() });
  handleUnauthorized(res.status);
  if (!res.ok) throw new Error("Version fetch failed");
  const data = await res.json();
  return (data.results ?? data) as Quotation[];
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function downloadQuotationPdf(id: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/quotations/${id}/pdf/`, {
    method: "GET",
    headers: getAuthHeaders({ Accept: "application/pdf" }),
  });

  if (res.status === 401 && typeof window !== "undefined") {
    ["access", "access_token", "token", "refresh", "refresh_token"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`PDF failed (${res.status}): ${msg.slice(0, 200)}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("pdf")) {
    const msg = await safeText(res);
    throw new Error(`Not a PDF response. content-type=${ct}. Body=${msg.slice(0, 200)}`);
  }

  return res.blob();
}