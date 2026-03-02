import { api } from "./client";

export type CheckoutItem = { product_id: number; quantity: number };

export type Order = {
  id: number;
  created_at: string;
  status: string;
  total: string;
  items: {
    id: number;
    product: { id: number; name: string; image_url: string | null };
    quantity: number;
    unit_price: string;
    line_total: string;
  }[];
};

export async function checkout(items: CheckoutItem[]) {
  const res = await api.post<Order>("/orders/checkout/", { items });
  return res.data;
}

export async function listOrders() {
  const res = await api.get<Order[]>("/orders/orders/");
  return res.data;
}

export async function getOrder(id: number) {
  const res = await api.get<Order>(`/orders/orders/${id}/`);
  return res.data;
}