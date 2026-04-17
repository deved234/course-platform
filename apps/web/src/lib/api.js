function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base || typeof base !== "string") {
    return null;
  }
  return base.replace(/\/$/, "");
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, token?: string | null, headers?: Record<string, string> }} [options]
 * @returns {Promise<{ data: unknown, error: string | null }>}
 */
export async function apiFetch(path, options = {}) {
  const base = getBaseUrl();
  if (!base) {
    return { data: null, error: "NEXT_PUBLIC_API_URL is not configured" };
  }

  const { method = "GET", body, token, headers: extraHeaders = {} } = options;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  /** @type {RequestInit} */
  const init = {
    method,
    headers: {
      ...extraHeaders,
    },
    cache: "no-store",
  };

  if (body !== undefined && body !== null && method !== "GET" && method !== "HEAD") {
    init.headers = {
      "Content-Type": "application/json",
      ...init.headers,
    };
    init.body = JSON.stringify(body);
  }

  if (token) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const res = await fetch(url, init);
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
      return {
        data: null,
        error: typeof json.message === "string" ? json.message : res.statusText || "Request failed",
      };
    }

    return { data: json.data !== undefined ? json.data : json, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { data: null, error: message };
  }
}
