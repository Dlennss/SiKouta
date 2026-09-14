import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://sikouta.local"),
  title: "SiKouta",
  description: "Pulsa, paket data, e-wallet, token listrik, game, dan PPOB dalam satu tempat.",
  applicationName: "SiKouta",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "SiKouta",
    description: "Pulsa, paket data, e-wallet, token listrik, game, dan PPOB dalam satu tempat.",
    url: "https://sikouta.local",
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
    title: "SiKouta",
    description: "Pulsa, paket data, e-wallet, token listrik, game, dan PPOB dalam satu tempat.",
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout harus netral. Jangan taruh Header/Footer di sini.
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
