import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import logoDinkes from "@/assets/logo-dinkes.jpg";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Cek sesi login admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/admin/login");
      } else {
        setUser(data.user);
      }
    });
  }, [navigate]);

  // Hitung jumlah pending secara realtime
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count } = await supabase
          .from("applicants")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending");
        setPendingCount(count || 0);
      } catch (err) {
        console.error("Gagal memuat pending count:", err);
      }
    };

    fetchPendingCount();

    const channel = supabase
      .channel("admin-layout-pending")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applicants" },
        () => fetchPendingCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const navLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/verifikasi",
      label: "Verifikasi Pendaftar",
      icon: ClipboardCheck,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      to: "/admin/rekap",
      label: "Rekapitulasi",
      icon: FileSpreadsheet,
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentNav = navLinks.find((l) => l.to === location.pathname);

  return (
    <div className="min-h-screen bg-neutral-50 flex text-neutral-800">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Minimalist Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white flex flex-col border-r border-neutral-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header / Logo */}
        <div className="h-16 px-5 border-b border-neutral-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3 no-underline group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <img
                src={logoDinkes}
                alt="Logo Dinas Kesehatan Kota Dumai"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                BPJS Kesehatan
              </h1>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Panel Admin
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items (Clean & Simple) */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${isActive
                    ? "bg-neutral-800 text-white font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-400"
                      }`}
                  />
                  <span>{link.label}</span>
                </div>

                {link.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile Minimal */}
        {/* Footer / User Profile Avatar + Pill Button */}
        <div className="p-3 border-t border-neutral-800/80 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Inisial */}
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 text-xs font-semibold text-neutral-300 uppercase">
              {user.email?.[0] || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-200 truncate">
                {user.email?.split("@")[0]}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-neutral-900/50 border border-neutral-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Simple Clean Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-neutral-800">
              {currentNav?.label || "Admin"}
            </h2>
          </div>

          <Link
            to="/"
            className="text-xs font-medium text-neutral-500 hover:text-emerald-700 flex items-center gap-1 no-underline transition-colors px-2.5 py-1.5 rounded-md hover:bg-neutral-50"
          >
            <span>Halaman Publik</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
