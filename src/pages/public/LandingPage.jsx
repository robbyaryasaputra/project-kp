import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Shield,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Users,
  Clock,
  BadgeCheck,
  UserPlus,
  Sparkles,
  Lock,
  Smartphone,
  CreditCard,
  Building2,
  ChevronRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

/* ── Elite Awwwards Easing Curves & Motion Variants ── */
const EASE_AWWWARDS = [0.16, 1, 0.3, 1]; // power4.out

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: custom * 0.1,
      ease: EASE_AWWWARDS,
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_AWWWARDS,
    },
  },
};

export default function LandingPage() {
  const { user } = useAuth();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const bentoSteps = [
    {
      step: "01",
      title: "Buat Akun Portal",
      tag: "Akun Mandiri",
      description:
        "Registrasi dengan email dan kata sandi aman. Satu akun portal dapat digunakan untuk seluruh anggota keluarga Anda.",
      highlight: "1 Akun = 1 Kartu Keluarga",
    },
    {
      step: "02",
      title: "Lengkapi Data Diri",
      tag: "Data Terpadu",
      description:
        "Isi data NIK, No. KK, domisili, dan pilih Fasilitas Kesehatan Tingkat I (Puskesmas/Klinik Pratama) terdekat.",
      highlight: "Otomatisasi No. KK Anggota",
    },
    {
      step: "03",
      title: "Unggah Dokumen",
      tag: "100% Digital",
      description:
        "Unggah berkas Kartu Keluarga (KK wajib) dan KTP (opsional) langsung dari smartphone atau komputer tanpa perlu berkas fisik.",
      highlight: "Format JPG, PNG, atau PDF",
    },
    {
      step: "04",
      title: "Verifikasi & Terbit Kartu",
      tag: "Resmi & Cepat",
      description:
        "Petugas memverifikasi berkas dan menerbitkan Nomor Kartu BPJS Kesehatan resmi yang siap diunduh dalam format PDF.",
      highlight: "Unduh Bukti Sah Ber-Barcode",
    },
  ];

  return (
    <div className="relative space-y-24 sm:space-y-32 pb-24 overflow-x-hidden">
      {/* ── Top Scroll Progress Bar (Awwwards Signature) Underneath Header ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-primary-500 to-accent-400 origin-left z-30 pointer-events-none opacity-80"
      />

      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION: NEXT-GEN HEALTHCARE PORTAL (STATEMENT HERO)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-neutral-950 text-white pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40 border-b border-neutral-800/80">
        {/* Dynamic Background Dot Matrix */}
        <div className="absolute inset-0 bg-grid-dots-dark opacity-40 pointer-events-none" />

        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute top-1/2 -right-40 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[140px]"
        />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-accent-400/10 blur-[120px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-7 text-left"
            >
              {/* Top Status Pill */}
              <motion.div variants={fadeInUp} custom={0}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Sistem Pendaftaran Digital BPJS Kesehatan</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-300 font-mono text-[11px]">v2.6</span>
                </div>
              </motion.div>

              {/* Massive Main Heading */}
              <motion.h1
                variants={fadeInUp}
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white"
              >
                Jaminan Kesehatan{" "}
                <br className="hidden sm:block" />
                Nasional,{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-primary-300 bg-clip-text text-transparent">
                  Kini 100% Digital.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                custom={2}
                className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl"
              >
                Daftarkan diri dan seluruh anggota keluarga dalam satu Kartu Keluarga
                secara online. Tanpa perlu antre di kantor cabang, pantau status verifikasi
                secara transparan kapan saja.
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                variants={fadeInUp}
                custom={3}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link to={user ? "/register" : "/login"} className="no-underline">
                  <Button
                    size="lg"
                    className="h-13 px-7 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-neutral-950 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl flex items-center gap-2 group cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-neutral-950 transition-transform group-hover:rotate-6" />
                    <span>Mulai Pendaftaran</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link to="/cek-status" className="no-underline">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-6 text-sm font-semibold bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur-md rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-neutral-300" />
                    <span>Cek Status Berkas</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Key Trust Signals */}
              <motion.div
                variants={fadeInUp}
                custom={4}
                className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-neutral-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Akun untuk 1 Keluarga</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verifikasi Cepat Petugas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bukti PDF Sah Ber-Barcode</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual: Holographic Digital Card Simulation (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_AWWWARDS, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-500/20 via-emerald-500/20 to-transparent blur-2xl transform scale-95" />

              {/* The Holographic Card */}
              <motion.div
                animate={{ y: [-5, 6, -5], rotateZ: [-0.3, 0.4, -0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md card-hologram rounded-3xl p-6 sm:p-7 text-white shadow-2xl border border-white/20 backdrop-blur-xl"
              >
                {/* Chip & Logo Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest uppercase text-white/90">
                        BPJS KESEHATAN
                      </h4>
                      <p className="text-[10px] text-white/60 tracking-wider">
                        KARTU INDONESIA SEHAT (KIS)
                      </p>
                    </div>
                  </div>

                  {/* Golden Smart Chip Graphic */}
                  <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 shadow-inner flex flex-col justify-around p-1">
                    <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                    <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                    <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                  </div>
                </div>

                {/* Card Number Mock */}
                <div className="mb-6 space-y-1">
                  <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold">
                    NOMOR KARTU DIGITAL
                  </p>
                  <p className="text-xl sm:text-2xl font-black font-mono tracking-widest text-white drop-shadow-sm">
                    0001 8492 7391 8290
                  </p>
                </div>

                {/* Holder Details */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/15 text-left">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold">
                      NAMA PESERTA
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      WARGA NEGARA INDONESIA
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold">
                      STATUS KEPESERTAAN
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AKTIF - PBI / NON-PBI
                    </p>
                  </div>
                </div>

                {/* Micro Floating Badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-4 -left-4 glass rounded-2xl px-3.5 py-2 flex items-center gap-2.5 text-xs font-bold text-neutral-800 shadow-xl border border-white/50"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>1 Akun = 1 Keluarga</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -top-4 -right-4 glass rounded-2xl px-3.5 py-2 flex items-center gap-2.5 text-xs font-bold text-neutral-800 shadow-xl border border-white/50"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span>Verifikasi &lt; 24 Jam</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. STATS BAR (TACTILE METRIC STRIP WITH SCROLL REVEAL)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            {
              icon: Users,
              value: "1 Akun Keluarga",
              label: "Daftarkan kepala keluarga & anggota dalam 1 KK",
              accent: "text-primary-600 bg-primary-50",
            },
            {
              icon: ShieldCheck,
              value: "Proses Cepat & Resmi",
              label: "Diverifikasi langsung oleh petugas berwenang",
              accent: "text-emerald-600 bg-emerald-50",
            },
            {
              icon: Clock,
              value: "Layanan 24/7",
              label: "Daftar dan lacak progres kapan saja dari mana saja",
              accent: "text-amber-600 bg-amber-50",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={cardItem}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE_AWWWARDS } }}
              className="glass-card rounded-2xl p-6 sm:p-7 flex items-start gap-4 transition-all duration-300 hover:shadow-xl hover:border-primary-300 group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${stat.accent} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                  {stat.value}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. BENTO GRID: FITUR UTAMA & KEUNGGULAN (SCROLL REVEAL)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100">
            <Sparkles className="w-3.5 h-3.5" />
            Fitur Portal Terintegrasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Kemudahan Layanan dalam Satu Ekosistem
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Dirancang khusus untuk memberikan pengalaman pendaftaran BPJS Kesehatan
            yang mulus, transparan, dan terpercaya bagi seluruh keluarga Indonesia.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Bento Item 1: Wide Card (Span 2) */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_AWWWARDS } }}
            className="md:col-span-2 glass-card rounded-3xl p-7 sm:p-9 relative overflow-hidden flex flex-col justify-between group hover:border-primary-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="space-y-3 z-10 max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200/60">
                Inovasi Baru
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                1 Akun untuk Seluruh Anggota Keluarga
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Tidak perlu membuat akun berulang kali. Cukup daftar sekali sebagai Kepala
                Keluarga, lalu tambahkan istri dan anak ke dalam Nomor Kartu Keluarga yang sama
                secara otomatis.
              </p>
            </div>

            {/* Family Members Visual Mock */}
            <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 z-10">
              {[
                { role: "Kepala Keluarga", name: "Peserta Utama", pisat: "PISAT 1" },
                { role: "Pasangan", name: "Suami / Istri", pisat: "PISAT 2/3" },
                { role: "Tanggungan", name: "Anak Kandung", pisat: "PISAT 4" },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 group-hover:bg-primary-50/40 transition-colors"
                >
                  <p className="text-[10px] font-bold text-primary-700 uppercase">
                    {m.pisat}
                  </p>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5">{m.role}</p>
                  <p className="text-[11px] text-neutral-400">{m.name}</p>
                </div>
              ))}
            </div>

            {/* Decorative Background Blob */}
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-primary-100/40 blur-3xl pointer-events-none -mr-20 -mb-20" />
          </motion.div>

          {/* Bento Item 2: Process Fast Card */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_AWWWARDS } }}
            className="glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group hover:border-amber-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Verifikasi Cepat &amp; Terpantau
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Berkas pendaftaran Anda langsung diproses antreannya oleh petugas admin.
                Dapatkan nomor kartu BPJS resmi tanpa harus menunggu berhari-hari.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>SLA Verifikasi</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                &lt; 24 Jam Kerja
              </span>
            </div>
          </motion.div>

          {/* Bento Item 3: Status Tracking Card */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_AWWWARDS } }}
            className="glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group hover:border-blue-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Pantau Status Tanpa Login
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Ingin cek berkas cepat? Cukup masukkan NIK dan Kode Registrasi Anda di menu
                Cek Status tanpa harus login terlebih dahulu.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                to="/cek-status"
                className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 no-underline group-hover:translate-x-1 transition-transform"
              >
                Cek Status Sekarang <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Item 4: Digital Proof Card (Span 2) */}
          <motion.div
            variants={cardItem}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_AWWWARDS } }}
            className="md:col-span-2 glass-card rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-emerald-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="space-y-3 max-w-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Bukti Pendaftaran Digital PDF Sah
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Setelah pendaftaran disetujui petugas, Anda dapat langsung mengunduh
                lembar bukti pendaftaran ber-barcode resmi yang diakui di seluruh faskes tingkat I.
              </p>
            </div>

            <div className="w-full sm:w-auto p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center shrink-0">
              <FileText className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-900">Format Resmi BPJS</p>
              <p className="text-[10px] text-neutral-400">PDF Ready to Print</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. HOW IT WORKS: 4-STEP STREAMLINED JOURNEY (SCROLL REVEAL)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-neutral-950 text-white py-24 sm:py-32 border-y border-neutral-800">
        {/* Dot Matrix Texture */}
        <div className="absolute inset-0 bg-grid-dots-dark opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-950 px-3 py-1 rounded-full border border-primary-800/80">
              Prosedur Sederhana
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Alur Pendaftaran BPJS Mandiri
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Cukup 4 tahapan ringkas untuk mendaftarkan diri dan keluarga dalam jaminan
              kesehatan nasional.
            </p>
          </motion.div>

          {/* Stepper Cards with Scroll Stagger */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {bentoSteps.map((item, i) => (
              <motion.div
                key={i}
                variants={cardItem}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_AWWWARDS } }}
                className="relative glass-dark rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-neutral-800 hover:border-primary-500/80 transition-all duration-300 group text-left cursor-default"
              >
                <div>
                  {/* Big Number Typography */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-white/10 group-hover:text-primary-400/30 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{item.highlight}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. SECURITY & CONVENIENCE PILLARS (SCROLL REVEAL)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeInUp}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="space-y-3 md:pr-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900">
                Keamanan Data Terjamin
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Dokumen identitas Anda disimpan dengan proteksi Row Level Security dan
                hanya dapat diakses oleh petugas verifikasi berwenang.
              </p>
            </div>

            <div className="space-y-3 pt-6 md:pt-0 md:px-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900">
                Faskes Tk. I Seluruh Indonesia
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Bebas memilih Fasilitas Kesehatan Tingkat I (Puskesmas atau Klinik Pratama)
                yang paling dekat dengan domisili tempat tinggal Anda.
              </p>
            </div>

            <div className="space-y-3 pt-6 md:pt-0 md:pl-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900">
                100% Responsif &amp; Ringan
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Akses portal dengan cepat dan nyaman melalui smartphone Android, iPhone,
                tablet, maupun komputer desktop tanpa kendala.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. FINAL CALL TO ACTION (AWWWARDS HIGH-IMPACT CLOSER)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_AWWWARDS }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-950 p-8 sm:p-14 text-center text-white shadow-2xl border border-primary-700/50"
        >
          {/* Ambient Lighting Orbs */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
              <Shield className="w-3.5 h-3.5 text-accent-300" />
              Perlindungan Kesehatan Keluarga Anda
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Siap Mendaftar BPJS Kesehatan Hari Ini?
            </h2>

            <p className="text-sm sm:text-base text-primary-100/90 leading-relaxed">
              Daftar sekarang dalam beberapa menit. Lindungi masa depan kesehatan Anda
              dan seluruh anggota keluarga dengan jaminan kesehatan nasional terpercaya.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Link to={user ? "/register" : "/login"} className="no-underline">
                <Button
                  size="lg"
                  className="h-13 px-8 text-sm font-bold bg-white text-primary-800 hover:bg-neutral-100 shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-primary-700" />
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <Link to="/cek-status" className="no-underline">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-7 text-sm font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md rounded-xl transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cek Status</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
