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

export const deleteProduct = async (id: string) => {
  return await api({
    endpoint: `Products/${id}`,
    config: {
      method: "DELETE",
    },
  });
};

export const createProduct = async (formData: FormData) => {
  return await api({
    endpoint: "Products",
    config: {
      method: "POST",
      headers: {
        // Note: Do not set 'Content-Type' header, let the browser set it to multipart/form-data
      },
      data: formData,
    },
  });
};

export const updateProduct = async (formData: FormData) => {
  const id = formData.get("ID");
  if (!id) {
    throw new Error("Product ID is required");
  }

  return await api({
    endpoint: `Products/${id}`,
    config: {
      method: "PUT",
      headers: {
        // Ensure correct Content-Type for FormData
        // 'Content-Type': 'multipart/form-data' is automatically set by the browser
      },
      data: formData,
    },
  });
};

export const deleteCategory = async (id: string) => {
  return await api({
    endpoint: `Categories/${id}`,
    config: {
      method: "DELETE",
    },
  });
};

export const createCategory = async (formData: FormData) => {
  return await api({
    endpoint: "Categories",
    config: {
      method: "POST",
      headers: {
        // Note: Do not set 'Content-Type' header, let the browser set it to multipart/form-data
      },
      data: formData,
    },
  });
};

// Update the updateCategory function to accept a single object parameter
export const updateCategory = async ({
  id,
  title,
}: {
  id: number;
  title: string;
}) => {
  return await api({
    endpoint: `Categories/${id}`,
    config: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: { title },
    },
  });
};
