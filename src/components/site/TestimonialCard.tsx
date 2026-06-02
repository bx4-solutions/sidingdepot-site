import { Star } from "lucide-react";

type Props = { name: string; city: string; text: string; rating?: number };

export function TestimonialCard({ name, city, text, rating = 5 }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="rounded-lg border border-border bg-background p-6 h-full flex flex-col">
      <div className="flex gap-0.5 text-sd-green">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-4 text-sm text-foreground leading-relaxed flex-1">
        “{text}”
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sd-green-pale text-sm font-bold text-sd-green-text">
          {initials}
        </span>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{city}, GA</div>
        </div>
      </div>
    </article>
  );
}
