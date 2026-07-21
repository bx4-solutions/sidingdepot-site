import { createFileRoute } from "@tanstack/react-router";
import { CitySidingLP, cityLpHead } from "@/components/site/CitySidingLP";
import { CITY_LPS } from "@/data/city-lp-content";

export const Route = createFileRoute("/lp/johns-creek-siding")({
  head: () => cityLpHead(CITY_LPS["johns-creek"]),
  component: () => <CitySidingLP data={CITY_LPS["johns-creek"]} />,
});
