import React, { useState } from "react";
import { ProductType } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import "@/assets/custom.css";

const ProductList: React.FC<{ products: ProductType[] }> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
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
      <div className={productGridClassName}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { ProductList };
