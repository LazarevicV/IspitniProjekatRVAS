import React from "react";
import { ProductType } from "@/lib/types";
import "@/assets/custom.css";

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  const imageUrl = product.imageUrl || "default.png";
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center w-full">
      <img
        src={imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 w-full">
        <h2 className="text-lg font-bold dark:text-slate-800 text-center">
          {product.title}
        </h2>
        <p className="text-gray-600 italic text-center">
          {product.description}
        </p>
        <div className="mt-2 text-center">
          <p className="text-xl font-bold dark:text-slate-600">
            ${product.price.toFixed(2)}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
