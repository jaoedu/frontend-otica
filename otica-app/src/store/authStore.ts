import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setToken: (t: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setToken: async (t) => {
    if (t) await AsyncStorage.setItem("token", t);
    else await AsyncStorage.removeItem("token");
    set({ token: t, isAuthenticated: !!t });
  },

  hydrate: async () => {
    const t = await AsyncStorage.getItem("token");
    set({ token: t, isAuthenticated: !!t, hydrated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));