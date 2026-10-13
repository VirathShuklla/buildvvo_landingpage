import { Check } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { Reveal } from "../components/site/Reveal";
import { CTAButton } from "../components/site/CTAButton";
import { CTABand } from "../components/site/CTABand";
import { GymBossMockup } from "../components/site/GymBossMockup";
import { PageHero } from "./Services";

const BLOCKS = [
  { t: "The challenge", d: "Gyms and fitness studios commonly run on paper registers, spreadsheets and manual phone calls. Renewals get missed, dues go untracked, and owners have no clear picture of how the business is performing." },
  { t: "Our approach", d: "We mapped the daily routine of a gym — enrolment, plan selection, fee collection, attendance and renewals — and designed a system where each step takes seconds instead of minutes." },
  { t: "The solution", d: "GymBoss_VVO brings members, plans, payments, attendance and reminders into one dashboard, so owners and staff spend less time on admin and more time with members." },
];
const FEATURES = ["Member profiles & membership plans", "Fee collection, dues & payment history", "Automated renewal reminders", "Attendance & check-in tracking", "Trainer and staff management", "Business reports & dashboards"];

export default function Work() {
  usePageMeta("Our Work — Custom Software Case Studies",
    "See software built by BuildVVO Technologies, including GymBoss_VVO, a gym management system for members, fees, renewals and attendance.");
  return (
    <div data-testid="work-page">
      <PageHero eyebrow="Our Work" title="Software that solves real operational problems."
        text="Every product we build starts with a business problem. Here's a closer look at what we've built and how we approach it." />

      <section className="container-x section-y" data-testid="case-study-gymboss">
        <Reveal>
          <div className="rounded-[28px] bg-navy text-cream p-6 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" />
            <div className="relative flex flex-wrap gap-2 mb-8">
              {["Fitness", "Web Application", "Business Automation"].map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cream/70">{t}</span>
              ))}
            </div>
            <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">GymBoss<span className="text-brand">_VVO</span></h2>
            <p className="relative mt-5 max-w-2xl text-cream/70 text-base md:text-lg leading-relaxed">A complete gym management system for members, fees, renewals and attendance.</p>
            <div className="relative mt-14 max-w-3xl mx-auto"><GymBossMockup /></div>
            <p className="relative mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-cream/40">Product interface preview</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.t} delay={i * 0.06} className="border-t border-foreground/80 pt-6">
              <p className="font-mono text-sm text-primary">0{i + 1}</p>
              <h3 className="mt-4 text-2xl font-bold">{b.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.d}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-[22px] border border-border bg-card p-8 sm:p-10 grid gap-8 lg:grid-cols-[1fr_2fr] items-start">
          <div>
            <p className="eyebrow mb-3">Key features</p>
            <h3 className="text-2xl font-extrabold">What GymBoss_VVO does</h3>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => <li key={f} className="flex gap-3 text-[15px]"><Check className="h-4 w-4 mt-1 text-primary shrink-0" />{f}</li>)}
          </ul>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton to="/contact" data-testid="work-gymboss-demo-button">Request a GymBoss_VVO demo</CTAButton>
          <CTAButton to="/contact" variant="ghost" data-testid="work-similar-project-button">Build something similar</CTAButton>
        </div>
      </section>

      <section className="container-x pb-20 sm:pb-28">
        <Reveal className="rounded-[22px] border border-dashed border-foreground/25 p-10 sm:p-14 text-center">
          <p className="eyebrow mb-4">More case studies</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">More detailed case studies are being prepared.</h3>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Want to see examples relevant to your industry? Ask us during your free consultation and we'll walk you through them.</p>
        </Reveal>
      </section>
      <CTABand title="Your project could be our next case study." />
    </div>
  );
}
