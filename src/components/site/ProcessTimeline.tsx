import { ClipboardCheck, FileText, Smartphone, Hammer, ShieldCheck } from "lucide-react";
import { PROCESS_STEPS } from "@/data/site";
import { useEffect, useRef, useState } from "react";

const ICONS = [ClipboardCheck, FileText, Smartphone, Hammer, ShieldCheck];

const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

export function ProcessTimeline({
  title = "It's Easy to Start Your Exterior Project",
}: {
  title?: string;
}) {
  return (
    <section className="py-20 lg:py-24 bg-white overflow-hidden">
      <style>{`
        @keyframes pt-fade-up   { from { opacity:0; transform:translateY(32px);  } to { opacity:1; transform:translateY(0);   } }
        @keyframes pt-fade-down { from { opacity:0; transform:translateY(-32px); } to { opacity:1; transform:translateY(0);   } }
        @keyframes pt-fade-left { from { opacity:0; transform:translateX(32px);  } to { opacity:1; transform:translateX(0);  } }
        @keyframes pt-dot-pop   { from { opacity:0; transform:scale(0);          } to { opacity:1; transform:scale(1);        } }
        .pt-step[data-visible="true"].pt-top  { animation: pt-fade-up   0.6s ease both; }
        .pt-step[data-visible="true"].pt-bot  { animation: pt-fade-down 0.6s ease both; }
        .pt-step[data-visible="true"].pt-mob  { animation: pt-fade-left 0.6s ease both; }
        .pt-dot[data-visible="true"]          { animation: pt-dot-pop   0.4s ease both; }
        .pt-step, .pt-dot { opacity: 0; }
      `}</style>
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            Our Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight font-bold">
            {title}
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Five simple steps. Complete transparency from consultation to completion. Through the
            Siding Depot customer portal, you'll have 24/7 access to project updates, progress
            photos, documents, schedules, and direct communication with your dedicated project
            manager.
          </p>
        </div>

        {/* Desktop zigzag (lg+) */}
        <div className="hidden lg:block relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[88px] bottom-[88px] w-0.5"
            style={{
              background: "linear-gradient(to bottom, #B3D133 0%, #D4EC5A 50%, #B3D133 100%)",
              opacity: 0.35,
            }}
          />
          {PROCESS_STEPS.map((step, i) => {
            const Icon = ICONS[i] || ShieldCheck;
            const isTop = i % 2 === 0;
            return (
              <PTStepZigzag
                key={step.num}
                step={step}
                Icon={Icon}
                isTop={isTop}
                delay={`${i * 0.11}s`}
                index={i}
                total={PROCESS_STEPS.length}
              />
            );
          })}
        </div>

        {/* Mobile / tablet stacked (< lg) */}
        <div className="lg:hidden flex flex-col gap-0">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = ICONS[i] || ShieldCheck;
            return (
              <PTStepMobile
                key={step.num}
                step={step}
                Icon={Icon}
                delay={`${i * 0.09}s`}
                index={i}
                total={PROCESS_STEPS.length}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PTStepZigzag({
  step,
  Icon,
  isTop,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS_STEPS)[number];
  Icon: React.ElementType;
  isTop: boolean;
  delay: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative" style={{ height: 220, marginTop: index === 0 ? 0 : -60 }}>
      <div
        data-visible={vis}
        className={`pt-step ${isTop ? "pt-top" : "pt-bot"} absolute w-[44%]`}
        style={{
          [isTop ? "right" : "left"]: "54%",
          ...(isTop ? { top: 0 } : { bottom: 0 }),
          animationDelay: delay,
        }}
      >
        <div
          className="rounded-2xl p-5 h-full"
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold shrink-0"
              style={{ background: "#B3D133", color: "#1e2a3a" }}
            >
              {step.num}
            </span>
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-sd-navy leading-snug mb-1.5">{step.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{step.desc}</p>
        </div>
      </div>
      <div
        data-visible={vis}
        className="pt-dot absolute left-1/2 -translate-x-1/2"
        style={{ top: isTop ? "auto" : 0, bottom: isTop ? 0 : "auto", animationDelay: delay }}
      >
        <div
          className="h-5 w-5 rounded-full border-4 border-white"
          style={{ background: "#B3D133", boxShadow: "0 0 0 3px rgba(179,209,51,0.25)" }}
        />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: "calc(44% + 10px)",
          height: 2,
          background: "rgba(179,209,51,0.3)",
          top: isTop ? "auto" : 10,
          bottom: isTop ? 10 : "auto",
          [isTop ? "right" : "left"]: "50%",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

function PTStepMobile({
  step,
  Icon,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS_STEPS)[number];
  Icon: React.ElementType;
  delay: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative pl-10 pb-10 last:pb-0">
      {/* vertical line connecting dots */}
      {index < total - 1 && (
        <div
          className="absolute left-[18px] top-9 bottom-0 w-0.5"
          style={{ background: "rgba(179,209,51,0.3)" }}
        />
      )}
      <div
        data-visible={vis}
        className="pt-dot absolute left-2 top-2"
        style={{ animationDelay: delay }}
      >
        <div
          className="h-5 w-5 rounded-full border-4 border-white"
          style={{ background: "#B3D133", boxShadow: "0 0 0 3px rgba(179,209,51,0.25)" }}
        />
      </div>
      <div
        data-visible={vis}
        className="pt-step pt-mob rounded-2xl p-5"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          animationDelay: delay,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-2xl font-bold" style={{ color: "#B3D133" }}>
            {step.num}
          </span>
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <h3 className="text-sm font-bold text-sd-navy leading-snug mb-1">{step.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}
