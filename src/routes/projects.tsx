import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Play, MapPin, Filter, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────
type Project = {
  id: string;
  title: string;
  city: string;
  service: string;
  mux_playback_id: string | null;
  youtube_id: string | null;
  thumbnail_url: string;
  featured: boolean;
  sort_order: number;
  media_type?: "video" | "slideshow" | "before_after" | null;
  gallery_images?: string[] | null;
  before_after?: { before: string; after: string }[] | null;
  description?: string | null;
};

// ── Static fallback videos (YouTube) ─────────────────────────────────────────
const STATIC_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Before & After Siding Transformation #1 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "Tnjj45TAc2k",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/Tnjj45TAc2k/maxresdefault.jpg",
    featured: true,
    sort_order: 1,
  },
  {
    id: "2",
    title: "Before & After Siding Transformation #2 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "2TFxqOOVhg4",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/2TFxqOOVhg4/maxresdefault.jpg",
    featured: false,
    sort_order: 2,
  },
  {
    id: "3",
    title: "Before & After Siding Transformation #3 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "Wb3zPV83_dg",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/Wb3zPV83_dg/maxresdefault.jpg",
    featured: false,
    sort_order: 3,
  },
  {
    id: "4",
    title: "Before & After Siding Transformation #4 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "Zf61N2WWkJ4",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/Zf61N2WWkJ4/maxresdefault.jpg",
    featured: false,
    sort_order: 4,
  },
  {
    id: "5",
    title: "Before & After Siding Transformation #5 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "OlWZlwOlQqI",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/OlWZlwOlQqI/maxresdefault.jpg",
    featured: false,
    sort_order: 5,
  },
  {
    id: "6",
    title: "Before & After Siding Transformation #6 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "_lk2t_5ZZBs",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/_lk2t_5ZZBs/maxresdefault.jpg",
    featured: false,
    sort_order: 6,
  },
  {
    id: "7",
    title: "Before & After Siding Transformation #7 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "v4Pf_1rNLDs",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/v4Pf_1rNLDs/maxresdefault.jpg",
    featured: false,
    sort_order: 7,
  },
  {
    id: "8",
    title: "Before & After Siding Transformation #8 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "q1t0HoeP3lY",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/q1t0HoeP3lY/maxresdefault.jpg",
    featured: false,
    sort_order: 8,
  },
  {
    id: "9",
    title: "Before & After Siding Transformation #9 — Marietta",
    city: "Marietta",
    service: "siding",
    youtube_id: "43lgIP_ZJqU",
    mux_playback_id: null,
    thumbnail_url: "https://img.youtube.com/vi/43lgIP_ZJqU/maxresdefault.jpg",
    featured: false,
    sort_order: 9,
  },
];

// ── Server function to load projects ─────────────────────────────────────────
const loadProjects = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,title,city,service,mux_playback_id,youtube_id,thumbnail_url,media_type,gallery_images,before_after,description,featured,sort_order",
      )
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return STATIC_PROJECTS;
    }

    // Garantir que qualquer ocorrência vinda do banco de dados seja sanitizada para "Marietta"
    const sanitizedData = data.map((p) => ({
      ...p,
      title: p.title.replace(/Greater Marietta/g, "Marietta"),
      city: p.city.replace(/Greater Marietta/g, "Marietta"),
    }));

    return sanitizedData as Project[];
  } catch {
    return STATIC_PROJECTS;
  }
});

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/projects")({
  loader: () => loadProjects(),
  head: () => ({
    meta: [
      {
        title: "Before & After Projects | Siding Depot — Marietta, GA",
      },
      {
        name: "description",
        content:
          "See real before-and-after transformations by Siding Depot across Marietta, Alpharetta, Canton and North Atlanta. Siding, painting, windows and more.",
      },
      {
        property: "og:title",
        content: "Before & After Projects | Siding Depot",
      },
      {
        property: "og:description",
        content:
          "Real before-and-after home transformations in Marietta & North Atlanta by Siding Depot.",
      },
      {
        property: "og:image",
        content: "https://www.sidingdepot.com/og-default.webp",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.sidingdepot.com/projects" }],
  }),
  component: ProjectsPage,
});

// ── Service filter labels ──────────────────────────────────────────────────────
const SERVICE_LABELS: Record<string, string> = {
  all: "All Projects",
  siding: "Siding",
  painting: "Painting",
  windows: "Windows",
  roofing: "Roofing",
  gutters: "Gutters",
  decks: "Decks",
  doors: "Doors",
};

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onPlay }: { project: Project; onPlay: (p: Project) => void }) {
  const isVideo =
    !!(project.youtube_id || project.mux_playback_id) || project.media_type === "video";
  const firstImage = project.gallery_images?.[0] || project.before_after?.[0]?.before || null;
  const thumb =
    project.thumbnail_url ||
    firstImage ||
    (project.youtube_id
      ? `https://img.youtube.com/vi/${project.youtube_id}/maxresdefault.jpg`
      : `https://www.sidingdepot.com/og-default.webp`);
  const OverlayIcon = isVideo ? Play : Images;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#B3D133]/60 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.04)" }}
      onClick={() => onPlay(project)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumb}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            style={{ background: "#B3D133" }}
          >
            <OverlayIcon className="h-6 w-6" style={{ color: "#1a2332" }} />
          </div>
        </div>
        {/* Featured badge */}
        {project.featured && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "#B3D133", color: "#1a2332" }}
          >
            Featured
          </span>
        )}
        {/* Service tag */}
        <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
          {SERVICE_LABELS[project.service] ?? project.service}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {project.title}
        </p>
        <p className="mt-1 flex items-center gap-1 text-white/45 text-xs">
          <MapPin className="h-3 w-3" />
          {project.city}
        </p>
      </div>
    </div>
  );
}

