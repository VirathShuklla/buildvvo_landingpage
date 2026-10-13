import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { SERVICES, PROBLEMS, PROCESS, WHY, INDUSTRIES } from "../data/content";
import { CTAButton } from "../components/site/CTAButton";
import { Reveal, SectionHead } from "../components/site/Reveal";
import { DashboardMockup } from "../components/site/DashboardMockup";
import { GymBossMockup } from "../components/site/GymBossMockup";
import { FAQSection } from "../components/site/FAQSection";
import { LeadForm } from "../components/site/LeadForm";
import { useSite } from "../context/SiteContext";

const COMMITMENTS = ["100% source-code ownership", "Fixed-scope written proposals", "Free discovery consultation", "Post-launch support"];

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
    <div className="container-x relative pt-14 pb-20 sm:pt-20 lg:pt-24 lg:pb-28 grid gap-16 lg:grid-cols-[1.05fr_1fr] items-center">
      <Reveal>
        <p className="eyebrow mb-6 inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Custom software & website development · India</p>
        <h1 data-testid="hero-headline" className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.4rem] font-extrabold leading-[1.02]">
          Your Business Is Unique. <span className="text-primary">Your Software Should Be Too.</span>
        </h1>
        <p data-testid="hero-subheadline" className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
          We build custom software, web applications, and business automation solutions that simplify operations and help businesses grow.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton to="/contact" data-testid="hero-discuss-project-button">Discuss Your Project</CTAButton>
          <CTAButton to="/work" variant="ghost" data-testid="hero-explore-work-button">Explore Our Work</CTAButton>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 max-w-lg">
          {COMMITMENTS.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0" />{c}</li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.15}><DashboardMockup /></Reveal>
    </div>
  </section>
);

const Problems = () => (
  <section className="bg-navy text-cream dark:bg-[#0A1324] relative grain" data-testid="problems-section">
    <div className="container-x section-y">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand mb-4">Problems we solve</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">Is your business outgrowing the way it runs?</h2>
        <p className="mt-5 text-cream/65 text-base md:text-lg leading-relaxed">Most growing companies hit the same walls. Custom software removes them.</p>
      </Reveal>
      <div className="mt-16 grid gap-px bg-white/10 rounded-[22px] overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05} className="bg-navy dark:bg-[#0A1324] p-8 sm:p-10 h-full">
            <p.icon className="h-6 w-6 text-brand" strokeWidth={1.6} />
            <h3 className="mt-6 text-xl font-bold">{p.title}</h3>
            <p className="mt-3 text-cream/60 text-[15px] leading-relaxed">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => (
  <section className="container-x section-y" data-testid="services-section">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <SectionHead eyebrow="What we build" title="Software and websites built around your business." text="From a high-converting website to a company-wide ERP — designed, built and supported by one accountable team." />
      <CTAButton to="/services" variant="ghost" data-testid="home-all-services-button">All services</CTAButton>
    </div>
    <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.05}>
          <Link to={`/services/${s.slug}`} data-testid={`home-service-card-${s.slug}`} className="lift group flex h-full flex-col rounded-[22px] border border-border bg-card p-7">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </div>
            <h3 className="mt-8 text-xl sm:text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed">{s.tagline}</p>
          </Link>
        </Reveal>
      ))}
      <Reveal delay={0.35}>
        <Link to="/contact" data-testid="home-service-card-not-sure" className="group flex h-full flex-col justify-between rounded-[22px] bg-primary text-white p-7 transition-colors hover:bg-[#3651D4]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Not sure what you need?</p>
            <h3 className="mt-6 text-xl sm:text-2xl font-bold">Tell us the problem. We'll suggest the right solution.</h3>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">Free consultation <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </Link>
      </Reveal>
    </div>
  </section>
);

