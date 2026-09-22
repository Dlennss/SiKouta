"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownUp,
  BadgeDollarSign,
  Bolt,
  Cable,
  Car,
  CreditCard,
  Flame,
  Gamepad2,
  GraduationCap,
  Grid2X2,
  HandHeart,
  HeartPulse,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Ticket,
  Truck,
  WalletCards,
  Wifi,
} from "lucide-react";

type CategoryVisual = {
  Icon: LucideIcon;
  className: string;
};

type CategoryShortcutLinkProps = {
  href: string;
  label: string;
  visualName: string;
};

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function getCategoryVisual(name: string): CategoryVisual {
  const value = normalizeName(name);

  switch (value) {
    case "pulsa":
    case "pulsa data":
    case "pulsa & data":
      return { Icon: Smartphone, className: "text-[#168cff]" };
    case "e-money":
    case "e-wallet":
      return { Icon: WalletCards, className: "text-[#168cff]" };
    case "paket data":
      return { Icon: ArrowDownUp, className: "text-[#168cff]" };
    case "listrik":
    case "pln":
    case "listrik pln":
      return { Icon: Bolt, className: "text-[#ffad1f]" };
    case "game":
      return { Icon: Gamepad2, className: "text-[#168cff]" };
    case "tv":
    case "tv kabel":
      return { Icon: Cable, className: "text-[#168cff]" };
    case "pdam":
      return { Icon: Grid2X2, className: "text-[#168cff]" };
    case "bpjs":
      return { Icon: ShieldCheck, className: "text-[#15bf77]" };
    case "internet pascabayar":
      return { Icon: Wifi, className: "text-[#168cff]" };
    case "hp pascabayar":
      return { Icon: Phone, className: "text-[#15bf77]" };
    case "masa aktif":
      return { Icon: Phone, className: "text-[#15bf77]" };
    case "paket telepon":
    case "telepon":
      return { Icon: Phone, className: "text-[#15bf77]" };
    case "sms":
      return { Icon: Mail, className: "text-[#ffb21f]" };
    case "voucher":
      return { Icon: Ticket, className: "text-[#168cff]" };
    case "aktivasi perdana":
      return { Icon: Smartphone, className: "text-[#168cff]" };
    case "gas negara":
      return { Icon: Flame, className: "text-[#ffad1f]" };
    case "transfer bank":
      return { Icon: ArrowDownUp, className: "text-[#168cff]" };
    case "qris":
    case "pembayaran qris":
      return { Icon: QrCode, className: "text-[#168cff]" };
    case "uang elektronik":
      return { Icon: WalletCards, className: "text-[#168cff]" };
    case "kartu kredit":
      return { Icon: CreditCard, className: "text-[#168cff]" };
    case "asuransi":
      return { Icon: ShieldCheck, className: "text-[#15bf77]" };
    case "streaming":
    case "streaming & musik":
      return { Icon: Cable, className: "text-[#168cff]" };
    case "klinik":
    case "kesehatan":
    case "klinik & kesehatan":
      return { Icon: HeartPulse, className: "text-[#15bf77]" };
    case "uang sekolah":
      return { Icon: GraduationCap, className: "text-[#168cff]" };
    case "cicilan kendaraan":
      return { Icon: Car, className: "text-[#168cff]" };
    case "cicilan multifinance":
      return { Icon: BadgeDollarSign, className: "text-[#168cff]" };
    case "pbb":
      return { Icon: BadgeDollarSign, className: "text-[#168cff]" };
    case "pajak":
    case "pajak & negara":
      return { Icon: BadgeDollarSign, className: "text-[#168cff]" };
    case "tiket":
    case "tiket perjalanan":
      return { Icon: Ticket, className: "text-[#168cff]" };
    case "saldo kartu tol":
      return { Icon: CreditCard, className: "text-[#168cff]" };
    case "parkir digital":
      return { Icon: Car, className: "text-[#168cff]" };
    case "kurir":
    case "pengiriman":
    case "kurir & pengiriman":
      return { Icon: Truck, className: "text-[#168cff]" };
    case "zakat":
    case "donasi":
    case "zakat & donasi":
      return { Icon: HandHeart, className: "text-[#15bf77]" };
    case "lainnya":
      return { Icon: Grid2X2, className: "text-[#6b7d95]" };
    default:
      return { Icon: Grid2X2, className: "text-[#6b7d95]" };
  }
}

export function CategoryShortcutLink({ href, label, visualName }: CategoryShortcutLinkProps) {
  const visual = getCategoryVisual(visualName);
  const Icon = visual.Icon;

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="group flex min-h-[86px] min-w-0 flex-col items-center justify-start gap-1.5 rounded-[14px] px-0 py-0.5 text-center transition duration-200 hover:-translate-y-0.5"
    >
      <div className="grid aspect-square w-full max-w-[60px] shrink-0 place-items-center rounded-[16px] bg-white shadow-[0_10px_20px_rgba(6,43,116,0.10)] ring-1 ring-sky-100/90 transition-transform duration-200 group-hover:scale-105">
        <Icon aria-hidden="true" className={`h-8 w-8 ${visual.className}`} strokeWidth={2.8} />
      </div>
      <span className="block px-0.5">
        <span className="line-clamp-2 text-[12px] font-bold leading-4 text-[#06184f]">
          {label}
        </span>
      </span>
    </Link>
  );
}
