import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/queries";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SelectCategory } from "./components/SelectCategory";
import { ProductList } from "./components/ProductList";
import { CategoryType, ProductType } from "@/lib/types";
import SearchProduct from "./components/SearchProduct";
import { Label } from "@/components/ui/label";

const ProductPage: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortCriteria, setSortCriteria] = useState<string>("");

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
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value);
  };

  // Filter products based on selected category and search term
  const filteredProducts = products?.filter((product) => {
    const categoryMatch =
      selectedCategory === null ||
      selectedCategory === "all" ||
      categories?.find((cat) => cat.title === selectedCategory)?.id ===
        product.categoryId;
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
        <div className="flex">
          <Label className="" htmlFor="sort">
            Sort by:
          </Label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="sort"
            value={sortCriteria}
            onChange={handleSortChange}
          >
            <option value="">Select</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      <ProductList
        products={filteredProducts || []}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        sortCriteria={sortCriteria}
      />
    </div>
  );
};

export { ProductPage };
