export type ProductType = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
};

export type CategoryType = {
  id: number;
  title: string;
};

export interface ReviewType {
  id: string;
  content: string;
  rating: number;
  productId: string;
  userId: string;
}

export interface UserType {
  id: string;
  username: string;
  role: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface CreatingUser {
  username: string;
  password: string;
  role: string;
}

export interface UpdatingUser {
  id: string;
  username: string;
  password: string;
  role: string;
}
