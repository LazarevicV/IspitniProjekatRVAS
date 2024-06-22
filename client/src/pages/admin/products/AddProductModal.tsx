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
import { getCategories, createProduct } from "@/lib/queries";
import { CategoryType, ProductType } from "@/lib/types";

const AddProductModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [createdProduct, setCreatedProduct] = React.useState<ProductType>({
    id: "",
    title: "",
    price: 0,
    description: "",
    imageUrl: "",
    categoryId: 0,
  });

  const { mutateAsync } = useMutation({
    mutationFn: createProduct,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedProduct((prev) => ({ ...prev, title: e.target.value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedProduct((prev) => ({
      ...prev,
      price: parseFloat(e.target.value),
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setCreatedProduct((prev) => ({
      ...prev,
      categoryId: parseInt(categoryId),
    }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreatedProduct((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpdate = async () => {
    if (
      createdProduct.title === "" ||
      createdProduct.price <= 0 ||
      createdProduct.description === "" ||
      !file ||
      createdProduct.categoryId === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("Title", createdProduct.title);
    formData.append("Price", createdProduct.price.toString());
    formData.append("Description", createdProduct.description);
    formData.append("CategoryID", createdProduct.categoryId.toString());
    formData.append("ImageFile", file);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Add Product</h3>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-10">
              <Label>
                Title
                <Input
                  onChange={handleTitleChange}
                  type="text"
                  value={createdProduct.title}
                />
              </Label>
              <Label>
                Price
                <Input
                  onChange={handlePriceChange}
                  type="number"
                  step="0.01"
                  value={createdProduct.price}
                />
              </Label>
              <div className="flex items-center gap-10">
                Category
                <Select
                  onValueChange={handleCategoryChange}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Select category"} />
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
              <Label>
                Description
                <Textarea
                  value={createdProduct.description}
                  onChange={handleDescriptionChange}
                  className="h-[250px]"
                />
              </Label>
              <Label>
                Image
                <Input onChange={handleFileChange} type="file" />
              </Label>
              <Button onClick={handleUpdate}>Create</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { AddProductModal };
