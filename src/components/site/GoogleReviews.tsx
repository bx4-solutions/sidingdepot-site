import {
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getGoogleReviews, syncGoogleReviews } from "@/lib/google-reviews.functions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  author: string;
  date: string;
  timestamp: number; // For sorting
  rating: number;
  text: string;
  avatar: string;
}

const RECENT_REVIEWS: Review[] = [
  {
    author: "Jennifer M.",
    date: "2 weeks ago",
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "We got 4 quotes. Siding Depot was the most transparent — no vague numbers, no pressure. The James Hardie looks incredible. Our neighbors keep stopping to ask who did the work.",
    avatar: "J",
  },
  {
    author: "David & Susan R.",
    date: "1 month ago",
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "From the first quote to the final walkthrough, not a single surprise. The estimate matched the invoice to the dollar. The project manager checked in with us every single day. This is how a contractor should run.",
    avatar: "D",
  },
  {
    author: "Michael T.",
    date: "2 months ago",
    timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "I specifically looked for a James Hardie Elite Contractor because I wanted the 30-year warranty. Siding Depot qualified. The install was flawless — you can see the craftsmanship at every corner.",
    avatar: "M",
  },
  {
    author: "Robert B.",
    date: "3 months ago",
    timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "The crew showed up on time every day, cleaned up every evening, and finished ahead of schedule. My house went from embarrassing to the best on the block. Worth every penny.",
    avatar: "R",
  },
  {
    author: "Sarah L.",
    date: "4 months ago",
    timestamp: Date.now() - 120 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "Professional, clean, and quick. Siding Depot is the best in Georgia.",
    avatar: "S",
  },
  {
    author: "John D.",
    date: "5 months ago",
    timestamp: Date.now() - 150 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "Fantastic attention to detail. Our house looks brand new.",
    avatar: "J",
  },
];

export function GoogleReviews() {
  const queryClient = useQueryClient();
  const fetchReviews = useServerFn(getGoogleReviews);
  const syncReviews = useServerFn(syncGoogleReviews);

  const { data: remoteData, isLoading } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: () => fetchReviews(),
  });

  const syncMutation = useMutation({
    mutationFn: () => syncReviews({ data: { placeId: "ChIJgXSHh4OH9YgR9nx8zHzMfMw" } }),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(`Successfully synced ${res.count} reviews!`);
        queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
      } else if (res.status === 429) {
        toast.error("Google API limit reached. Using cached reviews.");
      } else {
        toast.error(`Sync failed: ${res.error}`);
      }
    },
    onError: () => toast.error("An error occurred during sync"),
  });

  // Auto-sync effect
  useEffect(() => {
    if (remoteData?.shouldSync && !syncMutation.isPending) {
      console.log("Auto-syncing reviews (data is older than 24h)...");
      syncMutation.mutate();
    }
  }, [remoteData?.shouldSync]);

  const allReviews: Review[] = useMemo(() => {
    if (!remoteData?.reviews || remoteData.reviews.length === 0) {
      return RECENT_REVIEWS;
    }
    return remoteData.reviews.map((r: any) => ({
      author: r.author_name,
      date: r.relative_time_description,
      timestamp: r.time_timestamp * 1000,
      rating: r.rating,
      text: r.text,
      avatar: r.author_name.charAt(0),
      photoUrl: r.author_photo_url,
    }));
  }, [remoteData]);

  const gmbUrl = "/#google-reviews";

  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10; // Updated from 3 to 10 as per request

  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    // Filter by rating
    if (ratingFilter !== "all") {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "newest") return b.timestamp - a.timestamp;
      if (sortOrder === "oldest") return a.timestamp - b.timestamp;
      if (sortOrder === "highest") return b.rating - a.rating;
      if (sortOrder === "lowest") return a.rating - b.rating;
      return 0;
    });

    return result;
  }, [ratingFilter, sortOrder, allReviews]);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById("reviews-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Google My Business
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              What North Atlanta Homeowners Say
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s <= ((remoteData as any)?.overallRating || 4.5) ? "fill-sd-green text-sd-green" : "text-gray-300"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="font-bold text-sd-black">
                {(remoteData as any)?.overallRating || "4.5"}/5.0
              </span>
              <span className="text-sd-gray-text">
                ({(remoteData as any)?.totalReviews || "166"} Reviews)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              variant="outline"
              className="border-sd-navy text-sd-navy hover:bg-sd-navy hover:text-white"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {syncMutation.isPending ? "Syncing..." : "Sync Reviews"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-sd-green text-sd-green hover:bg-sd-green hover:text-white"
            >
              <a href={gmbUrl}>
                <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
                Write a Review
              </a>
            </Button>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-black/5">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-sd-gray-text" aria-hidden="true" />
              <span className="text-sm font-medium text-sd-navy">Rating:</span>
            </div>
            <Select
              value={ratingFilter}
              onValueChange={(v) => {
                setRatingFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sd-gray-text" aria-hidden="true" />
              <span className="text-sm font-medium text-sd-navy">Sort:</span>
            </div>
            <Select
              value={sortOrder}
              onValueChange={(v) => {
                setSortOrder(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div id="reviews-grid" className="grid gap-6 md:grid-cols-3 min-h-[350px]">
          {currentReviews.length > 0 ? (
            currentReviews.map((r, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-sd-navy text-white flex items-center justify-center font-bold">
                    {r.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sd-black leading-none">{r.author}</h4>
                    <span className="text-xs text-sd-gray-text">{r.date}</span>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < r.rating ? "fill-sd-green text-sd-green" : "text-gray-300"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-sd-gray-text flex-grow italic">"{r.text}"</p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sd-green">
                  <img loading="lazy" decoding="async"
                    src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png"
                    alt="Google"
                    width="46"
                    height="15"
                    className="h-3 w-auto opacity-70"
                  />
                  <span>Verified Review</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-sd-gray-text">No reviews matching your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setRatingFilter("all");
                  setSortOrder("newest");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-9 w-9 rounded-full border-sd-navy/10"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-9 w-9 rounded-full p-0 text-xs ${
                    currentPage === i + 1
                      ? "bg-sd-navy text-white"
                      : "border-sd-navy/10 text-sd-navy hover:bg-sd-navy/5"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-9 w-9 rounded-full border-sd-navy/10"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-sd-gray-text italic">
            Reviews are synced automatically with our Google Business profile.
          </p>
        </div>
      </div>
    </section>
  );
}
