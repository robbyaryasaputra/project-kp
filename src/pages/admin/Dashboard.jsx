import { useState, useEffect } from "react";
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
  DialogFooter,
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
  Image,
  CreditCard,
  Users as UsersIcon,
  Camera,
  AlertTriangle,
  Inbox,
} from "lucide-react";

function DashboardOverview({ stats, applicants }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Ringkasan pendaftaran dan aktivitas verifikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [
            "Menunggu Verifikasi",
            stats.pending,
            Clock,
            "text-amber-500",
            "bg-amber-50",
          ],
          [
            "Disetujui",
            stats.approved,
            CheckCircle,
            "text-emerald-500",
            "bg-emerald-50",
          ],
          ["Ditolak", stats.rejected, XCircle, "text-red-500", "bg-red-50"],
        ].map(([label, value, Icon, color, bg]) => (
          <Card key={label} className="border-neutral-200/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pendaftar Menunggu</CardTitle>
            <CardDescription>
              Antrean terbaru yang perlu ditinjau.
            </CardDescription>
          </div>
          <Link
            to="/admin/verifikasi"
            className="inline-flex h-8 items-center rounded-md bg-primary-500 px-3 text-xs font-semibold text-white no-underline hover:bg-primary-600"
          >
            Buka Verifikasi
          </Link>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              Tidak ada pendaftar yang menunggu verifikasi.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {applicants.slice(0, 5).map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-800 truncate">
                      {applicant.full_name}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                      {applicant.registration_code}
                    </p>
                  </div>
                  <Link
                    to={`/admin/verify/${applicant.id}`}
                    className="text-sm font-semibold text-primary-600 no-underline hover:text-primary-700"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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

  const getGenderLabel = (g) => (g === 1 ? "Laki-laki" : "Perempuan");
  const getMaritalLabel = (m) =>
    ({ 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" })[m] ||
    "-";
  const getPisatLabel = (p) =>
    ({ 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" })[p] || "-";

  const filteredApplicants = applicants.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.full_name?.toLowerCase().includes(q) ||
      a.nik?.includes(q) ||
      a.registration_code?.toLowerCase().includes(q)
    );
  });

  if (!isVerification) {
    return <DashboardOverview stats={stats} applicants={applicants} />;
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Menunggu Verifikasi",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Disetujui",
            value: stats.approved,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Ditolak",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((stat, i) => (
          <Card key={i} className="border-neutral-200/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Antrean Verifikasi
              </CardTitle>
              <CardDescription>
                Pendaftaran berstatus pending yang perlu diverifikasi
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Cari nama, NIK, kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-56"
                />
              </div>
              <Button variant="outline" size="icon" onClick={fetchApplicants}>
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Inbox className="w-12 h-12 mb-3" />
              <p className="font-medium">Tidak ada data</p>
              <p className="text-sm">
                {searchQuery
                  ? "Tidak ditemukan hasil pencarian."
                  : "Belum ada pendaftaran yang perlu diverifikasi."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Tgl Daftar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant, i) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium text-neutral-500">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
                        {applicant.registration_code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {applicant.full_name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {applicant.nik}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">
                      {new Date(applicant.created_at).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReview(applicant)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Quick
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/verify/${applicant.id}`)
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Side-by-Side Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-500" />
              Review Pendaftaran
            </DialogTitle>
            <DialogDescription>
              {selectedApplicant?.registration_code} —{" "}
              {selectedApplicant?.full_name}
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="p-6 pt-2">
              {/* Side-by-Side Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Data Diri */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-2">
                    <User className="w-4 h-4 text-primary-500" />
                    Data Diri Pendaftar
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {[
                      ["Kode Registrasi", selectedApplicant.registration_code],
                      ["NIK", selectedApplicant.nik],
                      ["No. KK", selectedApplicant.family_card_number],
                      ["Nama Lengkap", selectedApplicant.full_name],
                      ["PISAT", getPisatLabel(selectedApplicant.pisat_code)],
                      [
                        "TTL",
                        `${selectedApplicant.birth_place}, ${selectedApplicant.birth_date}`,
                      ],
                      [
                        "Jenis Kelamin",
                        getGenderLabel(selectedApplicant.gender),
                      ],
                      [
                        "Status Kawin",
                        getMaritalLabel(selectedApplicant.marital_status),
                      ],
                      ["No. Telepon", selectedApplicant.phone_number || "-"],
                      ["Email", selectedApplicant.email || "-"],
                      [
                        "Alamat",
                        `${selectedApplicant.address}, RT ${selectedApplicant.rt || "-"}/RW ${selectedApplicant.rw || "-"}`,
                      ],
                      ["Kecamatan", selectedApplicant.district],
                      ["Kelurahan/Desa", selectedApplicant.village],
                      ["Kode Pos", selectedApplicant.postal_code || "-"],
                      ["Faskes Tk.I", selectedApplicant.facility_name],
                      [
                        "Tgl Daftar",
                        new Date(
                          selectedApplicant.created_at,
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }),
                      ],
                    ].map(([label, value], i) => (
                      <div key={i}>
                        <p className="text-neutral-400 text-xs">{label}</p>
                        <p className="font-medium text-neutral-800 break-all">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Document Preview */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-2">
                    <Image className="w-4 h-4 text-primary-500" />
                    Pratinjau Dokumen
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Foto KTP",
                        url: selectedApplicant.ktp_url,
                        icon: CreditCard,
                      },
                      {
                        label: "Kartu Keluarga",
                        url: selectedApplicant.kk_url,
                        icon: UsersIcon,
                      },
                      {
                        label: "Pas Foto",
                        url: selectedApplicant.photo_url,
                        icon: Camera,
                      },
                    ].map((doc, i) => (
                      <div key={i}>
                        <p className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5 mb-1.5">
                          <doc.icon className="w-3.5 h-3.5" />
                          {doc.label}
                        </p>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={doc.url}
                              alt={doc.label}
                              className="w-full h-40 object-cover rounded-lg border border-neutral-200 hover:border-primary-400 transition-colors cursor-pointer"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="hidden w-full h-40 rounded-lg border border-neutral-200 bg-neutral-50 items-center justify-center text-neutral-400 text-sm">
                              Gagal memuat gambar
                            </div>
                          </a>
                        ) : (
                          <div className="w-full h-40 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-neutral-400 text-sm">
                            Tidak ada file
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                {!actionMode && (
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => setActionMode("reject")}
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak
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
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 animate-slide-up">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Setujui Pendaftaran
                    </div>
                    <div className="space-y-2">
                      <Label className="text-emerald-800">
                        Nomor Kartu BPJS *
                      </Label>
                      <Input
                        placeholder="Masukkan nomor kartu BPJS..."
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionMode(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
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
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3 animate-slide-up">
                    <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Tolak Pendaftaran
                    </div>
                    <div className="space-y-2">
                      <Label className="text-red-800">Alasan Penolakan *</Label>
                      <Textarea
                        placeholder="Masukkan alasan penolakan..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="border-red-300 focus:border-red-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionMode(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
