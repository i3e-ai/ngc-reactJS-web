import ContentCurator from "./blocks/content-curator/content-curator";
import Header from "./blocks/header/header";
import HeroCarousel from "./blocks/hero-carousel/hero-carousel";
import Highlight from "./blocks/highlight/highlight";
import ProductDisplay from "./blocks/product-display/product-display";

export default function RootLayout({

}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Highlight />
        <Header />
        <HeroCarousel />
        <ProductDisplay />
        <ContentCurator />
      </body>
    </html>
  );
}
