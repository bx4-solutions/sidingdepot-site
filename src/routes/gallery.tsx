import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  beforeLoad: () => {
    // 301 permanente: /gallery foi consolidada em /projects (preserva SEO).
    throw redirect({ to: "/projects", statusCode: 301 });
  },
});
