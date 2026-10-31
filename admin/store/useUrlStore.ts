import { create } from "zustand";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface URLProps {
  APP: string;
  LOGIN: string;
  REGISTER: string;
  REFRESH: string;
  LOGOUT: string;
  LOGOUT_ALL: string;
  ME: string;
}

export interface UseUrlStoreProps {
  URL: URLProps;
}

export const useUrlStore = create<UseUrlStoreProps>(() => ({
  URL: {
    APP: baseUrl,
    LOGIN: `${baseUrl}/api/v1/auth/login`,
    REGISTER: `${baseUrl}/api/v1/auth/register`,
    REFRESH: `${baseUrl}/api/v1/auth/refresh`,
    LOGOUT: `${baseUrl}/api/v1/auth/logout`,
    LOGOUT_ALL: `${baseUrl}/api/v1/auth/logout-all`,
    ME: `${baseUrl}/api/v1/auth/me`,
  },
}));
