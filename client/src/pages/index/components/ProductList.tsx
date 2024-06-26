import React, { useState, useEffect } from "react";
import { ProductType } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import Pagination from "./PaginationComponent";

const ProductList: React.FC<{
  products: ProductType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  sortCriteria: string;
}> = ({ products, currentPage, onPageChange, sortCriteria }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort products based on criteria
  const sortProducts = (products: ProductType[], criteria: string) => {
    switch (criteria) {
      case "title-asc":
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return products.sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return products.sort((a, b) => a.price - b.price);
      case "price-desc":
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts([...products], sortCriteria);

  // Pagination logic
  const itemsPerPage = 3;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIdx, endIdx);

  const filteredProducts = paginatedProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productGridClassName =
    filteredProducts.length > 1
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      : "flex justify-center w-[280px]";

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="flex gap-4">{/* Use SearchProduct component */}</div>
      {filteredProducts.length === 0 && (
        <p className="text-center text-xl">No products found</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
      <div className={productGridClassName}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { ProductList };
