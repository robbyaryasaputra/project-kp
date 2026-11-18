import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileCheck2,
  FileText,
  HeartPulse,
  LockKeyhole,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";
import logoDinkes from "@/assets/logo-dinkes.jpg";
import heroFamily from "@/assets/hero-family.jpg";
import { useAuth } from "@/context/AuthContext";

const EASE = [0.16, 1, 0.3, 1];

const stats = [
  { value: "100%", label: "Cakupan semesta warga", accent: "text-primary-700" },
  { value: "Rp 0", label: "Iuran ditanggung APBD", accent: "text-emerald-700" },
  { value: "7", label: "Kecamatan di Kota Dumai", accent: "text-neutral-900" },
  { value: "Resmi", label: "Program Pemerintah Kota", accent: "text-primary-700" },
];

const advantages = [
  {
    icon: FileText,
    title: "Pendaftaran BPJS PBI Gratis",
    description:
      "Ajukan pendaftaran secara online dan lengkapi data keluarga dalam satu portal.",
    points: [
      "Untuk warga Kota Dumai sesuai ketentuan program",
      "Satu akun untuk data satu Kartu Keluarga",
      "Tidak dipungut biaya pendaftaran",
    ],
    action: "Mulai pendaftaran",
    to: "/register",
  },
  {
    icon: Search,
    title: "Pantau Status Pendaftaran",
    description:
      "Lihat perkembangan pengajuan dengan NIK dan kode pendaftaran, tanpa harus masuk akun.",
    points: [
      "Informasi status pengajuan",
      "Catatan verifikasi dari petugas",
      "Bisa diakses kapan saja",
    ],
    action: "Cek status",
    to: "/cek-status",
  },
  {
    icon: Building2,
    title: "Pilih Fasilitas Kesehatan",
    description:
      "Tentukan Puskesmas atau Klinik Pratama tingkat pertama yang sesuai dengan domisili.",
    points: [
      "Pilihan faskes tingkat pertama",
      "Sesuaikan dengan wilayah tempat tinggal",
      "Data faskes diisi pada formulir",
    ],
    action: "Lihat alur",
    to: "#alur",
  },
];

const steps = [
  {
    number: "01",
    title: "Siapkan NIK & Kartu Keluarga",
    description:
      "Pastikan data kependudukan aktif dan sesuai dengan identitas warga Kota Dumai.",
    note: "KK dan NIK peserta",
  },
  {
    number: "02",
    title: "Isi formulir pendaftaran",
    description:
      "Buat akun, lengkapi informasi keluarga, alamat, dan pilihan fasilitas kesehatan.",
    note: "Proses online",
  },
  {
    number: "03",
    title: "Pantau proses verifikasi",
    description:
      "Simpan kode pendaftaran dan gunakan bersama NIK untuk melihat status pengajuan.",
    note: "Cek status kapan saja",
  },
];

const facilities = [
  { name: "Puskesmas Kota Dumai", district: "Dumai Kota" },
  { name: "Puskesmas Jaya Mukti", district: "Dumai Timur" },
  { name: "Puskesmas Bumi Ayu", district: "Dumai Selatan" },
  { name: "Puskesmas Dumai Barat", district: "Dumai Barat" },
];

const commitments = [
  {
    icon: LockKeyhole,
    title: "Data dijaga",
    description:
      "Informasi pendaftar digunakan untuk kebutuhan pengajuan dan verifikasi.",
  },
  {
    icon: HeartPulse,
    title: "Layanan kesehatan",
    description:
      "Program membantu warga mengakses perlindungan kesehatan sesuai ketentuan.",
  },
  {
    icon: Smartphone,
    title: "Akses lebih mudah",
    description:
      "Formulir pendaftaran dan cek status dapat diakses melalui ponsel maupun komputer.",
  },
  {
    icon: BadgeCheck,
    title: "Proses tercatat",
    description:
      "Kode pendaftaran membantu warga menelusuri status pengajuan dengan jelas.",
  },
];

