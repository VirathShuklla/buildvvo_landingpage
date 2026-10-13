import { Link, Navigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { SERVICES, FAQS, PROCESS } from "../data/content";
import { Reveal, SectionHead } from "../components/site/Reveal";
import { CTAButton } from "../components/site/CTAButton";
import { CTABand } from "../components/site/CTABand";
import { FAQSection } from "../components/site/FAQSection";
import { PageHero } from "./Services";

const Detail = ({ s }) => {
  usePageMeta(s.seoTitle, s.seoDesc);
  const others = SERVICES.filter((o) => o.slug !== s.slug);
  const contactTo = `/contact?service=${encodeURIComponent(s.formType)}`;
  return (
    <div data-testid={`service-detail-${s.slug}`}>
      <PageHero eyebrow={s.title} title={s.tagline} text={s.summary}>
        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton to={contactTo} data-testid="service-detail-quote-button">Get a Free Quote</CTAButton>
          <CTAButton to="/work" variant="ghost" data-testid="service-detail-work-button">See our work</CTAButton>
        </div>
      </PageHero>

      <section className="container-x section-y grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[22px] border border-border bg-card p-8 sm:p-10">
          <p className="eyebrow mb-4">Sound familiar?</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold">The problems we fix</h2>
          <ul className="mt-8 space-y-4">
            {s.problems.map((p) => (
              <li key={p} className="flex gap-3 text-[15px]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive"><X className="h-3.5 w-3.5" /></span>{p}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="rounded-[22px] bg-navy text-cream p-8 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand mb-4">What you get</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold">What we build for you</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {s.features.map((f) => (
              <li key={f} className="flex gap-3 text-[15px] text-cream/85"><Check className="h-4 w-4 mt-1 text-brand shrink-0" />{f}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="container-x section-y">
          <SectionHead eyebrow="Process" title={`How we deliver your ${s.short.toLowerCase()} project`} />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((p) => (
              <div key={p.n} className="border-t border-foreground/70 pt-5">
                <p className="font-mono text-sm text-primary">{p.n}</p>
                <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-muted-foreground text-[15px] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection items={FAQS.slice(0, 5)} />

      <section className="container-x pb-20">
        <p className="eyebrow mb-5">Other services</p>
        <div className="flex flex-wrap gap-3">
          {others.map((o) => (
            <Link key={o.slug} to={`/services/${o.slug}`} data-testid={`related-service-${o.slug}`} className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition-colors">{o.title}</Link>
          ))}
        </div>
      </section>
      <CTABand title={`Ready to discuss your ${s.short.toLowerCase()} project?`} />
    </div>
  );
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <Navigate to="/services" replace />;
  return <Detail key={s.slug} s={s} />;
}
