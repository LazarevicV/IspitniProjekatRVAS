import React from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { QUERY_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/routes/__root";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, updateProduct } from "@/lib/queries";
import { CategoryType, ProductType } from "@/lib/types";

const EditProductModal: React.FC<{
  open: boolean;
  product: ProductType;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange, product }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [updatedProduct, setUpdatedProduct] =
    React.useState<ProductType>(product);

  const { mutateAsync } = useMutation({
    mutationFn: updateProduct,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProduct((prev) => ({ ...prev, title: e.target.value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      price: parseFloat(e.target.value),
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      categoryId: parseInt(categoryId),
    }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUpdatedProduct((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  const handleUpdate = () => {
    if (
      updatedProduct.title === "" ||
      updatedProduct.price <= 0 ||
      updatedProduct.description === "" ||
      updatedProduct.categoryId === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("ID", updatedProduct.id.toString());
    formData.append("Title", updatedProduct.title);
    formData.append("Price", updatedProduct.price.toString());
    formData.append("Description", updatedProduct.description);
    formData.append("CategoryID", updatedProduct.categoryId.toString());

    // Append ImageFile only if file is not null
    if (file) {
      formData.append("ImageFile", file);
    }

    const mutate = mutateAsync(formData, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PRODUCTS],
        });
      },
      onSuccess: () => {
        onOpenChange(false);
      },
    });

    toast.promise(mutate, {
      loading: "Updating...",
      success: "Product updated",
      error: "Failed to update product",
    });
  };

  const replaceCategoryId = categories?.find(
    (category) => category.id === updatedProduct.categoryId
  )?.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Edit Product</h3>
          <DialogDescription>
            <span>Editing product: {product.title}</span>
            <div className="flex flex-col gap-4 mt-10">
              <Label className="">Title</Label>
              <Input
                onChange={handleTitleChange}
                type="text"
                value={updatedProduct.title}
              />
              <Label>Price</Label>
              <Input
                onChange={handlePriceChange}
                type="number"
                step="0.01"
                value={updatedProduct.price}
              />
              <div className="flex items-center gap-10">
                Category
                <Select
                  onValueChange={handleCategoryChange}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={replaceCategoryId} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: CategoryType) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Label>Description</Label>
              <Textarea
                value={updatedProduct.description}
                onChange={handleDescriptionChange}
                className="h-[250px]"
              />
              {updatedProduct.imageUrl && (
                <div className="flex items-center justify-between">
                  Current image:{" "}
                  <img
                    className="max-h-[150px]"
                    src={updatedProduct.imageUrl}
                  />
                </div>
              )}
              <Label>Image</Label>
              <Input onChange={handleFileChange} type="file" />
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { EditProductModal };
