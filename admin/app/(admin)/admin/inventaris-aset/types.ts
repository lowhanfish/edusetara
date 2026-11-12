export const KIB: Record<string, string> = {
  A: "A · Tanah", B: "B · Peralatan dan mesin", C: "C · Gedung dan bangunan",
  D: "D · Jalan, irigasi, dan jaringan", E: "E · Aset tetap lainnya", F: "F · Konstruksi dalam pengerjaan",
};
const KIB_BY_PREFIX: Record<string, string> = { "01.03.01": "A", "01.03.02": "B", "01.03.03": "C", "01.03.04": "D", "01.03.05": "E", "01.03.06": "F" };
/** Kelompok KIB ditentukan oleh tiga tingkat pertama kode barang. */
export const kibOf = (code: string) => KIB_BY_PREFIX[code.split(".").slice(0, 3).join(".")] ?? "";
export interface Asset {
  id: string; upb_id: string; upb_kode: string; upb_nama: string;
  kode_barang: string; uraian_barang: string; nomor_register: string; kib: string;
  nama: string; merk: string | null; nomor_seri: string | null;
  tahun_perolehan: number; tanggal_perolehan: string | null; nilai_perolehan: string;
  lokasi: string; kondisi_kode: number; kondisi_nama: string;
  sumber_dana_id: string | null; sumber_dana_nama: string | null;
  keterangan: string | null; version: number; created_by: string; created_at: string; updated_at: string;
}
export interface ConditionHistory {
  id: string; kondisi_lama: { kode: number; nama: string } | null;
  kondisi_baru: { kode: number; nama: string }; catatan: string;
  foto_url: string | null; created_by: string; created_at: string; version: number;
}
export interface AssetDetail extends Asset { riwayat: ConditionHistory[] }
export interface AssetList { total: number; skip: number; limit: number; nilai_total: string; data: Asset[] }
export interface Choice { id: string; value: string }
export const rupiah = (value: string) => {
  const [whole, fraction = ""] = value.split(".");
  return `Rp ${new Intl.NumberFormat("id-ID").format(BigInt(whole || "0"))},${fraction.padEnd(2, "0").slice(0, 2)}`;
};
export const errorText = (error: unknown) => error instanceof Error ? error.message : "Permintaan gagal. Coba lagi.";
