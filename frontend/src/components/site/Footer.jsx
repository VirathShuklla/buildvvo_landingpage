import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { SERVICES } from "../../data/content";
import { Logo } from "./Logo";
import { NAV } from "./Navbar";

export const Footer = () => {
  const { settings } = useSite();
  return (
    <footer data-testid="site-footer" className="bg-navy text-cream dark:bg-[#0A1324]">
      <div className="container-x py-20 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 text-cream/65 leading-relaxed max-w-sm text-sm">
            BuildVVO Technologies Private Limited builds custom software, ERP, CRM, web and mobile applications that simplify operations for growing Indian businesses.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/45 mb-5">Services</p>
          <ul className="space-y-3 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link className="text-cream/80 hover:text-white transition-colors" to={`/services/${s.slug}`} data-testid={`footer-service-${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/45 mb-5">Company</p>
          <ul className="space-y-3 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link className="text-cream/80 hover:text-white transition-colors" to={n.to} data-testid={`footer-${n.id}-link`}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/45 mb-5">Get in touch</p>
          <ul className="space-y-4 text-sm text-cream/80">
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-brand" /><a href={`tel:${settings.phone}`} data-testid="footer-phone">{settings.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-brand" /><a href={`mailto:${settings.email}`} data-testid="footer-email">{settings.email}</a></li>
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-brand" /><span data-testid="footer-address">{settings.address}</span></li>
            <li className="flex gap-3"><Clock className="h-4 w-4 mt-0.5 text-brand" /><span>{settings.business_hours}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-cream/50">
          <p>© {new Date().getFullYear()} BuildVVO Technologies Private Limited. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-cream transition-colors" data-testid="admin-dashboard-link">Team login</Link>
        </div>
      </div>
    </footer>
  );
};
