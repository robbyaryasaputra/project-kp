import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield, Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/register";

  const [tab, setTab] = useState("login"); // "login" | "register"
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

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginForm.email) errs.email = "Email wajib diisi";
    if (!loginForm.password) errs.password = "Password wajib diisi";
    if (Object.keys(errs).length) { setErrors(errs); return; }

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
      toast.error("Login gagal: " + (err.message || "Periksa email dan password"));
    } finally {
      setLoading(false);
    }
  };

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!registerForm.full_name.trim()) errs.full_name = "Nama wajib diisi";
    if (!registerForm.email) errs.email = "Email wajib diisi";
    if (!registerForm.password || registerForm.password.length < 6)
      errs.password = "Password minimal 6 karakter";
    if (registerForm.password !== registerForm.confirmPassword)
      errs.confirmPassword = "Password tidak cocok";
    if (Object.keys(errs).length) { setErrors(errs); return; }

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

  const changeTab = (t) => {
    setTab(t);
    setErrors({});
    setShowPassword(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Portal BPJS Kesehatan</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {tab === "login"
              ? "Masuk untuk melanjutkan pendaftaran"
              : "Buat akun untuk mulai mendaftar BPJS"}
          </p>
        </div>

        <Card className="shadow-lg border-neutral-200">
          {/* Tab switcher */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => changeTab("login")}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "login"
                  ? "text-primary-700 border-b-2 border-primary-600 -mb-px bg-primary-50/50"
                  : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              Masuk
            </button>
            <button
              onClick={() => changeTab("register")}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "register"
                  ? "text-primary-700 border-b-2 border-primary-600 -mb-px bg-primary-50/50"
                  : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              Daftar Akun
            </button>
          </div>

          <CardContent className="p-6">
            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      className={`pl-9 ${errors.email ? "border-red-400" : ""}`}
                      value={loginForm.email}
                      onChange={(e) => {
                        setLoginForm((p) => ({ ...p, email: e.target.value }));
                        if (errors.email) setErrors((p) => ({ ...p, email: null }));
                      }}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-9 pr-10 ${errors.password ? "border-red-400" : ""}`}
                      value={loginForm.password}
                      onChange={(e) => {
                        setLoginForm((p) => ({ ...p, password: e.target.value }));
                        if (errors.password) setErrors((p) => ({ ...p, password: null }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : "Masuk"}
                </Button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="reg-name"
                      placeholder="Nama sesuai KTP"
                      className={`pl-9 ${errors.full_name ? "border-red-400" : ""}`}
                      value={registerForm.full_name}
                      onChange={(e) => {
                        setRegisterForm((p) => ({ ...p, full_name: e.target.value }));
                        if (errors.full_name) setErrors((p) => ({ ...p, full_name: null }));
                      }}
                    />
                  </div>
                  {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="nama@email.com"
                      className={`pl-9 ${errors.email ? "border-red-400" : ""}`}
                      value={registerForm.email}
                      onChange={(e) => {
                        setRegisterForm((p) => ({ ...p, email: e.target.value }));
                        if (errors.email) setErrors((p) => ({ ...p, email: null }));
                      }}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 karakter"
                      className={`pl-9 pr-10 ${errors.password ? "border-red-400" : ""}`}
                      value={registerForm.password}
                      onChange={(e) => {
                        setRegisterForm((p) => ({ ...p, password: e.target.value }));
                        if (errors.password) setErrors((p) => ({ ...p, password: null }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      className={`pl-9 ${errors.confirmPassword ? "border-red-400" : ""}`}
                      value={registerForm.confirmPassword}
                      onChange={(e) => {
                        setRegisterForm((p) => ({ ...p, confirmPassword: e.target.value }));
                        if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: null }));
                      }}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Membuat Akun...</>
                  ) : (
                    "Buat Akun"
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-neutral-500 mt-5">
              {tab === "login" ? (
                <>Belum punya akun?{" "}
                  <button onClick={() => changeTab("register")} className="text-primary-600 font-semibold hover:underline">
                    Daftar Akun
                  </button>
                </>
              ) : (
                <>Sudah punya akun?{" "}
                  <button onClick={() => changeTab("login")} className="text-primary-600 font-semibold hover:underline">
                    Masuk
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-neutral-400 mt-6">
          <Link to="/" className="hover:text-primary-500 transition-colors no-underline">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}

