import { api } from "@/api/client";
import type { Address } from "@/api/auth";

export type CheckoutItem = { product_id: number; quantity: number };

export type CheckoutPayload = {
  items: CheckoutItem[];
  address_id: number;
  prescription_notes?: string;
  prescription_image_uri?: string | null;
};

export type Order = {
  id: number;
  created_at: string;
  status: string;
  total: string;
  address?: Omit<Address, "id" | "is_default" | "created_at" | "updated_at">;
  prescription_image_url: string | null;
  prescription_notes: string;
  items: {
    id: number;
    product: { id: number; name: string; image_url: string | null };
    quantity: number;
    unit_price: string;
    line_total: string;
  }[];
};

function createPrescriptionFile(uri: string) {
  const lower = uri.toLowerCase();
  const extension = lower.endsWith(".png") ? "png" : "jpg";
  const type = extension === "png" ? "image/png" : "image/jpeg";

  return {
    uri,
    name: `receita.${extension}`,
    type,
  } as any;
}

export async function checkout(payload: CheckoutPayload) {
  if (payload.prescription_image_uri) {
    const form = new FormData();
    form.append("items", JSON.stringify(payload.items));
    form.append("address_id", String(payload.address_id));
    form.append("prescription_notes", payload.prescription_notes ?? "");
    form.append(
      "prescription_image",
      createPrescriptionFile(payload.prescription_image_uri)
    );

    const res = await api.post<Order>("/orders/checkout/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await api.post<Order>("/orders/checkout/", {
    items: payload.items,
    address_id: payload.address_id,
    prescription_notes: payload.prescription_notes ?? "",
  });
  return res.data;
}

export async function listOrders() {
  const res = await api.get<Order[]>("/orders/orders/");
  return res.data;
}
