import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, Plus, ReceiptText, Send, Star } from "lucide-react";
import { getAppServerSession } from "@/lib/server-auth";
import { getUserProfile } from "@/lib/api.auth";
import { getCategories } from "@/lib/api.products";
import type { UserCategoryItem, UserSession } from "@/components/user/types";
import { UserCategoryGrid } from "@/components/user/UserCategoryGrid";
import { UserBottomNav } from "@/components/user/UserBottomNav";
import { UserAuthClientSync } from "@/components/user/UserAuthClientSync";

type SessionShape = {
  user?: UserSession;
  backendToken?: string;
};

function formatIDR(value: number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function getFirstName(value?: string | null) {
  const name = String(value || "").trim();
  if (!name) return "Andi";
  return name.split(/\s+/)[0] || "Andi";
}

function StatusBar() {
  return (
    <div className="flex h-5 items-center justify-between px-1 text-[13px] font-black leading-none text-[#06184f]">
      <span>9:41</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        <span className="h-2.5 w-3 rounded-full bg-[#06184f]" />
        <span className="h-2.5 w-3 rounded-full border-[2.5px] border-[#06184f]" />
        <span className="relative h-2.5 w-5 rounded-[5px] border-2 border-[#06184f]">
          <span className="absolute left-0.5 top-0.5 h-1.5 w-3 rounded-[3px] bg-[#06184f]" />
        </span>
      </div>
    </div>
  );
}

function UserHeader({ name }: { name: string }) {
  return (
    <header className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <Image src="/brand/logo.svg" alt="Sikouta" width={300} height={72} priority className="h-auto w-[154px] object-contain" />
        <div className="flex items-center gap-3">
          <button type="button" className="relative grid h-10 w-10 place-items-center rounded-full bg-white/60 text-[#06184f] shadow-[0_8px_18px_rgba(6,43,116,0.08)]" aria-label="Notifikasi">
            <Bell className="h-6 w-6" strokeWidth={2.3} />
            <span className="absolute right-1.5 top-1 h-2.5 w-2.5 rounded-full bg-[#ff3b30] ring-2 ring-white" />
          </button>
          <Link href="/user/account" className="grid h-11 w-11 place-items-center rounded-full bg-[#d6e8ff] text-[14px] font-black text-[#06184f] shadow-[0_10px_20px_rgba(6,43,116,0.10)]">
            AR
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-[22px] font-black leading-7 tracking-normal text-[#06184f]">Halo, {name} 👋</h1>
        <p className="mt-0.5 text-[14px] font-medium leading-5 text-[#41598c]">Semoga harimu selalu menyenangkan</p>
      </div>
    </header>
  );
}

function UserHomeBalance({ saldo }: { saldo: number }) {
  const amount = formatIDR(saldo);

  return (
    <section className="mt-4 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#1c96ff_0%,#0065eb_100%)] px-5 py-5 text-white shadow-[0_18px_36px_rgba(16,116,238,0.26)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link href="/user/saldo" prefetch={false} className="min-w-0 !text-white">
          <span className="flex items-center gap-2 text-[16px] font-medium leading-none">
            Saldo Utama
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className={`mt-2 block break-words font-black leading-9 tracking-normal tabular-nums ${amount.length > 13 ? "text-[25px]" : "text-[31px]"}`}>
            {amount}
          </span>
        </Link>
        <Link
          href="/user/account/topup"
          prefetch={false}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[13px] bg-white px-4 text-[15px] font-black !text-[#0646b5] shadow-[0_12px_24px_rgba(6,43,116,0.16)]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
          Top Up
        </Link>
      </div>
    </section>
  );
}

function UserQuickActions() {
  const items = [
    { href: "/user/account/topup", label: "Isi Saldo", icon: Plus },
    { href: "/user/kategori", label: "Transfer", icon: Send },
    { href: "/user/transaksi", label: "Riwayat", icon: ReceiptText },
    { href: "/user/kategori", label: "Favorit", icon: Star },
  ];

  return (
    <section className="mt-5 grid grid-cols-4 gap-3">
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={label} href={href} prefetch={false} className="group flex min-w-0 flex-col items-center gap-2 text-center">
          <span className="grid h-[48px] w-[48px] place-items-center rounded-[14px] bg-[linear-gradient(135deg,#279eff_0%,#006bea_100%)] text-white shadow-[0_12px_22px_rgba(22,120,242,0.24)] transition group-hover:-translate-y-0.5">
            <Icon className="h-7 w-7" strokeWidth={3} fill={label === "Favorit" ? "currentColor" : "none"} />
          </span>
          <span className="text-[12px] font-black leading-4 text-[#06184f]">{label}</span>
        </Link>
      ))}
    </section>
  );
}

function SikoutaPromoCard() {
  return (
    <Link href="/user/kategori" prefetch={false} className="mt-5 grid min-h-[100px] grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-3 rounded-[20px] bg-[#e9f4ff] px-4 py-3.5 shadow-[0_14px_30px_rgba(7,84,150,0.08)] ring-1 ring-white/70">
      <Image src="/sikouta-assets/03_dashboard/promo_card.png" alt="" width={78} height={78} className="h-[78px] w-[78px] rounded-[16px] object-cover object-left" />
      <span className="min-w-0">
        <span className="block text-[14px] font-black leading-5 text-[#06184f]">Transaksi makin mudah bersama Sikouta</span>
        <span className="mt-1 block text-[12.5px] font-medium leading-4 text-[#41598c]">Bayar tagihan, beli pulsa, dan banyak lagi dalam satu aplikasi.</span>
      </span>
      <span className="text-[32px] leading-none text-[#06184f]">›</span>
    </Link>
  );
}

export default async function UserAppHomePage() {
  const session = (await getAppServerSession()) as SessionShape | null;
  const [categories, profile] = await Promise.all([
    getCategories() as Promise<UserCategoryItem[]>,
    session?.backendToken ? getUserProfile(session.backendToken) : Promise.resolve(null),
  ]);
  const saldo = Number(profile?.saldo || 0);
  const name = getFirstName(profile?.nama || session?.user?.name || session?.user?.email);

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#e8f8ff_0%,#f6fbff_44%,#dff2ff_100%)] text-[#06184f] sm:py-4">
      {session?.backendToken ? <UserAuthClientSync backendToken={session.backendToken} /> : null}
      <div className="mx-auto min-h-svh w-full max-w-[390px] overflow-hidden bg-[linear-gradient(154deg,#ffffff_0%,#f7fcff_50%,#e2f2ff_100%)] px-5 pb-[calc(116px+env(safe-area-inset-bottom))] pt-6 shadow-[0_24px_70px_rgba(7,84,150,0.14)] sm:min-h-[820px] sm:rounded-[42px] sm:ring-1 sm:ring-sky-200/70">
        <StatusBar />
        <UserHeader name={name} />
        <UserHomeBalance saldo={saldo} />
        <UserQuickActions />
        <SikoutaPromoCard />
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-black leading-6 tracking-normal">Layanan Utama</h2>
            <Link href="/user/kategori" prefetch={false} className="text-[14px] font-semibold text-[#0067f5]">
              Lihat Semua
            </Link>
          </div>
          <UserCategoryGrid items={categories} />
        </section>
        <UserBottomNav />
      </div>
    </main>
  );
}
