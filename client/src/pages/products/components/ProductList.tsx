import React from "react";
import { ProductType } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const ProductList: React.FC<{ products: ProductType[] }> = ({ products }) => {
  console.log(products);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="flex justify-center">
          <div className="w-full ">
            <ProductCard product={product} />
          </div>
        </div>
      ))}
    </div>
  );
};

export { ProductList };
