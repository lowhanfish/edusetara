export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  errors?: Array<{ field?: string; message: string }>;
}

export const callAPI = async <T>(
  url: string,
  option: RequestInit = {}
): Promise<T> => {
  const { method, headers, ...otherOption } = option;
  const isFormData = typeof FormData !== "undefined" && otherOption.body instanceof FormData;
  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  try {
    const res = await fetch(url, {
      ...otherOption,
      method: method ?? "GET",
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...((headers as Record<string, string>) ?? {}),
      },
    });

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
  } catch (error) {
    throw error;
  }
};
