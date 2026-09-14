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
        { label: "Beranda", href: "/", imageSrc: "/sikouta-assets/07_bottom_nav/beranda_active.png", active: homeActive },
        { label: "Riwayat", href: "/transaksi", imageSrc: "/sikouta-assets/07_bottom_nav/riwayat.png", active: historyActive },
        { label: "Promo", href: promoHref, imageSrc: "/sikouta-assets/07_bottom_nav/promo.png", active: promoActive },
        { label: "Akun", href: accountHref, imageSrc: "/sikouta-assets/07_bottom_nav/akun.png", active: accountActive },
      ]}
    />
  );
}
