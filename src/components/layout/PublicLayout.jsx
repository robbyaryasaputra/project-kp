import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield, FileText, Search, Home } from "lucide-react";

export default function PublicLayout() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/register", label: "Daftar BPJS", icon: FileText },
    { to: "/cek-status", label: "Cek Status", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-neutral-900 leading-tight">
                  BPJS Kesehatan
                </h1>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Sistem Pendaftaran Online
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Shield className="w-4 h-4 text-primary-500" />
              <span>© 2026 Sistem Pendaftaran BPJS Kesehatan</span>
            </div>
            <Link
              to="/admin/login"
              className="text-xs text-neutral-400 hover:text-primary-500 transition-colors no-underline"
            >
              Admin Panel →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
