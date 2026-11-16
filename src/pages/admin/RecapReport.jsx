import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { exportToExcel } from "@/lib/excelExport";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Download,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle,
  Inbox,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  User,
  CreditCard,
  Clock,
  XCircle,
} from "lucide-react";

const INITIAL_FORM = {
  registration_code: "",
  card_number: "",
  full_name: "",
  nik: "",
  family_card_number: "",
  pisat_code: "1",
  birth_place: "",
  birth_date: "",
  gender: "1",
  marital_status: "1",
  phone_number: "",
  email: "",
  address: "",
  rt: "",
  rw: "",
  postal_code: "",
  district: "",
  village: "",
  facility_name: "",
  status: "approved",
  notes: "Disetujui",
};

function generateRegistrationCode() {
  const now = new Date();
  const ym =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `BPJS-${ym}-${rand}`;
}

export default function RecapReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("approved"); // 'approved' | 'all' | 'pending' | 'rejected'
  const [exporting, setExporting] = useState(false);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from("applicants").select("*");
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      const { data: result, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data rekapitulasi.");
    } finally {
      setLoading(false);
    }
  };

  /* ── CREATE ── */
  const handleOpenCreate = () => {
    setFormData({
      ...INITIAL_FORM,
      registration_code: generateRegistrationCode(),
      status: "approved",
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name?.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.nik || formData.nik.length !== 16) {
      toast.error("NIK harus 16 digit angka.");
      return;
    }
    if (!formData.family_card_number || formData.family_card_number.length !== 16) {
      toast.error("Nomor Kartu Keluarga harus 16 digit.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        registration_code: formData.registration_code || generateRegistrationCode(),
        card_number: formData.card_number?.trim() || null,
        full_name: formData.full_name.trim(),
        nik: formData.nik.trim(),
        family_card_number: formData.family_card_number.trim(),
        pisat_code: parseInt(formData.pisat_code) || 1,
        birth_place: formData.birth_place?.trim() || "",
        birth_date: formData.birth_date || null,
        gender: parseInt(formData.gender) || 1,
        marital_status: parseInt(formData.marital_status) || 0,
        phone_number: formData.phone_number?.trim() || "",
        email: formData.email?.trim() || "",
        address: formData.address?.trim() || "",
        rt: formData.rt?.trim() || "",
        rw: formData.rw?.trim() || "",
        postal_code: formData.postal_code?.trim() || "",
        district: formData.district?.trim() || "",
        village: formData.village?.trim() || "",
        facility_name: formData.facility_name?.trim() || "",
        status: formData.status || "approved",
        notes: formData.notes?.trim() || "Disetujui",
      };

      const { data: created, error } = await supabase
        .from("applicants")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      toast.success("Data pendaftar baru berhasil ditambahkan!");
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan data: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  /* ── EDIT / UPDATE ── */
  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      registration_code: item.registration_code || "",
      card_number: item.card_number || "",
      full_name: item.full_name || "",
      nik: item.nik || "",
      family_card_number: item.family_card_number || "",
      pisat_code: String(item.pisat_code ?? "1"),
      birth_place: item.birth_place || "",
      birth_date: item.birth_date || "",
      gender: String(item.gender ?? "1"),
      marital_status: String(item.marital_status ?? "0"),
      phone_number: item.phone_number || "",
      email: item.email || "",
      address: item.address || "",
      rt: item.rt || "",
      rw: item.rw || "",
      postal_code: item.postal_code || "",
      district: item.district || "",
      village: item.village || "",
      facility_name: item.facility_name || "",
      status: item.status || "approved",
      notes: item.notes || (item.status === "approved" ? "Disetujui" : ""),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name?.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.nik || formData.nik.length !== 16) {
      toast.error("NIK harus 16 digit angka.");
      return;
    }
    if (!formData.family_card_number || formData.family_card_number.length !== 16) {
      toast.error("Nomor Kartu Keluarga harus 16 digit.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        card_number: formData.card_number?.trim() || null,
        full_name: formData.full_name.trim(),
        nik: formData.nik.trim(),
        family_card_number: formData.family_card_number.trim(),
        pisat_code: parseInt(formData.pisat_code) || 1,
        birth_place: formData.birth_place?.trim() || "",
        birth_date: formData.birth_date || null,
        gender: parseInt(formData.gender) || 1,
        marital_status: parseInt(formData.marital_status) || 0,
        phone_number: formData.phone_number?.trim() || "",
        email: formData.email?.trim() || "",
        address: formData.address?.trim() || "",
        rt: formData.rt?.trim() || "",
        rw: formData.rw?.trim() || "",
        postal_code: formData.postal_code?.trim() || "",
        district: formData.district?.trim() || "",
        village: formData.village?.trim() || "",
        facility_name: formData.facility_name?.trim() || "",
        status: formData.status,
        notes: formData.notes?.trim() || "",
      };

      const { error } = await supabase
        .from("applicants")
        .update(payload)
        .eq("id", selectedItem.id);

      if (error) throw error;

      toast.success(`Data ${formData.full_name} berhasil diperbarui!`);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui data: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("applicants")
        .delete()
        .eq("id", selectedItem.id);

      if (error) throw error;

      toast.success(`Data pendaftar ${selectedItem.full_name} berhasil dihapus.`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus data: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setDeleting(false);
    }
  };

  /* ── EXPORT EXCEL ── */
  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.error("Tidak ada data untuk di-export.");
      return;
    }
    setExporting(true);
    try {
      exportToExcel(filteredData);
      toast.success("File Excel berhasil di-download!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengexport data.");
    } finally {
      setExporting(false);
    }
  };

  const getGenderLabel = (g) => (g === 1 ? "L" : "P");
  const getPisatLabel = (p) =>
    ({ 1: "Peserta", 2: "Suami", 3: "Istri", 4: "Anak" }[p] || "-");

  const filteredData = data.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.full_name?.toLowerCase().includes(q) ||
      a.nik?.includes(q) ||
      a.family_card_number?.includes(q) ||
      a.registration_code?.toLowerCase().includes(q) ||
      a.card_number?.toLowerCase().includes(q) ||
      a.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary-500" />
            Rekapitulasi Data Peserta
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Kelola, perbarui, hapus, dan export data pendaftaran BPJS Kesehatan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleOpenCreate} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Tambah Data Rekap
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting || filteredData.length === 0}
            className="flex items-center gap-1.5"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengexport...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setStatusFilter("approved")}
          className={`cursor-pointer transition-all border ${
            statusFilter === "approved"
              ? "border-emerald-400 bg-emerald-50/70 shadow-xs"
              : "border-neutral-200 hover:border-emerald-300 bg-white"
          }`}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">
                {statusFilter === "approved" ? data.length : "Disetujui"}
              </p>
              <p className="text-xs text-neutral-600 font-medium">
                Pendaftar Disetujui (ACC)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer transition-all border ${
            statusFilter === "all"
              ? "border-primary-400 bg-primary-50/70 shadow-xs"
              : "border-neutral-200 hover:border-primary-300 bg-white"
          }`}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">
                {statusFilter === "all" ? data.length : "Semua Data"}
              </p>
              <p className="text-xs text-neutral-600 font-medium">
                Tampilkan Semua Status
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStatusFilter("pending")}
          className={`cursor-pointer transition-all border ${
            statusFilter === "pending"
              ? "border-amber-400 bg-amber-50/70 shadow-xs"
              : "border-neutral-200 hover:border-amber-300 bg-white"
          }`}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">
                {statusFilter === "pending" ? data.length : "Pending"}
              </p>
              <p className="text-xs text-neutral-600 font-medium">
                Menunggu Verifikasi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>
                Data Pendaftar{" "}
                {statusFilter === "approved"
                  ? "Disetujui"
                  : statusFilter === "pending"
                    ? "Pending"
                    : statusFilter === "rejected"
                      ? "Ditolak"
                      : "Semua Status"}
              </CardTitle>
              <CardDescription>
                Daftar lengkap pendaftar dengan aksi Edit data dan Hapus
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Cari nama, NIK, KK, kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                title="Refresh Data"
              >
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
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Inbox className="w-12 h-12 mb-3" />
              <p className="font-medium">Tidak ada data</p>
              <p className="text-sm">
                {searchQuery
                  ? "Tidak ditemukan hasil pencarian."
                  : "Belum ada data pendaftar pada filter ini."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Kode Registrasi</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>No. KK</TableHead>
                    <TableHead>PISAT</TableHead>
                    <TableHead>JK</TableHead>
                    <TableHead>Faskes Tk.I</TableHead>
                    <TableHead>No. Kartu BPJS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, i) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-neutral-500">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
                          {item.registration_code}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-neutral-900">
                        {item.full_name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.nik}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.family_card_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getPisatLabel(item.pisat_code)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getGenderLabel(item.gender)}</TableCell>
                      <TableCell className="text-sm">
                        {item.facility_name || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-semibold text-primary-600">
                          {item.card_number || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "success"
                              : item.status === "rejected"
                                ? "danger"
                                : "warning"
                          }
                          className="text-xs"
                        >
                          {item.status === "approved"
                            ? "Disetujui"
                            : item.status === "rejected"
                              ? "Ditolak"
                              : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600 max-w-[140px] truncate" title={item.notes || ""}>
                        {item.notes || (item.status === "approved" ? "Disetujui" : "-")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 px-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            title="Edit Data"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenDelete(item)}
                            className="h-8 px-2"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════════════════
          MODAL TAMBAH DATA (CREATE)
      ════════════════════════════════════════════════════ */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-600" />
              Tambah Data Peserta Rekap
            </DialogTitle>
            <DialogDescription>
              Tambahkan data pendaftar baru langsung ke sistem rekapitulasi BPJS
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-reg-code">Kode Registrasi</Label>
                <Input
                  id="create-reg-code"
                  value={formData.registration_code}
                  readOnly
                  className="bg-neutral-100 font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-card-number">No. Kartu BPJS</Label>
                <Input
                  id="create-card-number"
                  placeholder="Contoh: 0001234567890"
                  value={formData.card_number}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, card_number: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-fullname">Nama Lengkap *</Label>
                <Input
                  id="create-fullname"
                  required
                  placeholder="Nama sesuai KTP"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, full_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-status">Status Pendaftaran</Label>
                <Select
                  id="create-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="approved">Disetujui (Approved)</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Ditolak (Rejected)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-nik">NIK (16 Digit) *</Label>
                <Input
                  id="create-nik"
                  required
                  maxLength={16}
                  placeholder="3201234567890001"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      nik: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-kk">No. Kartu Keluarga (16 Digit) *</Label>
                <Input
                  id="create-kk"
                  required
                  maxLength={16}
                  placeholder="3201234567890001"
                  value={formData.family_card_number}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      family_card_number: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-pisat">Hubungan PISAT</Label>
                <Select
                  id="create-pisat"
                  value={formData.pisat_code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, pisat_code: e.target.value }))
                  }
                >
                  <option value="1">1 - Peserta</option>
                  <option value="2">2 - Suami</option>
                  <option value="3">3 - Istri</option>
                  <option value="4">4 - Anak</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-gender">Jenis Kelamin</Label>
                <Select
                  id="create-gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, gender: e.target.value }))
                  }
                >
                  <option value="1">Laki-laki</option>
                  <option value="2">Perempuan</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-marital">Status Kawin</Label>
                <Select
                  id="create-marital"
                  value={formData.marital_status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, marital_status: e.target.value }))
                  }
                >
                  <option value="0">Tidak Diketahui</option>
                  <option value="1">Belum Kawin</option>
                  <option value="2">Kawin</option>
                  <option value="3">Cerai</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-birthplace">Tempat Lahir</Label>
                <Input
                  id="create-birthplace"
                  placeholder="Kota Lahir"
                  value={formData.birth_place}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, birth_place: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-birthdate">Tanggal Lahir</Label>
                <Input
                  id="create-birthdate"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, birth_date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-phone">No. Telepon</Label>
                <Input
                  id="create-phone"
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone_number: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="email@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-address">Alamat Lengkap</Label>
              <Textarea
                id="create-address"
                rows={2}
                placeholder="Jl. Nama Jalan No. XX..."
                value={formData.address}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="create-rt">RT</Label>
                <Input
                  id="create-rt"
                  placeholder="001"
                  value={formData.rt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, rt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-rw">RW</Label>
                <Input
                  id="create-rw"
                  placeholder="002"
                  value={formData.rw}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, rw: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-postal">Kode Pos</Label>
                <Input
                  id="create-postal"
                  placeholder="12345"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, postal_code: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-district">Kecamatan</Label>
                <Input
                  id="create-district"
                  placeholder="Nama Kecamatan"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, district: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-village">Kelurahan / Desa</Label>
                <Input
                  id="create-village"
                  placeholder="Nama Kelurahan"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, village: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-faskes">Faskes Tingkat I</Label>
              <Input
                id="create-faskes"
                placeholder="Puskesmas / Klinik Pratama"
                value={formData.facility_name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, facility_name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-notes">Status / Keterangan Rekap (Masuk ke Excel)</Label>
              <Input
                id="create-notes"
                placeholder="Contoh: Disetujui, Aktif, PBI APBD, dll"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Data Baru"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          MODAL EDIT DATA (UPDATE)
      ════════════════════════════════════════════════════ */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary-600" />
              Edit Data Pendaftar
            </DialogTitle>
            <DialogDescription>
              Perbarui data pendaftar {selectedItem?.registration_code} —{" "}
              {selectedItem?.full_name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-reg-code">Kode Registrasi</Label>
                <Input
                  id="edit-reg-code"
                  value={formData.registration_code}
                  readOnly
                  className="bg-neutral-100 font-mono text-xs cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-card-number">No. Kartu BPJS</Label>
                <Input
                  id="edit-card-number"
                  placeholder="Nomor kartu BPJS..."
                  value={formData.card_number}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, card_number: e.target.value }))
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-fullname">Nama Lengkap *</Label>
                <Input
                  id="edit-fullname"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, full_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-status">Status Pendaftaran</Label>
                <Select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="approved">Disetujui (Approved)</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Ditolak (Rejected)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-nik">NIK (16 Digit) *</Label>
                <Input
                  id="edit-nik"
                  required
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      nik: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-kk">No. Kartu Keluarga (16 Digit) *</Label>
                <Input
                  id="edit-kk"
                  required
                  maxLength={16}
                  value={formData.family_card_number}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      family_card_number: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-pisat">Hubungan PISAT</Label>
                <Select
                  id="edit-pisat"
                  value={formData.pisat_code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, pisat_code: e.target.value }))
                  }
                >
                  <option value="1">1 - Peserta</option>
                  <option value="2">2 - Suami</option>
                  <option value="3">3 - Istri</option>
                  <option value="4">4 - Anak</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-gender">Jenis Kelamin</Label>
                <Select
                  id="edit-gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, gender: e.target.value }))
                  }
                >
                  <option value="1">Laki-laki</option>
                  <option value="2">Perempuan</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-marital">Status Kawin</Label>
                <Select
                  id="edit-marital"
                  value={formData.marital_status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, marital_status: e.target.value }))
                  }
                >
                  <option value="0">Tidak Diketahui</option>
                  <option value="1">Belum Kawin</option>
                  <option value="2">Kawin</option>
                  <option value="3">Cerai</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-birthplace">Tempat Lahir</Label>
                <Input
                  id="edit-birthplace"
                  value={formData.birth_place}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, birth_place: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-birthdate">Tanggal Lahir</Label>
                <Input
                  id="edit-birthdate"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, birth_date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">No. Telepon</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone_number: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-address">Alamat Lengkap</Label>
              <Textarea
                id="edit-address"
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-rt">RT</Label>
                <Input
                  id="edit-rt"
                  value={formData.rt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, rt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-rw">RW</Label>
                <Input
                  id="edit-rw"
                  value={formData.rw}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, rw: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-postal">Kode Pos</Label>
                <Input
                  id="edit-postal"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, postal_code: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-district">Kecamatan</Label>
                <Input
                  id="edit-district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, district: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-village">Kelurahan / Desa</Label>
                <Input
                  id="edit-village"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, village: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-faskes">Faskes Tingkat I</Label>
              <Input
                id="edit-faskes"
                value={formData.facility_name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, facility_name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Status / Keterangan Rekap (Masuk ke Excel)</Label>
              <Input
                id="edit-notes"
                placeholder="Contoh: Disetujui, Aktif, PBI APBD, dll"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          MODAL HAPUS DATA (DELETE CONFIRMATION)
      ════════════════════════════════════════════════════ */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Konfirmasi Hapus Data
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pendaftar akan dihapus permanen dari basis data.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="p-6 pt-2 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm space-y-2">
                <p className="font-semibold text-red-900">
                  Data yang akan dihapus:
                </p>
                <ul className="text-red-800 space-y-1 text-xs">
                  <li>
                    <span className="font-semibold">Nama:</span> {selectedItem.full_name}
                  </li>
                  <li>
                    <span className="font-semibold">NIK:</span> {selectedItem.nik}
                  </li>
                  <li>
                    <span className="font-semibold">Kode Registrasi:</span>{" "}
                    {selectedItem.registration_code}
                  </li>
                  <li>
                    <span className="font-semibold">No. Kartu BPJS:</span>{" "}
                    {selectedItem.card_number || "-"}
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Ya, Hapus Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
