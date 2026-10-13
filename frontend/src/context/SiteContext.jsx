import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { initTracking, captureAttribution } from "../lib/tracking";

const SiteContext = createContext(null);

const FALLBACK = {
  whatsapp_number: "919999999999", phone: "+91 99999 99999", email: "hello@buildvvo.com",
  address: "India", business_hours: "Mon – Sat, 10:00 AM – 7:00 PM IST",
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK);
  const [theme, setTheme] = useState(() => localStorage.getItem("bvvo_theme") || "light");

  useEffect(() => {
    captureAttribution();
    api.get("/settings").then(({ data }) => {
      setSettings(data);
      if (!window.location.pathname.startsWith("/admin")) initTracking(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("bvvo_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <SiteContext.Provider value={{ settings, setSettings, theme, toggleTheme }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);

export const whatsappLink = (number, text = "Hi BuildVVO, I'd like to discuss a software project for my business.") =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
