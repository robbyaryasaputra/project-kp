import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import logoDinkes from "@/assets/logo-dinkes.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full max-w-[100vw] items-center justify-center overflow-hidden bg-neutral-50 px-4 py-8 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-blue-200/40 blur-3xl"
      />

      <div className="relative w-full min-w-0 max-w-6xl animate-slide-up">
        <div className="grid min-w-0 overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_32px_100px_-44px_rgba(15,23,42,0.35)] lg:min-h-[680px] lg:grid-cols-[1.03fr_0.97fr]">
          <section className="relative isolate flex min-h-[300px] min-w-0 flex-col overflow-hidden bg-[linear-gradient(145deg,#094f4f_0%,#176e93_52%,#51418f_100%)] p-7 text-white sm:min-h-[340px] sm:p-10 lg:min-h-0 lg:p-12">
            <div
              aria-hidden="true"
              className="bg-grid-dots-dark pointer-events-none absolute inset-0 opacity-30"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-36 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-[20rem] w-[20rem] rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
            />

            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-slate-950/10">
                <img
                  src={logoDinkes}
                  alt="Logo Dinas Kesehatan Kota Dumai"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">DINKES DUMAI</p>
                <p className="text-xs text-white/70">Layanan BPJS Kesehatan</p>
              </div>
            </div>

            <div className="relative mt-10 max-w-lg sm:mt-12 lg:my-auto lg:py-14">
              <h1 className="max-w-[13ch] text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                Mengelola layanan,{" "}
                <span className="text-cyan-200">menguatkan kesehatan.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
                Akses ruang kerja petugas untuk memverifikasi pendaftaran BPJS
                Kesehatan warga Kota Dumai dengan lebih mudah dan teratur.
              </p>
            </div>

            <p className="relative mt-8 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/50 lg:mt-0">
              Dinas Kesehatan Kota Dumai · Indonesia
            </p>
          </section>

          <section className="flex min-w-0 flex-col justify-center p-7 sm:p-10 lg:p-14">
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
                Ruang kerja petugas
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-4xl">
                Selamat datang
                <br className="hidden sm:block" /> kembali.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Masuk menggunakan akun administrator untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-neutral-700"
                >
                  Alamat email
                </Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    required
                    placeholder="nama@dinkes.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-neutral-700"
                  >
                    Kata sandi
                  </Label>
                  <span className="text-xs text-neutral-400">
                    Akses khusus petugas
                  </span>
                </div>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-4 top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 pr-12 text-sm focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-primary-600 via-blue-600 to-violet-600 text-sm font-bold shadow-lg shadow-blue-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:from-primary-700 hover:via-blue-700 hover:to-violet-700 hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Memproses...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-7 flex items-start gap-2.5 border-t border-neutral-100 pt-5 text-xs leading-5 text-neutral-500">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
                aria-hidden="true"
              />
              <p>
                Gunakan akun resmi Anda. Jangan bagikan kata sandi kepada siapa
                pun.
              </p>
            </div>
          </section>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-500">
          © 2026 Dinas Kesehatan Kota Dumai · Layanan Pendaftaran BPJS Mandiri
        </p>
      </div>
    </main>
  );
}
