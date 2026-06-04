import { createFileRoute } from "@tanstack/react-router";
import { SidingLP, lpHead } from "@/components/site/SidingLP";

export const Route = createFileRoute("/lp/siding-marietta")({
  head: () => lpHead({ city: "Greater Marietta", path: "/lp/siding-marietta" }),
  component: () => <SidingLP city="Greater Marietta" />,
});
