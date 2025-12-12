import { Metadata } from "next";
import HeroCarousel from "./blocks/hero-carousel/hero-carousel";
import ProductDisplay from "./blocks/product-display/product-display";
import ContentCurator from "./blocks/content-curator/content-curator";
import Quote from "./blocks/quote/quote";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to NGC - Your destination for next-generation commerce solutions. Explore our featured products, latest innovations, and curated content.",
  openGraph: {
    title: "NGC - Next Generation Commerce Platform",
    description: "Welcome to NGC - Your destination for next-generation commerce solutions.",
    url: "https://ngc-website.com",
  },
};

export default function HomePage() {
  return (
    <article>
      <HeroCarousel />
      <section aria-label="Featured products">
        <ProductDisplay />
      </section>
      <section aria-label="Curated content">
        <ContentCurator />
      </section>
      <aside aria-label="Customer testimonial">
        <Quote />
      </aside>
    </article>
  );
}