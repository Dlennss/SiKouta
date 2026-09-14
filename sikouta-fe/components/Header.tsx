"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/docs", label: "Dokumentasi API" },
];

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith("/dashboard");

  if (inDashboard) return null;

  return (
    <header className="sticky top-0 z-50 overflow-hidden bg-white/96 text-[#06184f] shadow-[0_10px_28px_rgba(22,120,242,0.08)] backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-sky-100" />
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="SiKouta">
          <span className="min-w-0">
            <span className="relative block h-10 w-[174px]">
              <Image
                src="/sikouta-assets/logo_full_sikouta.png"
                alt="SiKouta"
                fill
                priority
                sizes="170px"
                className="object-contain object-left"
              />
            </span>
            <span className="mt-0.5 block text-[10px] font-black uppercase tracking-[0.18em] text-[#2d4a84]">
              Cepat & hemat
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-bold text-[#2d4a84] transition hover:text-[#0876CE]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="h-8 w-px bg-sky-100" />
          <Link href="/login" className="inline-flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#168cff_0%,#0066ea_100%)] px-6 py-2 text-sm font-black text-white shadow-[0_10px_22px_rgba(22,120,242,0.22)] transition hover:brightness-105">
            <span>Masuk</span>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-2xl border border-sky-100 bg-sky-50 p-2 text-[#0876CE] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <nav className="space-y-2 border-t border-sky-100 bg-white px-4 py-4 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-2xl bg-sky-50 px-3 py-2 text-sm font-bold text-[#06184f]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/login"
              className="block rounded-2xl bg-[linear-gradient(135deg,#168cff_0%,#0066ea_100%)] px-3 py-2 text-center text-sm font-black text-white"
              onClick={() => setOpen(false)}
            >
              Masuk
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
