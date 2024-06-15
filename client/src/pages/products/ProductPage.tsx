import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/queries";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SelectCategory } from "./components/SelectCategory";
import { ProductList } from "./components/ProductList";
import { CategoryType, ProductType } from "@/lib/types";

const ProductPage: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );

  // Fetch categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<CategoryType[]>({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  // Fetch products
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<ProductType[]>({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: getProducts,
  });

  if (isLoadingCategories || isLoadingProducts) return <div>Loading...</div>;

  if (isErrorCategories || isErrorProducts) return <div>Error</div>;

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
  };

  // Filter products based on selected category or show all if none selected
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products?.filter((product) => {
          const category = categories?.find(
            (cat) => cat.title === selectedCategory
          );
          return category && product.categoryId === category.id;
        })
      : products;

  return (
    <div className={cn("max-w-4xl mx-auto flex flex-col gap-4", className)}>
      <SelectCategory
        categories={categories || []}
        onChange={handleCategorySelect}
      />
      <ProductList products={filteredProducts || []} />
    </div>
  );
};

export { ProductPage };
