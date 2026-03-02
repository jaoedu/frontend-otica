import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  hydrated: boolean;

  setTokens: (access: string | null, refresh?: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,

  isAuthenticated: false,
  hydrated: false,

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
    });
  },
}));