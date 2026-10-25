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

interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  phone: string;
  subject: string;
  category: "Pengaduan" | "Permohonan Informasi" | "Aspirasi / Saran" | "Umum";
  message: string;
  date: string;
  status: "Belum Dibalas" | "Diproses" | "Selesai";
}

const initialMessages: ContactMessage[] = [
  {
    id: "msg-1",
    senderName: "Baharuddin, S.Pd.",
    email: "baharuddin.sdn3@gmail.com",
    phone: "0812-4567-8901",
    subject: "Klarifikasi Kuota Pendaftaran PPG Guru PAI Daljab 2026",
    category: "Permohonan Informasi",
    message: "Mohon informasi apakah kuota penempatan PPG Guru Pendidikan Agama Islam tahun ini diprioritaskan untuk TMT di bawah 2020? Terima kasih.",
    date: "17 Sep 2026, 08:30 WITA",
    status: "Belum Dibalas",
  },
  {
    id: "msg-2",
    senderName: "Rina Marlina (Orang Tua Murid)",
    email: "rinamarlina.konsel@yahoo.com",
    phone: "0852-3344-5566",
    subject: "Konsultasi Berkas Pindah Rayon Siswa SMP Masuk Kendari",
    category: "Permohonan Informasi",
    message: "Selamat pagi admin Dikbud, untuk berkas mutasi siswa ke luar daerah apakah tanda tangan Kadis bisa diwakilkan via aplikasi online?",
    date: "16 Sep 2026, 14:15 WITA",
    status: "Diproses",
  },
  {
    id: "msg-3",
    senderName: "Komite Sekolah SDN 12 Andoolo",
    email: "komite.sdn12andoolo@gmail.com",
    phone: "0813-9988-7711",
    subject: "Usulan Rehabilitasi Plafon Ruang Guru Pascamusim Hujan",
    category: "Pengaduan",
    message: "Melaporkan kondisi atap dan plafon ruang guru yang mengalami kebocoran. Berita acara foto kerusakan sudah kami upload ke Dapodik Sarpras.",
    date: "14 Sep 2026, 10:00 WITA",
    status: "Selesai",
  },
];

export default function KontakAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form tambah pengaduan / pesan manual
  const [formData, setFormData] = useState({
    senderName: "",
    email: "",
    phone: "",
    subject: "",
    category: "Aspirasi / Saran" as ContactMessage["category"],
    message: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.message) return;

    const newItem: ContactMessage = {
      id: `msg-${Date.now()}`,
      senderName: formData.senderName,
      email: formData.email || "-",
      phone: formData.phone || "-",
      subject: formData.subject || "Pesan Langsung / Pengaduan",
      category: formData.category,
      message: formData.message,
      date: "17 Sep 2026, Hari ini",
      status: "Belum Dibalas",
    };

    setMessages([newItem, ...messages]);
    setIsModalOpen(false);
    setFormData({
      senderName: "",
      email: "",
      phone: "",
      subject: "",
      category: "Aspirasi / Saran",
      message: "",
    });
  };

  const handleReplySubmit = () => {
    if (!selectedMessage || !replyText.trim()) return;
    alert(`Balasan berhasil dikirimkan ke email: ${selectedMessage.email}`);
    setMessages(
      messages.map((m) =>
        m.id === selectedMessage.id ? { ...m, status: "Selesai" } : m
      )
    );
    setSelectedMessage(null);
    setReplyText("");
  };

  const filtered = messages.filter(
    (m) => statusFilter === "Semua" || m.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kotak Pesan & Pengaduan Masuk"
        description="Kelola pesan masuk masyarakat, pertanyaan layanan, serta aspirasi publik yang masuk melalui portal Dikbud Konawe Selatan."
        badge={<Badge variant="gold">{messages.length} Pesan Masuk</Badge>}
        action={
          <Button variant="gold" icon="✉️" onClick={() => setIsModalOpen(true)}>
            Catat Pesan / Aspirasi Baru
          </Button>
        }
      />

      {/* Filter Status */}
      <div className="flex gap-2">
        {["Semua", "Belum Dibalas", "Diproses", "Selesai"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-[#2d2410] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengirim & Kontak</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Perihal / Subjek</TableHead>
              <TableHead>Waktu Masuk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#2d2410]">
                      {item.senderName}
                    </span>
                    <span className="text-xs text-[#7d7152]">
                      {item.email} • {item.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant="neutral">{item.category}</Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {item.subject}
                    </span>
                    <span className="text-xs text-slate-500 line-clamp-1">
                      {item.message}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-slate-500">
                  {item.date}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    variant={
                      item.status === "Selesai"
                        ? "success"
                        : item.status === "Diproses"
                        ? "info"
                        : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedMessage(item)}
                    >
                      Buka & Balas
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setMessages(messages.filter((m) => m.id !== item.id))
                      }
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

      {/* Modal Balas Pesan */}
      {selectedMessage && (
        <Modal
          isOpen={Boolean(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
          title="Detail & Tanggapan Pesan"
          description={`Pengirim: ${selectedMessage.senderName} (${selectedMessage.email})`}
          maxWidth="lg"
          footer={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => setSelectedMessage(null)}
              >
                Tutup
              </Button>
              <Button
                variant="gold"
                type="button"
                onClick={handleReplySubmit}
              >
                Kirimkan Balasan
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#2d2410]">
                  {selectedMessage.subject}
                </span>
                <Badge variant="neutral">{selectedMessage.category}</Badge>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </p>
            </div>

            <Textarea
              label="Tanggapan / Jawaban Resmi Dinas"
              placeholder="Tuliskan jawaban atau disposisi untuk pemohon..."
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Modal Catat Pesan Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Pesan / Aspirasi Baru"
        description="Dokumentasikan pesan masuk dari loket, telepon, atau kanal offline."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="gold" type="submit" form="form-kontak">
              Simpan Pesan
            </Button>
          </>
        }
      >
        <form id="form-kontak" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Pengirim"
            placeholder="Nama lengkap pemohon atau instansi..."
            required
            value={formData.senderName}
            onChange={(e) =>
              setFormData({ ...formData, senderName: e.target.value })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="email@domain.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="No. Telepon / WhatsApp"
              placeholder="08xx-xxxx-xxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Perihal / Subjek"
              placeholder="Contoh: Permohonan Konsultasi BOS"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
            <Select
              label="Kategori"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ContactMessage["category"],
                })
              }
              options={[
                { value: "Aspirasi / Saran", label: "Aspirasi / Saran" },
                { value: "Permohonan Informasi", label: "Permohonan Informasi" },
                { value: "Pengaduan", label: "Pengaduan Layanan" },
                { value: "Umum", label: "Umum" },
              ]}
            />
          </div>

          <Textarea
            label="Isi Pesan"
            placeholder="Tuliskan isi pesan atau pokok pengaduan..."
            rows={4}
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
