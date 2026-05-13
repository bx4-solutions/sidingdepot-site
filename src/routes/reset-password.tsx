import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordForm,
});