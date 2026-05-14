import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://www.slimmekascontrole.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Slimme Kascontrole – Uw kascontrole klaar voor de ALV",
    template: "%s | Slimme Kascontrole",
  },
  description: "Professioneel kascontrolerapport voor uw vereniging. Snel, betrouwbaar en voor slechts €59.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "Slimme Kascontrole",
    title: "Slimme Kascontrole – Uw kascontrole klaar voor de ALV",
    description: "Professioneel kascontrolerapport voor uw VvE, sportvereniging of stichting. Eenmalig €59 incl. btw.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Slimme Kascontrole" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slimme Kascontrole – Uw kascontrole klaar voor de ALV",
    description: "Professioneel kascontrolerapport voor uw VvE, sportvereniging of stichting. Eenmalig €59 incl. btw.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Slimme Kascontrole",
  "description": "Professioneel kascontrolerapport voor VvE's, sportverenigingen en stichtingen.",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.png`,
  "telephone": "06-24235829",
  "email": "info@slimmekascontrole.nl",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "NL"
  },
  "priceRange": "€59",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "iDEAL",
  "areaServed": "NL",
  "offers": {
    "@type": "Offer",
    "name": "Kascontrolerapport",
    "price": "59",
    "priceCurrency": "EUR",
    "description": "Volledig kascontrolerapport voor uw vereniging of VvE."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
