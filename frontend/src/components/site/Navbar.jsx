import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { Logo } from "./Logo";
import { CTAButton } from "./CTAButton";

export const NAV = [
  { to: "/services", label: "Services", id: "services" },
  { to: "/industries", label: "Industries", id: "industries" },
  { to: "/work", label: "Our Work", id: "work" },
  { to: "/about", label: "About Us", id: "about" },
  { to: "/contact", label: "Contact", id: "contact" },
];

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useSite();
  return (
    <button
      data-testid="theme-toggle-button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 hover:bg-foreground/5 transition-colors"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = ({ isActive }) =>
    `relative text-[15px] transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`;

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
        scrolled || open ? "bg-background/85 backdrop-blur-xl border-border" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls} data-testid={`nav-${n.id}-link`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CTAButton to="/contact" className="hidden sm:inline-flex !py-2.5 !px-5" data-testid="nav-get-quote-button">Get a Quote</CTAButton>
          <button
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-foreground/15"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            data-testid="mobile-menu-button"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background" data-testid="mobile-menu">
          <div className="container-x flex flex-col py-6 gap-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} data-testid={`mobile-nav-${n.id}-link`}
                className="font-display text-2xl font-bold py-3 border-b border-border/60">{n.label}</NavLink>
            ))}
            <CTAButton to="/contact" className="mt-6" data-testid="mobile-get-quote-button">Discuss Your Project</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
};
