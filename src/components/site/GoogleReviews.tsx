import { Star, MessageSquare, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
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
    text: "Siding Depot did an amazing job on our home. The James Hardie siding looks incredible and the team was professional from start to finish.",
    avatar: "J",
  },
  {
    author: "David & Susan R.",
    date: "1 month ago",
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "From the first quote to final walkthrough they were professional. The estimate matched the final invoice — no surprises. Highly recommend!",
    avatar: "D",
  },
  {
    author: "Michael T.",
    date: "2 months ago",
    timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "Replaced our siding, gutters and trim. The whole project finished one day ahead of schedule and looks fantastic. Great communication.",
    avatar: "M",
  },
  {
    author: "Robert B.",
    date: "3 months ago",
    timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
    rating: 4,
    text: "Great experience with the siding install. Very communicative team.",
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
  const gmbUrl = "https://www.google.com/maps/place/Siding+Depot/@33.9856525,-84.4716183,17z/data=!4m8!3m7!1s0x88f5148386377777:0x7c7c7c7c7c7c7c7c!8m2!3d33.9856525!4d-84.4716183!9m1!1b1!16s%2Fg%2F11b6_v1_v1";

  return (
    <section className="py-20 lg:py-24 bg-sd-gray-bg">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Google My Business
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Recent Google Reviews
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-sd-green text-sd-green" />
                ))}
              </div>
              <span className="font-bold text-sd-black">4.9/5.0</span>
              <span className="text-sd-gray-text">(128+ Reviews)</span>
            </div>
          </div>
          <Button asChild variant="outline" className="border-sd-green text-sd-green hover:bg-sd-green hover:text-white">
            <a href={gmbUrl} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-4 w-4" />
              Write a Review
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {RECENT_REVIEWS.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col h-full">
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
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3 w-3 fill-sd-green text-sd-green" />
                ))}
              </div>
              <p className="text-sm text-sd-gray-text flex-grow italic">"{r.text}"</p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sd-green">
                <img 
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png" 
                  alt="Google" 
                  className="h-3 w-auto opacity-70"
                />
                <span>Verified Review</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-sd-gray-text">
            For real-time sync with Google My Business, we can integrate the Google Places API.
          </p>
        </div>
      </div>
    </section>
  );
}
