import { api } from "@/api/client";

export type TokenPair = { access: string; refresh: string };

// backend atual NÃO tem username e ainda não sabemos se tem "name"
export type Me = { id: string; email: string };

export async function loginApi(email: string, password: string) {
  const { data } = await api.post<TokenPair>("/auth/token/", { email, password });
  return data;
}

export async function meApi() {
  const { data } = await api.get<Me>("/auth/me/");
  return data;
}

export async function registerApi(email: string, password: string) {
  const { data } = await api.post<{ id: string; email: string }>(
    "/auth/register/",
    { email, password }
  );
  return data;
}