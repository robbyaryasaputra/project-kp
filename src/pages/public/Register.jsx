import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
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
  FileText,
  User,
  MapPin,
  Upload,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Users,
  UserPlus,
  Home,
  Check,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Registration type: null = choosing, "new" = kepala keluarga / individu baru, "add" = tambah anggota
  const [regType, setRegType] = useState(null);
  const [existingApplicants, setExistingApplicants] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(user));
  const [allowEditKK, setAllowEditKK] = useState(false);
  const [prefilledKkUrl, setPrefilledKkUrl] = useState(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({ ktp: null, kk: null });
  const [previews, setPreviews] = useState({ ktp: null, kk: null });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check for prefill data passed from Success page
  const prefillFamilyCard = location.state?.prefillFamilyCard;
  const incomingMode = location.state?.mode; // "add_member"

  // On mount: load existing applicants for this user (by user_id OR email)
  useEffect(() => {
    if (!user) return;
    const fetchExisting = async () => {
      setLoadingExisting(true);
      try {
        let query = supabase.from("applicants").select("*");
        if (user.id && user.email) {
          query = query.or(`user_id.eq.${user.id},email.eq.${user.email}`);
        } else if (user.id) {
          query = query.eq("user_id", user.id);
        } else if (user.email) {
          query = query.eq("email", user.email);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setExistingApplicants(data);

          // Hubungkan record lama yang user_id nya masih null ke user.id sekarang
          const unlinked = data.filter((item) => !item.user_id && item.email === user.email);
          if (unlinked.length > 0) {
            supabase
              .from("applicants")
              .update({ user_id: user.id })
              .in("id", unlinked.map((u) => u.id))
              .then(() => { });
          }
        }
      } catch (err) {
        console.error("Gagal memuat data pendaftar keluarga:", err);
      } finally {
        setLoadingExisting(false);
      }
    };
    fetchExisting();
  }, [user]);

  // Jika dialihkan dari halaman success dengan mode "add_member"
  useEffect(() => {
    if (incomingMode === "add_member") {
      setRegType("add");
      const targetKK =
        prefillFamilyCard ||
        existingApplicants.find((a) => a.family_card_number?.length === 16)?.family_card_number ||
        "";
      const prev = existingApplicants[0];

      if (targetKK) {
        setForm((prevForm) => ({
          ...prevForm,
          family_card_number: targetKK,
          email: user?.email || prevForm.email,
          address: prev?.address || prevForm.address,
          rt: prev?.rt || prevForm.rt,
          rw: prev?.rw || prevForm.rw,
          postal_code: prev?.postal_code || prevForm.postal_code,
          district: prev?.district || prevForm.district,
          village: prev?.village || prevForm.village,
          facility_name: prev?.facility_name || prevForm.facility_name,
        }));
      }

      if (prev?.kk_url) {
        setPrefilledKkUrl(prev.kk_url);
        setPreviews((p) => ({ ...p, kk: prev.kk_url }));
      }
    }
  }, [incomingMode, prefillFamilyCard, existingApplicants, user]);

  // Auto-sync KK jika user sudah di form mode "add" dan existingApplicants selesai dimuat
  useEffect(() => {
    if (
      regType === "add" &&
      (!form.family_card_number || form.family_card_number.length !== 16) &&
      existingApplicants.length > 0
    ) {
      const prev =
        existingApplicants.find((a) => a.family_card_number?.length === 16) ||
        existingApplicants[0];

      if (prev?.family_card_number) {
        setForm((prevForm) => ({
          ...prevForm,
          family_card_number: prev.family_card_number,
          email: prevForm.email || user?.email || "",
          address: prevForm.address || prev.address || "",
          rt: prevForm.rt || prev.rt || "",
          rw: prevForm.rw || prev.rw || "",
          postal_code: prevForm.postal_code || prev.postal_code || "",
          district: prevForm.district || prev.district || "",
          village: prevForm.village || prev.village || "",
          facility_name: prevForm.facility_name || prev.facility_name || "",
        }));

        if (prev.kk_url && !previews.kk) {
          setPrefilledKkUrl(prev.kk_url);
          setPreviews((p) => ({ ...p, kk: prev.kk_url }));
        }

        if (errors.family_card_number) {
          setErrors((e) => ({ ...e, family_card_number: null }));
        }
      }
    }
  }, [regType, existingApplicants, form.family_card_number, errors.family_card_number, previews.kk, user]);

  /* ── Handlers ── */
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

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
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
    if (!files.kk && !prefilledKkUrl) {
      errs.kk = "Foto Kartu Keluarga (KK) wajib diunggah";
    }
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
      // Upload dokumen yang diunggah
      const ktpPromise = files.ktp
        ? uploadFile(files.ktp, "ktp")
        : Promise.resolve(null);
      const kkPromise = files.kk
        ? uploadFile(files.kk, "kk")
        : Promise.resolve(prefilledKkUrl || "");

      const [ktpUrl, kkUrl] = await Promise.all([
        ktpPromise,
        kkPromise,
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
        email: form.email || user?.email || "",
        address: form.address,
        rt: form.rt,
        rw: form.rw,
        postal_code: form.postal_code,
        district: form.district,
        village: form.village,
        facility_name: form.facility_name,
        ktp_url: ktpUrl,
        kk_url: kkUrl,
        photo_url: null,
        status: "pending",
        user_id: user?.id ?? null,
      });

      if (error) throw error;

      toast.success("Pendaftaran berhasil dikirim!");
      navigate("/success", {
        state: {
          registrationCode,
          fullName: form.full_name,
          familyCardNumber: form.family_card_number,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim pendaftaran: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  /* ── Pilih Tipe Pendaftaran ── */
  const selectType = (type) => {
    setRegType(type);
    setStep(1);
    setErrors({});
    setAllowEditKK(false);

    if (type === "add") {
      const prev =
        existingApplicants.find((a) => a.family_card_number?.length === 16) ||
        existingApplicants[0];
      const targetKK =
        prefillFamilyCard ||
        prev?.family_card_number ||
        "";

      setForm({
        ...INITIAL_FORM,
        family_card_number: targetKK,
        email: user?.email || "",
        address: prev?.address || "",
        rt: prev?.rt || "",
        rw: prev?.rw || "",
        postal_code: prev?.postal_code || "",
        district: prev?.district || "",
        village: prev?.village || "",
        facility_name: prev?.facility_name || "",
      });

      if (prev?.kk_url) {
        setPrefilledKkUrl(prev.kk_url);
        setPreviews({ ktp: null, kk: prev.kk_url });
      } else {
        setPrefilledKkUrl(null);
        setPreviews({ ktp: null, kk: null });
      }
    } else {
      setForm({
        ...INITIAL_FORM,
        email: user?.email || "",
      });
      setPrefilledKkUrl(null);
      setPreviews({ ktp: null, kk: null });
    }

    setFiles({ ktp: null, kk: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Step indicators ── */
  const stepIndicators = [
    { num: 1, label: "Data Diri", icon: User },
    { num: 2, label: "Alamat", icon: MapPin },
    { num: 3, label: "Dokumen", icon: Upload },
  ];

  /* ── File upload box ── */
  const FileUploadBox = ({ id, label, icon: Icon, fileKey, accept, note }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden ${previews[fileKey]
          ? "border-primary-300 bg-primary-50/50"
          : errors[fileKey]
            ? "border-red-300 bg-red-50/50"
            : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400"
          }`}
      >
        {previews[fileKey] ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
            <img
              src={previews[fileKey]}
              alt={label}
              className="h-32 w-auto object-contain rounded-lg"
            />
            <span className="text-[11px] text-primary-700 font-medium mt-1 bg-white/90 px-2 py-0.5 rounded shadow-sm">
              {fileKey === "kk" && prefilledKkUrl && !files.kk
                ? "✓ Foto KK dari keluarga sebelumnya (klik untuk ganti)"
                : "Klik untuk mengganti"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400 p-4 text-center">
            <Icon className="w-8 h-8" />
            <span className="text-sm font-medium">Klik untuk unggah</span>
            <span className="text-xs">JPG, PNG, PDF (maks. 5MB)</span>
            {note && <span className="text-[11px] text-primary-600">{note}</span>}
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

  /* ════════════════════════════════════════════════════
     TAMPILAN PILIH JENIS PENDAFTARAN
  ════════════════════════════════════════════════════ */
  if (!regType) {
    const hasExisting = existingApplicants.length > 0;
    const primaryApplicant =
      existingApplicants.find((a) => a.family_card_number?.length === 16) ||
      existingApplicants[0];

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Pendaftaran BPJS Kesehatan
          </h1>
          <p className="text-neutral-500">
            Pilih jenis pendaftaran yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        {/* Status Data Keluarga Terdaftar */}
        {loadingExisting ? (
          <div className="mb-8 p-4 rounded-2xl bg-neutral-100/60 border border-neutral-200/60 flex items-center justify-center gap-2.5 text-neutral-500 text-xs sm:text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Memeriksa data keluarga terdaftar...</span>
          </div>
        ) : hasExisting ? (
          <div className="mb-8 p-5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Kartu Keluarga Terdaftar:{" "}
                <span className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {primaryApplicant?.family_card_number}
                </span>
              </p>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {existingApplicants.length} Anggota
              </span>
            </div>

            <div className="space-y-2">
              {existingApplicants.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-emerald-100 shadow-xs"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{a.full_name}</p>
                    <p className="text-xs text-neutral-500 font-mono">
                      NIK: {a.nik} · Faskes: {a.facility_name || "-"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${a.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : a.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {a.status === "approved"
                      ? "Disetujui"
                      : a.status === "rejected"
                        ? "Ditolak"
                        : "Menunggu"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Kartu Pilihan Tipe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            type="button"
            onClick={() => selectType("new")}
            className="group text-left p-6 border-2 border-neutral-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <Home className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">
              Kepala Keluarga / KK Baru
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Pendaftaran dengan nomor Kartu Keluarga baru. Isi data lengkap dari awal.
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectType("add")}
            className="group text-left p-6 border-2 border-emerald-300 bg-emerald-50/30 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 relative"
          >
            {hasExisting && (
              <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Auto-fill No KK
              </span>
            )}
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <UserPlus className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">
              Tambah Anggota Keluarga
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {hasExisting
                ? `Daftarkan anggota keluarga lain dalam KK (${primaryApplicant?.family_card_number}). Nomor KK & alamat otomatis terisi.`
                : "Daftarkan anggota keluarga lain (suami/istri/anak) dalam Kartu Keluarga yang sama."}
            </p>
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════
     FORMULIR PENDAFTARAN MULTI-STEP
  ════════════════════════════════════════════════════ */
  const isKkFilled16 = form.family_card_number && form.family_card_number.length === 16;
  const isKkLocked = regType === "add" && isKkFilled16 && !allowEditKK;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              setRegType(null);
              setStep(1);
            }}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ganti Jenis Pendaftaran
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          {regType === "add" ? "Tambah Anggota Keluarga" : "Formulir Pendaftaran BPJS"}
        </h1>
        <p className="text-neutral-500">
          {regType === "add"
            ? "Daftarkan anggota keluarga baru dalam Kartu Keluarga yang sama."
            : "Lengkapi data berikut untuk mendaftar sebagai peserta BPJS Kesehatan."}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {stepIndicators.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s.num
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
                className={`text-xs mt-1.5 font-medium ${step >= s.num ? "text-primary-600" : "text-neutral-400"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {i < stepIndicators.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-colors duration-300 ${step > s.num ? "bg-primary-500" : "bg-neutral-200"
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
              {/* NIK */}
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 Digit) *</Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="3201234567890001"
                  maxLength={16}
                  value={form.nik}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setForm((p) => ({ ...p, nik: val }));
                    if (errors.nik) setErrors((p) => ({ ...p, nik: null }));
                  }}
                  className={errors.nik ? "border-red-400" : ""}
                />
                {errors.nik && (
                  <p className="text-xs text-red-500">{errors.nik}</p>
                )}
              </div>

              {/* No KK */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="family_card_number">
                    No. Kartu Keluarga (16 Digit) *
                  </Label>
                  {regType === "add" && isKkFilled16 && (
                    <button
                      type="button"
                      onClick={() => setAllowEditKK(!allowEditKK)}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium cursor-pointer"
                    >
                      {allowEditKK ? "Kunci No. KK" : "Ubah No. KK"}
                    </button>
                  )}
                </div>
                <Input
                  id="family_card_number"
                  name="family_card_number"
                  placeholder="3201234567890001"
                  maxLength={16}
                  value={form.family_card_number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setForm((p) => ({ ...p, family_card_number: val }));
                    if (errors.family_card_number) {
                      setErrors((p) => ({ ...p, family_card_number: null }));
                    }
                  }}
                  className={`${errors.family_card_number ? "border-red-400" : ""} ${isKkLocked ? "bg-emerald-50/50 text-emerald-900 border-emerald-300 font-medium" : ""
                    }`}
                  readOnly={isKkLocked}
                />
                {isKkLocked && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    Nomor KK diisi otomatis dari data keluarga sebelumnya
                  </p>
                )}
                {regType === "add" && allowEditKK && (
                  <p className="text-xs text-amber-600">
                    Mode ubah aktif: masukkan 16 digit No. KK jika ingin mengganti.
                  </p>
                )}
                {errors.family_card_number && (
                  <p className="text-xs text-red-500">
                    {errors.family_card_number}
                  </p>
                )}
              </div>
            </div>

            {/* Nama Lengkap */}
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

            {/* PISAT */}
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
                {regType !== "add" && <option value="1">1 - Peserta (Kepala Keluarga)</option>}
                <option value="2">2 - Suami</option>
                <option value="3">3 - Istri</option>
                <option value="4">4 - Anak</option>
              </Select>
              {errors.pisat_code && (
                <p className="text-xs text-red-500">{errors.pisat_code}</p>
              )}
            </div>

            {/* Tempat & Tgl Lahir */}
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

            {/* Jenis Kelamin & Status Kawin */}
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

            {/* No Telepon & Email */}
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
                <CardTitle>Alamat &amp; Faskes</CardTitle>
                <CardDescription>
                  {regType === "add"
                    ? "Alamat dan Faskes telah diisi sesuai data keluarga, silakan sesuaikan jika diperlukan."
                    : "Masukkan alamat tempat tinggal dan pilihan fasilitas kesehatan."}
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
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Upload Dokumen</CardTitle>
                <CardDescription>
                  Unggah berkas Kartu Keluarga (wajib) dan KTP (opsional)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FileUploadBox
                id="upload-kk"
                label="Foto Kartu Keluarga (KK) *"
                icon={Users}
                fileKey="kk"
                accept="image/*,.pdf"
                note={prefilledKkUrl ? "✓ Telah terisi dari foto KK keluarga" : null}
              />
              <FileUploadBox
                id="upload-ktp"
                label="Foto KTP (Opsional)"
                icon={CreditCard}
                fileKey="ktp"
                accept="image/*,.pdf"
                note="Boleh dikosongkan jika belum memiliki KTP"
              />
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 text-sm text-emerald-950">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <span>📋</span> Ketentuan Dokumen:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-emerald-800">
                <li>
                  <strong>Kartu Keluarga (KK):</strong> Wajib diunggah dan seluruh teks harus terbaca jelas.
                </li>
                <li>
                  <strong>KTP:</strong> Bersifat opsional (disarankan jika pendaftar sudah memiliki KTP).
                </li>
                <li>Format file yang didukung: JPG, PNG, atau PDF (maksimal 5MB per file).</li>
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
    </div>
  );
}
