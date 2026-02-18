import { api } from "@/api/client";

export type TokenPair = { access: string; refresh: string };
export type Me = { id: string; name: string; email: string };

export async function loginApi(email: string, password: string) {
  // quando backend existir, você ajusta pra username/email conforme sua API
  const { data } = await api.post<TokenPair>("/auth/token/", { email, password });
  return data;
}

export async function meApi() {
  const { data } = await api.get<Me>("/auth/me/");
  return data;
}

export async function registerApi(name: string, email: string, password: string) {
  const { data } = await api.post<{ ok: true }>("/auth/register/", { name, email, password });
  return data;
}
