import { AddProductPage } from "@/pages/products/AddProductPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  component: () => <AddProductPage />,
});
