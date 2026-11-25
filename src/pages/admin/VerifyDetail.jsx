import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  Check,
  Copy,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Clock,
  ClipboardCheck,
  ExternalLink,
  Maximize2,
  AlertTriangle,
  FileWarning,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    variant: "warning",
    label: "Pending",
    icon: Clock,
    boxClass: "bg-amber-100 text-amber-600",
    titleClass: "text-amber-700",
    cardClass: "border-amber-400 bg-amber-50/70 shadow-xs",
  },
  approved: {
    variant: "success",
    label: "Disetujui",
    icon: CheckCircle,
    boxClass: "bg-emerald-100 text-emerald-600",
    titleClass: "text-emerald-700",
    cardClass: "border-emerald-400 bg-emerald-50/70 shadow-xs",
  },
  rejected: {
    variant: "danger",
    label: "Ditolak",
    icon: XCircle,
    boxClass: "bg-red-100 text-red-600",
    titleClass: "text-red-700",
    cardClass: "border-red-400 bg-red-50/70 shadow-xs",
  },
};

const QUICK_NOTES = ["Disetujui", "Aktif", "PBI APBD", "Non-PBI"];

function getGenderLabel(g) {
  return g === 1 ? "Laki-laki" : "Perempuan";
}

function getMaritalLabel(m) {
  return (
    { 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" }[m] ||
    "-"
  );
}

function getPisatLabel(p) {
  return { 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" }[p] || "-";
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      toast.success(`${label} disalin`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Gagal menyalin ke clipboard");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Salin ${label}`}
      aria-label={`Salin ${label}`}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default function VerifyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [brokenDocs, setBrokenDocs] = useState({});

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const [statusNote, setStatusNote] = useState("Disetujui");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchApplicant() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("applicants")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setApplicant(data);
        if (data?.notes) {
          setStatusNote(data.notes);
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data pendaftar.");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchApplicant();
  }, [id, navigate]);

  const handleApprove = async (e) => {
    e.preventDefault();
    const finalNote = statusNote.trim() || "Disetujui";
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("applicants")
        .update({
          status: "approved",
          notes: finalNote,
        })
        .eq("id", applicant.id);

      if (error) throw error;
      toast.success(`Pendaftaran ${applicant.full_name} disetujui!`);
      setShowApproveModal(false);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyetujui pendaftaran.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
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
      setShowRejectModal(false);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menolak pendaftaran.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!applicant) return null;

  const status = STATUS_CONFIG[applicant.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const documents = [
    { key: "ktp", label: "KTP", fullLabel: "Foto KTP", url: applicant.ktp_url },
    { key: "kk", label: "KK", fullLabel: "Kartu Keluarga", url: applicant.kk_url },
    { key: "photo", label: "Pas Foto", fullLabel: "Pas Foto", url: applicant.photo_url },
  ];

  const activeDoc = documents[activeDocIndex] || documents[0];
  const isActiveDocBroken = Boolean(brokenDocs[activeDoc.key]);

  const submittedAt = new Date(applicant.created_at).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const personalRows = [
    { label: "Kode Registrasi", value: applicant.registration_code, badge: true },
    { label: "Nama Lengkap", value: applicant.full_name, bold: true },
    { label: "NIK", value: applicant.nik, copyable: true, mono: true },
    { label: "No. Kartu Keluarga", value: applicant.family_card_number, copyable: true, mono: true },
    { label: "Hubungan PISAT", value: getPisatLabel(applicant.pisat_code), outlineBadge: true },
    { label: "Tempat, Tgl Lahir", value: `${applicant.birth_place || "-"}, ${applicant.birth_date || "-"}` },
    { label: "Jenis Kelamin", value: getGenderLabel(applicant.gender) },
    { label: "Status Perkawinan", value: getMaritalLabel(applicant.marital_status) },
    { label: "No. Telepon", value: applicant.phone_number || "-", mono: true },
    { label: "Email", value: applicant.email || "-" },
  ];

  const addressRows = [
    { label: "Alamat Lengkap", value: applicant.address || "-" },
    { label: "RT / RW", value: `${applicant.rt || "-"} / ${applicant.rw || "-"}`, mono: true },
    { label: "Kelurahan / Desa", value: applicant.village || "-" },
    { label: "Kecamatan", value: applicant.district || "-" },
    { label: "Kode Pos", value: applicant.postal_code || "-", mono: true },
    { label: "Faskes Tingkat I", value: applicant.facility_name || "-", bold: true },
  ];

  if (applicant.card_number) {
    personalRows.push({
      label: "No. Kartu BPJS",
      value: applicant.card_number,
      mono: true,
      highlightPrimary: true,
    });
  }

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* ── Top Back Navigation ── */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/dashboard")}
          className="-ml-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Dashboard
        </Button>
      </div>

      {/* ── Header (Selaras dengan RecapReport) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-primary-500 shrink-0" />
            <span>Detail Verifikasi — {applicant.full_name}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-medium">
              {applicant.registration_code}
            </span>
            <Badge variant={status.variant} className="text-xs">
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            <span>Didaftarkan {submittedAt}</span>
          </div>
        </div>

        {applicant.status === "pending" && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              <XCircle className="w-4 h-4" />
              Tolak
            </Button>
            <Button
              variant="success"
              onClick={() => setShowApproveModal(true)}
            >
              <CheckCircle className="w-4 h-4" />
              Setujui (ACC)
            </Button>
          </div>
        )}
      </div>

      {/* ── 3 Summary Cards (Selaras dengan RecapReport) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-neutral-200 bg-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-base font-bold font-mono tabular-nums text-neutral-900 truncate">
                  {applicant.nik}
                </p>
                <CopyButton value={applicant.nik} label="NIK" />
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <span className="font-mono tabular-nums truncate">
                  KK: {applicant.family_card_number}
                </span>
                <CopyButton value={applicant.family_card_number} label="No. KK" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-neutral-900 truncate">
                {applicant.facility_name || "-"}
              </p>
              <p className="text-xs text-neutral-600 font-medium truncate">
                {applicant.district}, {applicant.village}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`border transition-all ${status.cardClass}`}>
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${status.boxClass}`}
            >
              <StatusIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-bold leading-tight ${status.titleClass}`}>
                {status.label}
              </p>
              <p className="text-xs text-neutral-600 font-medium truncate mt-0.5">
                {applicant.status === "rejected"
                  ? applicant.rejection_reason || "Berkas ditolak"
                  : applicant.status === "approved"
                    ? applicant.notes || "Disetujui"
                    : "Menunggu verifikasi petugas"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Split Content: Data Table & Document Inspector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Structured Data Sheet (6 cols) */}
        <Card className="lg:col-span-6 border-neutral-200 bg-white overflow-hidden">
          <CardHeader className="pb-4 border-b border-neutral-100">
            <CardTitle className="text-base font-bold text-neutral-900">
              Data Pendaftar &amp; Domisili
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Sub-header: Identitas */}
            <div className="bg-neutral-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
              Identitas Pribadi
            </div>
            <dl className="divide-y divide-neutral-100">
              {personalRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[140px_1fr] sm:grid-cols-[165px_1fr] items-center gap-3 px-6 py-3 text-sm"
                >
                  <dt className="text-xs font-medium text-neutral-500">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 flex items-center gap-1.5 text-neutral-900">
                    {row.badge ? (
                      <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-medium">
                        {row.value}
                      </span>
                    ) : row.outlineBadge ? (
                      <Badge variant="outline" className="text-xs">
                        {row.value}
                      </Badge>
                    ) : (
                      <span
                        className={`truncate ${row.bold ? "font-semibold" : "font-medium"} ${row.mono ? "font-mono text-xs tabular-nums" : ""
                          } ${row.highlightPrimary ? "text-primary-600 font-semibold" : ""}`}
                      >
                        {row.value}
                      </span>
                    )}
                    {row.copyable && (
                      <CopyButton value={row.value} label={row.label} />
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Sub-header: Domisili */}
            <div className="bg-neutral-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-y border-neutral-100">
              Alamat &amp; Fasilitas Kesehatan
            </div>
            <dl className="divide-y divide-neutral-100">
              {addressRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[140px_1fr] sm:grid-cols-[165px_1fr] items-start gap-3 px-6 py-3 text-sm"
                >
                  <dt className="text-xs font-medium text-neutral-500 pt-0.5">
                    {row.label}
                  </dt>
                  <dd
                    className={`min-w-0 text-neutral-900 ${row.bold ? "font-semibold" : "font-medium"
                      } ${row.mono ? "font-mono text-xs tabular-nums" : ""}`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* RIGHT: Interactive Document Inspector (6 cols) */}
        <Card className="lg:col-span-6 lg:sticky lg:top-6 border-neutral-200 bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base font-bold text-neutral-900">
              Lampiran Dokumen
            </CardTitle>

            <div
              className="inline-flex items-center rounded-lg bg-neutral-100 p-1"
              role="tablist"
              aria-label="Pilih dokumen lampiran"
            >
              {documents.map((doc, idx) => {
                const isActive = idx === activeDocIndex;
                return (
                  <button
                    key={doc.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveDocIndex(idx)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${isActive
                      ? "bg-white text-primary-700 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                      }`}
                  >
                    {doc.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Preview Canvas (object-contain so KTP/KK edges are never cropped) */}
            <div className="relative flex min-h-[320px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:min-h-[360px]">
              {activeDoc.url && !isActiveDocBroken ? (
                <button
                  type="button"
                  onClick={() => setShowZoomModal(true)}
                  className="group relative flex w-full items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-zoom-in"
                >
                  <img
                    key={activeDoc.url}
                    src={activeDoc.url}
                    alt={activeDoc.fullLabel}
                    className="max-h-[340px] w-full rounded-lg object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                    onError={() =>
                      setBrokenDocs((prev) => ({
                        ...prev,
                        [activeDoc.key]: true,
                      }))
                    }
                  />
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-neutral-400">
                  <FileWarning className="w-8 h-8" />
                  <p className="text-xs font-medium text-neutral-500">
                    {activeDoc.url
                      ? "Gagal memuat gambar"
                      : `${activeDoc.fullLabel} tidak tersedia`}
                  </p>
                </div>
              )}
            </div>

            {/* Utility Bar */}
            {activeDoc.url && !isActiveDocBroken && (
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">
                  {activeDoc.fullLabel}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowZoomModal(true)}
                    className="h-8 px-2.5 text-xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5 mr-1" />
                    Perbesar
                  </Button>
                  <a
                    href={activeDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 no-underline transition-colors hover:bg-neutral-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Tab Baru
                  </a>
                </div>
              </div>
            )}

            {/* Thumbnail Selector Strip */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-neutral-100">
              {documents.map((doc, idx) => {
                const isSelected = idx === activeDocIndex;
                const isBroken = Boolean(brokenDocs[doc.key]);
                return (
                  <button
                    key={doc.key}
                    type="button"
                    onClick={() => setActiveDocIndex(idx)}
                    className={`group flex flex-col overflow-hidden rounded-lg border text-left transition-all cursor-pointer ${isSelected
                      ? "border-primary-500 bg-primary-50/30 ring-1 ring-primary-500"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                  >
                    <div className="flex h-16 w-full items-center justify-center overflow-hidden bg-neutral-100">
                      {doc.url && !isBroken ? (
                        <img
                          src={doc.url}
                          alt={doc.fullLabel}
                          className="h-full w-full object-cover"
                          onError={() =>
                            setBrokenDocs((prev) => ({
                              ...prev,
                              [doc.key]: true,
                            }))
                          }
                        />
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          Kosong
                        </span>
                      )}
                    </div>
                    <span
                      className={`truncate px-2 py-1.5 text-[11px] font-semibold ${isSelected ? "text-primary-700" : "text-neutral-600"
                        }`}
                    >
                      {doc.fullLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════
          MODAL SETUJUI PENDAFTARAN (Selaras dengan RecapReport Dialog)
      ════════════════════════════════════════════════════ */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Setujui Pendaftaran
            </DialogTitle>
            <DialogDescription>
              {applicant.registration_code} — {applicant.full_name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApprove} className="space-y-4 p-6 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="approve-notes">Status / Keterangan *</Label>
              <Input
                id="approve-notes"
                placeholder="Contoh: Disetujui, Aktif, PBI APBD..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-neutral-500">
                  Pilihan cepat:
                </span>
                {QUICK_NOTES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStatusNote(opt)}
                    className={`text-[11px] px-2.5 py-0.5 rounded border transition-colors cursor-pointer ${statusNote === opt
                      ? "bg-primary-600 text-white border-primary-600 font-medium"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-700"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-500 pt-1">
                Keterangan ini akan tersimpan dan masuk ke kolom Keterangan pada rekap Excel.
              </p>
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 flex justify-end gap-2 px-0 pb-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowApproveModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="success" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Konfirmasi ACC
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          MODAL TOLAK PENDAFTARAN
      ════════════════════════════════════════════════════ */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Tolak Pendaftaran
            </DialogTitle>
            <DialogDescription>
              {applicant.registration_code} — {applicant.full_name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReject} className="space-y-4 p-6 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reject-reason">Alasan Penolakan *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Jelaskan alasan penolakan pendaftaran ini..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                autoFocus
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 flex justify-end gap-2 px-0 pb-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowRejectModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="destructive" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Konfirmasi Tolak
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          MODAL ZOOM DOKUMEN
      ════════════════════════════════════════════════════ */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-4">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle>{activeDoc.fullLabel}</DialogTitle>
                <DialogDescription className="mt-1">
                  {applicant.full_name} · {applicant.registration_code}
                </DialogDescription>
              </div>
              {activeDoc.url && (
                <a
                  href={activeDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 no-underline hover:bg-neutral-50"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Asli
                </a>
              )}
            </div>
          </DialogHeader>
          <div className="bg-neutral-100 p-4 flex items-center justify-center">
            {activeDoc.url && (
              <img
                src={activeDoc.url}
                alt={activeDoc.fullLabel}
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
