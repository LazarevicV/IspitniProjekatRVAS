import { createFileRoute } from "@tanstack/react-router";
import { PageSection } from "@/pages/components/PageSection";
import { ProductPage } from "@/pages/products/ProductPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <PageSection>
      <ProductPage />
    </PageSection>
  );
}
