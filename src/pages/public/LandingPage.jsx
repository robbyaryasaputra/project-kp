import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  Search,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: "Pendaftaran Online",
      description:
        "Daftar BPJS Kesehatan tanpa perlu antri. Isi formulir dan upload dokumen langsung dari perangkat Anda.",
      color: "bg-primary-50 text-primary-600",
    },
    {
      icon: Clock,
      title: "Proses Cepat",
      description:
        "Pendaftaran Anda akan diverifikasi oleh petugas dan diproses dalam waktu singkat.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Search,
      title: "Pantau Status",
      description:
        "Cek status pendaftaran kapan saja dengan NIK dan kode pendaftaran Anda.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: BadgeCheck,
      title: "Bukti Digital",
      description:
        "Unduh bukti pendaftaran dalam format PDF setelah pendaftaran disetujui.",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Isi Formulir",
      description: "Lengkapi data diri dan informasi kepesertaan Anda.",
    },
    {
      step: "02",
      title: "Upload Dokumen",
      description: "Unggah foto KTP, Kartu Keluarga, dan Pas Foto.",
    },
    {
      step: "03",
      title: "Dapatkan Kode",
      description: "Simpan kode pendaftaran untuk memantau status.",
    },
    {
      step: "04",
      title: "Verifikasi",
      description: "Petugas akan memverifikasi data dan dokumen Anda.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 animate-slide-up">
              <Shield className="w-4 h-4" />
              Sistem Pendaftaran Online
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 animate-slide-up delay-100">
              Daftar BPJS
              <br />
              Kesehatan{" "}
              <span className="text-accent-300">Dengan Mudah</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-xl animate-slide-up delay-200">
              Pendaftaran peserta BPJS Kesehatan secara online. Cepat, mudah, dan
              tanpa perlu antri di kantor cabang.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-neutral-100 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5" />
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/cek-status">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Search className="w-5 h-5" />
                  Cek Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, value: "Peserta Baru", label: "Pendaftaran terbuka" },
            {
              icon: CheckCircle,
              value: "Proses Mudah",
              label: "Cukup 4 langkah",
            },
            { icon: Clock, value: "24/7 Akses", label: "Daftar kapan saja" },
          ].map((stat, i) => (
            <Card
              key={i}
              className={`animate-slide-up delay-${(i + 1) * 100} border-0 shadow-lg`}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">
            Fitur Layanan
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Nikmati kemudahan layanan pendaftaran BPJS Kesehatan secara digital.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="group hover:-translate-y-1 transition-transform duration-300 border-neutral-200/80"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Cara Pendaftaran</h2>
            <p className="text-neutral-400 max-w-lg mx-auto">
              Ikuti langkah-langkah berikut untuk mendaftar BPJS Kesehatan
              secara online.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-5xl font-black text-primary-500/20 mb-3 group-hover:text-primary-500/40 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-5 h-5 text-neutral-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="relative p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Siap Mendaftar BPJS Kesehatan?
            </h2>
            <p className="text-primary-100 mb-8 max-w-md mx-auto">
              Lindungi diri dan keluarga Anda dengan jaminan kesehatan nasional.
              Daftar sekarang, proses cepat dan mudah.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary-700 hover:bg-neutral-100 shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Mulai Pendaftaran
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
