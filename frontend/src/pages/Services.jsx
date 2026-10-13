import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { SERVICES } from "../data/content";
import { Reveal } from "../components/site/Reveal";
import { CTABand } from "../components/site/CTABand";

export const PageHero = ({ eyebrow, title, text, children }) => (
  <section className="relative overflow-hidden border-b border-border">
    <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" />
    <div className="container-x relative pt-16 pb-16 sm:pt-24 sm:pb-24">
      <Reveal className="max-w-3xl">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.03]">{title}</h1>
        {text && <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">{text}</p>}
        {children}
      </Reveal>
    </div>
  </section>
);

export default function Services() {
  usePageMeta("Software Development Services in India — ERP, CRM, Web & Mobile Apps",
    "Custom software, ERP, CRM, web application, mobile app and business automation services for Indian businesses by BuildVVO Technologies.");
  return (
    <div data-testid="services-page">
      <PageHero eyebrow="Services" title="Every service starts with one question: what's slowing your business down?"
        text="We don't sell technology for its own sake. We solve operational problems with software that fits — then support it as you grow." />
      <section className="container-x section-y space-y-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.03}>
            <Link to={`/services/${s.slug}`} data-testid={`service-row-${s.slug}`}
              className="lift group grid gap-6 md:grid-cols-[auto_1.2fr_1.6fr_auto] items-start md:items-center rounded-[22px] border border-border bg-card p-7 sm:p-10">
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
                <h2 className="text-2xl sm:text-3xl font-extrabold">{s.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{s.summary}</p>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-border transition-[background-color,color,border-color] group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
      <CTABand />
    </div>
  );
}
