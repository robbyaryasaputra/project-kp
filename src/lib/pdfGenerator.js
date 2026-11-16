import jsPDF from "jspdf";
import { STAMP_BASE64 } from "@/assets/capDinkesBase64";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getPuskesmasByDistrict(district) {
  if (!district) return "Puskesmas Kota Dumai";
  const d = district.toLowerCase();
  const map = {
    "bukit kapur": "Puskesmas Bukit Kapur",
    "dumai barat": "Puskesmas Dumai Barat",
    "dumai kota": "Puskesmas Kota Dumai",
    "dumai selatan": "Puskesmas Bumi Ayu",
    "bumi ayu": "Puskesmas Bumi Ayu",
    "dumai timur": "Puskesmas Jaya Mukti",
    "jaya mukti": "Puskesmas Jaya Mukti",
    "medang kampai": "Puskesmas Medang Kampai",
    "sungai sembilan": "Puskesmas Sungai Sembilan",
  };
  for (const key of Object.keys(map)) {
    if (d.includes(key)) return map[key];
  }
  return `Puskesmas ${district}`;
}

function getRecheckDate(createdAt) {
  const d = new Date(createdAt);
  d.setMonth(d.getMonth() + 2);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtDate(isoStr) {
  return new Date(isoStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main PDF generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {Object} applicant
 * @param {number} totalApplicants
 */
export function generateApprovalPDF(applicant, totalApplicants = 1) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const marginL = 12;
  const marginR = 12;
  const boxW = pageW - marginL - marginR; // 186 mm
  const boxTop = 14;
  const boxH = 195;

  // Garis luar kotak utama
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.rect(marginL, boxTop, boxW, boxH);

  // ── HEADER ───────────────────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  const headerText = `${applicant.registration_code || "0000000000"}  BUKTI PENDAFTARAN PESERTA PBPU PEMDA KOTA DUMAI`;
  doc.text(headerText, pageW / 2, boxTop + 9, { align: "center" });

  // Garis pemisah bawah header
  doc.setLineWidth(0.6);
  doc.line(marginL, boxTop + 14, marginL + boxW, boxTop + 14);

  // ── KOORDINAT KOLOM ───────────────────────────────────────────────────────
  const labelX = marginL + 5;
  const colonX = marginL + 70;
  const valX   = marginL + 76;
  const hpColX = marginL + 135;

  // ── BAGIAN 1: DATA BUKU TAMU ──────────────────────────────────────────
  let y = boxTop + 24;
  const rowGap = 9;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Baris 1: No. Buku Tamu | Hp
  doc.text("No. Buku Tamu", labelX, y);
  doc.text(":", colonX, y);
  doc.text(applicant.registration_code || "-", valX, y);

  doc.text("Hp  :", hpColX, y);
  doc.text(applicant.phone_number || "-", hpColX + 11, y);

  // Baris 2: Tanggal Terima Berkas
  y += rowGap;
  doc.text("Tanggal Terima Berkas", labelX, y);
  doc.text(":", colonX, y);
  doc.text(fmtDate(applicant.created_at), valX, y);

  // Baris 3: Usulan
  y += rowGap;
  doc.text("Usulan", labelX, y);
  doc.text(":", colonX, y);
  doc.text(`${totalApplicants} Orang (1..KK)`, valX, y);

  // Baris 4: Jenis
  y += rowGap;
  doc.text("Jenis", labelX, y);
  doc.text(":", colonX, y);
  doc.text("USBD", valX, y);

  // Garis pemisah horizontal tengah
  y += rowGap + 2;
  doc.setLineWidth(0.5);
  doc.line(marginL, y, marginL + boxW, y);

  // ── BAGIAN 2: NAMA KEPALA KELUARGA / NAMA YG DIUSULKAN ───────────────────
  y += 9;
  doc.text("Nama Kepala Keluarga /", labelX, y);
  doc.text(":", colonX, y);
  doc.text(applicant.full_name || "-", valX, y);

  y += 5.5;
  doc.text("Nama yg diusulkan", labelX, y);

  // ── BAGIAN 3: PENGECEKAN KEMBALI DI TANGGAL ──────────────────────────────
  y += 9;
  doc.setFont("helvetica", "bold");
  doc.text("Pengecekan kembali di Tanggal", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(":", colonX, y);
  doc.text(getRecheckDate(applicant.created_at), valX, y);

  // Di bawah baris Pengecekan kembali di Tanggal: opsi instruksi
  const puskesmas = getPuskesmasByDistrict(applicant.district);
  y += 9;
  const listIndent = valX;
  doc.text(":", colonX, y);
  doc.text(`1. Langsung ke ${puskesmas}`, listIndent, y);
  y += 5.5;
  doc.text("2. Via WA Chat Call Center JKN", listIndent, y);
  y += 5;
  doc.text("   (0811 7503 343)", listIndent, y);
  y += 5.5;
  doc.text("3. Aplikasi Mobile JKN", listIndent, y);

  // ── BAGIAN 4: JIKA ADA YANG SAKIT ────────────────────────────────────────
  y += 9;
  doc.setFont("helvetica", "bold");
  doc.text("Jika Ada yang sakit", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(":", colonX, y);
  doc.text("1. Langsung ke Puskesmas/UGD RS.", listIndent, y);
  y += 5.5;
  doc.text("2. Via WA Chat Call Center JKN", listIndent, y);
  y += 5;
  doc.text("   (0811 7503 343)", listIndent, y);

  // ── BAGIAN 5: TANDA TANGAN & CAP DIGITAL ASLI ────────────────────────────
  const signY = boxTop + 145;
  const signRightX = marginL + boxW - 55;

  // Kiri: Yang Menyerahkan
  doc.text("Yang Menyerahkan", labelX + 6, signY);

  // Kanan: Dumai, tanggal & Yang Menerima / Petugas JKN
  doc.text(`Dumai, ${fmtDate(applicant.created_at)}`, signRightX - 5, signY);
  doc.text("Yang Menerima", signRightX + 4, signY + 6);
  doc.text("Petugas JKN", signRightX + 6, signY + 12);

  // CAP DIGITAL ASLI (PEMERINTAH KOTA DUMAI - DINAS KESEHATAN)
  // Ukuran stempel 33mm x 33mm, transparan menimpa area Petugas JKN
  const stampW = 33;
  const stampH = 33;
  const stampX = signRightX + 2;
  const stampY = signY + 10;
  try {
    doc.addImage(STAMP_BASE64, "PNG", stampX, stampY, stampW, stampH);
  } catch (err) {
    console.warn("Gagal menambahkan cap digital:", err);
  }

  // Tanda kurung tempat tanda tangan
  const parY = signY + 36;
  doc.text("(                                  )", labelX, parY);
  doc.text("(                                  )", signRightX - 7, parY);

  // ── SIMPAN PDF ────────────────────────────────────────────────────────────
  doc.save(`Bukti_Pendaftaran_${applicant.registration_code}.pdf`);
}
