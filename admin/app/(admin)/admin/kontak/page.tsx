"use client";

import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { fetchData } from "@/lib/api_secure";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
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

export default function KontakAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form tambah pengaduan / pesan manual
  const [formData, setFormData] = useState({
    senderName: "",
    email: "",
    phone: "",
    subject: "",
    category: "Aspirasi / Saran" as ContactMessage["category"],
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const q = debouncedSearch.trim() ? `&search=${encodeURIComponent(debouncedSearch.trim())}` : "";
      const res = await fetchData<{ total: number; data: any[] }>(
        `/api/v1/admin/kontak/read?page=${page}&per_page=${pageSize}&skip=${skip}&limit=${pageSize}${q}`
      );

      if (res && Array.isArray(res.data)) {
        const mapped: ContactMessage[] = res.data.map((row: any) => ({
          id: row.id,
          senderName: row.nama || row.senderName || "",
          email: row.email || "-",
          phone: row.phone || "-",
          subject: row.subjek || row.subject || "Pesan Langsung",
          category: (row.kategori || row.category || "Aspirasi / Saran") as ContactMessage["category"],
          message: row.pesan || row.message || "",
          date: row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Hari ini",
          status: (row.status || "Belum Dibalas") as ContactMessage["status"],
        }));

        const filteredByStatus = statusFilter === "Semua" ? mapped : mapped.filter(m => m.status === statusFilter);
        setMessages(filteredByStatus);
        setTotalCount(res.total ?? mapped.length);
      }
    } catch (err: any) {
      console.error("Gagal memuat pesan masuk:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.message) return;

    const payload = {
      nama: formData.senderName,
      email: formData.email || "-",
      phone: formData.phone || "-",
      subjek: formData.subject || "Pesan Langsung / Pengaduan",
      kategori: formData.category,
      pesan: formData.message,
      status: "Belum Dibalas",
    };

    try {
      await fetchData(`/api/v1/admin/kontak/create`, {
        method: "POST",
        body: payload,
      });

      Swal.fire({
        icon: "success",
        title: "Pesan Disimpan",
        text: "Pesan masuk baru telah dicatat ke sistem.",
        timer: 1800,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setFormData({
        senderName: "",
        email: "",
        phone: "",
        subject: "",
        category: "Aspirasi / Saran",
        message: "",
      });
      loadData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: err?.message || "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      await fetchData(`/api/v1/admin/kontak/update/${selectedMessage.id}`, {
        method: "PUT",
        body: {
          tanggapan: replyText,
          status: "Selesai",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Tanggapan Terkirim",
        text: `Tanggapan resmi telah disimpan untuk ${selectedMessage.senderName}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setSelectedMessage(null);
      setReplyText("");
      loadData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Tanggapan",
        text: err?.message || "Terjadi kesalahan sistem.",
      });
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    const result = await Swal.fire({
      title: "Hapus Pesan Masuk?",
      text: `Pesan dari "${senderName}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await fetchData(`/api/v1/admin/kontak/delete/${id}`, {
          method: "DELETE",
        });
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Pesan berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: err?.message || "Terjadi kesalahan saat menghapus pesan.",
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Kotak Pesan & Pengaduan Masuk"
        description="Kelola pesan masuk masyarakat, pertanyaan layanan, serta aspirasi publik yang masuk melalui portal Dikbud Konawe Selatan."
        badge={<Badge variant="gold">{totalCount} Pesan Masuk</Badge>}
        action={
          <Button variant="gold" icon="✉️" onClick={() => setIsModalOpen(true)}>
            Catat Pesan / Aspirasi Baru
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Toolbar Pencarian & Filter Status di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari pengirim, email, subjek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {["Semua", "Belum Dibalas", "Diproses", "Selesai"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#2d2410] text-white shadow-2xs"
                    : "bg-white/60 text-slate-600 border border-white/80 hover:bg-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Pengirim & Kontak</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Kategori</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Perihal / Subjek</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Waktu Masuk</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      Memuat pesan masuk...
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada pesan ditemukan.
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#2d2410]">
                          {item.senderName}
                        </span>
                        <span className="text-xs text-[#7d7152]">
                          {item.email} • {item.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {item.subject}
                        </span>
                        <span className="text-xs text-[#7d7152] line-clamp-1">
                          {item.message}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-[#7d7152]">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
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
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(item)}
                        >
                          Buka & Balas
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item.id, item.senderName)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginasi Terstandar */}
        <div className="px-6 py-4 bg-white/20 border-t border-white/60">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={totalCount}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
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
