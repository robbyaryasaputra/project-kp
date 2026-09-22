import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Copy,
  Search,
  FileText,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { registrationCode, fullName } = location.state || {};

  /* If user navigated directly without state, redirect */
  if (!registrationCode) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <Card>
          <CardContent className="p-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              Halaman Tidak Valid
            </h2>
            <p className="text-neutral-500 mb-6 text-sm">
              Anda belum melakukan pendaftaran. Silakan isi formulir pendaftaran terlebih dahulu.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/register">
                <Button className="w-full">
                  <FileText className="w-4 h-4" />
                  Daftar Sekarang
                </Button>
              </Link>
              <Link to="/cek-status">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4" />
                  Cek Status Pendaftaran
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(registrationCode);
    toast.success("Kode pendaftaran berhasil disalin!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      {/* Success Hero */}
      <div className="text-center mb-8">
        {/* Animated success icon */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-200/60 animate-pulse-soft" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          {/* Sparkle decorations */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse-soft" />
          <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-primary-400 animate-pulse-soft delay-200" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-3 animate-slide-up">
          Pendaftaran Berhasil!
        </h1>
        <p className="text-neutral-500 max-w-md mx-auto animate-slide-up delay-100">
          Terima kasih{fullName ? `, ${fullName}` : ""}. Data pendaftaran Anda telah berhasil dikirim dan sedang menunggu verifikasi petugas.
        </p>
      </div>

      {/* Registration Code Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white mb-6 animate-slide-up delay-200">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-base text-emerald-700 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Kode Pendaftaran Anda
          </CardTitle>
          <CardDescription>
            Simpan kode ini untuk memantau status pendaftaran
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-semibold">
              Registration Code
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600 tracking-widest font-mono">
              {registrationCode}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            onClick={copyCode}
          >
            <Copy className="w-4 h-4" />
            Salin Kode Pendaftaran
          </Button>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 animate-slide-up delay-300">
        <h3 className="font-semibold text-amber-800 text-sm mb-2">
          📋 Langkah Selanjutnya:
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
            <span>Simpan kode pendaftaran Anda dengan baik</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
            <span>Petugas akan memverifikasi data dan dokumen Anda</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
            <span>Cek status pendaftaran secara berkala dengan NIK dan kode pendaftaran</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
            <span>Download bukti pendaftaran PDF setelah disetujui</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up delay-400">
        <Link to="/cek-status" className="flex-1">
          <Button className="w-full" size="lg">
            <Search className="w-4 h-4" />
            Cek Status Pendaftaran
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/register" className="flex-1">
          <Button variant="outline" className="w-full" size="lg">
            <FileText className="w-4 h-4" />
            Daftar Lagi
          </Button>
        </Link>
      </div>
    </div>
  );
}
