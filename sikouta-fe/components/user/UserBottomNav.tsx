"use client";

import { usePathname } from "next/navigation";
import { Clock3, House, UserRound } from "lucide-react";
import { BottomNav } from "@/components/shared/BottomNav";

function isActivePath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function UserBottomNav() {
  const pathname = usePathname() || "";
  const homeActive = pathname === "/user";
  const historyActive = isActivePath(pathname, "/user/transaksi");
  const accountActive = isActivePath(pathname, "/user/account");

  return (
    <BottomNav
      items={[
        { label: "Beranda", href: "/user", icon: House, active: homeActive },
        { label: "Riwayat", href: "/user/transaksi", icon: Clock3, active: historyActive },
        { label: "Akun", href: "/user/account", icon: UserRound, active: accountActive },
      ]}
    />
  );
}
