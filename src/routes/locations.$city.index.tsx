import { createFileRoute, notFound } from "@tanstack/react-router";
import { CityHub, cityHubHead } from "@/components/site/CityHub";
import { isHubCity } from "@/data/locations";

export const Route = createFileRoute("/locations/$city/")({
  loader: ({ params }) => {
    if (!isHubCity(params.city)) {
      throw notFound();
    }
    return { slug: params.city };
  },
  head: ({ loaderData }) => (loaderData ? cityHubHead(loaderData.slug) : {}),
  component: CityHubPage,
});

function CityHubPage() {
  const { slug } = Route.useLoaderData();
  return <CityHub slug={slug} />;
}
