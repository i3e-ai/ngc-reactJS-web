import Header from "./blocks/header/header";
import HeroCarousel from "./blocks/hero-carousel/hero-carousel";

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
      </body>
    </html>
  );
}