// ── Media modal (video · slideshow · before/after) ─────────────────────────────
function MediaModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const isVideo = !!(project.youtube_id || project.mux_playback_id);
  const pairs = project.before_after ?? [];
  const isBeforeAfter = !isVideo && project.media_type === "before_after" && pairs.length > 0;
  const slides =
    !isVideo && !isBeforeAfter
      ? project.gallery_images && project.gallery_images.length > 0
        ? project.gallery_images
        : project.thumbnail_url
          ? [project.thumbnail_url]
          : []
      : [];
  const count = isBeforeAfter ? pairs.length : slides.length;
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i > 0 ? i - 1 : count - 1));
  const next = () => setIdx((i) => (i < count - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 text-white/60 hover:text-white text-sm transition-colors"
        >
          ✕ Fechar
        </button>

        {isVideo ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
            {project.youtube_id ? (
              <iframe
                src={`https://www.youtube.com/embed/${project.youtube_id}?autoplay=1&rel=0&controls=1&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <mux-player
                stream-type="on-demand"
                playback-id={project.mux_playback_id!}
                metadata-video-title={project.title}
                autoplay
                style={{ width: "100%", height: "100%" } as React.CSSProperties}
              />
            )}
          </div>
        ) : isBeforeAfter ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-2xl overflow-hidden bg-black shadow-2xl">
            <div className="relative">
              <img loading="lazy" decoding="async"
                src={pairs[idx].before}
                alt="Before"
                className="w-full h-[45vh] sm:h-[65vh] object-contain bg-black"
              />
              <span className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[11px] font-bold uppercase tracking-wide">
                Before
              </span>
            </div>
            <div className="relative">
              <img loading="lazy" decoding="async"
                src={pairs[idx].after}
                alt="After"
                className="w-full h-[45vh] sm:h-[65vh] object-contain bg-black"
              />
              <span
                className="absolute top-2 left-2 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide"
                style={{ background: "#B3D133", color: "#1a2332" }}
              >
                After
              </span>
            </div>
          </div>
        ) : slides.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img loading="lazy" decoding="async"
              src={slides[idx]}
              alt={`${project.title} — ${idx + 1}`}
              className="w-full h-[70vh] object-contain bg-black"
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-black flex items-center justify-center text-white/40 shadow-2xl">
            Sem mídia neste projeto.
          </div>
        )}

        {!isVideo && count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <p className="mt-3 text-white/60 text-sm text-center">
          {project.title} · {project.city}
          {!isVideo && count > 1 ? ` · ${idx + 1}/${count}` : ""}
        </p>
        {project.description && (
          <p className="mt-1 text-white/40 text-xs text-center max-w-2xl mx-auto">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
        <Play className="h-7 w-7 text-white/20" />
      </div>
      <p className="text-white/40 text-sm mb-6">Vídeos sendo enviados — volte em breve.</p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-opacity hover:opacity-90"
        style={{ background: "#B3D133", color: "#1a2332" }}
      >
        Schedule Free Quote
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function ProjectsPage() {
  const projects = Route.useLoaderData();
  const [activeFilter, setActiveFilter] = useState("all");
  const [playing, setPlaying] = useState<Project | null>(null);

  const availableServices = Array.from(new Set(projects.map((p) => p.service)));
  const filters = ["all", ...availableServices];

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.service === activeFilter);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-sd-navy pt-24 pb-12 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(179,209,51,0.15)",
              border: "1px solid #B3D133",
              color: "#B3D133",
            }}
          >
            <Play className="h-3 w-3" /> Real Projects · Real Results
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Before &amp; After <span style={{ color: "#B3D133" }}>Transformations</span>
          </h1>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
            Every video is a real North Atlanta home. See the difference Siding Depot makes — from
            curb appeal to structural protection.
          </p>
        </div>
      </section>

      {/* ── Filters ── */}
      {filters.length > 1 && (
        <div className="bg-sd-navy border-b border-white/10 sticky top-0 z-30">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2 overflow-x-auto">
            <Filter className="h-3.5 w-3.5 text-white/30 shrink-0" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                style={
                  activeFilter === f
                    ? { background: "#B3D133", color: "#1a2332" }
                    : {
                        background: "rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.55)",
                      }
                }
              >
                {SERVICE_LABELS[f] ?? f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <section className="bg-sd-navy min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((p) => <ProjectCard key={p.id} project={p} onPlay={setPlaying} />)
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center border-t border-white/10 pt-12">
            <p className="text-white/50 text-sm mb-4">Ready to transform your home?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-opacity hover:opacity-90"
              style={{ background: "#B3D133", color: "#1a2332" }}
            >
              Schedule Your Free Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {playing && (
        <MediaModal key={playing.id} project={playing} onClose={() => setPlaying(null)} />
      )}
    </>
  );
}

// JSX namespace for mux-player web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mux-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "stream-type"?: string;
          "playback-id"?: string;
          "metadata-video-title"?: string;
          autoplay?: boolean | string;
        },
        HTMLElement
      >;
    }
  }
}
