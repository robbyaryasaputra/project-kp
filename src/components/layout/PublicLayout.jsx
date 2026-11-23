import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Home,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import logoDinkes from "@/assets/logo-dinkes.jpg";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const reduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Instantly reset scroll to top on page switch & auto-close mobile menu
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/register", label: "Daftar BPJS", icon: FileText },
    { to: "/cek-status", label: "Cek Status", icon: Search },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Berhasil keluar");
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userInitial = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Top Route Transition Loading Bar (Pure GPU Keyframe Animation) ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2.5px] overflow-hidden">
        <motion.div
          key={location.pathname}
          initial={
            reduceMotion ? { width: "100%", opacity: 0 } : { width: "0%", opacity: 1 }
          }
          animate={
            reduceMotion
              ? { width: "100%", opacity: 0 }
              : {
                width: ["0%", "35%", "85%", "100%"],
                opacity: [1, 1, 1, 0],
              }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                duration: 0.45,
                times: [0, 0.25, 0.65, 1],
                ease: [0.16, 1, 0.3, 1],
              }
          }
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.9)] relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/70 blur-xs" />
        </motion.div>
      </div>

      {/* ── Modern Minimalist Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary-900 text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 no-underline group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <img
                  src={logoDinkes}
                  alt="Logo Dinas Kesehatan Kota Dumai"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-emerald-200 sm:text-base">
                  DINKES KOTA DUMAI
                </span>
                <p className="mt-0.5 hidden text-[10px] leading-tight text-white/60 sm:block">
                  APBD Kota Dumai
                </p>
              </div>
            </Link>

            <nav className="relative hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] p-1 md:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative z-10 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs no-underline transition-colors duration-200 ${isActive
                      ? "font-semibold text-primary-950"
                      : "font-medium text-white/70 hover:text-white"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="publicNavActivePill"
                        className="absolute inset-0 -z-10 rounded-full border border-white/80 bg-white shadow-sm"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }
                        }
                      />
                    )}
                    <Icon
                      className={`h-3.5 w-3.5 transition-colors duration-200 ${isActive ? "text-emerald-700" : "text-white/50"
                        }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: Auth Buttons + Mobile Hamburger */}
            <div className="flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <div className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/10 p-1 pl-2 sm:flex">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-primary-950">
                        {userInitial}
                      </div>
                      <span className="max-w-[120px] truncate text-xs font-medium leading-none text-white/90">
                        {displayName}
                      </span>
                      <button
                        onClick={handleSignOut}
                        title="Keluar"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="hidden items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-950/25 no-underline transition-all duration-200 hover:bg-red-500 hover:shadow-red-600/35 active:scale-95 sm:inline-flex"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>LOGIN</span>
                    </Link>
                  )}

                </>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="cursor-pointer rounded-xl p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="public-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown (Animated) ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="public-mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
              className="space-y-3 border-b border-white/10 bg-primary-900 px-4 py-3 shadow-lg md:hidden"
            >
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm no-underline transition-colors ${isActive
                        ? "bg-white/10 font-semibold text-white"
                        : "font-medium text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-emerald-300" : "text-white/45"
                          }`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth info / Action */}
              <div className="border-t border-white/10 pt-3">
                {user ? (
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-primary-950">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                          {displayName}
                        </p>
                        <p className="truncate font-mono text-[10px] text-white/50">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-950/20 no-underline transition-colors hover:bg-red-500"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>LOGIN</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content with Immediate, Non-Blocking GPU Fade Entrance */}
      <main className="min-w-0 flex-1">
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-primary-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 no-underline">
                <img
                  src={logoDinkes}
                  alt="Logo Dinas Kesehatan Kota Dumai"
                  className="h-10 w-10 rounded-full border border-white/20 bg-white p-0.5"
                />
                <span className="text-sm font-bold text-white">
                  Dinas Kesehatan Kota Dumai
                </span>
              </Link>
              <p className="mt-4 max-w-md text-xs leading-5 text-white/60">
                Portal pendaftaran dan pemantauan layanan BPJS Kesehatan
                Pemerintah Kota Dumai.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-white/90">
                Layanan
              </h2>
              <div className="mt-3 flex flex-col items-start gap-2.5 text-xs text-white/60">
                <Link to="/register" className="no-underline transition-colors hover:text-emerald-300">
                  Daftar BPJS
                </Link>
                <Link to="/cek-status" className="no-underline transition-colors hover:text-emerald-300">
                  Cek status
                </Link>
                <Link to="/login" className="no-underline transition-colors hover:text-emerald-300">
                  Masuk akun
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-white/90">
                Informasi
              </h2>
              <p className="mt-3 text-xs leading-5 text-white/60">
                Program jaminan kesehatan untuk warga Kota Dumai. Pastikan data
                yang dikirim sesuai dokumen kependudukan.
              </p>
              <Link
                to="/admin/login"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-300 no-underline transition-colors hover:text-emerald-200"
              >
                Panel petugas
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Dinas Kesehatan Kota Dumai</span>
            <span>Layanan Pendaftaran BPJS Pemerintah Kota Dumai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
