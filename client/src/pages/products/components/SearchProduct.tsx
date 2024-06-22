// components/SearchProduct.tsx

import React from "react";

type SearchProductProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchProduct: React.FC<SearchProductProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search products"
        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchProduct;
