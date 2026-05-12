import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Project, formatProjectDate } from "@/data/site";

type Props = {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export function ProjectModal({ project, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, hasPrev, hasNext, onPrev, onNext]);

  return (
    <Dialog open={Boolean(project)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-5xl p-0 overflow-hidden bg-sd-navy border-white/10"
        showCloseButton
      >
        {project && (
          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            {/* Image */}
            <div className="relative bg-sd-black aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
              <img
                src={project.src}
                alt={project.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Prev / Next */}
              {hasPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous project"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-sd-black/60 text-white hover:bg-sd-green hover:text-sd-black transition-colors flex items-center justify-center backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {hasNext && (
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next project"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-sd-black/60 text-white hover:bg-sd-green hover:text-sd-black transition-colors flex items-center justify-center backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Details */}
            <div className="p-6 lg:p-8 text-white flex flex-col">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-pill bg-sd-green px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sd-black"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl text-white leading-tight">
                {project.title ?? project.alt}
              </DialogTitle>

              <dl className="mt-5 grid gap-3 text-sm">
                {project.city && (
                  <div className="flex items-center gap-2.5 text-white/85">
                    <MapPin className="h-4 w-4 text-sd-green shrink-0" />
                    <span>{project.city}</span>
                  </div>
                )}
                {project.date && (
                  <div className="flex items-center gap-2.5 text-white/85">
                    <Calendar className="h-4 w-4 text-sd-green shrink-0" />
                    <span>{formatProjectDate(project.date)}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center gap-2.5 text-white/85">
                    <Tag className="h-4 w-4 text-sd-green shrink-0" />
                    <span>{project.category}</span>
                  </div>
                )}
              </dl>

              {project.description && (
                <DialogDescription className="mt-5 text-sm leading-relaxed text-white/70">
                  {project.description}
                </DialogDescription>
              )}

              <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-2.5">
                <Button asChild size="lg" className="flex-1">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    onClick={onClose}
                  >
                    View full project <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outlineWhite" className="flex-1">
                  <Link to="/contact" onClick={onClose}>
                    Get a similar quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
