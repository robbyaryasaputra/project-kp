import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  HeartPulse,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import heroFamily from "@/assets/hero-family.jpg";
import advantagesBg from "@/assets/advantages-bg.jpg";
import alurBg from "@/assets/alur-bg.jpg";
import faskesBg from "@/assets/faskes-bg.jpg";
import komitmenBg from "@/assets/komitmen-bg.jpg";
import faqBg from "@/assets/faq-bg.jpg";
import { useAuth } from "@/context/AuthContext";

const EASE = [0.16, 1, 0.3, 1];

const stats = [
  { value: "100%", label: "Cakupan semesta warga" },
  { value: "Rp 0", label: "Iuran ditanggung APBD" },
  { value: "7", label: "Kecamatan terintegrasi" },
  { value: "Resmi", label: "Program Pemko Dumai" },
];

const advantages = [
  {
    icon: FileText,
    label: "Layanan Utama",
    title: "Pendaftaran BPJS PBI Gratis",
    description:
      "Ajukan pendaftaran secara online dan lengkapi data satu Kartu Keluarga dalam satu akun tanpa biaya sepeser pun.",
    points: [
      "Khusus warga ber-KTP & KK Kota Dumai",
      "Satu akun untuk seluruh anggota keluarga",
      "100% bebas biaya pendaftaran & iuran bulanan",
    ],
    action: "Mulai pendaftaran",
    to: "/register",
  },
  {
    icon: Search,
    label: "Transparansi",
    title: "Pantau Status Real-Time",
    description:
      "Cek perkembangan verifikasi berkas cukup menggunakan NIK dan kode pendaftaran tanpa perlu masuk akun.",
    points: [
      "Informasi progres verifikasi secara langsung",
      "Catatan tindak lanjut dari petugas Dinkes",
      "Dapat diakses kapan saja melalui ponsel",
    ],
    action: "Cek status pengajuan",
    to: "/cek-status",
  },
  {
    icon: Building2,
    label: "Jaringan Wilayah",
    title: "Pilihan Puskesmas Terdekat",
    description:
      "Tentukan lokasi Puskesmas yang sesuai dengan domisili tempat tinggal Anda di wilayah Kota Dumai.",
    points: [
      "Terhubung dengan Puskesmas se-Kota Dumai",
      "Penyesuaian lokasi berbasis kecamatan",
      "Dipilih langsung saat pengisian formulir",
    ],
    action: "Lihat alur daftar",
    to: "#alur",
  },
];

const steps = [
  {
    number: "01",
    title: "Siapkan NIK & Kartu Keluarga",
    description:
      "Pastikan data kependudukan aktif dan tercatat sebagai warga Kota Dumai.",
    note: "Dokumen KK & NIK aktif",
  },
  {
    number: "02",
    title: "Isi Formulir Online",
    description:
      "Buat akun, lengkapi biodata anggota keluarga, alamat domisili, serta pilihan Puskesmas.",
    note: "Pengisian ± 5 menit",
  },
  {
    number: "03",
    title: "Pantau Hasil Verifikasi",
    description:
      "Simpan kode pendaftaran yang muncul dan gunakan bersama NIK untuk melihat status kepesertaan.",
    note: "Notifikasi & cek mandiri",
  },
];

const facilities = [
  {
    name: "Puskesmas Kota Dumai",
    district: "Dumai Kota",
    coverage:
      "Pelayanan kesehatan umum, ibu & anak, serta rujukan terpadu wilayah pusat kota.",
  },
  {
    name: "Puskesmas Jaya Mukti",
    district: "Dumai Timur",
    coverage:
      "Melayani pemeriksaan dasar, imunisasi, dan administrasi kepesertaan wilayah Dumai Timur.",
  },
  {
    name: "Puskesmas Bumi Ayu",
    district: "Dumai Selatan",
    coverage:
      "Akses layanan kesehatan keluarga dan konsultasi medis bagi warga Dumai Selatan.",
  },
  {
    name: "Puskesmas Dumai Barat",
    district: "Dumai Barat",
    coverage:
      "Fasilitas pemeriksaan rawat jalan dan pelayanan kesehatan masyarakat Dumai Barat.",
  },
];

