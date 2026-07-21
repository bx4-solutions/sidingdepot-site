import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, CircleDollarSign, Phone } from "lucide-react";
import { ReferralForm } from "@/components/site/ReferralForm";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { ORG_SCHEMA } from "@/lib/schema";

const PROCESS = [
  {
    number: "01",
    eyebrow: "YOU MAKE THE INTRODUCTION",
    title: "Tell us about your neighbor.",
    text: "You fill out a short form with your details and theirs. That gives you credit from the very beginning — no codes, no guessing, and no awkward follow-up.",
    detail: "About one minute. You stay in control.",
    image: "/referral/neighbors-referral.png",
    alt: "Two neighbors discussing a recommendation outside their homes",
  },
  {
    number: "02",
    eyebrow: "WE TAKE IT FROM HERE",
    title: "Our team follows up with care.",
    text: "We contact your neighbor, answer their questions, and schedule a free estimate if they are ready. You do not need to sell anything or chase anyone down.",
    detail: "We keep the referral connected to you as it moves forward.",
    image: "/referral/siding-depot-follow-up.png",
    alt: "Home improvement consultant following up from a homeowner's porch",
  },
  {
    number: "03",
    eyebrow: "WE SAY THANK YOU",
    title: "Earn up to $150 for the referral.",
    text: "You earn $75 when a written estimate is completed. If your neighbor signs a qualifying project, you earn another $75. We verify each milestone and send payment within two weeks.",
    detail: "There is no limit to the number of neighbors you can refer.",
    image: "/referral/referral-reward.png",
    alt: "Homeowner happily looking at a reward confirmation on her phone",
  },
] as const;

const QUALIFIES = [
  "New Siding Depot customers only.",
  "A qualifying project has an estimate value of $5,000 or more.",
  "We can complete a free estimate and provide a written estimate.",
  "There is no limit to how many eligible homeowners you can refer.",
] as const;

const NOT_ELIGIBLE = [
  "Repair-only, warranty, or service-only work.",
  "Projects below $5,000.",
  "Homes where lead-based paint prevents a qualifying estimate.",
  "Any referral where Siding Depot cannot provide a written estimate.",
] as const;

export const Route = createFileRoute("/referral")({
  head: () => {
    const canonical = "https://www.sidingdepot.com/referral";
    return {
      meta: [
        { title: "Refer a Neighbor & Earn up to $150 | Siding Depot" },
        // Oculto do publico durante os testes: fora do indice e sem seguir links.
        { name: "robots", content: "noindex, nofollow" },
        {
          name: "description",
          content:
            "Refer a North Atlanta homeowner to Siding Depot and earn $75 after a written estimate, plus another $75 when they sign a qualifying exterior project.",
        },
        { property: "og:title", content: "Refer a Neighbor. Earn up to $150. | Siding Depot" },
        {
          property: "og:description",
          content: "A simple thank-you for introducing a new homeowner to Siding Depot.",
        },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Siding Depot Referral Rewards Program",
            url: canonical,
            description: "Refer a new homeowner and earn up to $150 in referral rewards.",
            isPartOf: { "@id": "https://www.sidingdepot.com/#website" },
          }),
        },
      ],
    };
  },
  component: ReferralPage,
});

