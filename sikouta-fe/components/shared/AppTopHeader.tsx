"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type AppTopHeaderProps = {
  isLoggedIn?: boolean;
  userName?: string | null;
  saldo?: number | null;
  role?: string | null;
};

export function AppTopHeader({ isLoggedIn = false, userName, saldo, role }: AppTopHeaderProps) {
  const pathname = usePathname() || "";
  const normalizedRole = String(role || "").trim().toLowerCase();
  const isRetailLoggedIn = isLoggedIn && (normalizedRole === "user" || normalizedRole === "agent" || normalizedRole === "master");
  const homeHref = isRetailLoggedIn ? "/user" : "/";
  void userName;
  void saldo;

  if (pathname === "/" || pathname === "/user") return null;

  return (
    <header className="sticky top-0 z-30 overflow-hidden bg-white/96 px-4 py-2 text-[#06184f] shadow-[0_10px_28px_rgba(22,120,242,0.08)] backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-sky-100" />

      <div className="relative flex h-12 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href={homeHref}
            prefetch={false}
            className="inline-flex h-11 max-w-[68vw] min-w-0 items-center"
            aria-label="SiKouta"
          >
            <span className="relative block h-10 w-[170px] min-w-0">
              <Image
                src="/sikouta-assets/logo_full_sikouta.png"
                alt="SiKouta"
                fill
                priority
                sizes="150px"
                className="object-contain object-left"
              />
            </span>
          </Link>
        </div>

        <div className="h-10 w-10 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
