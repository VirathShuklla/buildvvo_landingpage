import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { FAQS } from "../../data/content";
import { SectionHead } from "./Reveal";

export const FAQSection = ({ items = FAQS }) => (
  <section className="container-x section-y grid gap-12 lg:grid-cols-[1fr_1.4fr]" data-testid="faq-section">
    <SectionHead eyebrow="FAQ" title="Questions businesses ask us before they start." text="Straight answers on cost, timelines and ownership. Have something else in mind? Ask us directly." />
    <Accordion type="single" collapsible className="w-full">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`f${i}`} className="border-border">
          <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-display text-lg sm:text-xl font-bold py-6 hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
