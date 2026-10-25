"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../../_components/ui";

interface Announcement {
  id: string;
  number: string;
  title: string;
  category: "Akademik & ANBK" | "Kepegawaian / PPPK" | "Pendataan & Dapodik" | "Kebudayaan & Event";
  summary: string;
  targetAudience: string;
  deadline: string;
  attachmentName: string;
  important: boolean;
  status: "Aktif" | "Draft" | "Selesai";
}

const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    number: "421.2/342/Dikbud/IX/2026",
    title: "Pemberitahuan Jadwal dan Petunjuk Teknis Pelaksanaan ANBK Jenjang SD & SMP Tahun 2026",
    category: "Akademik & ANBK",
    summary: "Timeline gladi bersih, sinkronisasi server, dan jadwal utama asesmen nasional.",
    targetAudience: "Kepala Sekolah & Proktor SD/SMP",
    deadline: "28 Sep 2026",
    attachmentName: "Juknis_ANBK_2026.pdf",
    important: true,
    status: "Aktif",
  },
  {
    id: "ann-2",
    number: "800/198/Dikbud/IX/2026",
    title: "Verifikasi Berkas Administrasi Seleksi Calon Kepala Sekolah & Pengawas Periode II",
    category: "Kepegawaian / PPPK",
    summary: "Hasil verifikasi berkas tahap pertama dan jadwal asesmen wawancara bagi guru penggerak.",
    targetAudience: "Guru Madya & Guru Penggerak",
    deadline: "30 Sep 2026",
    attachmentName: "Hasil_Verifikasi_CKS_2026.pdf",
    important: false,
    status: "Aktif",
  },
  {
    id: "ann-3",
    number: "420/087/Dikbud/VIII/2026",
    title: "Batas Waktu Sinkronisasi Data Pokok Pendidikan (Dapodik) Semester Ganjil TA 2026/2027",
    category: "Pendataan & Dapodik",
    summary: "Instruksi penuntasan input rombel, sarpras, dan data siswa penerima PIP/BOS.",
    targetAudience: "Operator Satuan Pendidikan se-Konsel",
    deadline: "31 Agu 2026",
    attachmentName: "Edaran_Dapodik_Ganjil_2026.pdf",
    important: true,
    status: "Selesai",
  },
];

export default function PengumumanAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    number: "",
    title: "",
    category: "Akademik & ANBK" as Announcement["category"],
    summary: "",
    targetAudience: "Semua Satuan Pendidikan",
    deadline: "",
    attachmentName: "",
    important: false,
    status: "Aktif" as Announcement["status"],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: Announcement = {
      id: `ann-${Date.now()}`,
      number: formData.number || `421/DKB/${Date.now()}`,
      title: formData.title,
      category: formData.category,
      summary: formData.summary || formData.title,
      targetAudience: formData.targetAudience,
      deadline: formData.deadline || "Sesuai Edaran",
      attachmentName: formData.attachmentName || "Surat_Edaran_Resmi.pdf",
      important: formData.important,
      status: formData.status,
    };

    setAnnouncements([newItem, ...announcements]);
    setIsModalOpen(false);
    setFormData({
      number: "",
      title: "",
      category: "Akademik & ANBK",
      summary: "",
      targetAudience: "Semua Satuan Pendidikan",
      deadline: "",
      attachmentName: "",
      important: false,
      status: "Aktif",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus pengumuman ini?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pengumuman & Surat Edaran"
        description="Publikasi edaran kedinasan resmi, jadwal ujian, juknis asesmen, dan pemberitahuan penting."
        badge={<Badge variant="gold">{announcements.length} Edaran</Badge>}
        action={
          <Button
            variant="gold"
            icon="📢"
            onClick={() => setIsModalOpen(true)}
          >
            Buat Pengumuman
          </Button>
        }
      />

      <div className="w-full sm:w-80">
        <Input
          placeholder="Cari nomor edaran atau judul..."
          leftIcon="🔍"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Surat & Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Sasaran Penerima</TableHead>
              <TableHead>Batas Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono font-semibold text-[#a86a00]">
                      {item.number}
                    </span>
                    <span className="font-bold text-[#2d2410] line-clamp-2">
                      {item.title}
                    </span>
                    {item.important && (
                      <span className="inline-block text-[10px] text-red-600 font-bold">
                        ⚡ PENTING / SEGERA
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="neutral">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {item.targetAudience}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-slate-500">
                  {item.deadline}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    variant={
                      item.status === "Aktif"
                        ? "success"
                        : item.status === "Draft"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`Edit edaran: ${item.number}`)}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengumuman / Surat Edaran"
        description="Masukkan nomor surat, isi ringkasan, dan dokumen PDF lampiran untuk pengumuman kedinasan."
        maxWidth="2xl"
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="gold"
              type="submit"
              form="form-pengumuman"
            >
              Terbitkan Pengumuman
            </Button>
          </>
        }
      >
        <form id="form-pengumuman" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Surat Resmi"
              placeholder="Contoh: 421.2/342/Dikbud/IX/2026"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            <Select
              label="Kategori Pengumuman"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Announcement["category"],
                })
              }
              options={[
                { value: "Akademik & ANBK", label: "Akademik & ANBK" },
                { value: "Kepegawaian / PPPK", label: "Kepegawaian / PPPK" },
                { value: "Pendataan & Dapodik", label: "Pendataan & Dapodik" },
                { value: "Kebudayaan & Event", label: "Kebudayaan & Event" },
              ]}
            />
          </div>

          <Input
            label="Perihal / Judul Pengumuman"
            placeholder="Masukkan judul atau perihal surat edaran..."
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sasaran Penerima"
              placeholder="Contoh: Kepala Satuan Pendidikan SD/SMP"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
            <Input
              label="Batas Waktu / Deadline"
              placeholder="Contoh: 28 September 2026"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <Textarea
            label="Ringkasan Isi Pemberitahuan"
            placeholder="Jelaskan pokok-pokok penting surat edaran..."
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Dokumen PDF Lampiran"
              placeholder="Contoh: Surat_Edaran_ANBK_2026.pdf"
              value={formData.attachmentName}
              onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Announcement["status"],
                })
              }
              options={[
                { value: "Aktif", label: "Aktif & Tampil di Publik" },
                { value: "Draft", label: "Draft Sementara" },
                { value: "Selesai", label: "Arsip / Sudah Selesai" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ann-important"
              checked={formData.important}
              onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-400 cursor-pointer"
            />
            <label
              htmlFor="ann-important"
              className="text-xs font-semibold text-[#2d2410] cursor-pointer"
            >
              Tandai sebagai Pengumuman Mendesak / Penting (Badge Merah)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
