import Link from "next/link";
import { Headset } from "lucide-react";
import { SUPPORT_WHATSAPP, SUPPORT_URL } from "@/lib/support";

export default function HelpPage() {
  return <main className="min-h-screen bg-[#EFFBFF] px-5 py-8 text-slate-900">
    <Headset className="h-8 w-8 text-sky-600" />
    <h1 className="mt-4 text-xl font-bold">Bantuan SiKouta</h1>
    <p className="mt-3 text-sm text-slate-600">{SUPPORT_WHATSAPP ? "Layanan pelanggan SiKouta" : "Layanan bantuan belum tersedia."}</p>
    <Link href={SUPPORT_WHATSAPP ? SUPPORT_URL : "/"} className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-sky-600 px-4 text-sm font-semibold !text-white">{SUPPORT_WHATSAPP ? "Hubungi bantuan" : "Kembali ke beranda"}</Link>
  </main>;
}
