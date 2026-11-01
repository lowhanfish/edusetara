import { useUrlStore } from "@/store/useUrlStore";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

let refreshPromise: Promise<void> | null = null;

export interface FetchOption extends Omit<RequestInit, "body"> {
  body?: any;
}

export const fetchData = async <T>(
  url: string,
  option: FetchOption = {},
  shouldRetry = true
): Promise<T> => {
  const { method, headers, ...otherOption } = option;
  const httpMethod = (method ?? "GET").toUpperCase();
  const isFormData = typeof FormData !== "undefined" && otherOption.body instanceof FormData;

  const headerObj: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...((headers as Record<string, string>) ?? {}),
  };

  // Attach CSRF token on mutation requests if cookie exists
  if (typeof window !== "undefined" && ["POST", "PUT", "PATCH", "DELETE"].includes(httpMethod)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken && !headerObj["X-CSRF-Token"]) {
      headerObj["X-CSRF-Token"] = csrfToken;
    }
  }

  const rawBody = otherOption.body;
  const processedBody =
    isFormData || typeof rawBody === "string" || rawBody == null
      ? rawBody
      : JSON.stringify(rawBody);

  const res = await fetch(url, {
    ...otherOption,
    body: processedBody,
    method: httpMethod,
    credentials: "include",
    headers: headerObj,
  });


  if (res.status === 401 && shouldRetry) {
    // Jangan jalankan refreshData jika request berasal dari halaman publik atau /login
    if (typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname === "/")) {
      throw new Error("Sesi belum terautentikasi.");
    }

    try {
      await refreshData();
      return fetchData<T>(url, option, false);
    } catch (refreshErr) {
      throw refreshErr;
    }
  }

  const data: any = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage =
      data?.message ||
      data?.detail ||
      (Array.isArray(data?.errors) && data.errors.length > 0 ? data.errors[0]?.message : null) ||
      `Terjadi kesalahan HTTP dengan status: ${res.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
};

const refreshData = async (): Promise<void> => {
  // Share a single refresh request across concurrent 401 triggers to prevent replay token conflicts
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshUrl = useUrlStore.getState().URL.REFRESH;
      const res = await fetch(refreshUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // Jika kredensial sudah tidak valid, larikan ke / (beranda)
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.replace("/");
        }
        throw new Error("Sesi login telah berakhir. Silakan masuk kembali.");
      }
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
