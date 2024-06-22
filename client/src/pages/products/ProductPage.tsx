import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/queries";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SelectCategory } from "./components/SelectCategory";
import { ProductList } from "./components/ProductList";
import { CategoryType, ProductType } from "@/lib/types";
import SearchProduct from "./components/SearchProduct";

const ProductPage: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  // Filter products based on selected category and search term
  const filteredProducts = products?.filter((product) => {
    // Check if the product matches the selected category filter
    const categoryMatch =
      selectedCategory === null ||
      selectedCategory === "all" ||
      categories?.find((cat) => cat.title === selectedCategory)?.id ===
        product.categoryId;

    // Check if the product matches the search term filter
    const searchMatch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className={cn("max-w-4xl mx-auto flex flex-col gap-4", className)}>
      <div className="flex justify-start gap-2">
        <SelectCategory
          categories={categories || []}
          onChange={handleCategorySelect}
        />
        <SearchProduct searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <ProductList products={filteredProducts || []} />
    </div>
  );
};

export { ProductPage };
