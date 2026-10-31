import { create } from "zustand";
import { ApiResponse } from "@/lib/api";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  role: string | null;
  nip: string | null;
  instansi_id: string | null;
  created_at?: string;
}

export interface AuthDataResponse {
  user: UserProfile;
  csrf_token?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  checkAuth: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const meUrl = useUrlStore.getState().URL.ME;
      const res = await fetchData<ApiResponse<AuthDataResponse>>(meUrl, {}, false);
      if (res.success && res.data?.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        return res.data.user;
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  logout: async () => {
    try {
      const logoutUrl = useUrlStore.getState().URL.LOGOUT;
      await fetchData(logoutUrl, { method: "POST" });
    } catch {
      // Tetap lanjutkan pembersihan sesi lokal jika server mengembalikan error
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
    }
  },
}));
