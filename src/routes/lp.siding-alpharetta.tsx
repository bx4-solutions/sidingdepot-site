import { createFileRoute } from "@tanstack/react-router";
import { AlpharettaSidingLP, alpharettaSidingLpHead } from "@/components/site/AlpharettaSidingLP";

export const Route = createFileRoute("/lp/siding-alpharetta")({
  head: () => alpharettaSidingLpHead(),
  component: AlpharettaSidingLP,
});