const commitments = [
  {
    icon: LockKeyhole,
    title: "Keamanan Data Warga",
    description:
      "Seluruh data kependudukan dilindungi dan hanya digunakan untuk keperluan verifikasi jaminan kesehatan.",
  },
  {
    icon: HeartPulse,
    title: "Akses Kesehatan Merata",
    description:
      "Memastikan setiap warga Kota Dumai memperoleh perlindungan layanan medis yang layak.",
  },
  {
    icon: Smartphone,
    title: "Layanan Tanpa Antre",
    description:
      "Pengajuan dan pemantauan berkas dilakukan sepenuhnya secara daring dari mana saja.",
  },
  {
    icon: BadgeCheck,
    title: "Alur Jelas & Tercatat",
    description:
      "Setiap permohonan memiliki kode registrasi unik untuk memudahkan penelusuran status.",
  },
];

const questions = [
  {
    question: "Siapa yang dapat mengajukan pendaftaran?",
    answer:
      "Layanan ini ditujukan bagi warga Kota Dumai. Setiap pengajuan akan diverifikasi berdasarkan data kependudukan dan ketentuan program yang berlaku.",
  },
  {
    question: "Data dan dokumen apa yang perlu disiapkan?",
    answer:
      "Siapkan NIK dan nomor Kartu Keluarga (KK). Formulir pendaftaran akan memandu dokumen pendukung yang perlu diunggah.",
  },
  {
    question: "Bagaimana cara melihat status pendaftaran?",
    answer:
      "Buka halaman Cek Status, lalu masukkan NIK peserta beserta kode pendaftaran yang Anda peroleh setelah mengirim formulir.",
  },
  {
    question: "Berapa lama proses verifikasi berlangsung?",
    answer:
      "Durasi verifikasi bergantung pada kelengkapan berkas dan antrean pengajuan. Anda dapat memeriksa pembaruannya secara berkala pada menu Cek Status.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Background Bergerak (Ken Burns Drift) */
function MovingBackdrop({
  image,
  scrimClassName,
  duration = 28,
  reverse = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1.03, 1],
                x: reverse ? ["0%", "2%", "-1.5%", "0%"] : ["0%", "-2%", "1.5%", "0%"],
                y: reverse ? ["0%", "-1.2%", "0.8%", "0%"] : ["0%", "1.2%", "-0.8%", "0%"],
              }
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-14 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className={`absolute inset-0 backdrop-blur-[2px] ${scrimClassName}`} />
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const registrationPath = user ? "/register" : "/login";

  const [selectedFacility, setSelectedFacility] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const featuredAdvantage = advantages[0];
  const secondaryAdvantages = advantages.slice(1);
  const FeaturedIcon = featuredAdvantage.icon;

  return (
    <div className="overflow-hidden bg-[#F7F6F2] text-slate-900 selection:bg-[#0F4C81]/15 selection:text-[#0F4C81]">
      {/* ── 1. HERO SECTION (Editorial Split + Warm Alabaster & Coastal Blue) ── */}
      <section className="relative isolate overflow-hidden">
        <MovingBackdrop
          image={faskesBg}
          duration={32}
          scrimClassName="bg-gradient-to-br from-[#F7F6F2]/96 via-[#F4F2EC]/90 to-[#EAE7DF]/82"
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* Kolom Kiri: Tipografi Tegas & Bersih */}
            <div>
              <h1 className="text-[clamp(2.45rem,4.7vw,3.95rem)] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-950">
                Perlindungan Kesehatan Gratis Warga Dumai.{" "}
                <span className="mt-1 block text-[#0F4C81]">
                  100% Ditanggung APBD.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[17px]">
                Daftarkan seluruh anggota keluarga dalam satu Kartu Keluarga
                secara daring tanpa antre. Cukup siapkan NIK dan KK, lalu
                pantau status verifikasi dari satu portal terpadu.
              </p>

              {/* Action Bar */}
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  to={registrationPath}
                  className="group inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-semibold text-white shadow-sm no-underline transition-all hover:bg-[#0F4C81] active:scale-[0.99]"
                >
                  <span>Ajukan Pendaftaran</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/cek-status"
                  className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-slate-300/90 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 no-underline backdrop-blur-sm transition-colors hover:border-[#0F4C81] hover:bg-white hover:text-[#0F4C81]"
                >
                  <Search className="h-4 w-4 text-[#0F4C81]" />
                  <span>Cek Status Berkas</span>
                </Link>
              </div>

              {/* Ringkasan Syarat Singkat */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
                {["Cukup NIK & KK", "Bebas Iuran Bulanan", "Proses Tercatat"].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0F4C81]" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Kolom Kanan: Frame Editorial Tegak dengan Detail Coastal Navy */}
            <Reveal className="relative mx-auto w-full max-w-[440px]">
              <div className="overflow-hidden rounded-2xl bg-[#0A2540] text-white shadow-[0_24px_60px_-20px_rgba(10,37,64,0.28)]">
                <div className="relative aspect-[4/3.8] w-full overflow-hidden">
                  <img
                    src={heroFamily}
                    alt="Keluarga warga Kota Dumai di Puskesmas"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-80" />
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0A96D]">
                    <span>Universal Health Coverage</span>
                    <span>Kota Dumai</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    Jaminan layanan kesehatan aktif untuk seluruh anggota
                    keluarga warga Kota Dumai melalui dukungan APBD.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Metrics Strip Terbuka */}
          <div className="mt-16 border-t border-slate-900/10 pt-8 sm:mt-20">
            <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-slate-900/10">
              {stats.map((item, idx) => (
                <div
                  key={item.label}
                  className={idx === 0 ? "sm:pr-6" : "sm:px-6"}
                >
                  <p className="text-2xl font-extrabold tracking-tight text-slate-950 tabular-nums sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEUNGGULAN PROGRAM (Asymmetric Bento Layout) ── */}
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <MovingBackdrop
          image={advantagesBg}
          duration={26}
          reverse
          scrimClassName="bg-gradient-to-b from-white/95 via-[#FAF9F6]/90 to-white/95"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F4C81]">
                Keunggulan Layanan
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Dirancang sederhana, cepat, dan mudah diakses warga.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              Seluruh tahapan pendaftaran hingga pengecekan status terintegrasi
              dalam satu layanan digital.
            </p>
          </div>

          {/* Bento Grid: 1 Kartu Utama Besar di Kiri + 2 Kartu Pendukung di Kanan */}
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Kartu Utama (Coastal Navy) */}
            <Reveal>
              <article className="group flex h-full flex-col justify-between rounded-2xl bg-[#0A2540] p-7 text-white shadow-sm sm:p-9">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#E0A96D]">
                      <FeaturedIcon className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-200">
                      {featuredAdvantage.label}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-bold tracking-tight text-white">
                    {featuredAdvantage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {featuredAdvantage.description}
                  </p>

                  <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                    {featuredAdvantage.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs leading-5 text-slate-200 sm:text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A96D]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={featuredAdvantage.to}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#E0A96D] no-underline transition-colors hover:text-white"
                >
                  <span>{featuredAdvantage.action}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </article>
            </Reveal>

            {/* 2 Kartu Pendukung Bertumpuk */}
            <div className="flex flex-col gap-6">
              {secondaryAdvantages.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={(idx + 1) * 0.08}>
                    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/92 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#0F4C81]/40 hover:bg-white sm:p-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            {item.label}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-500">
                          {item.points[0]}
                        </span>
                        <Link
                          to={item.to}
                          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#0F4C81] no-underline hover:text-[#0A2540]"
                        >
                          <span>{item.action}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ALUR PENDAFTARAN (Clean Architectural Steps di atas Deep Navy) ── */}
      <section
        id="alur"
        className="relative isolate overflow-hidden bg-[#081C2E] py-20 text-white sm:py-28"
      >
        <MovingBackdrop
          image={alurBg}
          duration={28}
          scrimClassName="bg-gradient-to-b from-[#071828]/94 via-[#0A2540]/88 to-[#071828]/95"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E0A96D]">
              Alur Pendaftaran
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Tiga langkah menuju perlindungan kesehatan.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 border-t border-white/15 pt-12 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-[#E0A96D] tabular-nums">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {step.description}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E0A96D]" />
                    {step.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. JEJARING PUSKESMAS (Interactive Split Directory) ── */}
      <section className="relative isolate overflow-hidden bg-[#F7F6F2] py-20 sm:py-28">
        <MovingBackdrop
          image={faskesBg}
          duration={27}
          reverse
          scrimClassName="bg-gradient-to-br from-[#F7F6F2]/95 via-[#F2F0EA]/88 to-[#EBE8DF]/94"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F4C81]">
              Jejaring Pelayanan Kota Dumai
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Layanan Puskesmas, lebih dekat dengan domisili.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Pilih salah satu lokasi Puskesmas di bawah untuk melihat cakupan
              layanan sebelum mengisi formulir pendaftaran.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Daftar Interaktif Puskesmas */}
            <div className="divide-y divide-slate-900/10 border-y border-slate-900/10">
              {facilities.map((facility, index) => {
                const isSelected = selectedFacility === index;
                return (
                  <button
                    key={facility.name}
                    type="button"
                    onClick={() => setSelectedFacility(index)}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-5 text-left transition-colors ${
                      isSelected
                        ? "bg-white/90 text-slate-950"
                        : "text-slate-800 hover:bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          isSelected ? "text-[#0F4C81]" : "text-slate-400"
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-base font-bold">{facility.name}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-[#0F4C81]" />
                          Kecamatan {facility.district}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected
                          ? "translate-x-0 text-[#0F4C81]"
                          : "-translate-x-1 text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Panel Detail Puskesmas Terpilih */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFacility}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0F4C81]/10 px-2.5 py-1 text-xs font-bold text-[#0F4C81]">
                      <Building2 className="h-3.5 w-3.5" />
                      Puskesmas Terdaftar
                    </span>
                    <span className="text-xs font-medium text-emerald-700">
                      ● Terhubung 7 Kecamatan
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-950">
                    {facilities[selectedFacility].name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Wilayah Kecamatan {facilities[selectedFacility].district}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {facilities[selectedFacility].coverage}
                  </p>

                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <Link
                      to={registrationPath}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-5 text-xs font-bold uppercase tracking-wider text-white no-underline transition-colors hover:bg-[#0F4C81]"
                    >
                      <span>Pilih Puskesmas Ini saat Daftar</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. KOMITMEN PEMKO DUMAI ── */}
      <section className="relative isolate overflow-hidden bg-[#12161B] py-20 text-white sm:py-28">
        <MovingBackdrop
          image={komitmenBg}
          duration={30}
          scrimClassName="bg-gradient-to-b from-[#101419]/92 via-[#151B22]/86 to-[#101419]/94"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E0A96D]">
              Komitmen Pemerintah Kota
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Pelayanan publik yang transparan dan berpihak pada warga.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-10 border-t border-white/15 pt-12 sm:grid-cols-2">
            {commitments.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#E0A96D]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ (2-Column Split) & POSKO BANTUAN ── */}
      <section className="relative isolate overflow-hidden bg-[#0A2540] py-20 text-white sm:py-28">
        <MovingBackdrop
          image={faqBg}
          duration={32}
          reverse
          scrimClassName="bg-gradient-to-b from-[#081E34]/94 via-[#0B2947]/86 to-[#081E34]/95"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* FAQ Split 2 Kolom */}
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E0A96D]">
                Tanya Jawab
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Pertanyaan yang sering diajukan.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Informasi ringkas seputar persyaratan dokumen, alur pendaftaran,
                dan cara mengecek status pengajuan.
              </p>
            </div>

            <div className="divide-y divide-white/15 border-y border-white/15">
              {questions.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.question} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-white transition-colors hover:text-[#E0A96D]"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#E0A96D] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 pr-8 text-sm leading-relaxed text-slate-300">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1 Fokus CTA Card Posko Bantuan */}
          <div className="mt-20 rounded-2xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-xl sm:mt-24 sm:p-12">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#E0A96D]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Posko Layanan & Pengaduan</span>
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Butuh bantuan pendaftaran BPJS Dumai?
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  Hubungi petugas Posko Layanan Dinas Kesehatan Kota Dumai
                  melalui WhatsApp resmi atau Call Center tanggap cepat.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <a
                  href="https://wa.me/6281275000000?text=Halo%20Admin%20Posko%20BPJS%20Dinas%20Kesehatan%20Kota%20Dumai,%20saya%20ingin%20bertanya%20seputar%20pendaftaran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#E0A96D] px-6 text-sm font-bold text-[#0A2540] no-underline transition-colors hover:bg-[#e8b882] active:scale-[0.99]"
                >
                  <MessageSquareText className="h-4 w-4" />
                  <span>WhatsApp Posko</span>
                </a>

                <a
                  href="tel:076531000"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/15"
                >
                  <Phone className="h-4 w-4 text-[#E0A96D]" />
                  <span>(0765) 31000 / 112</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}