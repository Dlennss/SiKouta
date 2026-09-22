"use client";

import { usePathname } from "next/navigation";
import { Clock3, House, Tags, UserRound } from "lucide-react";
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
        { label: "Beranda", href: "/user", icon: House, active: homeActive },
        { label: "Riwayat", href: "/user/transaksi", icon: Clock3, active: historyActive },
        { label: "Promo", href: "/user/kategori", icon: Tags, active: promoActive },
        { label: "Akun", href: "/user/account", icon: UserRound, active: accountActive },
      ]}
    />
  );
}
