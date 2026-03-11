import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi, meApi, type Me } from "@/api/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: Me | null;

  isAuthenticated: boolean;
  hydrated: boolean;
  isAuthLoading: boolean;
  authError: string | null;

  setTokens: (access: string | null, refresh?: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "authUser";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  isAuthenticated: false,
  hydrated: false,
  isAuthLoading: false,
  authError: null,

  clearAuthError: () => set({ authError: null }),

  setTokens: async (access, refresh) => {
    if (access) await AsyncStorage.setItem(ACCESS_KEY, access);
    else await AsyncStorage.removeItem(ACCESS_KEY);

    if (typeof refresh !== "undefined") {
      if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
      else await AsyncStorage.removeItem(REFRESH_KEY);
    }

    set((state) => ({
      accessToken: access,
      refreshToken: typeof refresh !== "undefined" ? refresh : state.refreshToken,
      isAuthenticated: !!access,
    }));
  },

  hydrate: async () => {
    const access = await AsyncStorage.getItem(ACCESS_KEY);
    const refresh = await AsyncStorage.getItem(REFRESH_KEY);
    const userStr = await AsyncStorage.getItem(USER_KEY);

    set({
      accessToken: access,
      refreshToken: refresh,
      user: userStr ? JSON.parse(userStr) : null,
      isAuthenticated: !!access,
      hydrated: true,
    });
  },

  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });

    try {
      const tokens = await loginApi(email, password);

      await get().setTokens(tokens.access, tokens.refresh);

      try {
        const user = await meApi();
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user });
      } catch {
        set({ user: null });
      }

      set({
        isAuthenticated: true,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Não foi possível entrar. Verifique suas credenciais.";

      set({
        isAuthLoading: false,
        authError: message,
        isAuthenticated: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ isAuthLoading: true, authError: null });

    try {
      await registerApi(name, email, password);

      set({
        isAuthLoading: false,
        authError: null,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Não foi possível criar a conta.";

      set({
        isAuthLoading: false,
        authError: message,
      });

      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(ACCESS_KEY);
    await AsyncStorage.removeItem(REFRESH_KEY);
    await AsyncStorage.removeItem(USER_KEY);

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hydrated: true,
      authError: null,
    });
  },
}));