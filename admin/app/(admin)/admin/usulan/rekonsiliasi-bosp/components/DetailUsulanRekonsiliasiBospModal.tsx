import React, { useState } from "react";
import ActionIconButton from "./ActionIconButton";
import Swal from "sweetalert2";
import { Button, FileInput, Modal, Select, Textarea } from "@/app/(admin)/_components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { useUrlStore } from "@/store/useUrlStore";
import { fetchData } from "@/lib/api_secure";
import { DokumenInput, DokumenSpj, ResponseInterface } from "../types";
import { useDokumenMutation, useDokumenSpj, useKategoriSpjOption } from "../hooks/crud";

interface Props { isOpen: boolean; onClose: () => void; record: ResponseInterface; verification?: boolean }
const emptyDocument: DokumenInput = { kategori_id: "", uraian: "", file: "" };

export default function DetailUsulanRekonsiliasiBospModal({ isOpen, onClose, record, verification = false }: Props) {
  const baseUrl = useUrlStore((state) => state.URL.APP);
  const role = useAuthStore((state) => state.user?.role);
  const canVerify = verification && (role === "admin" || role === "superadmin");
  const categories = useKategoriSpjOption();
  const documents = useDokumenSpj(record.id, isOpen, verification);
  const mutation = useDokumenMutation(record.id);
  const [draft, setDraft] = useState<DokumenInput>(emptyDocument);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busy = saving || mutation.isPending;

  const openEditor = (document?: DokumenSpj, kategoriId = "") => {
    setDraft(document ? { kategori_id: document.kategori_id || "", uraian: document.uraian, file: document.file } : { ...emptyDocument, kategori_id: kategoriId });
    setEditingId(document?.id);
    setSelectedFile(undefined);
    setError("");
    setIsEditing(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(""); setSaving(true);
    try {
      if (!draft.uraian.trim()) throw new Error("Isi uraian dokumen terlebih dahulu.");
      let file = draft.file;
      if (selectedFile) {
        const body = new FormData(); body.append("file", selectedFile);
        const result = await fetchData<{ file_url: string }>(`${baseUrl}/api/v1/admin/usulan/rekonsiliasi-bosp/upload`, { method: "POST", body });
        file = result.file_url;
        setDraft((previous) => ({ ...previous, file })); setSelectedFile(undefined);
      }
      if (!file) throw new Error("Pilih lampiran dokumen terlebih dahulu.");
      await mutation.mutateAsync({ type: "save", id: editingId, body: { ...draft, uraian: draft.uraian.trim(), file } });
      setIsEditing(false);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Gagal menyimpan dokumen."); }
    finally { setSaving(false); }
  };
  const remove = async (document: DokumenSpj) => {
    const result = await Swal.fire({ title: "Hapus rincian dokumen?", text: document.uraian,
      icon: "warning", showCancelButton: true, confirmButtonText: "Hapus Dokumen", cancelButtonText: "Batal" });
    if (!result.isConfirmed) return;
    setError("");
    try { await mutation.mutateAsync({ type: "delete", id: document.id }); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Gagal menghapus dokumen."); }
  };
  const verify = async (document: DokumenSpj, field: "cek_benar" | "cek_lengkap") => {
    setError("");
    try { await mutation.mutateAsync({ type: "verify", id: document.id, body: { [field]: !document[field] } }); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Gagal memperbarui pemeriksaan."); }
  };

  const rows = documents.data || [];
  const groups = categories.options.map((category) => ({ id: category.id, name: category.value,
    documents: rows.filter((document) => document.kategori_id === category.id) }));
  for (const document of rows) {
    if (categories.options.some((category) => category.id === document.kategori_id)) continue;
    const key = document.kategori_id || `previous-${document.kategori_nama}`;
    const group = groups.find((item) => item.id === key);
    if (group) group.documents.push(document);
    else groups.push({ id: key, name: document.kategori_nama, documents: [document] });
  }
  const fileUrl = (file: string) => {
    if (/^https?:\/\//i.test(file)) return file;
    return `${baseUrl}${file.startsWith("/") ? file : `/uploads/${file}`}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { if (!busy) { if (isEditing) setIsEditing(false); else onClose(); } }}
      title={isEditing ? (editingId ? "Edit Dokumen" : "Tambah Dokumen") : verification ? "Verifikasi Dokumen Rekonsiliasi BOSP" : "Rincian Dokumen Rekonsiliasi BOSP"}
      description={`${record.sekolah || record.unit_kerja || "Satuan Pendidikan"} · ${record.tahun || "—"} · ${record.tahap || "—"}`}
      maxWidth={isEditing ? "lg" : "4xl"}
      footer={isEditing ? <>
        <Button variant="outline" disabled={busy} onClick={() => setIsEditing(false)}>Batal</Button>
        <Button variant="gold" disabled={busy || categories.isLoading || categories.isError || !categories.options.length}
          type="submit" form="form-dokumen-bosp">{busy ? "Menyimpan..." : "Simpan Dokumen"}</Button>
      </> : <Button variant="outline" disabled={busy} onClick={onClose}>Tutup</Button>}>
      {error && <p role="alert" className="mb-4 text-xs text-rose-600">{error}</p>}
      {isEditing ? <form id="form-dokumen-bosp" onSubmit={save}>
        <fieldset disabled={busy} className="space-y-4">
          <label className="block text-xs font-semibold space-y-1"><span>Jenis Rincian Kategori *</span>
            <Select required value={draft.kategori_id} onChange={(event) => setDraft({ ...draft, kategori_id: event.target.value })}
              options={[{ value: "", label: categories.isLoading ? "Memuat kategori..." : "Pilih kategori dokumen" },
                ...categories.options.map((category) => ({ value: category.id, label: category.value }))]} />
          </label>
          {categories.isError && <p role="alert" className="text-xs text-rose-600">Gagal memuat master kategori. Tutup dan buka kembali rincian untuk mencoba lagi.</p>}
          {!categories.isLoading && !categories.isError && !categories.options.length && <p className="text-xs">Tambahkan kategori melalui Master Kategori terlebih dahulu.</p>}
          <label className="block text-xs font-semibold space-y-1"><span>Uraian *</span>
            <Textarea required maxLength={5000} rows={3} value={draft.uraian} placeholder="Contoh: Buku Kas Umum Semester I 2026 — PDF"
              onChange={(event) => setDraft({ ...draft, uraian: event.target.value })} />
          </label>
          <FileInput label="Lampiran *" value={selectedFile || draft.file}
            onChange={(_, file) => { setSelectedFile(file); setDraft((previous) => ({ ...previous, file: "" })); }}
            helperText="Satu lampiran per rincian. Tambahkan rincian lain untuk berkas berikutnya dalam kategori yang sama." />
          {editingId && <p className="text-xs text-[#7d7152]">Perubahan kategori, uraian, atau lampiran akan mengembalikan pemeriksaan dokumen ke belum diperiksa.</p>}
        </fieldset>
      </form> : <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs text-[#7d7152]">{rows.length} dokumen · {rows.filter((row) => row.cek_benar).length} cek benar · {rows.filter((row) => row.cek_lengkap).length} cek lengkap</p>
        </div>
        {(documents.isLoading || categories.isLoading) ? <p className="text-xs py-8 text-center">Memuat rincian dokumen...</p>
          : documents.isError ? <div role="alert" className="text-xs text-rose-600">Gagal memuat dokumen. <Button variant="outline" onClick={() => documents.refetch()}>Coba Lagi</Button></div>
          : <>
            {categories.isError && <p role="alert" className="text-xs text-rose-600">Master kategori gagal dimuat. Dokumen tersimpan tetap ditampilkan.</p>}
            {!groups.length && <p className="text-xs text-center py-8">Belum ada kategori dokumen. Tambahkan kategori melalui Master Kategori terlebih dahulu.</p>}
            <div className="overflow-x-auto rounded-xl border border-[#e2d9c8]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#fbf9f4]"><tr><th className="p-3">Rincian</th><th className="p-3">Cek Benar</th><th className="p-3">Cek Lengkap</th>{!verification && <th className="p-3">Aksi</th>}</tr></thead>
                <tbody>{groups.map((group) => <React.Fragment key={group.id}>
                  <tr className="bg-amber-50 text-amber-900 border-y border-[#e2d9c8]">
                    <th colSpan={verification ? 3 : 4} className="p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span>{group.name} <span className="font-normal">({group.documents.length})</span></span>
                        {!verification && <ActionIconButton action="add"
                          label={`Tambah Dokumen: ${group.name}`}
                          disabled={busy || categories.isError || !categories.options.some((category) => category.id === group.id)}
                          title={categories.options.some((category) => category.id === group.id) ? `Tambah dokumen ${group.name}` : "Kategori ini sudah tidak tersedia di Master Kategori"}
                          onClick={() => openEditor(undefined, group.id)} />}
                      </div>
                    </th>
                  </tr>
                  {!group.documents.length && <tr><td colSpan={verification ? 3 : 4} className="p-3 text-[#7d7152]">Belum ada dokumen</td></tr>}
                  {group.documents.map((document) => <tr key={document.id} className="border-b border-[#ece5d8]">
                    <td className="p-3 min-w-52"><p className="font-medium whitespace-pre-wrap break-words">{document.uraian}</p>
                      <a className="inline-block mt-1 text-amber-800 underline" href={fileUrl(document.file)} target="_blank" rel="noopener noreferrer">Lihat / Unduh Lampiran</a></td>
                    {(["cek_benar", "cek_lengkap"] as const).map((field) => <td key={field} className="p-3">
                      {canVerify ? <button type="button" disabled={busy} aria-pressed={document[field]}
                        aria-label={`${field === "cek_benar" ? "Cek Benar" : "Cek Lengkap"}: ${document.uraian}`}
                        onClick={() => void verify(document, field)}
                        className={`rounded-lg border px-3 py-2 ${document[field] ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-stone-500 border-stone-200"}`}>{document[field] ? "✓ Sudah" : "Belum"}</button>
                        : <span className={document[field] ? "text-emerald-700" : "text-stone-500"}>{document[field] ? "✓ Sudah" : "Belum"}</span>}
                    </td>)}
                    {!verification && <td className="p-3"><div className="flex gap-2">
                      <ActionIconButton action="edit" label={`Edit Dokumen: ${document.uraian}`} disabled={busy} onClick={() => openEditor(document)} />
                      <ActionIconButton action="delete" label={`Hapus Dokumen: ${document.uraian}`} disabled={busy} onClick={() => void remove(document)} />
                    </div></td>}
                  </tr>)}
                </React.Fragment>)}</tbody>
              </table>
            </div>
          </>}
      </div>}
    </Modal>
  );
}
