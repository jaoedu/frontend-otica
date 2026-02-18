import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { STORAGE_KEYS } from "@/utils/storage";

// Quando o backend existir, você vai trocar o mock por chamadas reais.
// (Vou deixar o "modo mock" controlado por uma flag.)
const USE_MOCK_AUTH = true;

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  // sessão
  isHydrating: boolean;
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  // UX
  isAuthLoading: boolean;
  authError: string | null;

  // actions
  hydrate: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUser: (user: User | null) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;

  // mantém seu mock (útil para testar fluxo)
  loginMock: (email: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isHydrating: true,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  isAuthLoading: false,
  authError: null,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken, userStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.accessToken),
        AsyncStorage.getItem(STORAGE_KEYS.refreshToken),
        AsyncStorage.getItem(STORAGE_KEYS.user),
      ]);

      const user = userStr ? (JSON.parse(userStr) as User) : null;

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken,
        isHydrating: false,
      });
    } catch {
      set({ isHydrating: false });
    }
  },

  setTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);

    set({
      accessToken,
      refreshToken: refreshToken ?? get().refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: async (user) => {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.user);
    }
    set({ user });
  },

  // ✅ LOGIN “pronto pro backend”
  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      if (USE_MOCK_AUTH) {
        await get().loginMock(email);
        set({ isAuthLoading: false });
        return;
      }

      // Quando o backend existir:
      // 1) chamar /auth/token/
      // 2) salvar access/refresh
      // 3) chamar /auth/me/ e salvar user
      // Exemplo (vamos implementar quando criar o Django):
      //
      // const tokens = await loginApi(email, password);
      // await get().setTokens(tokens.access, tokens.refresh);
      // const me = await meApi();
      // await get().setUser(me);

      set({ isAuthLoading: false });
    } catch {
      set({
        isAuthLoading: false,
        authError: "Não foi possível entrar. Verifique email e senha.",
      });
      throw new Error("LOGIN_FAILED");
    }
  },

  // ✅ REGISTER “pronto pro backend”
  register: async (name, email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      if (USE_MOCK_AUTH) {
        // Em mock, podemos simplesmente "criar" e logar direto:
        await get().loginMock(email);
        set({ isAuthLoading: false });
        return;
      }

      // Quando o backend existir:
      // await registerApi(name, email, password);
      // (opcional) logar após cadastrar:
      // await get().login(email, password);

      set({ isAuthLoading: false });
    } catch {
      set({
        isAuthLoading: false,
        authError: "Não foi possível cadastrar. Tente novamente.",
      });
      throw new Error("REGISTER_FAILED");
    }
  },

  loginMock: async (email) => {
    const fakeAccess = "mock_access_token";
    const fakeRefresh = "mock_refresh_token";
    const user: User = { id: "1", name: "Mota", email };

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.accessToken, fakeAccess),
      AsyncStorage.setItem(STORAGE_KEYS.refreshToken, fakeRefresh),
      AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user)),
    ]);

    set({
      accessToken: fakeAccess,
      refreshToken: fakeRefresh,
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.accessToken),
      AsyncStorage.removeItem(STORAGE_KEYS.refreshToken),
      AsyncStorage.removeItem(STORAGE_KEYS.user),
    ]);

    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      authError: null,
      isAuthLoading: false,
    });
  },
}));
