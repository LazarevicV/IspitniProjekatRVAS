import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import { deleteCategory, getCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { queryClient } from "@/routes/__root";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { CategoryType, ProductType } from "@/lib/types";
import { EditCategoryModal } from "./EditCategoryModal";
// import { EditProductModal } from "./EditProductModal";

const CategoriesAdminList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {data?.length === 0 && <div>No categories found</div>}
      {data?.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

const CategoryCard = ({ category }: { category: CategoryType }) => {
  const [open, setOpen] = React.useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: deleteCategory,
  });

  const handleDeleteCourse = (id: string) => {
    const mutate = mutateAsync(id, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CATEGORIES],
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
      <Card key={category.id} className="flex justify-between">
        <CardHeader>
          <h3>{category.title}</h3>
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
              handleDeleteCourse(category.id.toString());
            }}
          />
        </CardContent>
      </Card>
      <EditCategoryModal
        category={category}
        open={open}
        onOpenChange={handleOpen}
      />
    </>
  );
};
export { CategoriesAdminList };
