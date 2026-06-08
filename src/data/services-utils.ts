import { SERVICES } from "./site";

export function getServiceMeta(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
