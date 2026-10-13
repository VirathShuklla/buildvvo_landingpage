import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { useSite, whatsappLink } from "../context/SiteContext";
import { trackWhatsApp } from "../lib/tracking";
import { CTAButton } from "../components/site/CTAButton";

export default function ThankYou() {
  usePageMeta("Thank You — We've Received Your Enquiry", "Thank you for contacting BuildVVO Technologies. Our team will get in touch within one business day.");
  const { state } = useLocation();
  const { settings } = useSite();
  const name = state?.name;
  return (
    <section data-testid="thank-you-page" className="container-x py-20 sm:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center">
        <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-white shadow-[0_20px_50px_-15px_rgba(73,101,233,0.8)]">
          <Check className="h-9 w-9" strokeWidth={2.5} />
        </motion.span>
        <p className="eyebrow mt-10">Enquiry received</p>
        <h1 data-testid="thank-you-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
          Thank you{name ? `, ${name}` : ""}. We'll be in touch soon.
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          {state?.software_type ? `We've received your ${state.software_type} enquiry. ` : "We've received your enquiry. "}
          Our team will review your requirements and contact you within one business day{state?.consultation ? " to schedule your free consultation" : ""}.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3 text-left">
          {["We review your brief", "We call you to discuss", "You get a clear proposal"].map((s, i) => (
            <div key={s} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-xs text-primary">0{i + 1}</p>
              <p className="mt-2 font-medium">{s}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <CTAButton href={whatsappLink(settings.whatsapp_number, "Hi BuildVVO, I just submitted an enquiry on your website.")} onClick={() => trackWhatsApp("/thank-you")} data-testid="thank-you-whatsapp-button">Message us on WhatsApp</CTAButton>
          <CTAButton to="/work" variant="ghost" data-testid="thank-you-work-button">Explore Our Work</CTAButton>
        </div>
      </motion.div>
    </section>
  );
}
