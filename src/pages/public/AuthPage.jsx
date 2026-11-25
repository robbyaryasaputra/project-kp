import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import logoDinkes from "@/assets/logo-dinkes.jpg";
import faskesBg from "@/assets/faskes-bg.jpg";
import heroFamily from "@/assets/hero-family.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/register";
  const reduceMotion = useReducedMotion();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginForm.email) errs.email = "Email wajib diisi";
    if (!loginForm.password) errs.password = "Password wajib diisi";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) throw error;
      toast.success("Berhasil masuk!");
      navigate(redirectTo);
    } catch (err) {
      toast.error(
        "Login gagal: " + (err.message || "Periksa email dan password"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!registerForm.full_name.trim()) errs.full_name = "Nama wajib diisi";
    if (!registerForm.email) errs.email = "Email wajib diisi";
    if (!registerForm.password || registerForm.password.length < 6)
      errs.password = "Password minimal 6 karakter";
    if (registerForm.password !== registerForm.confirmPassword)
      errs.confirmPassword = "Password tidak cocok";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: { full_name: registerForm.full_name },
        },
      });
      if (error) throw error;
      toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      navigate(redirectTo);
    } catch (err) {
      toast.error("Registrasi gagal: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setErrors({});
    setShowPassword(false);
  };

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: null }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: null }));
  };

  return (
    <div className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:py-14">
      {/* ── Cinematic Moving Background (Fasilitas Kesehatan Kota Dumai / Ken Burns Drift) ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                scale: [1, 1.07, 1.03, 1],
                x: ["0%", "-2%", "1%", "0%"],
                y: ["0%", "1.5%", "-0.8%", "0%"],
              }
          }
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-14 bg-cover bg-center"
          style={{ backgroundImage: `url(${faskesBg})` }}
        />

        {/* Multi-layered Cinematic Scrim: deep rich teal-slate atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#021d1b]/92 via-[#043330]/82 to-[#011413]/94 backdrop-blur-[3px]" />

        {/* Subtle Ambient Radial Dots Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_0.75px,transparent_1px)] [background-size:26px_26px] opacity-[0.10]" />

        {/* Ambient Luminous Orbs */}
        <div className="absolute -left-28 top-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-28 bottom-1/4 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* ── Top Floating Navigation ── */}
        <div className="mb-4 flex items-center px-1 sm:mb-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 shadow-sm backdrop-blur-md no-underline transition-all duration-200 hover:border-white/40 hover:bg-white/20 hover:text-white hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* ── The Floating Master Card ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid min-w-0 w-full overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-[0_32px_100px_-20px_rgba(2,26,26,0.65),0_12px_40px_-15px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:min-h-[640px] lg:grid-cols-[0.95fr_1.05fr]"
        >
          {/* Left Hero Aside */}
          <aside className="relative isolate flex min-h-[220px] min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#063b3b] via-[#095555] to-[#0e5c6a] p-6 text-white sm:min-h-[260px] sm:p-9 lg:min-h-0 lg:p-11">
            {/* Subtle photographic underlay blending into the deep teal */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-15 mix-blend-overlay"
              style={{ backgroundImage: `url(${heroFamily})` }}
            />

            {/* Ambient geometric glass rings */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl"
            />

            {/* Top Branding */}
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md shadow-emerald-950/20 ring-2 ring-white/30">
                <img
                  src={logoDinkes}
                  alt="Logo Dinas Kesehatan Kota Dumai"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-white">DINKES KOTA DUMAI</p>
                <p className="text-xs text-white/75">Layanan Kota Dumai</p>
              </div>
            </div>

            {/* Middle Editorial Content */}
            <div className="relative my-8 max-w-md sm:my-10 lg:my-auto lg:py-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-cyan-100 backdrop-blur-sm">
                <HeartPulse className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span>Portal JKN BPJS Gratis APBD</span>
              </div>
              <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.65rem]">
                Kesehatan lebih dekat, mulai dari sini.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                Buat akun untuk memulai pendaftaran BPJS Kesehatan secara mandiri di
                Kota Dumai. 100% bebas iuran ditanggung APBD.
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/85">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  1 Akun = 1 KK
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                  Data Terlindungi
                </span>
              </div>
            </div>

            {/* Bottom Footer Stamp */}
            <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              <span>Dinas Kesehatan Kota Dumai</span>
              <span>UHC Kota Dumai</span>
            </div>
          </aside>

          {/* Right Form Section */}
          <section className="flex min-w-0 flex-col justify-center bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                Portal pendaftaran
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-4xl">
                {tab === "login" ? "Selamat datang." : "Buat akun Anda."}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {tab === "login"
                  ? "Masuk untuk melanjutkan proses pendaftaran."
                  : "Isi data berikut untuk memulai pendaftaran."}
              </p>
            </div>

            <div
              className="mb-7 grid grid-cols-2 rounded-xl bg-neutral-100 p-1"
              role="tablist"
              aria-label="Pilih masuk atau daftar"
            >
              <button
                type="button"
                role="tab"
                id="login-tab"
                aria-selected={tab === "login"}
                aria-controls="auth-panel"
                onClick={() => changeTab("login")}
                className={`min-h-10 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${tab === "login"
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                  }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                id="register-tab"
                aria-selected={tab === "register"}
                aria-controls="auth-panel"
                onClick={() => changeTab("register")}
                className={`min-h-10 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${tab === "register"
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                  }`}
              >
                Daftar akun
              </button>
            </div>

            <div
              id="auth-panel"
              role="tabpanel"
              aria-labelledby={tab === "login" ? "login-tab" : "register-tab"}
            >
              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="nama@email.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "login-email-error" : undefined}
                        className={`h-12 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 focus:bg-white ${errors.email ? "border-red-400 focus:border-red-500" : ""
                          }`}
                        value={loginForm.email}
                        onChange={(e) => updateLoginField("email", e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p id="login-email-error" className="text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "login-password-error" : undefined
                        }
                        className={`h-12 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 pr-12 focus:bg-white ${errors.password ? "border-red-400 focus:border-red-500" : ""
                          }`}
                        value={loginForm.password}
                        onChange={(e) =>
                          updateLoginField("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword ? "Sembunyikan password" : "Tampilkan password"
                        }
                        aria-pressed={showPassword}
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="login-password-error" className="text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl text-sm font-bold shadow-md shadow-primary-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Masuk
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-name"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Nama lengkap
                    </Label>
                    <div className="relative">
                      <UserRound
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="reg-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Nama sesuai KTP"
                        aria-invalid={Boolean(errors.full_name)}
                        aria-describedby={
                          errors.full_name ? "reg-name-error" : undefined
                        }
                        className={`h-11 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 focus:bg-white ${errors.full_name
                            ? "border-red-400 focus:border-red-500"
                            : ""
                          }`}
                        value={registerForm.full_name}
                        onChange={(e) =>
                          updateRegisterField("full_name", e.target.value)
                        }
                      />
                    </div>
                    {errors.full_name && (
                      <p id="reg-name-error" className="text-xs text-red-600">
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="nama@email.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "reg-email-error" : undefined}
                        className={`h-11 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 focus:bg-white ${errors.email ? "border-red-400 focus:border-red-500" : ""
                          }`}
                        value={registerForm.email}
                        onChange={(e) =>
                          updateRegisterField("email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <p id="reg-email-error" className="text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-password"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="reg-password"
                        name="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimal 6 karakter"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "reg-password-error" : undefined
                        }
                        className={`h-11 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 pr-12 focus:bg-white ${errors.password ? "border-red-400 focus:border-red-500" : ""
                          }`}
                        value={registerForm.password}
                        onChange={(e) =>
                          updateRegisterField("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword ? "Sembunyikan password" : "Tampilkan password"
                        }
                        aria-pressed={showPassword}
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="reg-password-error" className="text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-confirm"
                      className="text-sm font-semibold text-neutral-700"
                    >
                      Konfirmasi password
                    </Label>
                    <div className="relative">
                      <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="reg-confirm"
                        name="confirm-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Ulangi password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={
                          errors.confirmPassword
                            ? "reg-confirm-error"
                            : undefined
                        }
                        className={`h-11 rounded-xl border-neutral-200 bg-neutral-50/70 pl-11 focus:bg-white ${errors.confirmPassword
                            ? "border-red-400 focus:border-red-500"
                            : ""
                          }`}
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          updateRegisterField("confirmPassword", e.target.value)
                        }
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p id="reg-confirm-error" className="text-xs text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl text-sm font-bold shadow-md shadow-primary-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Membuat akun...
                      </>
                    ) : (
                      <>
                        Buat akun
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            <p className="mt-6 border-t border-neutral-100 pt-5 text-center text-sm text-neutral-500">
              {tab === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => changeTab("register")}
                    className="font-semibold text-primary-700 hover:text-primary-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Daftar akun
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => changeTab("login")}
                    className="font-semibold text-primary-700 hover:text-primary-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Masuk
                  </button>
                </>
              )}
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
