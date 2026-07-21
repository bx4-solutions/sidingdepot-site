import { createFileRoute } from "@tanstack/react-router";
import { CitySidingLP, cityLpHead } from "@/components/site/CitySidingLP";
import { CITY_LPS } from "@/data/city-lp-content";

export const Route = createFileRoute("/lp/woodstock-siding")({
  head: () => cityLpHead(CITY_LPS.woodstock),
  component: () => <CitySidingLP data={CITY_LPS.woodstock} />,
});
