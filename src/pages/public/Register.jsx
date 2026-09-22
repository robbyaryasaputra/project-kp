import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  User,
  MapPin,
  Upload,
  Loader2,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Camera,
  CreditCard,
  Users,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_FORM = {
  family_card_number: "",
  nik: "",
  full_name: "",
  pisat_code: "",
  birth_place: "",
  birth_date: "",
  gender: "",
  marital_status: "",
  phone_number: "",
  email: "",
  address: "",
  rt: "",
  rw: "",
  postal_code: "",
  district: "",
  village: "",
  facility_name: "",
};

function generateRegistrationCode() {
  const now = new Date();
  const ym =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `BPJS-${ym}-${rand}`;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({ ktp: null, kk: null, photo: null });
  const [previews, setPreviews] = useState({ ktp: null, kk: null, photo: null });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviews((prev) => ({ ...prev, [key]: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.nik || form.nik.length !== 16) errs.nik = "NIK harus 16 digit";
    if (!form.family_card_number || form.family_card_number.length !== 16)
      errs.family_card_number = "No. KK harus 16 digit";
    if (!form.full_name.trim()) errs.full_name = "Nama wajib diisi";
    if (!form.pisat_code) errs.pisat_code = "PISAT wajib dipilih";
    if (!form.birth_place.trim()) errs.birth_place = "Tempat lahir wajib diisi";
    if (!form.birth_date) errs.birth_date = "Tanggal lahir wajib diisi";
    if (!form.gender) errs.gender = "Jenis kelamin wajib dipilih";
    if (!form.marital_status && form.marital_status !== "0")
      errs.marital_status = "Status kawin wajib dipilih";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.address.trim()) errs.address = "Alamat wajib diisi";
    if (!form.district.trim()) errs.district = "Kecamatan wajib diisi";
    if (!form.village.trim()) errs.village = "Kelurahan/Desa wajib diisi";
    if (!form.facility_name.trim())
      errs.facility_name = "Nama Faskes wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!files.ktp) errs.ktp = "Foto KTP wajib diunggah";
    if (!files.kk) errs.kk = "Foto KK wajib diunggah";
    if (!files.photo) errs.photo = "Pas Foto wajib diunggah";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFile = async (file, folder) => {
    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("applicant-documents")
      .upload(filename, file, { upsert: true });
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("applicant-documents").getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    try {
      /* Upload 3 files */
      const [ktpUrl, kkUrl, photoUrl] = await Promise.all([
        uploadFile(files.ktp, "ktp"),
        uploadFile(files.kk, "kk"),
        uploadFile(files.photo, "photo"),
      ]);

      const registrationCode = generateRegistrationCode();

      const { error } = await supabase.from("applicants").insert({
        registration_code: registrationCode,
        family_card_number: form.family_card_number,
        nik: form.nik,
        full_name: form.full_name,
        pisat_code: parseInt(form.pisat_code),
        birth_place: form.birth_place,
        birth_date: form.birth_date,
        gender: parseInt(form.gender),
        marital_status: parseInt(form.marital_status),
        phone_number: form.phone_number,
        email: form.email,
        address: form.address,
        rt: form.rt,
        rw: form.rw,
        postal_code: form.postal_code,
        district: form.district,
        village: form.village,
        facility_name: form.facility_name,
        ktp_url: ktpUrl,
        kk_url: kkUrl,
        photo_url: photoUrl,
        status: "pending",
      });

      if (error) throw error;

      setSuccessData({ registrationCode, nik: form.nik });
      setShowSuccess(true);
      toast.success("Pendaftaran berhasil dikirim!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim pendaftaran: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(successData.registrationCode);
    toast.success("Kode pendaftaran disalin!");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFiles({ ktp: null, kk: null, photo: null });
    setPreviews({ ktp: null, kk: null, photo: null });
    setStep(1);
    setShowSuccess(false);
    setSuccessData(null);
    setErrors({});
  };

  const stepIndicators = [
    { num: 1, label: "Data Diri", icon: User },
    { num: 2, label: "Alamat", icon: MapPin },
    { num: 3, label: "Dokumen", icon: Upload },
  ];

  const FileUploadBox = ({ id, label, icon: Icon, fileKey, accept }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          previews[fileKey]
            ? "border-primary-300 bg-primary-50/50"
            : errors[fileKey]
              ? "border-red-300 bg-red-50/50"
              : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400"
        }`}
      >
        {previews[fileKey] ? (
          <img
            src={previews[fileKey]}
            alt={label}
            className="h-36 w-auto object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <Icon className="w-8 h-8" />
            <span className="text-sm font-medium">Klik untuk unggah</span>
            <span className="text-xs">JPG, PNG, PDF (maks. 5MB)</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept={accept || "image/*,.pdf"}
          className="hidden"
          onChange={(e) => handleFileChange(fileKey, e)}
        />
      </label>
      {errors[fileKey] && (
        <p className="text-xs text-red-500">{errors[fileKey]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Formulir Pendaftaran BPJS
        </h1>
        <p className="text-neutral-500">
          Lengkapi data berikut untuk mendaftar sebagai peserta BPJS Kesehatan.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {stepIndicators.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s.num
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {step > s.num ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <s.icon className="w-4.5 h-4.5" />
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  step >= s.num ? "text-primary-600" : "text-neutral-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < stepIndicators.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-colors duration-300 ${
                  step > s.num ? "bg-primary-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Data Diri */}
      {step === 1 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <CardTitle>Data Pribadi</CardTitle>
                <CardDescription>
                  Masukkan data diri sesuai KTP
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 Digit) *</Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="3201234567890001"
                  maxLength={16}
                  value={form.nik}
                  onChange={handleChange}
                  className={errors.nik ? "border-red-400" : ""}
                />
                {errors.nik && (
                  <p className="text-xs text-red-500">{errors.nik}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_card_number">
                  No. Kartu Keluarga (16 Digit) *
                </Label>
                <Input
                  id="family_card_number"
                  name="family_card_number"
                  placeholder="3201234567890001"
                  maxLength={16}
                  value={form.family_card_number}
                  onChange={handleChange}
                  className={
                    errors.family_card_number ? "border-red-400" : ""
                  }
                />
                {errors.family_card_number && (
                  <p className="text-xs text-red-500">
                    {errors.family_card_number}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Nama sesuai KTP"
                value={form.full_name}
                onChange={handleChange}
                className={errors.full_name ? "border-red-400" : ""}
              />
              {errors.full_name && (
                <p className="text-xs text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pisat_code">Status Kepesertaan (PISAT) *</Label>
              <Select
                id="pisat_code"
                name="pisat_code"
                value={form.pisat_code}
                onChange={handleChange}
                className={errors.pisat_code ? "border-red-400" : ""}
              >
                <option value="">Pilih Status</option>
                <option value="1">1 - Peserta</option>
                <option value="2">2 - Suami</option>
                <option value="3">3 - Istri</option>
                <option value="4">4 - Anak</option>
              </Select>
              {errors.pisat_code && (
                <p className="text-xs text-red-500">{errors.pisat_code}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="birth_place">Tempat Lahir *</Label>
                <Input
                  id="birth_place"
                  name="birth_place"
                  placeholder="Kota/Kabupaten"
                  value={form.birth_place}
                  onChange={handleChange}
                  className={errors.birth_place ? "border-red-400" : ""}
                />
                {errors.birth_place && (
                  <p className="text-xs text-red-500">{errors.birth_place}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Tanggal Lahir *</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={handleChange}
                  className={errors.birth_date ? "border-red-400" : ""}
                />
                {errors.birth_date && (
                  <p className="text-xs text-red-500">{errors.birth_date}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin *</Label>
                <Select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={errors.gender ? "border-red-400" : ""}
                >
                  <option value="">Pilih</option>
                  <option value="1">Laki-laki</option>
                  <option value="2">Perempuan</option>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="marital_status">Status Perkawinan *</Label>
                <Select
                  id="marital_status"
                  name="marital_status"
                  value={form.marital_status}
                  onChange={handleChange}
                  className={errors.marital_status ? "border-red-400" : ""}
                >
                  <option value="">Pilih</option>
                  <option value="0">Tidak Diketahui</option>
                  <option value="1">Belum Kawin</option>
                  <option value="2">Kawin</option>
                  <option value="3">Cerai</option>
                </Select>
                {errors.marital_status && (
                  <p className="text-xs text-red-500">
                    {errors.marital_status}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone_number">No. Telepon</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={nextStep}>
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Alamat */}
      {step === 2 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <CardTitle>Alamat & Faskes</CardTitle>
                <CardDescription>
                  Masukkan alamat tempat tinggal dan pilihan fasilitas kesehatan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Jl. Contoh No. 123..."
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "border-red-400" : ""}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rt">RT</Label>
                <Input
                  id="rt"
                  name="rt"
                  placeholder="001"
                  value={form.rt}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rw">RW</Label>
                <Input
                  id="rw"
                  name="rw"
                  placeholder="002"
                  value={form.rw}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  placeholder="12345"
                  value={form.postal_code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="district">Kecamatan *</Label>
                <Input
                  id="district"
                  name="district"
                  placeholder="Nama Kecamatan"
                  value={form.district}
                  onChange={handleChange}
                  className={errors.district ? "border-red-400" : ""}
                />
                {errors.district && (
                  <p className="text-xs text-red-500">{errors.district}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Kelurahan/Desa *</Label>
                <Input
                  id="village"
                  name="village"
                  placeholder="Nama Kelurahan/Desa"
                  value={form.village}
                  onChange={handleChange}
                  className={errors.village ? "border-red-400" : ""}
                />
                {errors.village && (
                  <p className="text-xs text-red-500">{errors.village}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facility_name">Nama Faskes Tingkat I *</Label>
              <Input
                id="facility_name"
                name="facility_name"
                placeholder="Puskesmas / Klinik Pratama"
                value={form.facility_name}
                onChange={handleChange}
                className={errors.facility_name ? "border-red-400" : ""}
              />
              {errors.facility_name && (
                <p className="text-xs text-red-500">{errors.facility_name}</p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
              <Button onClick={nextStep}>
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Upload Dokumen */}
      {step === 3 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Upload Dokumen</CardTitle>
                <CardDescription>
                  Unggah foto KTP, Kartu Keluarga, dan Pas Foto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FileUploadBox
                id="upload-ktp"
                label="Foto KTP *"
                icon={CreditCard}
                fileKey="ktp"
                accept="image/*,.pdf"
              />
              <FileUploadBox
                id="upload-kk"
                label="Foto Kartu Keluarga *"
                icon={Users}
                fileKey="kk"
                accept="image/*,.pdf"
              />
              <FileUploadBox
                id="upload-photo"
                label="Pas Foto *"
                icon={Camera}
                fileKey="photo"
                accept="image/*"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">📋 Persyaratan Dokumen:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                <li>Foto KTP dan KK harus jelas dan terbaca</li>
                <li>Pas foto berlatar belakang merah atau biru</li>
                <li>Format file: JPG, PNG, atau PDF (maks. 5MB per file)</li>
              </ul>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Kirim Pendaftaran
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <DialogTitle className="text-center">
              Pendaftaran Berhasil!
            </DialogTitle>
            <DialogDescription className="text-center">
              Simpan kode pendaftaran berikut untuk memantau status pendaftaran Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Kode Pendaftaran</p>
              <p className="text-2xl font-bold text-primary-600 tracking-wider font-mono">
                {successData?.registrationCode}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={copyCode}
            >
              <Copy className="w-4 h-4" />
              Salin Kode
            </Button>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Link to="/cek-status" className="w-full">
              <Button className="w-full">
                <Search className="w-4 h-4" />
                Cek Status Pendaftaran
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full"
              onClick={resetForm}
            >
              Daftar Lagi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
