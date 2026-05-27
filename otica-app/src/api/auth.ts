import { api } from "@/api/client";

export type TokenPair = { access: string; refresh: string };

export type Address = {
  id: number;
  label: string;
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AddressPayload = Omit<Address, "id" | "created_at" | "updated_at">;

export type Me = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
};

export async function loginApi(email: string, password: string) {
  const { data } = await api.post<TokenPair>("/auth/token/", { email, password });
  return data;
}

export async function meApi() {
  const { data } = await api.get<Me>("/auth/me/");
  return data;
}

export async function updateMeApi(payload: Pick<Me, "name" | "phone">) {
  const { data } = await api.patch<Me>("/auth/me/", payload);
  return data;
}

export async function registerApi(name: string, email: string, password: string) {
  const { data } = await api.post<Me>("/auth/register/", {
    name,
    email,
    password,
  });
  return data;
}

export async function createAddressApi(payload: AddressPayload) {
  const { data } = await api.post<Address>("/auth/addresses/", payload);
  return data;
}

export async function updateAddressApi(
  id: number,
  payload: Partial<AddressPayload>
) {
  const { data } = await api.patch<Address>(`/auth/addresses/${id}/`, payload);
  return data;
}

export async function deleteAddressApi(id: number) {
  await api.delete(`/auth/addresses/${id}/`);
}