const questions = [
  {
    question: "Siapa yang dapat mengajukan pendaftaran?",
    answer:
      "Layanan ini ditujukan untuk warga Kota Dumai. Pengajuan akan diperiksa berdasarkan data dan ketentuan program yang berlaku.",
  },
  {
    question: "Data dan dokumen apa yang perlu disiapkan?",
    answer:
      "Siapkan NIK dan nomor Kartu Keluarga. Formulir akan memberi petunjuk dokumen yang perlu diunggah; Kartu Keluarga diperlukan untuk pengajuan.",
  },
  {
    question: "Bagaimana cara melihat status pendaftaran?",
    answer:
      "Buka menu Cek Status, lalu masukkan NIK peserta dan kode pendaftaran yang diperoleh setelah mengirim formulir.",
  },
  {
    question: "Berapa lama proses verifikasi berlangsung?",
    answer:
      "Waktu verifikasi bergantung pada antrean dan kelengkapan data. Periksa status secara berkala untuk melihat pembaruan dari petugas.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-700">
        <span className="h-px w-5 bg-emerald-500" />
        {eyebrow}
        <span className="h-px w-5 bg-emerald-500" />
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const registrationPath = user ? "/register" : "/login";

  return (
    <div className="overflow-hidden bg-neutral-50 text-neutral-900">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-secondary-50 via-neutral-50 to-white">
        <div className="pointer-events-none absolute -left-36 top-12 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-20">
          <div className="relative z-10">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-800 shadow-sm sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Pemerintah Kota Dumai · Dinas Kesehatan
            </p>

            <h1 className="max-w-3xl text-[clamp(2.5rem,5vw,4.2rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-primary-950">
              Program JKN BPJS Kesehatan Gratis Warga Kota Dumai.
              <span className="mt-1 block text-primary-600">
                100% Bebas Iuran APBD.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
              Ajukan kepesertaan secara digital. Siapkan NIK dan nomor Kartu
              Keluarga, lalu pantau status permohonan dari satu portal.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to={registrationPath} className="no-underline">
                <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-800 px-6 text-sm font-bold text-white shadow-lg shadow-primary-900/15 transition-colors hover:bg-primary-700 sm:w-auto">
                  Ajukan pendaftaran gratis
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/cek-status"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 no-underline transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <Search className="h-4 w-4 text-primary-700" />
                Cek status
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-200/80 pt-5 text-xs font-medium text-neutral-600">
              {["NIK & KK", "Proses online", "Status transparan"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Reveal className="relative mx-auto w-full max-w-[540px]">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-4 rounded-[2.5rem] bg-gradient-to-tr from-emerald-400/25 via-primary-300/20 to-teal-200/20 blur-2xl" />

            {/* Main Editorial Image Card */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white p-2 shadow-[0_30px_70px_-25px_rgba(4,63,63,0.22)] transition-all duration-500 hover:shadow-[0_35px_80px_-20px_rgba(4,63,63,0.3)]">
              {/* Image Container with Ambient Scrim */}
              <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-[1.6rem] bg-neutral-100 sm:aspect-[4/3.3]">
                <img
                  src={heroFamily}
                  alt="Keluarga warga Kota Dumai di Puskesmas Ramah Keluarga"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Editorial Gradient Scrim for readable badges and text */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/10" />

                {/* Top Badge: Floating Status Pill */}
                <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-neutral-800 shadow-md backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Layanan Faskes Ramah Keluarga
                </div>

                {/* Top Right: Dinas Kesehatan Seal Pill */}
                <div className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900/70 p-1 pl-2.5 text-[10px] font-semibold tracking-wider text-white shadow-md backdrop-blur-md">
                  <span className="hidden xs:inline uppercase">Kota Dumai</span>
                  <img
                    src={logoDinkes}
                    alt="Logo Dinas Kesehatan Kota Dumai"
                    className="h-6 w-6 rounded-full border border-white/30 object-cover"
                  />
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                    Jaminan Kesehatan Semesta (UHC)
                  </p>
                  <h3 className="mt-1 text-lg font-bold leading-snug sm:text-xl text-white">
                    Perlindungan kesehatan aktif untuk seluruh anggota keluarga.
                  </h3>
                  <p className="mt-1 hidden sm:block text-xs leading-relaxed text-white/80">
                    Terhubung langsung dengan fasilitas kesehatan tingkat pertama di 7 kecamatan Kota Dumai.
                  </p>
                </div>
              </div>

              {/* Bottom Micro Metric Bar */}
              <div className="grid grid-cols-2 gap-2 p-2 pt-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 sm:p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Rp 0 Bebas Iuran</p>
                    <p className="text-[10px] text-neutral-500 leading-tight truncate">Ditanggung APBD</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 sm:p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                    <UsersRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">1 Akun = 1 KK</p>
                    <p className="text-[10px] text-neutral-500 leading-tight truncate">Daftarkan sekeluarga</p>
                  </div>
                </div>
              </div>
            </div>


          </Reveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:-mt-9 sm:grid-cols-4 sm:gap-4 sm:px-6">
        {stats.map((item, index) => (
          <Reveal key={item.label} delay={index * 0.04}>
            <div className="h-full rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] sm:p-5">
              <p className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${item.accent}`}>
                {item.value}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-neutral-500 sm:text-xs">
                {item.label}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Program prioritas Pemko Dumai"
          title="3 keunggulan BPJS Gratis Kota Dumai"
          description="Layanan yang dirancang agar pengajuan lebih mudah dipahami, status lebih mudah dipantau, dan pilihan faskes lebih dekat dengan warga."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary-900/[0.06] sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-100 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {item.description}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-xs leading-5 text-neutral-600"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={item.to}
                    className="mt-auto inline-flex items-center gap-1 pt-6 text-xs font-bold text-primary-700 no-underline hover:text-primary-900"
                  >
                    {item.action}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="alur" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Syarat & alur pendaftaran"
            title="Hanya 3 langkah mudah"
            description="Ikuti tahapannya dari menyiapkan data sampai memeriksa hasil verifikasi."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.06}>
                <article className="relative h-full rounded-2xl bg-neutral-50 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${index === 1 ? "bg-emerald-700" : "bg-primary-950"
                        }`}
                    >
                      {step.number}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                      Langkah {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold leading-snug text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">
                    {step.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {step.note}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-700">
              <MapPin className="h-4 w-4" />
              Jejaring pelayanan Kota Dumai
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Faskes tingkat pertama, lebih dekat dengan domisili.
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600 sm:text-base">
              Pilih Puskesmas yang sesuai dengan wilayah tempat tinggal saat
              mengisi formulir pendaftaran. Berikut beberapa contoh faskes di
              Kota Dumai.
            </p>
            <Link
              to={registrationPath}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-800 px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-700"
            >
              Pilih faskes saat daftar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {facilities.map((facility, index) => (
            <Reveal key={facility.name} delay={index * 0.04}>
              <article className="flex h-full min-h-28 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-primary-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-700">
                    Faskes tingkat I
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-neutral-900">
                    {facility.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Kecamatan {facility.district}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f0f4f3] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Komitmen Pemko Dumai"
            title="Perlindungan yang terasa manfaatnya"
            description="Informasi layanan, langkah pengajuan, dan tindak lanjut disajikan dalam satu tempat."
          />
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.04}>
                  <article className="h-full border-l-2 border-emerald-600 pl-4">
                    <Icon className="h-5 w-5 text-primary-700" />
                    <h3 className="mt-3 text-sm font-bold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-neutral-600">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Tanya jawab seputar BPJS Dumai"
          title="Pertanyaan yang sering diajukan"
          description="Temukan jawaban singkat tentang pengajuan dan cara memeriksa status."
        />
        <div className="space-y-3">
          {questions.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-neutral-200 bg-white px-5 shadow-sm open:border-primary-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-neutral-800 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-primary-700 transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-neutral-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary-950 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.035]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Layanan Bantuan &amp; Posko Pengaduan Dumai
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Butuh Bantuan Pendaftaran BPJS Dumai?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Hubungi petugas Posko Layanan BPJS Kesehatan Kota Dumai melalui WhatsApp atau layanan Call Center tanggap cepat.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/6281275000000?text=Halo%20Admin%20Posko%20BPJS%20Dinas%20Kesehatan%20Kota%20Dumai,%20saya%20ingin%20bertanya%20seputar%20pendaftaran"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-400 px-6 text-sm font-bold text-primary-950 shadow-md shadow-emerald-500/20 no-underline transition-all duration-200 hover:bg-emerald-300 hover:scale-[1.02] active:scale-95 sm:min-w-[280px]"
              >
                <MessageSquare className="h-4 w-4 text-primary-950" />
                <span>WhatsApp Posko Dumai</span>
              </a>
              <a
                href="tel:076531000"
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white backdrop-blur-xs no-underline transition-all duration-200 hover:border-emerald-400/50 hover:bg-white/10 hover:scale-[1.02] active:scale-95 sm:min-w-[280px]"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Call Center: (0765) 31000 / 112</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
