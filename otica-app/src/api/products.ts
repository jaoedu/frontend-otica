import { api } from "./client";

export type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;       // vem como string do DRF geralmente
  sale_price: string;  // idem
  final_price: string;
  is_on_sale: boolean;
  image_url: string | null;
  stock: number;
};

export type ProductDetail = Product & {
  gallery: { id: number; image_url: string }[];
  attributes: { id: number; name: string; value: string }[];
};

export async function listProducts() {
  const res = await api.get<Product[]>("/products/products/");
  return res.data;
}

export async function getProduct(id: number) {
  const res = await api.get<ProductDetail>(`/products/products/${id}/`);
  return res.data;
}

export async function listCategories() {
  const res = await api.get("/products/categories/");
  return res.data;
}