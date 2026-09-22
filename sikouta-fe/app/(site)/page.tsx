import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CANONICAL_SITE_URL } from "@/lib/seo-articles";

const homeTitle = "SiKouta | Solusi Keuangan untuk Semua";
const homeDescription =
  "SiKouta melayani isi pulsa, paket data, top up e-wallet, token listrik, top up game, dan pembayaran PPOB dalam satu aplikasi.";

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
  redirect("/login");
}
