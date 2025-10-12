import HeroCarousel from "./blocks/hero-carousel/hero-carousel";
import ProductDisplay from "./blocks/product-display/product-display";
import ContentCurator from "./blocks/content-curator/content-curator";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ProductDisplay />
      <ContentCurator />
    </>
  );
}