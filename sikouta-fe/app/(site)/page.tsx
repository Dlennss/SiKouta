import Script from "next/script";
import type { Metadata } from "next";
import { SiKoutaHomeHero } from "@/components/shared/SiKoutaHomeHero";
import { CANONICAL_SITE_URL } from "@/lib/seo-articles";

const homeTitle = "SiKouta | Solusi Keuangan untuk Semua";
const homeDescription =
  "SiKouta melayani isi pulsa, paket data, top up e-wallet, token listrik, top up game, dan pembayaran PPOB dalam satu aplikasi.";

const serviceNames = ["Pulsa", "Paket Data", "Listrik PLN", "E-Wallet", "Telepon", "SMS", "TV Kabel", "PPOB"];

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  keywords: [
    "SiKouta",
    "isi pulsa online",
    "paket data murah",
    "top up e-wallet",
    "token listrik online",
    "top up game",
    "PPOB online",
  ],
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: CANONICAL_SITE_URL,
    siteName: "SiKouta",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SiKouta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/twitter-image"],
  },
};

export default function GuestHomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SiKouta",
    url: CANONICAL_SITE_URL,
    description: homeDescription,
    inLanguage: "id-ID",
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SiKouta",
    url: CANONICAL_SITE_URL,
    logo: `${CANONICAL_SITE_URL}/brand/logo.svg`,
    image: `${CANONICAL_SITE_URL}/opengraph-image`,
    description: homeDescription,
  };

  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SiKouta",
    url: CANONICAL_SITE_URL,
    description: homeDescription,
    about: serviceNames,
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Kategori Produk SiKouta",
      itemListElement: serviceNames.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name,
        },
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#dceeff]">
      <Script id="homepage-website-jsonld" type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </Script>
      <Script id="homepage-organization-jsonld" type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </Script>
      <Script id="homepage-catalog-jsonld" type="application/ld+json">
        {JSON.stringify(catalogJsonLd)}
      </Script>
      <SiKoutaHomeHero />
    </main>
  );
}
