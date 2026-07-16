import { createFileRoute } from "@tanstack/react-router";
import { CitySidingLP, cityLpHead } from "@/components/site/CitySidingLP";
import { CITY_LPS } from "@/data/city-lp-content";

export const Route = createFileRoute("/lp/canton-siding")({
  head: () => cityLpHead(CITY_LPS.canton),
  component: () => <CitySidingLP data={CITY_LPS.canton} />,
});
