import ReviewPage from "@/pages/reviews/ReviewPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reviews")({
  component: () => <ReviewPage />,
});