const FeaturedWork = () => (
  <section className="container-x pb-20 sm:pb-28" data-testid="featured-work-section">
    <Reveal>
      <div className="rounded-[28px] bg-navy text-cream overflow-hidden grid lg:grid-cols-2 gap-12 p-7 sm:p-12 lg:p-16 relative">
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand mb-5">Featured product · Fitness</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">GymBoss<span className="text-brand">_VVO</span></h2>
          <p className="mt-5 text-cream/70 leading-relaxed text-base md:text-lg">A gym management system that replaces registers and spreadsheets with one place to manage members, fees, renewals and attendance.</p>
          <ul className="mt-8 space-y-3">
            {["Member & membership plan management", "Fee collection and due tracking", "Automated renewal reminders", "Attendance & check-in records"].map((x) => (
              <li key={x} className="flex gap-3 text-cream/85 text-[15px]"><Check className="h-4 w-4 mt-1 text-brand shrink-0" />{x}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <CTAButton to="/work" variant="light" data-testid="home-gymboss-case-study-button">View case study</CTAButton>
            <CTAButton to="/contact?service=Custom%20Software" data-testid="home-gymboss-discuss-button">Build something similar</CTAButton>
          </div>
        </div>
        <div className="relative self-center"><GymBossMockup /></div>
      </div>
    </Reveal>
  </section>
);

const IndustriesStrip = () => (
  <section className="border-y border-border bg-secondary/50" data-testid="industries-strip">
    <div className="container-x py-16 sm:py-20 grid gap-10 lg:grid-cols-[1fr_2fr] items-center">
      <div>
        <p className="eyebrow mb-3">Industries</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Built for how your industry works.</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {INDUSTRIES.map((ind) => (
          <Link key={ind.key} to={`/industries#${ind.key}`} data-testid={`home-industry-${ind.key}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-[border-color,color] hover:border-primary hover:text-primary">
            <ind.icon className="h-4 w-4" />{ind.name}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const Process = () => (
  <section className="container-x section-y" data-testid="process-section">
    <SectionHead eyebrow="How we work" title="A clear process. No surprises." text="You always know what's being built, what it costs and when it'll be ready." />
    <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {PROCESS.map((p, i) => (
        <Reveal key={p.n} delay={i * 0.05} className="border-t border-foreground/80 pt-6">
          <p className="font-mono text-sm text-primary">{p.n}</p>
          <h3 className="mt-4 text-2xl font-bold">{p.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed text-[15px]">{p.text}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

const Why = () => (
  <section className="bg-secondary/60 border-y border-border" data-testid="why-section">
    <div className="container-x section-y grid gap-14 lg:grid-cols-[1fr_1.6fr]">
      <div className="lg:sticky lg:top-28 self-start">
        <SectionHead eyebrow="Why BuildVVO" title="A partner who cares about your outcomes, not billable hours." />
        <CTAButton to="/about" variant="dark" className="mt-10" data-testid="why-about-button">About BuildVVO</CTAButton>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {WHY.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.05} className="rounded-[22px] border border-border bg-card p-8">
            <span className="font-mono text-xs text-primary">0{i + 1}</span>
            <h3 className="mt-5 text-xl font-bold">{w.title}</h3>
            <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed">{w.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const StartProject = () => {
  const { settings } = useSite();
  return (
    <section className="container-x section-y grid gap-14 lg:grid-cols-[1fr_1.3fr]" id="start" data-testid="home-lead-section">
      <div>
        <SectionHead eyebrow="Start your project" title="Tell us what's slowing your business down." text="Share a few details. We'll review your requirements and get back within one business day with next steps and a free consultation." />
        <ul className="mt-10 space-y-4">
          {["Takes about 2 minutes", "No obligation, no spam", `Prefer to talk? Call ${settings.phone}`].map((x) => (
            <li key={x} className="flex gap-3 text-[15px]"><Check className="h-4 w-4 mt-1 text-primary" />{x}</li>
          ))}
        </ul>
      </div>
      <Reveal delay={0.1}><LeadForm compact /></Reveal>
    </section>
  );
};

export default function Home() {
  usePageMeta(
    "BuildVVO Technologies | Custom Software Development Company in India",
    "Custom software, ERP, CRM, web apps, mobile apps and business automation for Indian businesses. Software built around how you work. Book a free consultation."
  );
  return (
    <div data-testid="home-page">
      <Hero />
      <Problems />
      <Services />
      <FeaturedWork />
      <IndustriesStrip />
      <Process />
      <Why />
      <FAQSection />
      <StartProject />
    </div>
  );
}
