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
      <div aria-hidden="true" className="pointer-events-none h-[calc(106px+env(safe-area-inset-bottom))]" />
      <div className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md bg-transparent pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:w-97.5 md:max-w-none">
        <nav
          aria-label="Navigasi utama"
          className="grid h-[94px] grid-cols-4 items-stretch rounded-t-[24px] bg-white px-5 pb-2 pt-3 shadow-[0_-12px_34px_rgba(31,94,146,0.14)] ring-1 ring-sky-100"
        >
          {items.map(({ label, href, icon: Icon, imageSrc, active, badge }) => (
            <Link
              key={label}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl no-underline! outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 motion-reduce:transition-none ${
                active
                  ? "text-[#0876CE]! visited:text-[#0876CE]!"
                  : "text-[#60738E]! visited:text-[#60738E]! hover:text-[#0876CE]!"
              }`}
            >
              <span className="relative flex h-9 w-12 shrink-0 items-center justify-center">
                {imageSrc ? (
                  <Image src={imageSrc} alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" aria-hidden="true" />
                ) : Icon ? (
                  <Icon aria-hidden="true" className="h-7 w-7 shrink-0" strokeWidth={2} />
                ) : null}
                {badge}
              </span>
              <span className="block max-w-full whitespace-nowrap text-[12px] font-semibold leading-4 tracking-normal">
                {label}
              </span>
              {active ? <span className="absolute bottom-0 h-1 w-10 rounded-full bg-[#0876CE]" /> : null}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