function ReferralPage() {
  return (
    <main className="bg-background text-sd-black">
      <section className="overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.94fr_1.06fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-sd-green-pale px-4 py-2 text-[11px] font-bold tracking-[.13em] text-sd-green-dark">
              SIDING DEPOT REFERRAL REWARDS
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[.96] sm:text-7xl lg:text-8xl">
              A good neighbor is worth <span className="text-sd-green-text">$150.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sd-gray-text sm:text-xl">
              Know a homeowner thinking about siding, roofing, windows, gutters, or exterior
              updates? Introduce them to Siding Depot — and we will thank you at every qualifying
              milestone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <a href="#refer">
                  Refer a neighbor <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
            <p className="mt-5 text-sm font-semibold text-sd-gray-text">
              $75 after a written estimate · +$75 after a qualifying contract
            </p>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-sd-green-pale"
            />
            <img
              src="/referral/neighbors-referral.png"
              alt="Neighbors sharing a recommendation in front of their homes"
              className="relative h-[390px] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_rgba(12,12,12,.17)] sm:h-[540px]"
            />
            <div className="absolute -bottom-5 -left-3 max-w-[245px] rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-7 sm:p-5">
              <p className="text-[10px] font-bold tracking-[.14em] text-sd-green-dark">
                SIMPLE BY DESIGN
              </p>
              <p className="mt-1 font-display text-2xl leading-none">
                One form. Three clear steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sd-gray-border bg-sd-green-pale px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-display text-2xl text-sd-navy">
            You do the introduction. We do the work.
          </p>
          <p className="text-sm font-semibold text-sd-gray-text">
            No referral codes · No limit on referrals · Clear milestones
          </p>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            HOW THE PROGRAM WORKS
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            A referral should feel this easy.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            This is a simple, homeowner-first process. You submit the referral; we take it from
            there.
          </p>
        </div>
        <div className="mt-16 grid gap-16 lg:mt-20 lg:gap-24">
          {PROCESS.map((item, index) => (
            <article
              key={item.number}
              className={`grid items-center gap-9 lg:grid-cols-2 lg:gap-20 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2rem] bg-sd-green-pale"
                />
                <img
                  src={item.image}
                  alt={item.alt}
                  className="relative h-[360px] w-full rounded-[1.65rem] object-cover shadow-[0_20px_48px_rgba(12,12,12,.12)] sm:h-[500px]"
                />
              </div>
              <div className="max-w-xl">
                <p className="font-display text-7xl leading-none text-sd-green sm:text-8xl">
                  {item.number}
                </p>
                <p className="mt-4 text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-4xl leading-[.98] sm:text-5xl">
                  {item.title}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">{item.text}</p>
                <p className="mt-6 border-l-2 border-sd-green pl-4 text-sm font-bold leading-relaxed text-sd-navy">
                  {item.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="refer"
        className="scroll-mt-24 bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.76fr_1.24fr] lg:gap-20">
          <div className="lg:pt-8">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              START A REFERRAL
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              You make the introduction.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-sd-gray-text">
              This form is for the person making the referral. First we save your information. Then
              you tell us about your neighbor or friend.
            </p>
            <div className="mt-8 rounded-2xl border border-sd-gray-border bg-background p-5">
              <p className="font-bold text-sd-navy">
                Would your neighbor rather contact us directly?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">
                They can call or text{" "}
                <a
                  className="font-bold underline decoration-sd-green decoration-2 underline-offset-2"
                  href={SITE.phoneHref}
                >
                  {SITE.phone}
                </a>{" "}
                and give us your name and phone number. We will record the connection before the
                estimate is scheduled.
              </p>
            </div>
          </div>
          <ReferralForm />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-sd-navy px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[.16em] text-sd-green">
                YOUR REWARD, STEP BY STEP
              </p>
              <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                No surprises. Just clear milestones.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-bold text-sd-green">FIRST $75</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Your referred homeowner completes a free estimate and we provide a written
                  estimate.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-bold text-sd-green">SECOND $75</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  They sign a qualifying contract. Your total reward can be $150.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sd-gray-border bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              PROGRAM DETAILS
            </p>
            <h2 className="mt-3 font-display text-4xl leading-none">The simple rules</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl bg-sd-green-pale p-6">
              <h3 className="font-display text-3xl text-sd-navy">This qualifies</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-sd-gray-text">
                {QUALIFIES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sd-green-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-sd-gray-border p-6">
              <h3 className="font-display text-3xl text-sd-navy">This does not qualify</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-sd-gray-text">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sd-gray-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-sd-gray-text">
            Rewards are issued within two weeks after each qualifying milestone and after referral
            information is verified. Siding Depot reserves the right to verify referral information
            before payment.
          </p>
        </div>
      </section>
      <section className="bg-sd-black py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <CircleDollarSign className="mx-auto h-8 w-8 text-sd-green" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            A good neighbor deserves a thank-you.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Thank you for helping us serve more homeowners across North Atlanta.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="#refer">
                Refer a neighbor <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outlineWhite">
              <a href={SITE.phoneHref}>
                <Phone className="mr-2 h-4 w-4" />
                Call {SITE.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
