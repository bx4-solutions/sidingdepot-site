import { useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { start: 17, end: 43 },
  { start: 60, end: 71 },
] as const;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function HeroVideoBg({
  videoId,
  fallbackImg,
  fallbackImgMobile,
}: {
  videoId: string;
  fallbackImg?: string;
  fallbackImgMobile?: string;
}) {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const segRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Default false → SSR and mobile render the static image only (no YouTube load).
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // Mobile: never load the YouTube iframe/API.
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Build the embed URL client-side so we can pass the correct origin.
    const params = new URLSearchParams({
      enablejsapi: "1",
      autoplay: "1",
      mute: "1",
      controls: "0",
      loop: "0",
      rel: "0",
      playsinline: "1",
      modestbranding: "1",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
      start: String(SEGMENTS[0].start),
      origin: window.location.origin,
    });
    iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

    const startMonitor = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime) return;
        const t = player.getCurrentTime();
        const seg = SEGMENTS[segRef.current];
        if (t >= seg.end || t < seg.start - 1) {
          segRef.current = (segRef.current + 1) % SEGMENTS.length;
          player.seekTo(SEGMENTS[segRef.current].start, true);
        }
      }, 200);
    };

    const attachPlayer = () => {
      // Attach to the EXISTING iframe so our cover CSS is preserved.
      playerRef.current = new window.YT.Player(iframe, {
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.setPlaybackQuality("hd1080");
            e.target.seekTo(SEGMENTS[0].start, true);
            e.target.playVideo();
            segRef.current = 0;
            startMonitor();
          },
          onStateChange: (e: any) => {
            // 1 = playing → keep forcing HD; 0 = ended → restart first segment
            if (e.data === 1) e.target.setPlaybackQuality("hd1080");
            if (e.data === 0) {
              segRef.current = 0;
              e.target.seekTo(SEGMENTS[0].start, true);
              e.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      attachPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        attachPlayer();
      };
      if (!document.querySelector("#yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId, isDesktop]);

  return (
    <>
      {fallbackImg && (
        <picture>
          {fallbackImgMobile && <source media="(max-width: 640px)" srcSet={fallbackImgMobile} />}
          <img
            src={fallbackImg}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            width="1920"
            height="1080"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: 0 }}
          />
        </picture>
      )}
      {isDesktop && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <iframe
            ref={iframeRef}
            title="Background video"
            allow="autoplay; encrypted-media"
            frameBorder={0}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "56.25vw", // 16:9 based on width
              minWidth: "177.78vh", // 16:9 based on height
              minHeight: "100%",
              transform: "translate(-50%, -50%) scale(1.08)",
              filter: "blur(3px) brightness(0.95)",
              pointerEvents: "none",
              border: "none",
            }}
          />
        </div>
      )}
    </>
  );
}
