import Image from "next/image";

export function SiKoutaHomeHero() {
  return (
    <section aria-label="SiKouta" className="relative isolate min-h-dvh w-full overflow-hidden bg-[#dceeff] text-white sm:py-4">
      <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-hidden bg-[linear-gradient(154deg,#188eff_0%,#0064db_52%,#02359f_100%)] px-9 pt-7 shadow-[0_24px_70px_rgba(7,84,150,0.2)] sm:min-h-[820px] sm:rounded-[42px] sm:ring-1 sm:ring-sky-200/70">
      <div className="pointer-events-none absolute -left-20 -top-14 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute left-9 top-40 h-[360px] w-[360px] rounded-full bg-[#001a77]/10" />
      <div className="pointer-events-none absolute -right-16 top-12 h-44 w-44 rounded-full bg-cyan-200/15" />
      <div className="pointer-events-none absolute -right-24 bottom-80 h-48 w-48 rounded-full bg-sky-100/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[328px] bg-white" style={{ clipPath: "ellipse(96% 42% at 50% 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[185px]">
        <Image src="/sikouta-assets/01_splash/city_illustration_bottom.png" alt="" fill priority sizes="430px" className="object-contain object-bottom" />
      </div>

      <div className="relative flex items-center justify-between text-[17px] font-black leading-none">
        <span className="h-3 w-16 rounded-full bg-white/90" />
      </div>

      <div className="relative mt-[18svh] flex flex-col items-center text-center sm:mt-32">
        <Image src="/sikouta-assets/01_splash/logo_symbol_large.png" alt="" width={170} height={170} priority className="h-[150px] w-[150px] object-contain drop-shadow-[0_22px_34px_rgba(1,32,111,0.32)]" />
        <Image src="/sikouta-assets/01_splash/brand_wordmark.png" alt="Sikouta" width={288} height={88} priority className="mt-5 h-auto w-[270px] object-contain drop-shadow-[0_10px_20px_rgba(1,32,111,0.16)]" />
        <p className="mt-6 text-[20px] font-medium leading-8">Solusi Keuangan untuk Semua<br />Lebih Mudah, Lebih Dekat</p>
        <div className="mt-[8.5svh] flex items-center gap-3 sm:mt-16" aria-hidden="true">
          <span className="h-2 w-12 rounded-full bg-white shadow-[0_4px_10px_rgba(255,255,255,0.35)]" />
          <span className="h-2 w-11 rounded-full bg-white/20" />
          <span className="h-2 w-11 rounded-full bg-white/20" />
        </div>
      </div>

      <p className="absolute inset-x-0 bottom-[192px] px-10 text-center text-[18px] font-black leading-7 text-[#06184f]">
        Transaksi - Bayar - Isi Ulang<br />Dalam Satu Aplikasi
      </p>
      </div>
    </section>
  );
}
