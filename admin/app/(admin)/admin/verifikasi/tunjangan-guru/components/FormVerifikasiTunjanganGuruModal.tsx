import React, { useState } from "react";
import { Button, Modal, Select, Textarea } from "@/app/(admin)/_components/ui";
import { useUrlStore } from "@/store/useUrlStore";
import { ResponseInterface } from "../../../usulan/tunjangan-guru/types";
import { useTriwulanOption, useJenisPenerimaOption, useKelasPenerimaOption } from "../../../usulan/tunjangan-guru/hooks/crud";
import { useVerifyUsulan } from "../hooks/crud";

export default function FormVerifikasiTunjanganGuruModal({ record, onClose }: { record: ResponseInterface; onClose: () => void }) {
  const mutation = useVerifyUsulan();
  const baseUrl = useUrlStore((state) => state.URL.APP);
  const triwulan = useTriwulanOption();
  const jenis = useJenisPenerimaOption();
  const kelas = useKelasPenerimaOption();
  const [status, setStatus] = useState(record.status_verifikasi || "Menunggu");
  const [pesan, setPesan] = useState(record.catatan || "");
  const [error, setError] = useState("");
  const label = (options: { id: string; value: string }[], value: string | null) => options.find((item) => item.id === value || item.value === value)?.value || value || "—";
  const fileUrl = record.file ? (/^https?:\/\//i.test(record.file) ? record.file : `${baseUrl}${record.file.startsWith("/") ? record.file : `/uploads/${record.file}`}`) : "";
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    try { await mutation.mutateAsync({ id: record.id, status, pesan }); onClose(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Gagal menyimpan verifikasi."); }
  };
  return (
    <Modal isOpen onClose={() => { if (!mutation.isPending) onClose(); }} title="Verifikasi Usulan Tunjangan Guru"
      description={record.unit_kerja || `Usulan oleh ${record.created_by || "pengguna"}`} maxWidth="lg"
      footer={<>
        <Button variant="outline" disabled={mutation.isPending} onClick={onClose}>Batal</Button>
        <Button variant="gold" type="submit" form="form-verifikasi-tunjangan" disabled={mutation.isPending}>{mutation.isPending ? "Menyimpan..." : "Simpan Verifikasi"}</Button>
      </>}>
      <dl className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/60 text-xs mb-4">
        <dt>NIP Pengusul</dt><dd>{record.nip || "—"}</dd>
        <dt>Triwulan</dt><dd>{label(triwulan.options, record.triwulan_id)}</dd>
        <dt>Jenis Tunjangan</dt><dd>{label(jenis.options, record.jenis_id)}</dd>
        <dt>Kelas Penerima</dt><dd>{label(kelas.options, record.kelas_id)}</dd>
        <dt>Jumlah Guru</dt><dd>{record.jml_guru ?? "—"}</dd>
        <dt>Nominal Usulan</dt><dd>{record.nominal == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(record.nominal))}</dd>
        <dt>Lampiran</dt><dd>{fileUrl ? <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-amber-800 underline">Lihat / Unduh Berkas</a> : "Belum ada lampiran"}</dd>
      </dl>
      <form id="form-verifikasi-tunjangan" onSubmit={submit}>
        <fieldset disabled={mutation.isPending} className="space-y-4">
          <label className="block text-xs font-semibold space-y-1"><span>Status Verifikasi *</span>
            <Select required value={status} onChange={(event) => setStatus(event.target.value)} options={[
              { value: "Menunggu", label: "Menunggu Verifikasi" }, { value: "Disetujui", label: "Disetujui / Terbit SKTP" },
              { value: "Perbaikan", label: "Perlu Perbaikan Berkas" }, { value: "Ditolak", label: "Ditolak" },
              ...(!["Menunggu", "Disetujui", "Perbaikan", "Ditolak"].includes(status) ? [{ value: status, label: `${status} (status sebelumnya)` }] : []),
            ]} />
          </label>
          <label className="block text-xs font-semibold space-y-1"><span>Catatan Verifikator</span>
            <Textarea maxLength={5000} rows={3} value={pesan} onChange={(event) => setPesan(event.target.value)} placeholder="Catatan hasil pemeriksaan atau berkas yang perlu diperbaiki..." />
          </label>
          {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        </fieldset>
      </form>
    </Modal>
  );
}
