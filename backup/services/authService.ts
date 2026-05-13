// // ============================================================
// // 🔐 AUTH SERVICE
// // Login aur Register ke liye sare API calls yahan hain.
// // ============================================================

// import API_BASE_URL from "@/lib/config";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type LoginPayload = {
//   email: string;
//   password: string;
// };

// export type RegisterPayload = {
//   full_name: string;
//   email: string;
//   password: string;
//   role: string;
// };

// export type AuthTokens = {
//   access: string;
//   refresh: string;
// };

// // ─── POST: Login ──────────────────────────────────────────────────────────────

// export async function loginUser(payload: LoginPayload): Promise<AuthTokens> {
//   const response = await fetch(`${API_BASE_URL}/auth/login/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || "Invalid login credentials");
//   }

//   return data as AuthTokens;
// }

// // ─── POST: Register ───────────────────────────────────────────────────────────

// export async function registerUser(payload: RegisterPayload): Promise<void> {
//   const response = await fetch(`${API_BASE_URL}/auth/register/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.detail || "Registration failed");
//   }
// }

// // ─── Logout: Token clear karo ────────────────────────────────────────────────

// export function logoutUser(): void {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("access");
//     localStorage.removeItem("token");
//     localStorage.removeItem("refresh");
//     window.location.href = "/login";
//   }
// }


import API_BASE_URL from "@/lib/config";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  role: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {

  const response = await fetch(
    `${API_BASE_URL}/auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid login credentials"
    );
  }

  // SAVE TOKENS
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  // SAVE USER
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data;
}

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export async function registerUser(
  payload: RegisterPayload
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Register response:", response.status, data);

  if (!response.ok) {
    throw new Error(
      data.message || data.detail || JSON.stringify(data) || "Registration failed"
    );
  }
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────

export async function logoutUser(): Promise<void> {

  const refresh = localStorage.getItem("refresh");

  try {

    await fetch(
      `${API_BASE_URL}/auth/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({
          refresh,
        }),
      }
    );

  } catch (err) {
    console.error(err);
  }

  localStorage.clear();

  window.location.href = "/login";
}