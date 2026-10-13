import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const base = "group inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm sm:text-[15px] px-6 py-3.5 transition-[background-color,color,transform,box-shadow] duration-300 active:scale-[0.98]";
const variants = {
  primary: "bg-primary text-white hover:bg-[#3651D4] shadow-[0_10px_30px_-10px_rgba(73,101,233,0.7)]",
  dark: "bg-navy text-cream hover:bg-[#1E2D4A] dark:bg-cream dark:text-navy dark:hover:bg-white",
  ghost: "border border-foreground/20 text-foreground hover:bg-foreground/5",
  light: "bg-cream text-navy hover:bg-white",
};

export const CTAButton = ({ to, href, variant = "primary", children, icon = true, className = "", ...rest }) => {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {icon && <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </>
  );
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{inner}</a>;
  return <Link to={to} className={cls} {...rest}>{inner}</Link>;
};
