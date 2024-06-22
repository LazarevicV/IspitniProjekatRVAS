import { USER_KEY } from "@/lib/constants";
import { AdminPage } from "@/pages/admin/AdminPage";
import { PageSection } from "@/pages/components/PageSection";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");

    if (user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => (
    <PageSection>
      <AdminPage />
    </PageSection>
  ),
});
