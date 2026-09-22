import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateApprovalPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  User,
  MapPin,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

export default function StatusCheck() {
  const [nik, setNik] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!nik.trim() || !code.trim()) {
      toast.error("NIK dan Kode Pendaftaran wajib diisi.");
      return;
    }
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("nik", nik.trim())
        .eq("registration_code", code.trim().toUpperCase())
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mencari data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (result) {
      generateApprovalPDF(result);
      toast.success("PDF berhasil diunduh!");
    }
  };

  const statusConfig = {
    pending: {
      variant: "warning",
      icon: Clock,
      label: "Sedang Diverifikasi",
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
      description:
        "Pendaftaran Anda sedang dalam proses verifikasi oleh petugas. Silakan cek kembali secara berkala.",
    },
    approved: {
      variant: "success",
      icon: CheckCircle2,
      label: "Pendaftaran Disetujui",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
      description:
        "Selamat! Pendaftaran BPJS Kesehatan Anda telah disetujui.",
    },
    rejected: {
      variant: "danger",
      icon: XCircle,
      label: "Pendaftaran Ditolak",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      description:
        "Maaf, pendaftaran Anda ditolak. Silakan lihat alasan di bawah.",
    },
  };

  const getGenderLabel = (g) => (g === 1 ? "Laki-laki" : "Perempuan");
  const getMaritalLabel = (m) =>
    ({ 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" }[m] ||
    "-");
  const getPisatLabel = (p) =>
    ({ 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" }[p] || "-");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Cek Status Pendaftaran
        </h1>
        <p className="text-neutral-500">
          Masukkan NIK dan Kode Pendaftaran untuk melihat status pendaftaran BPJS Anda.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-nik">NIK (16 Digit)</Label>
                <Input
                  id="search-nik"
                  placeholder="3201234567890001"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  maxLength={16}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search-code">Kode Pendaftaran</Label>
                <Input
                  id="search-code"
                  placeholder="BPJS-202609-12345"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Cek Status
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Not Found */}
      {notFound && (
        <Card className="border-amber-200 bg-amber-50 animate-slide-up">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-amber-800 mb-1">
              Data Tidak Ditemukan
            </h3>
            <p className="text-sm text-amber-700">
              Pastikan NIK dan Kode Pendaftaran yang Anda masukkan sudah benar.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Status Banner */}
          {(() => {
            const cfg = statusConfig[result.status];
            const StatusIcon = cfg.icon;
            return (
              <Card className={`border ${cfg.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${cfg.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <StatusIcon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-lg font-bold ${cfg.color}`}>
                          {cfg.label}
                        </h3>
                        <Badge variant={cfg.variant}>{result.status.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {cfg.description}
                      </p>

                      {/* Approved: show card number */}
                      {result.status === "approved" && result.card_number && (
                        <div className="mt-4 bg-white rounded-xl border border-emerald-200 p-4">
                          <p className="text-xs text-neutral-500 mb-1">
                            Nomor Kartu BPJS
                          </p>
                          <p className="text-2xl font-bold text-primary-600 tracking-wider font-mono">
                            {result.card_number}
                          </p>
                        </div>
                      )}

                      {/* Rejected: show reason */}
                      {result.status === "rejected" &&
                        result.rejection_reason && (
                          <div className="mt-4 bg-white rounded-xl border border-red-200 p-4">
                            <p className="text-xs text-neutral-500 mb-1">
                              Alasan Penolakan
                            </p>
                            <p className="text-sm text-red-700 font-medium">
                              {result.rejection_reason}
                            </p>
                          </div>
                        )}

                      {/* Download PDF button (approved only) */}
                      {result.status === "approved" && (
                        <Button
                          className="mt-4"
                          variant="success"
                          onClick={handleDownloadPDF}
                        >
                          <Download className="w-4 h-4" />
                          Download Bukti PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Detail Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary-500" />
                Detail Data Pendaftar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {[
                  ["Kode Pendaftaran", result.registration_code],
                  ["NIK", result.nik],
                  ["No. KK", result.family_card_number],
                  ["Nama Lengkap", result.full_name],
                  ["PISAT", getPisatLabel(result.pisat_code)],
                  [
                    "Tempat, Tgl Lahir",
                    `${result.birth_place}, ${result.birth_date}`,
                  ],
                  ["Jenis Kelamin", getGenderLabel(result.gender)],
                  ["Status Kawin", getMaritalLabel(result.marital_status)],
                  ["No. Telepon", result.phone_number || "-"],
                  ["Email", result.email || "-"],
                  [
                    "Alamat",
                    `${result.address}, RT ${result.rt || "-"}/RW ${result.rw || "-"}`,
                  ],
                  ["Kecamatan", result.district],
                  ["Kelurahan/Desa", result.village],
                  ["Kode Pos", result.postal_code || "-"],
                  ["Faskes Tk. I", result.facility_name],
                  [
                    "Tanggal Daftar",
                    new Date(result.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }),
                  ],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <p className="text-neutral-400 text-xs mb-0.5">{label}</p>
                    <p className="font-medium text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
