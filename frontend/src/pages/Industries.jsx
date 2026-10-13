import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { INDUSTRIES } from "../data/content";
import { Reveal } from "../components/site/Reveal";
import { CTAButton } from "../components/site/CTAButton";
import { CTABand } from "../components/site/CTABand";
import { PageHero } from "./Services";

export default function Industries() {
  usePageMeta("Industry Software Solutions — Gyms, Healthcare, Education, Manufacturing & Retail",
    "Custom software for gyms, clinics, schools, warehouses, manufacturers, retailers and startups in India. Built around how your industry works.");
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }, [hash]);

  return (
    <div data-testid="industries-page">
      <PageHero eyebrow="Industries" title="Every industry runs differently. Your software should too."
        text="We learn how your sector operates — the workflows, the bottlenecks, the compliance — and build software that fits from day one." />
      <section className="container-x section-y space-y-6">
        {INDUSTRIES.map((ind, i) => (
          <Reveal key={ind.key}>
            <div id={ind.key} data-testid={`industry-${ind.key}`} className="scroll-mt-28 grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr] rounded-[22px] border border-border bg-card p-8 sm:p-10">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><ind.icon className="h-5 w-5" /></span>
                <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold">{ind.name}</h2>
                <CTAButton to="/contact" variant="ghost" className="mt-6 !py-2.5" data-testid={`industry-${ind.key}-cta`}>Discuss your needs</CTAButton>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Common challenges</p>
                <ul className="space-y-3">
                  {ind.pains.map((p) => <li key={p} className="text-[15px] border-l-2 border-destructive/40 pl-4">{p}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4">What we build</p>
                <ul className="space-y-3">
                  {ind.build.map((b) => <li key={b} className="flex gap-3 text-[15px]"><Check className="h-4 w-4 mt-1 text-primary shrink-0" />{b}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
      <CTABand title="Don't see your industry? We'd still love to hear about it." />
    </div>
  );
}
