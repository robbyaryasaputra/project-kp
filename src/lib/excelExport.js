import * as XLSX from "xlsx";

/**
 * Export approved applicants data to Excel (.xlsx) with official BPJS column format.
 * @param {Array} data - Array of applicant objects from Supabase
 */
export function exportToExcel(data) {
  const rows = data.map((item) => ({
    "JUMLAH DIGIT KK": item.family_card_number
      ? item.family_card_number.length
      : 0,
    NIK: item.nik,
    "JUMLAH DIGIT NIK": item.nik ? item.nik.length : 0,
    "Nama Lengkap": item.full_name,
    PISAT: item.pisat_code,
    "Tempat Lahir": item.birth_place,
    "Tgl Lahir": item.birth_date,
    "Jenis Kelamin": item.gender === 1 ? "Laki-laki" : "Perempuan",
    "Status Kawin": getMaritalStatusLabel(item.marital_status),
    "Alamat Tempat Tinggal": item.address,
    RT: item.rt,
    RW: item.rw,
    "Kode Pos": item.postal_code,
    "Nama Kecamatan": item.district,
    "Nama Desa": item.village,
    "Nama Faskes Tk.I": item.facility_name,
    Keterangan: item.notes || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  /* Auto-fit column widths */
  const colWidths = Object.keys(rows[0] || {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] || "").length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap BPJS");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Rekap_BPJS_${today}.xlsx`);
}

function getMaritalStatusLabel(code) {
  const labels = {
    0: "Tidak Diketahui",
    1: "Belum Kawin",
    2: "Kawin",
    3: "Cerai",
  };
  return labels[code] || "Tidak Diketahui";
}
