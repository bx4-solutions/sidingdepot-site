import { createFileRoute } from "@tanstack/react-router";
import { AlpharettaServiceAreaPage } from "@/components/site/AlpharettaServiceAreaPage";
import { lpHead } from "@/components/site/SidingLP";

export const Route = createFileRoute("/lp/siding-alpharetta")({
  head: () => lpHead({ city: "Alpharetta", path: "/lp/siding-alpharetta" }),
  component: AlpharettaServiceAreaPage,
});
