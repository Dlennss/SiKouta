"use client";

import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type BottomNavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  imageSrc?: string;
  active: boolean;
  badge?: ReactNode;
};

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none h-[calc(86px+env(safe-area-inset-bottom))]" />
      <div className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full bg-transparent pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] sm:max-w-[430px]">
        <nav
          aria-label="Navigasi utama"
          className="grid h-[78px] items-stretch rounded-t-[28px] border border-white/80 bg-white/96 px-6 pb-2.5 pt-2 shadow-[0_-18px_42px_rgba(31,94,146,0.18)] ring-1 ring-sky-100/80 backdrop-blur-md"
          style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}
        >
          {items.map(({ label, href, icon: Icon, imageSrc, active, badge }) => (
            <Link
              key={label}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl no-underline! outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 motion-reduce:transition-none ${
                active
                  ? "text-[#0876CE]! visited:text-[#0876CE]!"
                  : "text-[#60738E]! visited:text-[#60738E]! hover:text-[#0876CE]!"
              }`}
            >
              <span
                className={`relative flex h-9 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  active ? "bg-[#E7F3FF] shadow-[0_8px_18px_rgba(8,118,206,0.14)]" : "bg-transparent group-hover:bg-sky-50"
                }`}
              >
                {imageSrc ? (
                  <Image src={imageSrc} alt="" width={28} height={28} className="h-[28px] w-[28px] object-contain" aria-hidden="true" />
                ) : Icon ? (
                  <Icon aria-hidden="true" className="h-[22px] w-[22px] shrink-0" strokeWidth={active ? 2.6 : 2.25} fill={active && label === "Beranda" ? "currentColor" : "none"} />
                ) : null}
                {badge}
              </span>
              <span className="block max-w-full whitespace-nowrap text-[11px] font-black leading-4 tracking-normal">
                {label}
              </span>
              {active ? <span className="absolute bottom-0 h-1 w-8 rounded-full bg-[#0876CE]" /> : null}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
