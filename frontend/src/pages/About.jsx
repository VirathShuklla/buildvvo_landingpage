import { usePageMeta } from "../lib/seo";
import { Reveal, SectionHead } from "../components/site/Reveal";
import { CTABand } from "../components/site/CTABand";
import { PageHero } from "./Services";
import { WHY } from "../data/content";

const VALUES = [
  { t: "Clarity", d: "Plain language, written scopes and honest timelines. You always know where your project stands." },
  { t: "Ownership", d: "We treat your software like our own product — and you own every line of it." },
  { t: "Practicality", d: "We build what moves your business forward, not features for the sake of it." },
  { t: "Partnership", d: "We stay after launch, improving your software as your business evolves." },
];

export default function About() {
  usePageMeta("About BuildVVO Technologies — Custom Software Company in India",
    "BuildVVO Technologies Private Limited is an Indian software development company building custom software, ERP, CRM, web and mobile apps for growing businesses.");
  return (
    <div data-testid="about-page">
      <PageHero eyebrow="About Us" title="We build the software growing businesses actually need."
        text="BuildVVO Technologies Private Limited is an Indian software development company. We help businesses replace manual processes, scattered spreadsheets and ill-fitting tools with custom software designed around how they really work." />

      <section className="container-x section-y grid gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4">Our story</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">Every business is different. We think its software should be too.</h2>
        </Reveal>
        <Reveal delay={0.08} className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
          <p>Most businesses don't struggle because of a lack of effort — they struggle because their tools don't match how they work. Teams end up juggling spreadsheets, messaging apps and generic software that was never designed for their processes.</p>
          <p>BuildVVO was founded to change that. We sit down with business owners, understand their operations in detail and build focused solutions — business websites, ERP, CRM, web and mobile apps, and automations — that remove friction and give them clear visibility into their business.</p>
          <p>We work with gyms, clinics, schools, warehouses, manufacturers, retailers and startups across India.</p>
        </Reveal>
      </section>

      <section className="bg-navy text-cream dark:bg-[#0A1324]">
        <div className="container-x section-y">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand mb-4">What we value</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-2xl">Principles behind every project.</h2>
          <div className="mt-14 grid gap-px bg-white/10 rounded-[22px] overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <div key={v.t} className="bg-navy dark:bg-[#0A1324] p-8 sm:p-10">
                <p className="font-mono text-sm text-brand">0{i + 1}</p>
                <h3 className="mt-5 text-2xl font-bold">{v.t}</h3>
                <p className="mt-3 text-cream/60 text-[15px] leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x section-y">
        <SectionHead eyebrow="Why businesses choose us" title="What working with BuildVVO looks like." />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <Reveal key={w.title} className="rounded-[22px] border border-border bg-card p-8">
              <h3 className="text-xl font-bold">{w.title}</h3>
              <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed">{w.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTABand />
    </div>
  );
}
