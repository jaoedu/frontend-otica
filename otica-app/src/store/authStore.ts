import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createAddressApi,
  deleteAddressApi,
  loginApi,
  meApi,
  registerApi,
  updateAddressApi,
  updateMeApi,
  type Address,
  type AddressPayload,
  type Me,
} from "@/api/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: Me | null;

  isAuthenticated: boolean;
  hydrated: boolean;
  isAuthLoading: boolean;
  authError: string | null;

  setTokens: (access: string | null, refresh?: string | null) => Promise<void>;
  setUser: (user: Me | null) => Promise<void>;
  hydrate: () => Promise<void>;
  refreshMe: () => Promise<Me | null>;
  updateProfile: (payload: Pick<Me, "name" | "phone">) => Promise<void>;
  createAddress: (payload: AddressPayload) => Promise<Address>;
  updateAddress: (id: number, payload: Partial<AddressPayload>) => Promise<Address>;
  deleteAddress: (id: number) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "authUser";

function normalizeApiError(error: any, fallback: string) {
  const data = error?.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const value = data[firstKey];
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (typeof value === "string") return value;
  }

  return fallback;
}

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

  setUser: async (user) => {
    if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    else await AsyncStorage.removeItem(USER_KEY);
    set({ user });
  },

  hydrate: async () => {
    const access = await AsyncStorage.getItem(ACCESS_KEY);
    const refresh = await AsyncStorage.getItem(REFRESH_KEY);
    const userStr = await AsyncStorage.getItem(USER_KEY);

    let user: Me | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        await AsyncStorage.removeItem(USER_KEY);
      }
    }

    set({
      accessToken: access,
      refreshToken: refresh,
      user,
      isAuthenticated: !!access,
      hydrated: true,
    });
  },

  refreshMe: async () => {
    try {
      const user = await meApi();
      await get().setUser(user);
      return user;
    } catch {
      return null;
    }
  },

  updateProfile: async (payload) => {
    const user = await updateMeApi(payload);
    await get().setUser(user);
  },

  createAddress: async (payload) => {
    const created = await createAddressApi(payload);
    await get().refreshMe();
    return created;
  },

  updateAddress: async (id, payload) => {
    const updated = await updateAddressApi(id, payload);
    await get().refreshMe();
    return updated;
  },

  deleteAddress: async (id) => {
    await deleteAddressApi(id);
    await get().refreshMe();
  },

  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });

    try {
      const tokens = await loginApi(email, password);
      await get().setTokens(tokens.access, tokens.refresh);
      await get().refreshMe();

      set({
        isAuthenticated: true,
        isAuthLoading: false,
        authError: null,
      });
    } catch (error: any) {
      set({
        isAuthLoading: false,
        authError: normalizeApiError(
          error,
          "Nao foi possivel entrar. Verifique suas credenciais."
        ),
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
      set({
        isAuthLoading: false,
        authError: normalizeApiError(error, "Nao foi possivel criar a conta."),
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
