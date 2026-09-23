"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import TurnstileWidget from "@/components/TurnstileWidget";
import { decodeJwt } from "@/lib/jwt";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const TURNSTILE_ENABLED = /^(1|true|yes|on)$/i.test(process.env.NEXT_PUBLIC_TURNSTILE_ENABLED || "");
// Ketersediaan akhir tetap ditentukan provider dari server (`getProviders`).
// Default aktif mencegah build lama mengunci tombol ketika konfigurasi server baru dipasang.
const GOOGLE_LOGIN_ENABLED = String(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED ?? "true").toLowerCase() === "true";

type PasswordLoginResp = { ok?: boolean; token?: string; role?: string; error?: string };

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

async function persistLoginToken(token: string) {
  const response = await fetch("/api/auth/persist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
    cache: "no-store",
  }).catch(() => null);

  return Boolean(response?.ok);
}

function normalizeGoogleNext(raw: string, fallback = "/user") {
  let current = (raw || "").trim() || fallback;
  for (let i = 0; i < 6; i += 1) {
    try {
      const url = current.startsWith("http://") || current.startsWith("https://")
        ? new URL(current)
        : new URL(current, "https://sikouta.local");
      if (url.pathname === "/login") {
        const nested = (url.searchParams.get("callbackUrl") || "").trim();
        if (nested) { current = nested; continue; }
      }
      if (url.pathname === "/auth/google/complete") {
        const nested = (url.searchParams.get("next") || "").trim();
        if (nested) { current = nested; continue; }
      }
      return `${url.pathname}${url.search}${url.hash}` || fallback;
    } catch {
      return current.startsWith("/") ? current : fallback;
    }
  }
  return current.startsWith("/") ? current : fallback;
}

function toDashboardByRole(role?: string | null) {
  const r = (role || "").toLowerCase();
  if (r === "admin" || r === "staff") return "/dashboard/admin";
  if (r === "auditor") return "/dashboard/auditor";
  if (r === "analis" || r === "analyst") return "/dashboard/master/operator";
  if (r === "master") return "/dashboard/master";
  if (r === "user" || r === "agent") return "/user";
  if (r === "operator_trx") return "/dashboard/operator";
  if (r === "operator_wallet") return "/dashboard/wallet";
  return "/dashboard/member";
}

