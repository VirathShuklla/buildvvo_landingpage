import { usePageMeta } from "../lib/seo";
import { CTAButton } from "../components/site/CTAButton";

export default function NotFound() {
  usePageMeta("Page Not Found", "The page you are looking for does not exist.");
  return (
    <section className="container-x py-32 text-center" data-testid="not-found-page">
      <p className="font-mono text-primary">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold">This page doesn't exist.</h1>
      <div className="mt-10 flex justify-center gap-3">
        <CTAButton to="/" data-testid="not-found-home-button">Back to home</CTAButton>
        <CTAButton to="/contact" variant="ghost" data-testid="not-found-contact-button">Contact us</CTAButton>
      </div>
    </section>
  );
}
