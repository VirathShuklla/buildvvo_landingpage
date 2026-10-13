import { useLocation } from "react-router-dom";
import { useSite, whatsappLink } from "../../context/SiteContext";
import { trackWhatsApp } from "../../lib/tracking";

export const WhatsAppIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.39 9.39 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.42 9.42zm8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.7 5.84.7 12.1c0 2 .52 3.95 1.52 5.67L.6 23.25l5.6-1.47a11.33 11.33 0 0 0 5.85 1.49c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02z" />
  </svg>
);

export const WhatsAppButton = () => {
  const { settings } = useSite();
  const { pathname } = useLocation();
  return (
    <a
      data-testid="floating-whatsapp-button"
      href={whatsappLink(settings.whatsapp_number)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(pathname)}
      aria-label="Chat with BuildVVO on WhatsApp"
      className="group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center gap-3 rounded-full bg-[#25D366] text-white pl-4 pr-4 sm:pr-5 py-3.5 shadow-[0_16px_40px_-12px_rgba(37,211,102,0.6)] wa-pulse transition-transform duration-300 hover:-translate-y-1"
    >
      <WhatsAppIcon />
      <span className="hidden sm:inline text-sm font-semibold">Enquire on WhatsApp</span>
    </a>
  );
};
