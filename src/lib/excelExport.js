import XLSXStyle from "xlsx-js-style";

// 7 Kecamatan resmi Kota Dumai (urutan tetap meski sheet kosong)
const KECAMATAN_ORDER = [
  "DUMAI TIMUR",
  "BUKIT KAPUR",
  "DUMAI BARAT",
  "SUNGAI SEMBILAN",
  "MEDANG KAMPAI",
  "DUMAI SELATAN",
  "DUMAI KOTA",
];

/**
 * Export approved applicants data to Excel (.xlsx).
 * - Setiap kecamatan mendapat sheet tersendiri (tab terpisah).
 * - Sheet "SEMUA DATA" berisi seluruh data.
 * - Header row: UPPERCASE, background kuning, bold.
 * @param {Array} data - Array of applicant objects from Supabase
 */
export function exportToExcel(data) {
  // Helper: uppercase a string value, leave non-strings untouched
  const up = (val) =>
    typeof val === "string" && val ? val.toUpperCase() : val;

  // Column definitions — key = header label (UPPERCASE), value fn = data getter
  const columns = [
    { header: "NO KK", get: (i) => i.family_card_number ? String(i.family_card_number) : "" },
    { header: "JUMLAH DIGIT KK", get: (i) => i.family_card_number ? String(i.family_card_number).length : 0 },
    { header: "NIK", get: (i) => i.nik ? String(i.nik) : "" },
    { header: "JUMLAH DIGIT NIK", get: (i) => i.nik ? String(i.nik).length : 0 },
    { header: "NAMA LENGKAP", get: (i) => up(i.full_name) },
    { header: "PISAT", get: (i) => up(i.pisat_code) },
    { header: "TEMPAT LAHIR", get: (i) => up(i.birth_place) },
    { header: "TGL LAHIR", get: (i) => i.birth_date },
    { header: "JENIS KELAMIN", get: (i) => i.gender === 1 ? "LAKI-LAKI" : "PEREMPUAN" },
    { header: "STATUS KAWIN", get: (i) => up(getMaritalStatusLabel(i.marital_status)) },
    { header: "ALAMAT TEMPAT TINGGAL", get: (i) => up(i.address) },
    { header: "RT", get: (i) => i.rt },
    { header: "RW", get: (i) => i.rw },
    { header: "KODE POS", get: (i) => i.postal_code },
    { header: "NAMA KECAMATAN", get: (i) => up(i.district) },
    { header: "NAMA DESA", get: (i) => up(i.village) },
    { header: "NAMA FASKES TK.I", get: (i) => up(i.facility_name) },
    {
      header: "KETERANGAN",
      get: (i) => up(
        i.notes && i.notes.trim()
          ? i.notes.trim()
          : i.status === "approved" ? "DISETUJUI" : i.status || ""
      ),
    },
  ];

  // Header style: yellow background + bold + center aligned
  const headerStyle = {
    font: { bold: true, name: "Arial", sz: 11 },
    fill: { fgColor: { rgb: "FFFF00" }, patternType: "solid" },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Data cell style: thin border
  const dataStyle = {
    font: { name: "Arial", sz: 10 },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  };

  /**
   * Build a styled worksheet from a subset of data rows.
   */
  const buildSheet = (rows) => {
    const ws = {};
    const nCols = columns.length;
    const nRows = rows.length;

    // Header row
    columns.forEach((col, c) => {
      ws[XLSXStyle.utils.encode_cell({ r: 0, c })] = {
        v: col.header, t: "s", s: headerStyle,
      };
    });

    // Data rows
    rows.forEach((item, r) => {
      columns.forEach((col, c) => {
        const val = col.get(item);
        ws[XLSXStyle.utils.encode_cell({ r: r + 1, c })] = {
          v: val ?? "",
          t: typeof val === "number" ? "n" : "s",
          s: dataStyle,
        };
      });
    });

    ws["!ref"] = XLSXStyle.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: nRows, c: nCols - 1 },
    });

    // Auto-fit column widths based on this subset
    ws["!cols"] = columns.map((col) => {
      const maxLen = Math.max(
        col.header.length,
        ...(rows.length ? rows.map((item) => String(col.get(item) ?? "").length) : [0])
      );
      return { wch: Math.min(maxLen + 2, 42) };
    });

    ws["!rows"] = [{ hpt: 28 }];
    return ws;
  };

  // Group data by district (kecamatan), normalized to UPPERCASE
  const grouped = {};
  data.forEach((item) => {
    const kec = item.district
      ? String(item.district).toUpperCase().trim()
      : "LAINNYA";
    if (!grouped[kec]) grouped[kec] = [];
    grouped[kec].push(item);
  });

  const workbook = XLSXStyle.utils.book_new();

  // Sheet 1: Semua Data
  XLSXStyle.utils.book_append_sheet(workbook, buildSheet(data), "SEMUA DATA");

  // Sheets per kecamatan — fixed order first, then any extra districts not in list
  const extraDistricts = Object.keys(grouped).filter(
    (k) => !KECAMATAN_ORDER.includes(k)
  );
  const sheetOrder = [...KECAMATAN_ORDER, ...extraDistricts];

  sheetOrder.forEach((kec) => {
    const rows = grouped[kec] || [];
    // Always add sheet for the 7 official kecamatan (even if empty); skip empty extras
    const isOfficial = KECAMATAN_ORDER.includes(kec);
    if (rows.length > 0 || isOfficial) {
      // Excel sheet name max 31 chars
      const sheetName = kec.length > 31 ? kec.slice(0, 31) : kec;
      XLSXStyle.utils.book_append_sheet(workbook, buildSheet(rows), sheetName);
    }
  });

  const today = new Date().toISOString().slice(0, 10);
  XLSXStyle.writeFile(workbook, `Rekap_BPJS_${today}.xlsx`);
}

function getMaritalStatusLabel(code) {
  const labels = {
    0: "TIDAK DIKETAHUI",
    1: "BELUM KAWIN",
    2: "KAWIN",
    3: "CERAI",
  };
  return labels[code] || "TIDAK DIKETAHUI";
}
