import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  items: readonly FaqItem[];
  title?: string;
  titleAccent?: string;
  eyebrow?: string;
}

export function FaqSection({ 
  items, 
  title = "Questions,", 
  titleAccent = "answered.", 
  eyebrow = "FAQ" 
}: FaqSectionProps) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            {title} <span className="text-sd-green-dark">{titleAccent}</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-xl border border-sd-gray-border bg-white px-5 sm:px-6"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-sd-navy hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sd-gray-text leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-center text-sd-gray-text">
          Still have questions?{" "}
          <Link to="/contact" className="font-semibold text-sd-black hover:underline">
            Talk to our team →
          </Link>
        </p>
      </div>
    </section>
  );
}
