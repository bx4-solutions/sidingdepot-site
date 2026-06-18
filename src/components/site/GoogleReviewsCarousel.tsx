import { Star, ArrowRight } from "lucide-react";
import { useGoogleStats, useGoogleReviews } from "@/lib/google-stats-context";

const GOOGLE_MAPS_REVIEWS_URL = "/#google-reviews";

const FALLBACK_GOOGLE_REVIEWS = [
  {
    author_name: "Nubia Stewart",
    rating: 5,
    text: "Excellent service and quality work. The team was professional and completed the job on time.",
    relative_time_description: "1 month ago",
  },
  {
    author_name: "Bruno Goulart",
    rating: 5,
    text: "Amazing experience from start to finish. Highly recommend Siding Depot for any siding project.",
    relative_time_description: "2 months ago",
  },
  {
    author_name: "Jackson Todd",
    rating: 5,
    text: "Great company to work with. They were on time, professional and did amazing work.",
    relative_time_description: "2 months ago",
  },
  {
    author_name: "Danny McMahon",
    rating: 5,
    text: "The crew was fantastic and the new siding looks beautiful. Best decision we made for our home.",
    relative_time_description: "3 months ago",
  },
  {
    author_name: "Cody Carlson",
    rating: 5,
    text: "Top notch service. The team was courteous, clean and did an incredible job on our home.",
    relative_time_description: "3 months ago",
  },
];

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  author_photo_url?: string;
};

function GoogleReviewCard({ review }: { review: GoogleReview }) {
  const truncated = review.text.length > 160 ? review.text.slice(0, 157) + "…" : review.text;
  return (
    <a
      href={GOOGLE_MAPS_REVIEWS_URL}
      className="flex flex-col gap-3 rounded-2xl p-5 shrink-0 w-[272px] sm:w-80 transition-transform hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {review.author_photo_url ? (
          <img
            src={review.author_photo_url}
            alt={review.author_name}
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
            style={{ background: "#B3D133" }}
          >
            {review.author_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{review.author_name}</p>
          <p className="text-white/40 text-xs">{review.relative_time_description}</p>
        </div>
        {/* Google "G" logo */}
        <svg className="h-5 w-5 ml-auto shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#f59e0b" }} />
        ))}
      </div>

      {/* Text */}
      <p className="text-white/70 text-sm leading-relaxed flex-1">"{truncated}"</p>
    </a>
  );
}

type Props = {
  reviews?: GoogleReview[];
  overallRating?: number;
  totalReviews?: number;
};

export function GoogleReviewsCarousel({
  reviews,
  overallRating: ratingProp,
  totalReviews: countProp,
}: Props) {
  const stats = useGoogleStats();
  const ctxReviews = useGoogleReviews();
  const overallRating = ratingProp ?? stats.rating;
  const totalReviews = countProp ?? stats.totalReviews;
  // Priority: explicit prop → global live reviews (root loader) → static fallback.
  const rawReviews =
    reviews && reviews.length > 0
      ? reviews
      : ctxReviews.length > 0
        ? ctxReviews
        : FALLBACK_GOOGLE_REVIEWS;
  // Duplicate the list to create seamless loop
  const allReviews = [...rawReviews, ...rawReviews];

  return (
    <section id="google-reviews" style={{ background: "#111827" }} className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
            >
              Verified Reviews
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {overallRating}★ · {totalReviews} Google Reviews.
              <br />
              <span style={{ color: "#B3D133" }}>Directly from Google My Business.</span>
            </h2>
          </div>

          {/* Review Platform Logos */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 shrink-0">
            {/* Google Logo & Link */}
            <a
              href="#google-reviews"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Google Reviews"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white text-xs font-bold">Google</span>
            </a>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* GuildQuality Logo & Link */}
            <a
              href="#guild-reviews"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="GuildQuality Reviews"
            >
              <svg viewBox="0 0 40 40" className="w-6 h-6 shrink-0">
                <circle cx="20" cy="20" r="18" fill="#f5a623" />
                <path d="M20 10l2.5 7.5h7.9l-6.4 4.7 2.5 7.5L20 25.2l-6.5 4.5 2.5-7.5-6.4-4.7h7.9z" fill="white" />
              </svg>
              <span className="text-white text-xs font-bold">GuildQuality</span>
            </a>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* Thumbtack Logo & Link */}
            <a
              href="#google-reviews"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Thumbtack Reviews"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.5-6.3 4.5 2.3-7.4-6-4.6h7.6z" fill="#009fd9" />
              </svg>
              <span className="text-white text-xs font-bold">Thumbtack</span>
            </a>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* Angi Leads Logo & Link */}
            <a
              href="#google-reviews"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Angi Leads Reviews"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4a5a" />
              </svg>
              <span className="text-white text-xs font-bold">Angi Leads</span>
            </a>
          </div>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-track gap-4 px-4">
          {allReviews.map((review, i) => (
            <GoogleReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
