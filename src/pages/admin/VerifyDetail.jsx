import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Image,
  CreditCard,
  Users as UsersIcon,
  Camera,
  AlertTriangle,
  ExternalLink,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";

export default function VerifyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMode, setActionMode] = useState(null); // 'approve' | 'reject'
  const [cardNumber, setCardNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  const fetchApplicant = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setApplicant(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data pendaftar.");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!cardNumber.trim()) {
      toast.error("Nomor Kartu BPJS wajib diisi.");
      return;
    }
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("applicants")
        .update({
          status: "approved",
          card_number: cardNumber.trim(),
        })
        .eq("id", applicant.id);

      if (error) throw error;
      toast.success(`Pendaftaran ${applicant.full_name} disetujui!`);
      navigate("/admin/dashboard");
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
        .eq("id", applicant.id);

      if (error) throw error;
      toast.success(`Pendaftaran ${applicant.full_name} ditolak.`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menolak pendaftaran.");
    } finally {
      setProcessing(false);
    }
  };

  const getGenderLabel = (g) => (g === 1 ? "Laki-laki" : "Perempuan");
  const getMaritalLabel = (m) =>
    ({ 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" }[m] ||
    "-");
  const getPisatLabel = (p) =>
    ({ 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" }[p] || "-");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!applicant) return null;

  const statusConfig = {
    pending: { variant: "warning", label: "Pending", icon: Clock },
    approved: { variant: "success", label: "Disetujui", icon: CheckCircle },
    rejected: { variant: "danger", label: "Ditolak", icon: XCircle },
  };
  const status = statusConfig[applicant.status] || statusConfig.pending;

  const documents = [
    { label: "Foto KTP", url: applicant.ktp_url, icon: CreditCard },
    { label: "Kartu Keluarga", url: applicant.kk_url, icon: UsersIcon },
    { label: "Pas Foto", url: applicant.photo_url, icon: Camera },
  ];

  const personalData = [
    ["Kode Registrasi", applicant.registration_code],
    ["NIK", applicant.nik],
    ["No. Kartu Keluarga", applicant.family_card_number],
    ["Nama Lengkap", applicant.full_name],
    ["PISAT", getPisatLabel(applicant.pisat_code)],
    ["Tempat, Tgl Lahir", `${applicant.birth_place}, ${applicant.birth_date}`],
    ["Jenis Kelamin", getGenderLabel(applicant.gender)],
    ["Status Perkawinan", getMaritalLabel(applicant.marital_status)],
    ["No. Telepon", applicant.phone_number || "-"],
    ["Email", applicant.email || "-"],
  ];

  const addressData = [
    ["Alamat", applicant.address],
    ["RT / RW", `${applicant.rt || "-"} / ${applicant.rw || "-"}`],
    ["Kecamatan", applicant.district],
    ["Kelurahan / Desa", applicant.village],
    ["Kode Pos", applicant.postal_code || "-"],
    ["Faskes Tingkat I", applicant.facility_name],
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="text-neutral-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant={status.variant}>
            <status.icon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
          <span className="font-mono text-xs bg-neutral-100 px-3 py-1.5 rounded-lg text-neutral-600">
            {applicant.registration_code}
          </span>
        </div>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" />
          Review Pendaftaran
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Verifikasi data diri dan dokumen pendaftar secara side-by-side
        </p>
      </div>

      {/* Side-by-Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Personal Data */}
        <div className="space-y-6">
          {/* Data Diri */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-500" />
                </div>
                Data Diri Pendaftar
              </CardTitle>
              <CardDescription>
                Tanggal daftar:{" "}
                {new Date(applicant.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {personalData.map(([label, value], i) => (
                  <div key={i} className={label === "Nama Lengkap" ? "col-span-2" : ""}>
                    <p className="text-neutral-400 text-xs mb-0.5">{label}</p>
                    <p className="font-medium text-neutral-800 break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alamat */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                Alamat & Faskes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {addressData.map(([label, value], i) => (
                  <div key={i} className={label === "Alamat" ? "col-span-2" : ""}>
                    <p className="text-neutral-400 text-xs mb-0.5">{label}</p>
                    <p className="font-medium text-neutral-800 break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Document Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Image className="w-4 h-4 text-blue-500" />
                </div>
                Pratinjau Dokumen
              </CardTitle>
              <CardDescription>
                Klik gambar untuk melihat ukuran penuh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {documents.map((doc, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5 mb-2">
                    <doc.icon className="w-3.5 h-3.5" />
                    {doc.label}
                  </p>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative"
                    >
                      <img
                        src={doc.url}
                        alt={doc.label}
                        className="w-full h-48 object-cover rounded-xl border-2 border-neutral-200 group-hover:border-primary-400 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="hidden w-full h-48 rounded-xl border-2 border-neutral-200 bg-neutral-50 items-center justify-center text-neutral-400 text-sm"
                      >
                        Gagal memuat gambar
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-700 shadow-sm">
                          <ExternalLink className="w-3 h-3" />
                          Lihat Ukuran Penuh
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-48 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center text-neutral-400 gap-2">
                      <doc.icon className="w-8 h-8" />
                      <span className="text-sm">Tidak ada file</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Section (only for pending) */}
      {applicant.status === "pending" && (
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Tindakan Verifikasi
            </CardTitle>
            <CardDescription>
              Pilih untuk menyetujui atau menolak pendaftaran ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!actionMode && (
              <div className="flex gap-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => setActionMode("reject")}
                >
                  <XCircle className="w-4 h-4" />
                  Tolak Pendaftaran
                </Button>
                <Button
                  variant="success"
                  onClick={() => setActionMode("approve")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Setujui (ACC)
                </Button>
              </div>
            )}

            {/* Approve Form */}
            {actionMode === "approve" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Setujui Pendaftaran — {applicant.full_name}
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800">
                    Nomor Kartu BPJS *
                  </Label>
                  <Input
                    placeholder="Masukkan nomor kartu BPJS yang diterbitkan..."
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                  <p className="text-xs text-emerald-600">
                    Masukkan nomor kartu BPJS Kesehatan yang diterbitkan untuk peserta ini.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setActionMode(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Konfirmasi ACC
                  </Button>
                </div>
              </div>
            )}

            {/* Reject Form */}
            {actionMode === "reject" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Tolak Pendaftaran — {applicant.full_name}
                </div>
                <div className="space-y-2">
                  <Label className="text-red-800">
                    Alasan Penolakan *
                  </Label>
                  <Textarea
                    placeholder="Jelaskan alasan penolakan pendaftaran ini..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="border-red-300 focus:border-red-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setActionMode(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Konfirmasi Tolak
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Already processed info */}
      {applicant.status === "approved" && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-700">Pendaftaran Disetujui</p>
              <p className="text-sm text-emerald-600">
                Nomor Kartu BPJS: <span className="font-mono font-bold">{applicant.card_number || "-"}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {applicant.status === "rejected" && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-700">Pendaftaran Ditolak</p>
              <p className="text-sm text-red-600">
                Alasan: {applicant.rejection_reason || "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
