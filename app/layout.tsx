import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slimme Kascontrole – Uw kascontrole klaar voor de ALV",
  description: "Professioneel kascontrolerapport voor uw vereniging. Snel, betrouwbaar en voor slechts €59.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
