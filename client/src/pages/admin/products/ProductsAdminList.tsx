import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import {
  deleteProduct,
  getProductsPaginated,
  searchProductsByName,
  getCategories,
  getProductsByCategory,
} from "@/lib/queries";
import { cn } from "@/lib/utils";
import { queryClient } from "@/routes/__root";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductType, CategoryType } from "@/lib/types";
import { EditProductModal } from "./EditProductModal";
import { Button } from "@/components/ui/button";

const ProductsAdminList: React.FC<{ className?: string }> = ({ className }) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4); // Fixed page size
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, selectedCategory],
    queryFn: () => {
      if (selectedCategory) {
        return getProductsByCategory(selectedCategory, page, pageSize);
      }
      return getProductsPaginated(page, pageSize);
    },
    keepPreviousData: true,
    enabled: !isSearching,
  });

  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      toast.error("Please enter a search term.");
      return;
    }
    setIsSearching(true);
    const results = await searchProductsByName(searchTerm);
    if (results.length === 0) {
      toast.error("No products found.");
    }
    setSearchResults(results);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    setPage(1);
    setSelectedCategory(null); // Reset selected category
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isSearching]);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  const products = isSearching ? searchResults : data?.products ?? [];
  const totalCount = isSearching ? searchResults.length : data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex gap-2 mb-4">
        <select
          value={selectedCategory || ""}
          onChange={(e) => handleCategoryChange(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
          placeholder="Search products..."
        />
        <Button onClick={handleSearch} className="px-4 py-2">
          Search
        </Button>
        <Button onClick={handleReset} className="px-4 py-2">
          Reset
        </Button>
      </div>
      {products.length === 0 && <div>No products found</div>}
      {products.length !== 0 &&
        products.map((product) => (
          <CourseCard key={product.id} product={product} />
        ))}
      {!isSearching && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded ${
                    pageNum === page ? "" : "opacity-50"
                  }`}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ product }: { product: ProductType }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: deleteProduct,
  });

  const handleDeleteCourse = (id: string) => {
    const mutate = mutateAsync(id, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PRODUCTS],
        });
      },
    });

    toast.promise(mutate, {
      loading: "Deleting...",
      success: "Product deleted",
      error: "Failed to delete product",
    });
  };

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <Card key={product.id} className="flex justify-between">
        <CardHeader>
          <h3>{product.title}</h3>
        </CardHeader>
        <CardContent className="flex gap-2 mt-6">
          <Edit
            onClick={() => {
              setOpen(true);
            }}
            className="stroke-gray-500 cursor-pointer hover:stroke-gray-800"
          />
          <Trash
            className="stroke-red-500 cursor-pointer hover:stroke-red-800"
            onClick={() => {
              handleDeleteCourse(product.id);
            }}
          />
        </CardContent>
      </Card>
      <EditProductModal
        product={product}
        open={open}
        onOpenChange={handleOpen}
      />
    </>
  );
};

export { ProductsAdminList };
