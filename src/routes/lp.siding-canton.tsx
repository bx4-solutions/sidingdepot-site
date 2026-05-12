import { createFileRoute } from "@tanstack/react-router";
import { SidingLP, lpHead } from "@/components/site/SidingLP";

export const Route = createFileRoute("/lp/siding-canton")({
  head: () => lpHead({ city: "Canton", path: "/lp/siding-canton" }),
  component: () => <SidingLP city="Canton" />,
});
