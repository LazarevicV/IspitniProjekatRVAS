import { LoginPage } from "@/pages/login/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => <LoginPage />,
});
