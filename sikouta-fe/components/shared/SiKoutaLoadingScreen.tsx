"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/85 ${className}`} />;
}

function UserSkeletonScreen() {
  return (
    <div className="fixed inset-0 z-[2147483647] bg-[#dceeff] text-white md:py-4">
      <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-hidden bg-[linear-gradient(154deg,#188eff_0%,#0064db_52%,#02359f_100%)] px-9 pt-7 shadow-[0_24px_70px_rgba(7,84,150,0.2)] md:w-97.5 md:max-w-none md:rounded-[42px]">
        <div className="pointer-events-none absolute -left-20 -top-14 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-16 top-12 h-44 w-44 rounded-full bg-cyan-200/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[330px] bg-white" style={{ clipPath: "ellipse(88% 42% at 50% 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px]">
          <Image src="/sikouta-assets/header_tower_strip.png" alt="" fill sizes="430px" className="object-cover object-bottom opacity-95" />
        </div>

        <div className="relative flex items-center justify-between text-[17px] font-black leading-none">
          <span>9:41</span>
          <span className="h-3 w-16 rounded-full bg-white/90" />
        </div>

        <div className="relative mt-36 flex flex-col items-center text-center">
          <Image src="/sikouta-assets/logo_mark_512.png" alt="" width={150} height={150} priority className="h-[150px] w-[150px] object-contain drop-shadow-[0_22px_34px_rgba(1,32,111,0.32)]" />
          <Image src="/sikouta-assets/logo_wordmark_sikouta.png" alt="Sikouta" width={288} height={88} priority className="mt-5 h-auto w-[270px] brightness-0 invert" />
          <p className="mt-5 text-[19px] font-medium leading-8">Solusi Keuangan untuk Semua<br />Lebih Mudah, Lebih Dekat</p>
          <div className="mt-20 flex items-center gap-3" aria-hidden="true">
            <span className="h-2 w-12 rounded-full bg-white" />
            <span className="h-2 w-11 rounded-full bg-white/20" />
            <span className="h-2 w-11 rounded-full bg-white/20" />
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-48 px-10 text-center text-[17px] font-black leading-6 text-[#06184f]">
          Transaksi - Bayar - Isi Ulang<br />Dalam Satu Aplikasi
        </p>
      </div>
    </div>
  );
}

function DashboardSkeletonScreen() {
  return (
    <div className="fixed inset-0 z-[2147483647] bg-[#050A14] text-white">
      <div className="flex min-h-dvh">
        <aside className="relative hidden w-[280px] shrink-0 border-r border-white/10 bg-[#053f31] p-5 md:block">
          <SkeletonBlock className="mx-auto h-8 w-32 bg-white/30" />
          <div className="mt-9 space-y-3">
            <SkeletonBlock className="h-11 w-full bg-white/20" />
            <SkeletonBlock className="h-10 w-11/12 bg-white/14" />
            <SkeletonBlock className="h-10 w-10/12 bg-white/14" />
          </div>
          <div className="absolute bottom-5 left-5 right-5 hidden md:block">
            <SkeletonBlock className="h-10 w-full bg-white/20" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">
          <div className="mb-5 flex h-14 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 md:hidden">
            <SkeletonBlock className="h-9 w-9 rounded-full bg-white/18" />
            <SkeletonBlock className="h-6 w-28 bg-white/20" />
            <SkeletonBlock className="h-9 w-9 rounded-full bg-white/18" />
          </div>

          <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
            <div className="bg-[radial-gradient(circle_at_90%_10%,rgba(163,230,53,0.55),transparent_28%),linear-gradient(135deg,#168AF2_0%,#168AF2_48%,#21D5ED_100%)] p-5 sm:p-7">
              <SkeletonBlock className="h-5 w-28 bg-white/35" />
              <SkeletonBlock className="mt-4 h-9 w-64 max-w-full bg-white/35" />
              <SkeletonBlock className="mt-3 h-4 w-full max-w-md bg-white/25" />
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="mt-3 h-7 w-24" />
                    <SkeletonBlock className="mt-3 h-3 w-16" />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                <div className="rounded-[26px] border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <SkeletonBlock className="h-4 w-24" />
                      <SkeletonBlock className="mt-3 h-7 w-56 max-w-full" />
                    </div>
                    <SkeletonBlock className="hidden h-11 w-44 sm:block" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="rounded-3xl border border-sky-100 bg-sky-50/40 p-4">
                        <div className="flex gap-3">
                          <SkeletonBlock className="h-14 w-14 shrink-0 rounded-[20px]" />
                          <div className="min-w-0 flex-1">
                            <SkeletonBlock className="h-5 w-36" />
                            <SkeletonBlock className="mt-3 h-4 w-52 max-w-full" />
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <SkeletonBlock className="h-12" />
                              <SkeletonBlock className="h-12" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-100 bg-white p-4 shadow-sm">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="mt-3 h-7 w-44" />
                  <div className="mt-5 space-y-3">
                    {[0, 1, 2].map((item) => (
                      <SkeletonBlock key={item} className="h-20 w-full rounded-3xl" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SiteSkeletonScreen() {
  return <UserSkeletonScreen />;
}

type SiKoutaLoadingScreenProps = {
  persistent?: boolean;
};

export function SiKoutaLoadingScreen({ persistent = false }: SiKoutaLoadingScreenProps) {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (persistent) {
      return;
    }

    const first = firstRender.current;
    firstRender.current = false;

    const resetTimer = window.setTimeout(() => setVisible(true), 0);
    const timer = window.setTimeout(() => setVisible(false), first ? 760 : 420);
    return () => {
      window.clearTimeout(resetTimer);
      window.clearTimeout(timer);
    };
  }, [pathname, persistent]);

  if (!persistent && !visible) return null;

  if (pathname.startsWith("/user")) return <UserSkeletonScreen />;
  if (pathname.startsWith("/dashboard")) return <DashboardSkeletonScreen />;
  return <SiteSkeletonScreen />;
}
