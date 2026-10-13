import { useSearchParams } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Check } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { useSite, whatsappLink } from "../context/SiteContext";
import { trackWhatsApp, trackEvent } from "../lib/tracking";
import { LeadForm } from "../components/site/LeadForm";
import { WhatsAppIcon } from "../components/site/WhatsAppButton";
import { Reveal } from "../components/site/Reveal";

const NEXT = ["We review your requirements", "We call you within 1 business day", "Free consultation to understand your project", "You receive a clear written proposal"];

export default function Contact() {
  usePageMeta("Get a Quote — Discuss Your Software Project",
    "Request a free consultation and quote for custom software, ERP, CRM, web or mobile app development from BuildVVO Technologies.");
  const [params] = useSearchParams();
  const { settings } = useSite();
  return (
    <div data-testid="contact-page" className="relative">
      <div className="absolute inset-x-0 top-0 h-[520px] grid-bg [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <section className="container-x relative pt-14 sm:pt-20 pb-24 grid gap-14 lg:grid-cols-[0.9fr_1.3fr]">
        <Reveal>
          <p className="eyebrow mb-5">Contact / Get a quote</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.03]">Let's talk about your project.</h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">Tell us what you need in four short steps. No commitment — just a conversation about how software can simplify your operations.</p>

          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-5">What happens next</p>
            <ol className="space-y-4">
              {NEXT.map((n, i) => (
                <li key={n} className="flex gap-4 text-[15px]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">{i + 1}</span><span className="pt-0.5">{n}</span></li>
              ))}
            </ol>
          </div>

          <div className="mt-10 rounded-[22px] border border-border bg-card p-6 space-y-4 text-[15px]">
            <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("/contact")} data-testid="contact-whatsapp-link"
              className="flex items-center gap-3 rounded-xl bg-[#25D366] text-white px-4 py-3 font-semibold hover:opacity-90 transition-opacity">
              <WhatsAppIcon className="h-5 w-5" /> Chat with us on WhatsApp
            </a>
            <a href={`tel:${settings.phone}`} onClick={() => trackEvent("call_click")} className="flex gap-3 hover:text-primary transition-colors" data-testid="contact-phone-link"><Phone className="h-4 w-4 mt-1 text-primary" />{settings.phone}</a>
            <a href={`mailto:${settings.email}`} onClick={() => trackEvent("email_click")} className="flex gap-3 hover:text-primary transition-colors" data-testid="contact-email-link"><Mail className="h-4 w-4 mt-1 text-primary" />{settings.email}</a>
            <p className="flex gap-3" data-testid="contact-address"><MapPin className="h-4 w-4 mt-1 text-primary" />{settings.address}</p>
            <p className="flex gap-3 text-muted-foreground"><Clock className="h-4 w-4 mt-1 text-primary" />{settings.business_hours}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <LeadForm initialType={params.get("service") || ""} />
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary" />Free consultation included with every enquiry.</p>
        </Reveal>
      </section>
    </div>
  );
}
