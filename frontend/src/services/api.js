// Thin fetch wrapper. In dev, Vite proxies /api to the backend (see vite.config.js).
// Set VITE_API_URL (e.g. http://localhost:4000/api) to bypass the proxy.
const BASE = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // 0 = could not reach the server
  }
}

export async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server", 0);
  }
  if (res.status === 204) return null;
  if (!res.headers.get("content-type")?.includes("application/json")) {
    throw new ApiError(
      "The API returned a page instead of JSON. Check the Vite proxy and backend.",
      res.status,
    );
  }
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      data?.error || `Request failed (${res.status})`,
      res.status,
    );
  return data;
}
