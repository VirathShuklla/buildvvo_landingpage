import { Link } from "react-router-dom";

export const Logo = ({ className = "", light = false }) => (
  <Link to="/" data-testid="nav-homepage-link" className={`flex items-center gap-2.5 ${className}`}>
    <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-navy dark:bg-cream">
      <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
        <path d="M7 8l9 16 9-16" stroke="#4965E9" strokeWidth="3.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span className={`font-display text-xl font-extrabold tracking-tight ${light ? "text-cream" : ""}`}>
      BuildVVO<span className="text-primary">.</span>
    </span>
  </Link>
);
