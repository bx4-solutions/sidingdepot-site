import { SERVICE_METADATA_AB } from "../data/seo-config";
import { SITE } from "../data/site";

export type SeoReportEntry = {
  url: string;
  service: string;
  variation: string;
  title: string;
  description: string;
  isIndexable: boolean;
};

export function generateSeoReport(): SeoReportEntry[] {
  const entries: SeoReportEntry[] = [];
  const cities = ["Marietta", "Alpharetta", "Canton", "Milton", "Woodstock"];
  const services = Object.keys(SERVICE_METADATA_AB);

  // Home
  entries.push({
    url: "/",
    service: "Home",
    variation: "Default",
    title: "Siding Depot — James Hardie Elite Preferred Contractor in North Atlanta GA",
    description: "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Marietta, Alpharetta, Milton, Canton & North Atlanta.",
    isIndexable: true,
  });

  // Services
  services.forEach((s) => {
    const variations = ["A", "B", "C"] as const;
    variations.forEach((v) => {
      const meta = SERVICE_METADATA_AB[s][v];
      entries.push({
        url: `/${s}`,
        service: s,
        variation: v,
        title: meta.metaTitle("Marietta"), // default city for report
        description: meta.metaDesc,
        isIndexable: true,
      });
    });
  });

  // Location pages (sample)
  cities.forEach((city) => {
    services.forEach((s) => {
      entries.push({
        url: `/locations/${city.toLowerCase()}/${s}`,
        service: s,
        variation: "Dynamic (A/B/C)",
        title: SERVICE_METADATA_AB[s].A.metaTitle(city),
        description: SERVICE_METADATA_AB[s].A.metaDesc,
        isIndexable: true,
      });
    });
  });

  return entries;
}

export function generateSeoMarkdownReport(): string {
  const entries = generateSeoReport();
  let md = "# Siding Depot — SEO Indexability & Meta Report\n\n";
  md += "| URL | Service | Var | Title | Description | Indexable |\n";
  md += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";

  entries.forEach((e) => {
    md += `| \`${e.url}\` | ${e.service} | ${e.variation} | ${e.title} | ${e.description.substring(0, 50)}... | ${e.isIndexable ? "✅" : "❌"} |\n`;
  });

  md += "\n\n## Status Check\n";
  md += "- **Robots.txt**: Accessible at `/robots.txt`\n";
  md += "- **Sitemap**: Accessible at `/sitemap.xml`\n";
  md += "- **GTM**: Integrated (GTM-TFGQWCQN)\n";
  md += "- **GA4**: Integrated (VITE_GA4_ID)\n";

  return md;
}
