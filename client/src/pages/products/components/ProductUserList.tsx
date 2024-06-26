import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import { deleteProduct, getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { queryClient } from "@/routes/__root";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { ProductType } from "@/lib/types";
import { EditProductModalUser } from "./EditProductModalUser";

const ProductsUserList: React.FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: getProducts,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {data?.length === 0 && <div>No products found</div>}
      {data?.map((product) => (
        <CourseCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const CourseCard = ({ product }: { product: ProductType }) => {
  const [open, setOpen] = React.useState(false);

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
      <EditProductModalUser
        product={product}
        open={open}
        onOpenChange={handleOpen}
      />
    </>
  );
};
export { ProductsUserList };
