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
      <div className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] sm:max-w-[430px]">
        <nav
          aria-label="Navigasi utama"
          className="grid h-[calc(76px+env(safe-area-inset-bottom))] items-stretch gap-2 rounded-t-[20px] border-t border-[#e6edf4] bg-white px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(15,40,70,0.06)]"
          style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}
        >
          {items.map(({ label, href, icon: Icon, imageSrc, active, badge }) => (
            <Link
              key={label}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg no-underline! outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 motion-reduce:transition-none ${
                active
                  ? "text-[#0876CE]! visited:text-[#0876CE]!"
                  : "text-[#60738E]! visited:text-[#60738E]! hover:text-[#0876CE]!"
              }`}
            >
              <span
                className={`relative flex h-8 w-14 shrink-0 items-center justify-center rounded-lg transition-colors motion-reduce:transition-none ${
                  active ? "bg-[#E7F3FF]" : "bg-transparent group-hover:bg-sky-50"
                }`}
              >
                {imageSrc ? (
                  <Image src={imageSrc} alt="" width={24} height={24} className="h-6 w-6 object-contain" aria-hidden="true" />
                ) : Icon ? (
                  <Icon aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={2} fill="none" />
                ) : null}
                {badge}
              </span>
              <span className="block max-w-full whitespace-nowrap text-[12px] font-semibold leading-4 tracking-normal">
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
