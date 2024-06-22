import React from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/routes/__root";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateCategory } from "@/lib/queries";
import { CategoryType } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/constants";

const EditCategoryModal: React.FC<{
  open: boolean;
  category: CategoryType;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange, category }) => {
  const [updatedTitle, setUpdatedTitle] = React.useState<string>(
    category.title
  );

  const { mutateAsync } = useMutation({
    mutationFn: updateCategory,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  const handleUpdate = () => {
    if (updatedTitle.trim() === "") {
      toast.error("Title is required");
      return;
    }

    const updateData = { id: category.id, title: updatedTitle };

    const mutate = mutateAsync(updateData, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CATEGORIES],
        });
      },
      onSuccess: () => {
        onOpenChange(false);
      },
    });

    toast.promise(mutate, {
      loading: "Updating...",
      success: "Category updated",
      error: "Failed to update category",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Edit Category</h3>
          <DialogDescription>
            <span>Editing category: {category.title}</span>
            <div className="flex flex-col gap-4 mt-10">
              <Label>Title</Label>
              <Input
                onChange={handleTitleChange}
                type="text"
                value={updatedTitle}
              />
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { EditCategoryModal };
