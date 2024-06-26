import React, { useState, useEffect } from "react";
import { ProductType } from "@/lib/types";

import { addReview, getCurrentUser } from "@/lib/queries";
import { toast } from "sonner";
import { AddReviewModal } from "./AddReviewModal";
import { Button } from "@/components/ui/button";

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  const imageUrl = product.imageUrl || "default.png";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewGrade, setNewReviewGrade] = useState<number>(1); // Default grade
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(
    null
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserData = await getCurrentUser();
        setCurrentUser(currentUserData);
      } catch (error) {
        toast.error("Failed to fetch current user");
      }
    };

    fetchCurrentUser();
  }, []);

  const openModal = () => {
    if (!currentUser) {
      toast.error("You must be logged in to add a review");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReviewContent(e.target.value);
  };

  const handleGradeChange = (grade: number) => {
    setNewReviewGrade(grade);
  };

  const handleSubmit = async () => {
    if (newReviewContent.trim() === "") {
      toast.error("Review content cannot be empty");
      return;
    }

    try {
      if (!currentUser || !currentUser.username) {
        throw new Error("Current user data is missing or invalid");
      }

      await addReview(
        product.id,
        newReviewContent,
        newReviewGrade,
        currentUser.username
      );
      toast.success("Review added successfully");
      setNewReviewContent("");
      setNewReviewGrade(1); // Reset grade to default
      closeModal();
    } catch (error) {
      toast.error("Failed to add review");
    }
  };

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
            {product.price.toFixed(2)} RSD
          </p>
          <Button className="px-4 py-2 mt-2" onClick={openModal}>
            Add Review
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <AddReviewModal
          open={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          newReviewContent={newReviewContent}
          onContentChange={handleContentChange}
          newReviewGrade={newReviewGrade}
          onGradeChange={handleGradeChange}
        />
      )}
    </div>
  );
};

export { ProductCard };
