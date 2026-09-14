"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/shared/BottomNav";

type GuestBottomNavProps = {
  isLoggedIn?: boolean;
};

export function GuestBottomNav({ isLoggedIn = false }: GuestBottomNavProps) {
  const pathname = usePathname() || "";
  const homeActive = pathname === "/";
  const historyActive = pathname.startsWith("/transaksi");
  const accountHref = isLoggedIn ? "/user/account" : "/login";
  const promoHref = isLoggedIn ? "/user/kategori" : "/kategori";
  const promoActive = pathname.startsWith("/user/kategori") || pathname.startsWith("/kategori");
  const accountActive = isLoggedIn
    ? pathname.startsWith("/user/account")
    : pathname.startsWith("/login");

  return (
    <BottomNav
      items={[
        { label: "Beranda", href: "/", imageSrc: "/sikouta-assets/nav_beranda.png", active: homeActive },
        { label: "Riwayat", href: "/transaksi", imageSrc: "/sikouta-assets/nav_riwayat.png", active: historyActive },
        { label: "Promo", href: promoHref, imageSrc: "/sikouta-assets/promo_koin_rp.png", active: promoActive },
        { label: "Akun", href: accountHref, imageSrc: "/sikouta-assets/nav_akun.png", active: accountActive },
      ]}
    />
  );
}
