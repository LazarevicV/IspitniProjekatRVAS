// components/EditReviewModal.tsx
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Assuming you have Textarea component
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateReview } from "@/lib/queries";
import { ReviewType } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/constants";
import { queryClient } from "@/routes/__root";

const EditReviewModal: React.FC<{
  open: boolean;
  review: ReviewType;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange, review }) => {
  const [updatedContent, setUpdatedContent] = useState<string>(review.content);

  const { mutateAsync } = useMutation({
    mutationFn: updateReview,
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedContent(e.target.value);
  };

  const handleUpdate = () => {
    if (updatedContent.trim() === "") {
      toast.error("Content is required");
      return;
    }

    const updateData = { ...review, content: updatedContent };

    const mutate = mutateAsync(updateData, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REVIEWS],
        });
      },
      onSuccess: () => {
        onOpenChange(false);
      },
    });

    toast.promise(mutate, {
      loading: "Updating...",
      success: "Review updated",
      error: "Failed to update review",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Edit Review</h3>
          <DialogDescription>
            <span>Editing review for: {review.productId}</span>
            <div className="flex flex-col gap-4 mt-10">
              <Label>Content</Label>
              <Textarea onChange={handleContentChange} value={updatedContent} />
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { EditReviewModal };
