// lib/queries.ts
import { api } from "@/services/api";
import { CategoryType, ProductType } from "./types";

export const getCategories = async (): Promise<CategoryType[]> => {
  const res = await api({ endpoint: "Categories" });
  return res.data;
};

export const getProducts = async (): Promise<ProductType[]> => {
  const res = await api({ endpoint: "Products" });
  return res.data;
};
