"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/shared/BottomNav";

function isActivePath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function UserBottomNav() {
  const pathname = usePathname() || "";
  const homeActive = pathname === "/user";
  const historyActive = isActivePath(pathname, "/user/transaksi");
  const promoActive =
    isActivePath(pathname, "/user/kategori") ||
    isActivePath(pathname, "/user/pulsa-data") ||
    isActivePath(pathname, "/user/listrik") ||
    isActivePath(pathname, "/user/ewallet") ||
    isActivePath(pathname, "/game");
  const accountActive = isActivePath(pathname, "/user/account");

  return (
    <BottomNav
      items={[
        { label: "Beranda", href: "/user", imageSrc: "/sikouta-assets/07_bottom_nav/beranda_active.png", active: homeActive },
        { label: "Riwayat", href: "/user/transaksi", imageSrc: "/sikouta-assets/07_bottom_nav/riwayat.png", active: historyActive },
        { label: "Promo", href: "/user/kategori", imageSrc: "/sikouta-assets/07_bottom_nav/promo.png", active: promoActive },
        { label: "Akun", href: "/user/account", imageSrc: "/sikouta-assets/07_bottom_nav/akun.png", active: accountActive },
      ]}
    />
  );
}
