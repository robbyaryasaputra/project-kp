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
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import logoDinkes from "@/assets/logo-dinkes.jpg";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
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
          initial={{ width: "0%", opacity: 1 }}
          animate={{
            width: ["0%", "35%", "85%", "100%"],
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: 0.45,
            times: [0, 0.25, 0.65, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.9)] relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/70 blur-xs" />
        </motion.div>
      </div>

      {/* ── Modern Minimalist Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/70 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 no-underline group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-white shadow-xs ring-1 ring-neutral-200/90 group-hover:ring-emerald-500/50 group-hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center">
                <img
                  src={logoDinkes}
                  alt="Logo Dinas Kesehatan Kota Dumai"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                    DINKES KOTA DUMAI
                  </span>
                  
                </div>
                <p className="text-[11px] text-neutral-500 leading-tight hidden sm:block font-normal mt-0.5">
                  Layanan Pendaftaran
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Dock (Centered Minimal Pill with Gliding Indicator) */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-100/80 border border-neutral-200/70 rounded-full shadow-inner-xs relative">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 no-underline z-10 ${
                      isActive
                        ? "text-neutral-900 font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="publicNavActivePill"
                        className="absolute inset-0 bg-white rounded-full shadow-xs border border-neutral-200/80 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors duration-200 ${
                        isActive ? "text-emerald-600" : "text-neutral-400"
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
                    <div className="flex items-center gap-1.5 p-1 pl-2 bg-neutral-100/90 border border-neutral-200/80 rounded-full shadow-inner-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {userInitial}
                      </div>
                      <span className="text-xs font-medium text-neutral-700 max-w-[90px] sm:max-w-[120px] truncate leading-none">
                        {displayName}
                      </span>
                      <button
                        onClick={handleSignOut}
                        title="Keluar"
                        className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="no-underline">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-medium transition-all duration-200 shadow-xs cursor-pointer">
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Masuk</span>
                      </button>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="md:hidden border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-3 shadow-lg"
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-emerald-600" : "text-neutral-400"
                        }`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth info / Action */}
              <div className="pt-2 border-t border-neutral-100">
                {user ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-800 truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 active:scale-98 transition-all no-underline"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk / Daftar Akun</span>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                <img
                  src={logoDinkes}
                  alt="Logo Kota Dumai"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>
                © 2026 Dinas Kesehatan Kota Dumai · Layanan Pendaftaran BPJS Pemerintah Kota Dumai
              </span>
            </div>
            <Link
              to="/admin/login"
              className="text-neutral-400 hover:text-neutral-700 transition-colors no-underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>Panel Petugas</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
