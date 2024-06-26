import React, { useEffect, useState } from "react";
import {
  getProducts,
  getReviews,
  getUsers,
  getCurrentUser,
  deleteReview,
} from "@/lib/queries";
import { ProductType, ReviewType, UserType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { EditReviewModal } from "./components/EditReviewModal"; // Import your modal
import { toast } from "sonner";

const ReviewPage: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<UserType | null>(null); // State to store current user
  const [editReview, setEditReview] = useState<ReviewType | null>(null); // State to store review to edit

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, reviewsData, usersData] = await Promise.all([
          getProducts(),
          getReviews(),
          getUsers(),
        ]);
        setProducts(productsData);
        setReviews(reviewsData);
        setUsers(usersData);

        const currentUserData = await getCurrentUser();
        setCurrentUser(currentUserData);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, reviewsData, usersData] = await Promise.all([
          getProducts(),
          getReviews(),
          getUsers(),
        ]);
        setProducts(productsData);
        setReviews(reviewsData);
        setUsers(usersData);

        const currentUserData = await getCurrentUser();
        setCurrentUser(currentUserData);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (!editReview) {
      fetchData();
    }
  }, [editReview]);

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = event.target.value ? event.target.value : null;
    setSelectedProductId(productId);
    setCurrentPage(1); // Reset to first page when product filter changes
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Review deleted");
    } catch (error) {
      setError("Failed to delete review");
      toast.error("Failed to delete review");
    }
  };

  const handleEditReview = (review: ReviewType) => {
    setEditReview(review); // Open modal with selected review
  };

  const closeEditModal = () => {
    setEditReview(null); // Close modal
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredReviews = selectedProductId
    ? reviews.filter((review) => review.productId == selectedProductId)
    : reviews;

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const displayedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Reviews</h1>
      <div className="mb-4">
        <Label className="mr-5">Filter by Product</Label>
        <select
          onChange={handleProductChange}
          className="p-2 border rounded dark:bg-slate-900"
        >
          <option value="">All Products</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center gap-5 flex-wrap">
        {displayedReviews.length === 0 && <p>No reviews found</p>}
        {displayedReviews.map((review) => {
          const product = products.find(
            (product) => product.id == review.productId
          );
          const user = users.find((user) => user.id == review.userId);
          const isCurrentUser =
            currentUser && currentUser.username === user?.username;
          const isAdmin = currentUser && currentUser.role === "admin"; // Check if current user is admin

          return (
            <div key={review.id}>
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle className="text-center">
                    {product?.title}
                  </CardTitle>
                  <CardDescription className="flex justify-center align-middle">
                    <img
                      className="w-[150px] h-[150px] rounded"
                      src={product?.imageUrl}
                      alt=""
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="font-bold flex justify-center text-2xl">
                  {review.content}
                </CardContent>
                <div className="flex justify-center">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <span key={index} className="text-2xl text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <CardFooter className="flex justify-center">
                  <div>
                    Author - <b>{user?.username}</b>
                  </div>
                </CardFooter>
                {(isCurrentUser || isAdmin) && (
                  <div className="flex justify-center gap-2 mt-2 pb-2">
                    <Button onClick={() => handleEditReview(review)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-5 mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className=""
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? "" : "opacity-50"}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      {editReview && (
        <EditReviewModal
          open={Boolean(editReview)}
          review={editReview}
          onOpenChange={closeEditModal}
        />
      )}
    </div>
  );
};

export default ReviewPage;
