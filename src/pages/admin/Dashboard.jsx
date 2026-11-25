import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  User,
  FileText,
  Image as ImageIcon,
  CreditCard,
  Users as UsersIcon,
  Camera,
  AlertTriangle,
  Inbox,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  FileSpreadsheet,
  Check,
  X,
} from "lucide-react";

/* ── Helper: Avatar Colors & Initials ── */
const AVATAR_PALETTES = [
  "from-teal-500 to-emerald-600 text-white",
  "from-blue-500 to-cyan-600 text-white",
  "from-indigo-500 to-violet-600 text-white",
  "from-amber-500 to-orange-600 text-white",
  "from-rose-500 to-pink-600 text-white",
];

function getAvatarStyle(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "BP";
}

function getGenderLabel(g) {
  return g === 1 ? "Laki-laki" : "Perempuan";
}

function getMaritalLabel(m) {
  return (
    { 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" }[m] || "-"
  );
}

function getPisatLabel(p) {
  return { 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" }[p] || "-";
}

function formatIDDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} hari lalu`;
  if (diffHour > 0) return `${diffHour} jam lalu`;
  if (diffMin > 0) return `${diffMin} mnt lalu`;
  return "Baru saja";
}

/* ══════════════════════════════════════════════════════════════
   1. DASHBOARD OVERVIEW (HIGH-END MODERN SAAS COMMAND CENTER)
══════════════════════════════════════════════════════════════ */
function DashboardOverview({ stats, applicants }) {
  const total = stats.pending + stats.approved + stats.rejected;
  const approvalRate = total > 0 ? Math.round((stats.approved / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((stats.pending / total) * 100) : 0;
  const rejectedRate = total > 0 ? Math.round((stats.rejected / total) * 100) : 0;

  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* ── Executive Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 p-7 sm:p-9 text-white shadow-2xl border border-neutral-800/80">
        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Live System Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Sistem Pendaftaran Online BPJS Aktif</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400" />
                {todayFormatted}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Pusat Kendali Verifikasi BPJS
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
              Pantau antrean berkas pendaftar baru, verifikasi data kepesertaan,
              dan kelola penerbitan kartu jaminan kesehatan nasional secara presisi.
            </p>
          </div>

          {/* Quick Header Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/admin/verifikasi" className="no-underline">
              <Button
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4 mr-1.5 transition-transform group-hover:rotate-6" />
                Buka Antrean ({stats.pending})
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/admin/rekap" className="no-underline">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1.5 text-neutral-300" />
                Rekap Data
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── High-End Metric Cards with Micro-Interactions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Pending */}
        <Link to="/admin/verifikasi" className="no-underline group">
          <Card className="relative overflow-hidden border-neutral-200/90 bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/80 cursor-pointer">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 opacity-80" />
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-100/80 group-hover:shadow-inner">
                  <Clock className="w-6 h-6 transition-transform duration-300 group-hover:-rotate-12" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Perlu Ditinjau
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Menunggu Verifikasi
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900">
                    {stats.pending}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">berkas</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                <span>{pendingRate}% dari total</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Review <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Approved */}
        <Link to="/admin/rekap" className="no-underline group">
          <Card className="relative overflow-hidden border-neutral-200/90 bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/80 cursor-pointer">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80" />
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100/80 group-hover:shadow-inner">
                  <CheckCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3" />
                  Terbit Kartu
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Peserta Disetujui
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900">
                    {stats.approved}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">jiwa</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                <span>Approval: {approvalRate}%</span>
                <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Rekap <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Rejected */}
        <Card className="relative overflow-hidden border-neutral-200/90 bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-400/80 group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 to-rose-500 opacity-80" />
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/60 flex items-center justify-center text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-100/80 group-hover:shadow-inner">
                <XCircle className="w-6 h-6 transition-transform duration-300 group-hover:-rotate-12" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-200/60">
                <AlertTriangle className="w-3 h-3" />
                Berkas Ditolak
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Pendaftaran Ditolak
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900">
                  {stats.rejected}
                </span>
                <span className="text-xs text-neutral-500 font-medium">berkas</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <span>{rejectedRate}% penolakan</span>
              <span className="text-neutral-400 text-[11px]">Syarat belum lengkap</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Total Volume */}
        <Card className="relative overflow-hidden border-neutral-200/90 bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-400/80 group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700 opacity-80" />
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-200/60 flex items-center justify-center text-primary-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-100/80 group-hover:shadow-inner">
                <TrendingUp className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 border border-primary-200/60">
                <Activity className="w-3 h-3" />
                Total Volume
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Semua Pendaftar
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900">
                  {total}
                </span>
                <span className="text-xs text-neutral-500 font-medium">total data</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <span>Tersinkron Supabase</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% Realtime
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Asymmetric Bento Grid: Queue + Analytics/Shortcuts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Queue Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-neutral-200/90 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-6 pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-lg font-bold text-neutral-900 tracking-tight">
                    Antrean Menunggu Tindakan
                  </CardTitle>
                </div>
                <CardDescription className="mt-1 text-xs text-neutral-500">
                  Pendaftar teratas yang siap ditinjau dan diterbitkan nomor kartu BPJS-nya.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                  {applicants.length} Antrean
                </span>
                <Link
                  to="/admin/verifikasi"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline hover:underline px-2 py-1"
                >
                  Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {applicants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">
                    Semua Berkas Telah Diverifikasi!
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    Tidak ada pendaftar dalam antrean pending saat ini. Sistem siap menerima berkas baru.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {applicants.slice(0, 6).map((item, idx) => {
                    const avatarStyle = getAvatarStyle(item.full_name);
                    const initials = getInitials(item.full_name);

                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-neutral-50/70 transition-colors duration-200"
                      >
                        {/* Person Info */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarStyle} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                                {item.full_name}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 font-mono font-medium"
                              >
                                {getPisatLabel(item.pisat_code)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-0.5">
                              <span>NIK: {item.nik}</span>
                              <span>·</span>
                              <span className="text-neutral-500 font-medium">
                                {item.registration_code}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timing & Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {formatRelativeTime(item.created_at)}
                          </span>

                          <Link
                            to={`/admin/verify/${item.id}`}
                            className="no-underline"
                          >
                            <Button
                              size="sm"
                              className="h-8 px-3 text-xs font-semibold bg-neutral-900 hover:bg-primary-600 text-white rounded-lg shadow-sm transition-all group-hover:shadow cursor-pointer"
                            >
                              Review Berkas
                              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Performance & System Hub (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ratio Widget */}
          <Card className="border-neutral-200/90 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  Rasio Verifikasi Sistem
                </CardTitle>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {approvalRate}% ACC
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Stacked Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${approvalRate}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Disetujui: ${approvalRate}%`}
                  />
                  <div
                    style={{ width: `${pendingRate}%` }}
                    className="bg-amber-400 transition-all duration-500"
                    title={`Pending: ${pendingRate}%`}
                  />
                  <div
                    style={{ width: `${rejectedRate}%` }}
                    className="bg-red-400 transition-all duration-500"
                    title={`Ditolak: ${rejectedRate}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Distribusi Berkas Masuk</span>
                  <span className="font-mono">{total} total</span>
                </div>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center">
                <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
                  <p className="text-[10px] uppercase font-bold text-emerald-800">ACC</p>
                  <p className="text-base font-extrabold font-mono text-emerald-700">
                    {stats.approved}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100/80">
                  <p className="text-[10px] uppercase font-bold text-amber-800">Pending</p>
                  <p className="text-base font-extrabold font-mono text-amber-700">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-red-50/60 border border-red-100/80">
                  <p className="text-[10px] uppercase font-bold text-red-800">Tolak</p>
                  <p className="text-base font-extrabold font-mono text-red-700">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Command Shortcuts */}
          <Card className="border-neutral-200/90 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-neutral-100">
              <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pintasan Navigasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {[
                {
                  to: "/admin/verifikasi",
                  title: "Antrean Verifikasi Berkas",
                  desc: "Tinjau KTP, KK, dan Pas Foto peserta",
                  icon: ClipboardCheck,
                  badge: stats.pending > 0 ? `${stats.pending} pending` : null,
                  badgeColor: "bg-amber-100 text-amber-800",
                },
                {
                  to: "/admin/rekap",
                  title: "Kelola Rekapitulasi & CRUD",
                  desc: "Edit data, hapus, dan export file Excel",
                  icon: FileSpreadsheet,
                  badge: "Excel Export",
                  badgeColor: "bg-primary-100 text-primary-800",
                },
                {
                  to: "/cek-status",
                  title: "Cek Status Pendaftar",
                  desc: "Pratinjau tampilan publik pencarian peserta",
                  icon: Search,
                  badge: "Publik",
                  badgeColor: "bg-neutral-100 text-neutral-700",
                },
              ].map((shortcut, i) => {
                const Icon = shortcut.icon;
                return (
                  <Link
                    key={i}
                    to={shortcut.to}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-all duration-200 group no-underline text-neutral-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight group-hover:text-primary-600 transition-colors">
                          {shortcut.title}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {shortcut.desc}
                        </p>
                      </div>
                    </div>
                    {shortcut.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shortcut.badgeColor}`}
                      >
                        {shortcut.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. MAIN EXPORT COMPONENT: VERIFIKASI & DASHBOARD CONTROLLER
══════════════════════════════════════════════════════════════ */
export default function AdminDashboard({ isVerification = false }) {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [actionMode, setActionMode] = useState(null); // 'approve' | 'reject'
  const [cardNumber, setCardNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setApplicants(data || []);

      // Fetch stats
      const [pending, approved, rejected] = await Promise.all([
        supabase
          .from("applicants")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("applicants")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("applicants")
          .select("id", { count: "exact", head: true })
          .eq("status", "rejected"),
      ]);
      setStats({
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data pendaftar.");
    } finally {
      setLoading(false);
    }
  };

  const openReview = (applicant) => {
    setSelectedApplicant(applicant);
    setShowReviewModal(true);
    setActionMode(null);
    setCardNumber("");
    setRejectionReason("");
  };

  const closeReview = () => {
    setShowReviewModal(false);
    setSelectedApplicant(null);
    setActionMode(null);
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const updateData = {
        status: "approved",
      };
      if (cardNumber.trim()) {
        updateData.card_number = cardNumber.trim();
      }
      const { error } = await supabase
        .from("applicants")
        .update(updateData)
        .eq("id", selectedApplicant.id);

      if (error) throw error;
      toast.success(`Pendaftaran ${selectedApplicant.full_name} disetujui!`);
      closeReview();
      fetchApplicants();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyetujui pendaftaran.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Alasan penolakan wajib diisi.");
      return;
    }
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("applicants")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
        })
        .eq("id", selectedApplicant.id);

      if (error) throw error;
      toast.success(`Pendaftaran ${selectedApplicant.full_name} ditolak.`);
      closeReview();
      fetchApplicants();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menolak pendaftaran.");
    } finally {
      setProcessing(false);
    }
  };

  const filteredApplicants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return applicants;
    return applicants.filter(
      (a) =>
        a.full_name?.toLowerCase().includes(q) ||
        a.nik?.includes(q) ||
        a.registration_code?.toLowerCase().includes(q) ||
        a.family_card_number?.includes(q)
    );
  }, [applicants, searchQuery]);

  // Jika bukan rute verifikasi, render Dashboard Overview
  if (!isVerification) {
    return <DashboardOverview stats={stats} applicants={applicants} />;
  }

  /* ══════════════════════════════════════════════════════════════
     3. VERIFICATION QUEUE SCREEN (isVerification = true)
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="animate-fade-in space-y-7 pb-10">
      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-primary-500" />
            Antrean Verifikasi Pendaftar
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchApplicants}
            disabled={loading}
            title="Muat Ulang Data"
            className="cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* ── Metric Cards Compact ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Antrean Menunggu",
            value: stats.pending,
            desc: "Butuh verifikasi dokumen",
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200/80",
          },
          {
            label: "Total Disetujui",
            value: stats.approved,
            desc: "Telah terbit nomor kartu",
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200/80",
          },
          {
            label: "Total Ditolak",
            value: stats.rejected,
            desc: "Berkas tidak valid / ditolak",
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
            border: "border-red-200/80",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Card
              key={i}
              className={`border ${item.border} bg-white shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 mt-0.5">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                <div
                  className={`w-11 h-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Table Container ── */}
      <Card className="border-neutral-200/90 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-neutral-900">
              Daftar Antrean Aktif
            </CardTitle>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Cari nama, NIK, kode reg..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-neutral-50/60 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-xs font-medium">Memuat antrean verifikasi...</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-neutral-400 text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-sm font-bold text-neutral-700">
                {searchQuery
                  ? "Pencarian Tidak Ditemukan"
                  : "Tidak Ada Antrean Verifikasi"}
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mt-1">
                {searchQuery
                  ? `Tidak ada pendaftar yang cocok dengan kata kunci "${searchQuery}".`
                  : "Semua pendaftar berstatus pending telah selesai ditinjau."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50/70 border-b border-neutral-100">
                  <TableRow>
                    <TableHead className="w-12 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      No
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Kode Registrasi
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Nama Pendaftar
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      NIK &amp; KK
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Tanggal Masuk
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Tindakan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-neutral-100">
                  {filteredApplicants.map((applicant, i) => {
                    const avatarStyle = getAvatarStyle(applicant.full_name);
                    const initials = getInitials(applicant.full_name);

                    return (
                      <TableRow
                        key={applicant.id}
                        className="hover:bg-neutral-50/80 transition-colors duration-150"
                      >
                        <TableCell className="font-mono text-xs text-neutral-400">
                          {i + 1}
                        </TableCell>

                        {/* Kode Reg */}
                        <TableCell>
                          <span className="font-mono text-xs font-semibold bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md border border-neutral-200/60">
                            {applicant.registration_code}
                          </span>
                        </TableCell>

                        {/* Nama & PISAT */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarStyle} flex items-center justify-center text-[11px] font-bold shrink-0 shadow-xs`}
                            >
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-neutral-900 leading-tight">
                                {applicant.full_name}
                              </p>
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                {getPisatLabel(applicant.pisat_code)} ·{" "}
                                {getGenderLabel(applicant.gender)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* NIK & KK */}
                        <TableCell>
                          <div className="font-mono text-xs text-neutral-800">
                            <span className="font-semibold">{applicant.nik}</span>
                            <p className="text-[11px] text-neutral-400">
                              KK: {applicant.family_card_number}
                            </p>
                          </div>
                        </TableCell>

                        {/* Tanggal Daftar */}
                        <TableCell>
                          <div className="text-xs text-neutral-700">
                            <p>{formatIDDate(applicant.created_at)}</p>
                            <p className="text-[10px] text-neutral-400">
                              {formatRelativeTime(applicant.created_at)}
                            </p>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </span>
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReview(applicant)}
                              className="h-8 px-2.5 text-xs text-neutral-700 hover:text-primary-600 hover:border-primary-400 cursor-pointer"
                              title="Review Singkat di Modal"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Quick
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/verify/${applicant.id}`)
                              }
                              className="h-8 px-3 text-xs bg-neutral-900 hover:bg-primary-600 text-white cursor-pointer"
                              title="Buka Halaman Verifikasi Lengkap"
                            >
                              Detail
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── SIDE-BY-SIDE QUICK REVIEW MODAL ── */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-neutral-200">
          <DialogHeader className="p-6 pb-4 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-neutral-900">
                    Review Berkas Pendaftar
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-500 font-mono">
                    {selectedApplicant?.registration_code} — {selectedApplicant?.full_name}
                  </DialogDescription>
                </div>
              </div>
              <Badge variant="warning" className="mr-6">
                Status: Pending
              </Badge>
            </div>
          </DialogHeader>

          {selectedApplicant && (
            <div className="p-6 space-y-6">
              {/* Split Layout: Data Diri & Dokumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SISI KIRI: Data Lengkap */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    <User className="w-4 h-4 text-primary-500" />
                    Data Identitas Pemohon
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      ["Nama Lengkap", selectedApplicant.full_name, true],
                      ["NIK", selectedApplicant.nik],
                      ["No. KK", selectedApplicant.family_card_number],
                      ["Hubungan PISAT", getPisatLabel(selectedApplicant.pisat_code)],
                      ["Tempat, Tgl Lahir", `${selectedApplicant.birth_place || "-"}, ${selectedApplicant.birth_date || "-"}`],
                      ["Jenis Kelamin", getGenderLabel(selectedApplicant.gender)],
                      ["Status Kawin", getMaritalLabel(selectedApplicant.marital_status)],
                      ["Telepon", selectedApplicant.phone_number || "-"],
                      ["Email", selectedApplicant.email || "-", true],
                      ["Alamat", `${selectedApplicant.address || "-"} RT ${selectedApplicant.rt || "-"}/RW ${selectedApplicant.rw || "-"}`, true],
                      ["Kecamatan", selectedApplicant.district || "-"],
                      ["Kelurahan/Desa", selectedApplicant.village || "-"],
                      ["Faskes Tk.I", selectedApplicant.facility_name || "-", true],
                    ].map(([lbl, val, full], idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg bg-neutral-50/80 border border-neutral-100 ${full ? "col-span-2" : ""
                          }`}
                      >
                        <p className="text-[10px] uppercase font-bold text-neutral-400">
                          {lbl}
                        </p>
                        <p className="font-semibold text-neutral-800 break-words mt-0.5">
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SISI KANAN: Dokumen Berkas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    <ImageIcon className="w-4 h-4 text-primary-500" />
                    Pratinjau Dokumen Fisik
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        label: "Foto KTP Pemohon",
                        url: selectedApplicant.ktp_url,
                        icon: CreditCard,
                      },
                      {
                        label: "Foto Kartu Keluarga (KK)",
                        url: selectedApplicant.kk_url,
                        icon: UsersIcon,
                      },
                      {
                        label: "Pas Foto 3x4",
                        url: selectedApplicant.photo_url,
                        icon: Camera,
                      },
                    ].map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                            <doc.icon className="w-3.5 h-3.5 text-neutral-500" />
                            {doc.label}
                          </span>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                              Buka Layar Penuh <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {doc.url ? (
                          <div className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-white">
                            <img
                              src={doc.url}
                              alt={doc.label}
                              className="w-full h-32 object-contain bg-neutral-100"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="hidden w-full h-32 items-center justify-center text-xs text-neutral-400 bg-neutral-100">
                              Gagal menampilkan berkas
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-lg border border-dashed border-neutral-300 bg-neutral-100/60 flex items-center justify-center text-xs text-neutral-400">
                            Berkas tidak tersedia
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Action Section in Modal ── */}
              <div className="pt-4 border-t border-neutral-200">
                {!actionMode ? (
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setActionMode("reject")}
                      className="cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Tolak Pendaftaran
                    </Button>
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => setActionMode("approve")}
                      className="cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Setujui (ACC) Pendaftaran
                    </Button>
                  </div>
                ) : actionMode === "approve" ? (
                  /* Form ACC */
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3.5 animate-slide-up">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Konfirmasi Persetujuan Pendaftaran
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quick-card-number" className="text-emerald-950 font-semibold text-xs">
                        Nomor Kartu BPJS Kesehatan (Opsional)
                      </Label>
                      <Input
                        id="quick-card-number"
                        placeholder="Contoh: 0001234567890 (kosongkan jika belum diterbitkan)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-white border-emerald-300 focus:border-emerald-500 font-mono"
                        autoFocus
                      />
                      <p className="text-[11px] text-emerald-700">
                        Nomor kartu bersifat opsional dan dapat dikosongkan jika belum diterbitkan.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionMode(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        variant="success"
                        size="sm"
                        onClick={handleApprove}
                        disabled={processing}
                        className="cursor-pointer"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            Memproses...
                          </>
                        ) : (
                          "Konfirmasi Setujui"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Form Reject */
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3.5 animate-slide-up">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Konfirmasi Penolakan Pendaftaran
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quick-reject-reason" className="text-red-950 font-semibold text-xs">
                        Alasan Penolakan Berkas *
                      </Label>
                      <Textarea
                        id="quick-reject-reason"
                        placeholder="Contoh: Foto KTP buram / NIK tidak cocok dengan Disdukcapil..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="bg-white border-red-300 focus:border-red-500 text-xs"
                        rows={2}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionMode(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleReject}
                        disabled={processing}
                        className="cursor-pointer"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            Memproses...
                          </>
                        ) : (
                          "Konfirmasi Tolak"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
