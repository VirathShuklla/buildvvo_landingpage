import { CTAButton } from "./CTAButton";
import { Reveal } from "./Reveal";
import { useSite, whatsappLink } from "../../context/SiteContext";
import { trackWhatsApp } from "../../lib/tracking";

export const CTABand = ({ title = "Let's build the software your business deserves.", text = "Tell us about your operations. We'll show you what can be simplified, automated and scaled — in a free, no-obligation consultation." }) => {
  const { settings } = useSite();
  return (
    <section className="container-x pb-24 sm:pb-32">
      <Reveal>
        <div data-testid="cta-band" className="relative overflow-hidden rounded-[28px] bg-navy text-cream px-7 py-14 sm:px-14 sm:py-20 grain">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-[100px]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand mb-5">Free consultation</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] max-w-2xl">{title}</h2>
              <p className="mt-5 text-cream/70 max-w-xl leading-relaxed">{text}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <CTAButton to="/contact" data-testid="cta-band-discuss-button">Discuss Your Project</CTAButton>
              <CTAButton
                href={whatsappLink(settings.whatsapp_number)}
                variant="light"
                onClick={() => trackWhatsApp("cta-band")}
                data-testid="cta-band-whatsapp-button"
              >
                WhatsApp Us
              </CTAButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
