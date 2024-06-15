export type ProductType = {
  id: number;
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
