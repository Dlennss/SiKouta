import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://sikouta.com"),
  title: "SiKouta",
  description: "Pulsa, paket data, e-wallet, token listrik, game, dan PPOB dalam satu tempat.",
  applicationName: "SiKouta",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20261024-2", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/favicon-32.png?v=20261024-2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png?v=20261024-2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=20261024-2",
    apple: [{ url: "/apple-touch-icon.png?v=20261024-2", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "SiKouta",
    description: "Pulsa, paket data, e-wallet, token listrik, game, dan PPOB dalam satu tempat.",
    url: "https://sikouta.com",
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
