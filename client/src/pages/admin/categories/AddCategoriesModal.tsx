import React from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/lib/queries";
import { QUERY_KEYS } from "@/lib/constants";
import { queryClient } from "@/routes/__root";

const AddCategoriesModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [categoryTitle, setCategoryTitle] = React.useState("");

  const { mutateAsync } = useMutation({
    mutationFn: createCategory,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryTitle(e.target.value);
  };

  const handleCreateCategory = async () => {
    if (categoryTitle === "") {
      toast.error("Title is required");
      return;
    }

    try {
      await mutateAsync({ title: categoryTitle });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success("Category created successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Add Category</h3>
          <div className="flex flex-col gap-4 mt-10">
            <Label>Title</Label>
            <Input
              onChange={handleTitleChange}
              type="text"
              value={categoryTitle}
            />
            <Button onClick={handleCreateCategory}>Create</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { AddCategoriesModal };
