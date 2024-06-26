// lib/queries.ts
import { api } from "@/services/api";
import {
  CategoryType,
  CreatingUser,
  ProductType,
  ReviewType,
  UpdatingUser,
  UserType,
} from "./types";

export const getCategories = async (): Promise<CategoryType[]> => {
  const res = await api({ endpoint: "Categories" });
  return res.data;
};

export const getProducts = async (): Promise<ProductType[]> => {
  const res = await api({ endpoint: "Products" });
  return res.data;
};

export const getProductsPaginated = async (
  page = 1,
  pageSize = 10
): Promise<{ products: ProductType[]; totalCount: number }> => {
  console.log("called");
  const res = await api({
    endpoint: "Products/pagination",
    config: {
      params: { page, pageSize },
    },
  });
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

export const getReviews = async (): Promise<ReviewType[]> => {
  const res = await api({ endpoint: "Reviews" });
  console.log("res.data", res.data);
  return res.data;
};

export const getUsers = async (): Promise<UserType[]> => {
  const res = await api({ endpoint: "Users" });
  return res.data;
};

export const getCurrentUser = async (): Promise<UserType | null> => {
  const userData = localStorage.getItem("USER");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const deleteReview = async (id: string) => {
  return await api({
    endpoint: `Reviews/${id}`,
    config: {
      method: "DELETE",
    },
  });
};

export const updateReview = async (review: ReviewType) => {
  return await api({
    endpoint: `Reviews/${review.id}`,
    config: {
      method: "PUT",
      data: review,
    },
  });
};

export const addReview = async (
  productId: string,
  content: string,
  grade: number,
  username: string
) => {
  return await api({
    endpoint: "Reviews",
    config: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        productId,
        content,
        grade,
        username,
      },
    },
  });
};

export const deleteUser = async (id: string) => {
  return await api({
    endpoint: `Users/${id}`,
    config: {
      method: "DELETE",
    },
  });
};

export const createUser = async (user: CreatingUser) => {
  return await api({
    endpoint: "Users",
    config: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: user,
    },
  });
};

export const updateUser = async (user: UpdatingUser) => {
  return await api({
    endpoint: `Users/${user.id}`,
    config: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: user,
    },
  });
};

export const searchProductsByName = async (
  name: string
): Promise<ProductType[]> => {
  const res = await api({
    endpoint: "Products/search",
    config: {
      params: { name },
    },
  });
  return res.data;
};

export const getProductsByCategory = async (
  categoryId: number
): Promise<ProductType[]> => {
  console.log("pozvan getProductsByCategory");
  const res = await api({
    endpoint: "Products/byCategory",
    config: {
      params: { categoryId },
    },
  });
  return res.data;
};