export function LoginCard() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [shake, setShake] = useState(false);
  const loginCallbackUrl = normalizeGoogleNext((searchParams.get("callbackUrl") || "").trim(), "/user");
  const googleCallbackUrl = `/auth/google/complete?${new URLSearchParams({ next: loginCallbackUrl }).toString()}`;
  const canUseGoogleLogin = GOOGLE_LOGIN_ENABLED && googleAvailable && !loading;

  useEffect(() => {
    setTurnstileToken(TURNSTILE_ENABLED ? "" : "dev-bypass");
  }, []);

  useEffect(() => {
    if (!GOOGLE_LOGIN_ENABLED) return;
    void (async () => {
      const providers = await getProviders().catch(() => null);
      setGoogleAvailable(Boolean(providers?.google));
    })();
  }, []);

  useEffect(() => {
    if (!err) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 520);
    return () => clearTimeout(t);
  }, [err]);

  useEffect(() => {
    const googleStatus = (searchParams.get("google") || "").trim();
    const authError = (searchParams.get("error") || "").trim();
    if (googleStatus === "not_configured") {
      setErr("Login Google belum tersambung. Isi Client ID dan Client Secret Google terlebih dulu.");
      return;
    }
    if (authError) {
      setErr("Login Google gagal atau dibatalkan. Coba masuk ulang.");
    }
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setErr("Selesaikan verifikasi keamanan.");
      return;
    }
    setLoading(true);
    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, turnstileToken }),
        cache: "no-store",
      });
      const loginBody = (await loginResponse.json().catch(() => ({}))) as PasswordLoginResp;
      const backendToken = String(loginBody.token || "").trim();
      if (!loginResponse.ok || !loginBody.ok || !backendToken) {
        setErr("Email atau password salah.");
        return;
      }

      if (!(await persistLoginToken(backendToken))) {
        setErr("Sesi login belum tersimpan. Silakan coba lagi.");
        return;
      }

      localStorage.setItem("auth_token", backendToken);
      localStorage.setItem("auth_source", "password");

      // `/api/auth/login` sudah membuat cookie HttpOnly dan mengembalikan token
      // backend. Jangan jalankan login NextAuth kedua karena dua perubahan sesi
      // bersamaan memicu kedipan/navigasi ganda terutama di Safari mobile.
      window.location.replace(toDashboardByRole(loginBody.role || decodeJwt(backendToken)?.role || "member"));
    } catch {
      setErr("Koneksi login gagal. Periksa jaringan lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={cn("min-h-svh bg-[#dceeff] text-[#07194f] sm:py-4", shake && "auth-shake")}>
      <div className="relative mx-auto min-h-svh w-full max-w-md overflow-hidden bg-[linear-gradient(154deg,#fdfefe_0%,#f8fcff_54%,#e2f2ff_100%)] px-7 pb-8 pt-6 shadow-[0_24px_70px_rgba(7,84,150,0.14)] sm:min-h-[820px] sm:rounded-[42px] sm:ring-1 sm:ring-sky-200/70">
        <div className="pointer-events-none absolute -left-20 top-28 h-56 w-56 rotate-[64deg] bg-white/70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden">
          <div className="absolute -bottom-20 left-1/2 h-48 w-[560px] -translate-x-1/2 rounded-[50%] bg-[#d8ecff]" />
          <div className="absolute -bottom-24 left-1/2 h-44 w-[520px] -translate-x-[42%] rounded-[50%] bg-[#b8ddff]/65" />
        </div>

        <div className="relative mx-auto mt-12 flex max-w-[330px] flex-col items-center text-center">
          <Image src="/sikouta-assets/02_login/logo_symbol.png" alt="" width={118} height={118} priority className="h-[118px] w-[118px] object-contain" />
          <Image src="/sikouta-assets/02_login/brand_wordmark.png" alt="Sikouta" width={230} height={70} priority className="mt-1 h-auto w-[205px] object-contain" />
          <h1 className="mt-3 text-[22px] font-black leading-7 tracking-normal">Masuk ke akun Anda</h1>
          <p className="mt-2 max-w-[280px] text-[17px] font-medium leading-6 text-[#2d4a84]">
            Nikmati kemudahan bertransaksi bersama Sikouta
          </p>
        </div>

        <div className="relative mt-8">

        {err && (
          <div className="mb-4 flex items-start gap-2.5 rounded-[14px] border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#168AF2]" />
            <p className="text-[13px] font-medium text-sky-700">{err}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="sr-only">Email</label>
            <div className="flex h-[62px] items-center gap-3 rounded-[15px] border border-[#bfd5f4] bg-white px-4 shadow-[0_8px_22px_rgba(22,91,155,0.04)] transition focus-within:border-[#0876f2] focus-within:ring-4 focus-within:ring-sky-100">
              <span className="grid h-9 w-9 shrink-0 place-items-center text-[#344569]">
                <Mail className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <input
                  className="h-9 w-full min-w-0 bg-transparent text-[16px] font-semibold text-[#06184f] outline-none placeholder:font-medium placeholder:text-[#7c93bc]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email atau No. HP"
                  autoComplete="username"
                  type="email"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="sr-only">PIN / Password</label>
            <div className="relative flex h-[62px] items-center gap-3 rounded-[15px] border border-[#bfd5f4] bg-white px-4 shadow-[0_8px_22px_rgba(22,91,155,0.04)] transition focus-within:border-[#0876f2] focus-within:ring-4 focus-within:ring-sky-100">
              <span className="grid h-9 w-9 shrink-0 place-items-center text-[#344569]">
                <LockKeyhole className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1 pr-9">
                <input
                  className="h-9 w-full min-w-0 bg-transparent text-[16px] font-semibold text-[#06184f] outline-none placeholder:font-medium placeholder:text-[#7c93bc]"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-600"
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-[14px] font-black text-[#0067f5] hover:underline">
              Lupa Password?
            </Link>
          </div>

          {/* Turnstile - interaction-only, tidak tampil kalau sudah verified */}
          {TURNSTILE_ENABLED && !turnstileToken && (
            <div className="overflow-hidden rounded-xl">
              <TurnstileWidget
                siteKey={SITE_KEY}
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
                appearance="interaction-only"
              />
            </div>
          )}

          {/* Login Button */}
          <button
            className="group relative mt-2 flex h-[64px] w-full items-center justify-center gap-3 rounded-[15px] bg-[linear-gradient(135deg,#168cff_0%,#0066ea_100%)] text-[20px] font-black text-white shadow-[0_14px_30px_rgba(22,120,242,0.26)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            disabled={(TURNSTILE_ENABLED && !turnstileToken) || loading}
            type="submit"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>

          <div className="flex items-center gap-3 pt-4">
            <div className="h-px flex-1 bg-[#cbdcf2]" />
            <span className="text-[14px] font-medium text-[#2d4a84]">atau masuk dengan</span>
            <div className="h-px flex-1 bg-[#cbdcf2]" />
          </div>

          <div className="grid grid-cols-1">
            <button
              type="button"
              className="flex h-[62px] items-center justify-center gap-3 rounded-[15px] border border-slate-200 bg-white text-[18px] font-black text-[#06184f] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-all hover:border-sky-200 hover:bg-sky-50/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canUseGoogleLogin}
              onClick={() => {
                if (!canUseGoogleLogin) {
                  setErr(GOOGLE_LOGIN_ENABLED ? "Login Google belum dikonfigurasi." : "Login Google belum aktif.");
                  return;
                }
                void signIn("google", { callbackUrl: googleCallbackUrl });
              }}
            >
              <Image src="/google.svg" alt="" width={27} height={27} aria-hidden="true" />
              <span>Google</span>
            </button>
          </div>

          <p className="pt-4 text-center text-[15px] font-medium text-[#2d4a84]">
            Belum punya akun?{" "}
            <Link href="/register" className="font-black text-[#0067f5]">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
      </div>
    </section>
  );
}
