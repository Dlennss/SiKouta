"use client";

import Image from "next/image";
import Link from "next/link";

type CategoryVisual = {
  iconSrc: string;
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
      return { iconSrc: "/sikouta-assets/icons-home-hd/pulsa.png" };
    case "e-money":
    case "e-wallet":
      return { iconSrc: "/sikouta-assets/icons-home-hd/ewallet.png" };
    case "paket data":
      return { iconSrc: "/sikouta-assets/icons-home-hd/paket-data.png" };
    case "listrik":
    case "pln":
    case "listrik pln":
      return { iconSrc: "/sikouta-assets/06_service_icons/listrik_pln_icon.png" };
    case "game":
      return { iconSrc: "/sikouta-assets/icons-hd/voucher-game.png" };
    case "tv":
    case "tv kabel":
      return { iconSrc: "/sikouta-assets/06_service_icons/tv_kabel_icon.png" };
    case "pdam":
      return { iconSrc: "/sikouta-assets/icons-hd/pdam.png" };
    case "bpjs":
      return { iconSrc: "/sikouta-assets/icons-hd/bpjs.png" };
    case "internet pascabayar":
      return { iconSrc: "/sikouta-assets/icons-hd/internet-wifi.png" };
    case "hp pascabayar":
      return { iconSrc: "/sikouta-assets/icons-home-hd/telepon.png" };
    case "masa aktif":
      return { iconSrc: "/sikouta-assets/icons-home-hd/telepon.png" };
    case "paket telepon":
    case "telepon":
      return { iconSrc: "/sikouta-assets/icons-home-hd/telepon.png" };
    case "sms":
      return { iconSrc: "/sikouta-assets/icons-home-hd/sms.png" };
    case "voucher":
      return { iconSrc: "/sikouta-assets/icons-hd/voucher-digital.png" };
    case "aktivasi perdana":
      return { iconSrc: "/sikouta-assets/icons-hd/esim-roaming.png" };
    case "gas negara":
      return { iconSrc: "/sikouta-assets/icons-hd/gas-pgn.png" };
    case "transfer bank":
      return { iconSrc: "/sikouta-assets/icons-hd/transfer-bank.png" };
    case "qris":
    case "pembayaran qris":
      return { iconSrc: "/sikouta-assets/icons-hd/qris.png" };
    case "uang elektronik":
      return { iconSrc: "/sikouta-assets/icons-hd/uang-elektronik.png" };
    case "kartu kredit":
      return { iconSrc: "/sikouta-assets/icons-hd/kartu-kredit.png" };
    case "asuransi":
      return { iconSrc: "/sikouta-assets/icons-hd/asuransi.png" };
    case "streaming":
    case "streaming & musik":
      return { iconSrc: "/sikouta-assets/icons-hd/streaming-musik.png" };
    case "klinik":
    case "kesehatan":
    case "klinik & kesehatan":
      return { iconSrc: "/sikouta-assets/icons-hd/klinik-kesehatan.png" };
    case "uang sekolah":
      return { iconSrc: "/sikouta-assets/icons-hd/uang-sekolah.png" };
    case "cicilan kendaraan":
      return { iconSrc: "/sikouta-assets/icons-hd/cicilan-kendaraan.png" };
    case "cicilan multifinance":
      return { iconSrc: "/sikouta-assets/icons-hd/cicilan-multifinance.png" };
    case "pbb":
      return { iconSrc: "/sikouta-assets/icons-hd/pbb.png" };
    case "pajak":
    case "pajak & negara":
      return { iconSrc: "/sikouta-assets/icons-hd/pajak-negara.png" };
    case "tiket":
    case "tiket perjalanan":
      return { iconSrc: "/sikouta-assets/icons-hd/tiket-perjalanan.png" };
    case "saldo kartu tol":
      return { iconSrc: "/sikouta-assets/icons-hd/saldo-kartu-tol.png" };
    case "parkir digital":
      return { iconSrc: "/sikouta-assets/icons-hd/parkir-digital.png" };
    case "kurir":
    case "pengiriman":
    case "kurir & pengiriman":
      return { iconSrc: "/sikouta-assets/icons-hd/kurir-pengiriman.png" };
    case "zakat":
    case "donasi":
    case "zakat & donasi":
      return { iconSrc: "/sikouta-assets/icons-hd/zakat-donasi.png" };
    case "lainnya":
      return { iconSrc: "/sikouta-assets/icons-home-hd/lainnya.png" };
    default:
      return { iconSrc: "/sikouta-assets/06_service_icons/lainnya_icon.png" };
  }
}

export function CategoryShortcutLink({ href, label, visualName }: CategoryShortcutLinkProps) {
  const visual = getCategoryVisual(visualName);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="group flex min-h-[86px] min-w-0 flex-col items-center justify-start gap-1.5 rounded-[14px] px-0 py-0.5 text-center transition duration-200 hover:-translate-y-0.5"
    >
      <div className="grid aspect-square w-full max-w-[58px] shrink-0 place-items-center overflow-hidden rounded-[16px] bg-white shadow-[0_10px_20px_rgba(6,43,116,0.10)] ring-1 ring-sky-100/90 transition-transform duration-200 group-hover:scale-105">
        <Image
          src={visual.iconSrc}
          alt=""
          width={46}
          height={46}
          className="h-[46px] w-[46px] object-contain drop-shadow-[0_8px_10px_rgba(22,138,242,0.10)]"
        />
      </div>
      <span className="block px-0.5">
        <span className="line-clamp-2 text-[12px] font-bold leading-4 text-[#06184f]">
          {label}
        </span>
      </span>
    </Link>
  );
}
