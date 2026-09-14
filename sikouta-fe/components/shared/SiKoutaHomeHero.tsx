import Image from "next/image";

export function SiKoutaHomeHero() {
  return (
    <section aria-label="SiKouta" className="relative isolate min-h-[560px] w-full overflow-hidden rounded-b-[42px] bg-[linear-gradient(154deg,#188eff_0%,#0064db_52%,#02359f_100%)] px-8 pt-8 text-white">
      <div className="pointer-events-none absolute -left-20 -top-14 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-16 top-12 h-44 w-44 rounded-full bg-cyan-200/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[210px] bg-white" style={{ clipPath: "ellipse(88% 42% at 50% 100%)" }} />
      <Image src="/sikouta-assets/01_splash/city_illustration_bottom.png" alt="" fill priority sizes="(min-width:768px) 390px, 100vw" className="pointer-events-none object-cover object-bottom opacity-70" />

      <div className="relative flex items-center justify-between text-[17px] font-black leading-none">
        <span>9:41</span>
        <span className="h-3 w-16 rounded-full bg-white/90" />
      </div>

      <div className="relative mt-28 flex flex-col items-center text-center">
        <Image src="/sikouta-assets/01_splash/logo_symbol_large.png" alt="" width={145} height={145} priority className="h-[145px] w-[145px] object-contain drop-shadow-[0_22px_34px_rgba(1,32,111,0.32)]" />
        <Image src="/sikouta-assets/01_splash/brand_wordmark.png" alt="Sikouta" width={288} height={88} priority className="mt-5 h-auto w-[270px]" />
        <p className="mt-5 text-[19px] font-medium leading-8">Solusi Keuangan untuk Semua<br />Lebih Mudah, Lebih Dekat</p>
        <div className="mt-16 flex items-center gap-3" aria-hidden="true">
          <span className="h-2 w-12 rounded-full bg-white" />
          <span className="h-2 w-11 rounded-full bg-white/20" />
          <span className="h-2 w-11 rounded-full bg-white/20" />
        </div>
        <p className="mt-16 text-[17px] font-black leading-6 text-[#06184f]">
          Transaksi - Bayar - Isi Ulang<br />Dalam Satu Aplikasi
        </p>
      </div>
    </section>
  );
}
