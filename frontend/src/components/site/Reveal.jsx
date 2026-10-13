import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 24 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ eyebrow, title, text, className = "" }) => (
  <Reveal className={`max-w-2xl ${className}`}>
    <p className="eyebrow mb-4">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">{title}</h2>
    {text && <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">{text}</p>}
  </Reveal>
);
