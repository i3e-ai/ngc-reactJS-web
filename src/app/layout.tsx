import Header from "./blocks/header/header";
import HeroCarousel from "./blocks/hero-carousel/hero-carousel";
import ProductDisplay from "./blocks/product-display/product-display";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <HeroCarousel />
        <ProductDisplay />
      </body>
    </html>
  );
}
