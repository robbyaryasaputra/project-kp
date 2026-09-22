import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a PDF proof of approved BPJS registration.
 * @param {Object} applicant - The approved applicant data
 */
export function generateApprovalPDF(applicant) {
  const doc = new jsPDF();

  /* Header */
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BUKTI PENDAFTARAN BPJS KESEHATAN", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Dokumen ini merupakan bukti pendaftaran yang sah.", 105, 28, {
    align: "center",
  });

  doc.setDrawColor(13, 110, 110);
  doc.setLineWidth(0.8);
  doc.line(14, 33, 196, 33);

  /* Registration Info */
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Informasi Pendaftaran", 14, 42);

  doc.autoTable({
    startY: 46,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55 },
      1: { cellWidth: 130 },
    },
    body: [
      ["Kode Pendaftaran", `: ${applicant.registration_code}`],
      ["Nomor Kartu BPJS", `: ${applicant.card_number || "-"}`],
      ["Status", ": DISETUJUI"],
      [
        "Tanggal Daftar",
        `: ${new Date(applicant.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`,
      ],
    ],
  });

  /* Personal Data */
  const y1 = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Data Pribadi", 14, y1);

  doc.autoTable({
    startY: y1 + 4,
    theme: "striped",
    headStyles: {
      fillColor: [13, 110, 110],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 9.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55 },
      1: { cellWidth: 130 },
    },
    body: [
      ["NIK", applicant.nik],
      ["No. Kartu Keluarga", applicant.family_card_number],
      ["Nama Lengkap", applicant.full_name],
      ["Tempat, Tgl Lahir", `${applicant.birth_place}, ${applicant.birth_date}`],
      [
        "Jenis Kelamin",
        applicant.gender === 1 ? "Laki-laki" : "Perempuan",
      ],
      [
        "Status Perkawinan",
        { 0: "Tidak Diketahui", 1: "Belum Kawin", 2: "Kawin", 3: "Cerai" }[
          applicant.marital_status
        ] || "-",
      ],
      ["No. Telepon", applicant.phone_number || "-"],
      ["Email", applicant.email || "-"],
      [
        "Alamat",
        `${applicant.address}, RT ${applicant.rt || "-"}/RW ${applicant.rw || "-"}, ${applicant.village}, ${applicant.district} ${applicant.postal_code || ""}`,
      ],
      ["Faskes Tingkat I", applicant.facility_name],
    ],
  });

  /* Footer */
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "Dokumen ini digenerate secara otomatis oleh Sistem Pendaftaran BPJS.",
    105,
    pageHeight - 12,
    { align: "center" }
  );
  doc.text(
    `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
    105,
    pageHeight - 7,
    { align: "center" }
  );

  doc.save(`Bukti_BPJS_${applicant.registration_code}.pdf`);
}
