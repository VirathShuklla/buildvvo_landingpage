import { api } from "./api";

let settingsRef = {};

const loadScript = (src) => {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

export function initTracking(settings) {
  if (window.__bvvoTracking) return;
  window.__bvvoTracking = true;
  settingsRef = settings || {};
  const ids = [settingsRef.ga4_id, settingsRef.google_ads_id].filter(Boolean);
  if (ids.length) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    ids.forEach((id) => window.gtag("config", id));
  }
  if (settingsRef.meta_pixel_id) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", settingsRef.meta_pixel_id);
    window.fbq("track", "PageView");
  }
}

export function trackPageView(path) {
  window.gtag?.("event", "page_view", { page_path: path });
  window.fbq?.("track", "PageView");
}

export function trackEvent(name, params = {}) {
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}

export function trackLead(params = {}) {
  window.gtag?.("event", "generate_lead", { currency: "INR", ...params });
  if (settingsRef.google_ads_id && settingsRef.google_ads_label) {
    window.gtag?.("event", "conversion", { send_to: `${settingsRef.google_ads_id}/${settingsRef.google_ads_label}` });
  }
  window.fbq?.("track", "Lead", params);
  if (params.consultation) trackEvent("consultation_requested", params);
}

export function trackWhatsApp(page) {
  trackEvent("whatsapp_click", { page });
  window.fbq?.("track", "Contact");
  api.post("/events", { type: "whatsapp_click", page }).catch(() => {});
}

const SOURCE_MAP = [
  ["google", "Google"], ["instagram", "Instagram"], ["linkedin", "LinkedIn"],
  ["facebook", "Facebook"], ["fb", "Facebook"], ["youtube", "YouTube"],
  ["bing", "Bing"], ["twitter", "X / Twitter"], ["t.co", "X / Twitter"], ["whatsapp", "WhatsApp"],
];

const normalize = (raw) => {
  const v = (raw || "").toLowerCase();
  const hit = SOURCE_MAP.find(([k]) => v.includes(k));
  return hit ? hit[1] : null;
};

export function captureAttribution() {
  if (localStorage.getItem("bvvo_attr")) return;
  const p = new URLSearchParams(window.location.search);
  const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "";
  const utm = p.get("utm_source");
  let source = "Direct";
  if (p.get("gclid")) source = "Google";
  else if (p.get("fbclid")) source = "Facebook";
  else if (utm) source = normalize(utm) || utm.slice(0, 40);
  else if (ref) source = normalize(ref) || "Referral";
  localStorage.setItem("bvvo_attr", JSON.stringify({
    source, referrer: ref.slice(0, 300), landing_page: window.location.pathname.slice(0, 300),
    utm_campaign: (p.get("utm_campaign") || "").slice(0, 120), utm_medium: (p.get("utm_medium") || "").slice(0, 120),
  }));
}

export function getAttribution() {
  try { return JSON.parse(localStorage.getItem("bvvo_attr")) || { source: "Direct" }; } catch { return { source: "Direct" }; }
}
