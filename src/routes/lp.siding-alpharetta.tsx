import { createFileRoute } from "@tanstack/react-router";
import { SidingLP, lpHead } from "@/components/site/SidingLP";

export const Route = createFileRoute("/lp/siding-alpharetta")({
  head: () => lpHead({ city: "Marietta e Região", path: "/lp/siding-alpharetta" }),
  component: () => <SidingLP city="Marietta e Região" />,
});