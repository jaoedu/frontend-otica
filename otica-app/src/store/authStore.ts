import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, meApi, registerApi, type Me } from "@/api/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  hydrated: boolean;

  me: Me | null;

  isAuthLoading: boolean;
  authError: string | null;

  // actions base
  setTokens: (access: string | null, refresh?: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;

  // actions auth
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loadMe: () => Promise<void>;
  clearError: () => void;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

function normalizeApiError(err: any): string {
  // tenta pegar erro do DRF: { detail: "..."} ou { field: ["..."] }
  const data = err?.response?.data;

  if (typeof data?.detail === "string") return data.detail;

  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const val = data[firstKey];
    if (Array.isArray(val) && typeof val[0] === "string") return val[0];
    if (typeof val === "string") return val;
  }

  if (typeof err?.message === "string") return err.message;
  return "Algo deu errado. Tente novamente.";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  isAuthenticated: false,
  hydrated: false,

  me: null,

  isAuthLoading: false,
  authError: null,

  clearError: () => set({ authError: null }),

  setTokens: async (access, refresh) => {
    // access
    if (access) await AsyncStorage.setItem(ACCESS_KEY, access);
    else await AsyncStorage.removeItem(ACCESS_KEY);

    // refresh (só atualiza se veio)
    if (typeof refresh !== "undefined") {
      if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
      else await AsyncStorage.removeItem(REFRESH_KEY);
    }

    set((s) => ({
      accessToken: access,
      refreshToken: typeof refresh !== "undefined" ? refresh : s.refreshToken,
      isAuthenticated: !!access,
    }));
  },

  hydrate: async () => {
    const access = await AsyncStorage.getItem(ACCESS_KEY);
    const refresh = await AsyncStorage.getItem(REFRESH_KEY);

    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: !!access,
      hydrated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem(ACCESS_KEY);
    await AsyncStorage.removeItem(REFRESH_KEY);

    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: true,
      me: null,
      authError: null,
    });
  },

  register: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      await registerApi(email, password);

      // opção A: só cadastra e volta pra login
      set({ isAuthLoading: false });
    } catch (err: any) {
      set({ isAuthLoading: false, authError: normalizeApiError(err) });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const tokens = await loginApi(email, password);
      await get().setTokens(tokens.access, tokens.refresh);

      // tenta carregar o /me depois do login
      try {
        await get().loadMe();
      } catch {
        // não mata o login se /me falhar
      }

      set({ isAuthLoading: false });
    } catch (err: any) {
      set({ isAuthLoading: false, authError: normalizeApiError(err) });
      throw err;
    }
  },

  loadMe: async () => {
    set({ authError: null });
    const me = await meApi();
    set({ me });
  },
}));