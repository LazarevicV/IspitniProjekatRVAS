import { createFileRoute } from "@tanstack/react-router";
import { PageSection } from "@/pages/components/PageSection";
import { ProductPage } from "@/pages/index/ProductPage";

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
