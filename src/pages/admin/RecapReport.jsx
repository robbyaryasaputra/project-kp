import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { exportToExcel } from "@/utils/excelExport";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  Loader2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle,
  Inbox,
} from "lucide-react";

export default function RecapReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchApprovedData();
  }, []);

  const fetchApprovedData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data rekapitulasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
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
      a.registration_code?.toLowerCase().includes(q) ||
      a.card_number?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary-500" />
            Rekapitulasi Data
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Data pendaftar yang telah disetujui — siap untuk di-export
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting || data.length === 0}>
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

      {/* Summary */}
      <Card className="border-primary-200 bg-primary-50/50">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">{data.length}</p>
            <p className="text-xs text-primary-600">
              Total pendaftar disetujui
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Data Pendaftar Disetujui</CardTitle>
              <CardDescription>
                Format export sesuai kolom resmi BPJS Kesehatan
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
              <Button
                variant="outline"
                size="icon"
                onClick={fetchApprovedData}
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
                  : "Belum ada pendaftar yang disetujui."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Kode Registrasi</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>No. KK</TableHead>
                    <TableHead>PISAT</TableHead>
                    <TableHead>JK</TableHead>
                    <TableHead>Faskes Tk.I</TableHead>
                    <TableHead>No. Kartu BPJS</TableHead>
                    <TableHead>Tgl Disetujui</TableHead>
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
                      <TableCell className="font-medium">
                        {item.full_name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.nik}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.family_card_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getPisatLabel(item.pisat_code)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getGenderLabel(item.gender)}</TableCell>
                      <TableCell className="text-sm">
                        {item.facility_name}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-semibold text-primary-600">
                          {item.card_number || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
