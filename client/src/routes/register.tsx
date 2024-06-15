import { RegisterPage } from "@/pages/register/RegisterPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: () => <RegisterPage />,
});
