"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Input,
  Modal,
  PageHeader,
  Pagination,
  RichTextEditor,
  Select,
  Textarea,
} from "../../_components/ui";
import { Icon } from "../../_components/admin-icons";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: "Pendidikan" | "Kebudayaan" | "GTK & Guru" | "Sarana Prasarana" | "Prestasi Siswa";
  excerpt: string;
  author: string;
  date: string;
  status: "Terbit" | "Draft";
  image: string;
  content: string;
  featured: boolean;
}

const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital dalam Pembelajaran di Sekolah",
    slug: "teknologi-pembelajaran-sekolah",
    category: "Pendidikan",
    excerpt: "Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan mempercepat digitalisasi ruang kelas dan pemanfaatan Chromebook.",
    author: "Tim Publikasi & Media",
    date: "05 Sep 2026",
    status: "Terbit",
    image: "/img/pendidikan-jenjang.jpg",
    content: `
      <p>Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan dan Kebudayaan terus mendorong integrasi teknologi informasi dan komunikasi ke dalam aktivitas belajar mengajar di seluruh satuan pendidikan jenjang SD dan SMP.</p>
      <h2>Pemanfaatan Perangkat Digital dan Platform Merdeka Mengajar</h2>
      <p>Melalui pengadaan perangkat Chromebook dan penguatan jaringan internet sekolah, para pendidik didorong mengadopsi pembelajaran berbasis multimedia interaktif.</p>
      <ul>
        <li>Pemberdayaan laboratorium komputer untuk asesmen formatif adaptif.</li>
        <li>Pelatihan pemanfaatan akun belajar.id bagi guru kelas dan mata pelajaran.</li>
        <li>Integrasi materi ajar kontekstual berbasis kearifan lokal Konawe Selatan.</li>
      </ul>
      <blockquote>"Digitalisasi pendidikan bukan sekadar menyediakan gawai pintar, melainkan mengubah paradigma pembelajaran menjadi lebih menyenangkan, interaktif, dan berpusat pada murid," tegas Kepala Dinas.</blockquote>
      <p>Langkah ini diharapkan dapat mempercepat pemerataan mutu pendidikan hingga ke sekolah-sekolah di wilayah terpencil.</p>
    `,
    featured: true,
  },
  {
    id: "news-2",
    title: "Pelestarian Seni Musik Tradisional Tolaki Melalui Pembinaan Ekstrakurikuler Sekolah",
    slug: "pelestarian-seni-musik-tolaki",
    category: "Kebudayaan",
    excerpt: "Gamelan bambu dan tarian lulo khas Tolaki kini masuk sebagai muatan lokal unggulan sekolah dasar di Konawe Selatan.",
    author: "Bidang Kebudayaan",
    date: "28 Agu 2026",
    status: "Terbit",
    image: "/img/kebudayaan-sanggar.jpg",
    content: `
      <p>Dinas Pendidikan dan Kebudayaan Konawe Selatan meluncurkan program pembinaan seni tradisi suku Tolaki di lingkungan satuan pendidikan dasar.</p>
      <h2>Pengenalan Nilai Luhur Budaya Sejak Usia Dini</h2>
      <p>Kegiatan ini mencakup pelatihan memainkan alat musik tradisional gamelan bambu dan tarian lulo persahabatan yang menjadi ciri khas kebersamaan masyarakat Tolaki.</p>
      <blockquote>"Generasi muda Konawe Selatan harus bangga akan akar budayanya sendiri di tengah arus globalisasi," ujar Kepala Bidang Kebudayaan.</blockquote>
    `,
    featured: false,
  },
  {
    id: "news-3",
    title: "Diseminasi Praktik Baik Pembelajaran Berdiferensiasi Jenjang SMP se-Konawe Selatan",
    slug: "diseminasi-pembelajaran-berdiferensiasi",
    category: "GTK & Guru",
    excerpt: "Ratusan guru mata pelajaran berkumpul di Andoolo untuk berbagi strategi asesmen formatif adaptif Kurikulum Merdeka.",
    author: "Kelompok Kerja Guru (KKG)",
    date: "14 Agu 2026",
    status: "Draft",
    image: "/img/pendidikan-gtk.jpg",
    content: `
      <p>Forum KKG dan MGMP tingkat Kabupaten Konawe Selatan mengadakan diseminasi praktik baik untuk mendalami metode pembelajaran berdiferensiasi.</p>
      <p>Fokus utama adalah mengenali kebutuhan minat, bakat, dan kesiapan belajar masing-masing siswa di dalam kelas.</p>
    `,
    featured: false,
  },
  {
    id: "news-4",
    title: "Revitalisasi Ruang Kelas & Laboratorium IPA 15 SMP Negeri Tuntas Sebelum Tahun Ajaran Baru",
    slug: "revitalisasi-lab-smp",
    category: "Sarana Prasarana",
    excerpt: "Peningkatan mutu fisik sarana pendidikan Konawe Selatan berlanjut di semester ganjil tahun ini melalui alokasi DAK Fisik.",
    author: "Bidang Sarpras Dikbud",
    date: "02 Agu 2026",
    status: "Terbit",
    image: "/img/pendidikan-jenjang.jpg",
    content: `
      <p>Sebanyak 15 laboratorium IPA dan ruang kelas baru di sejumlah SMP Negeri telah selesai direvitalisasi dan siap digunakan pada tahun ajaran baru.</p>
      <p>Pekerjaan mencakup perbaikan atap, instalasi listrik laboratorium, dan penyediaan meja praktikum standar nasional.</p>
    `,
    featured: false,
  },
];

const emptyFormData = {
  title: "",
  slug: "",
  category: "Pendidikan" as NewsItem["category"],
  author: "Humas Dikbud Konsel",
  excerpt: "",
  content: "",
  image: "/img/pendidikan-jenjang.jpg",
  status: "Terbit" as NewsItem["status"],
  featured: false,
};

export default function BeritaAdminPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  // Modal Create / Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  // Modal Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : generatedSlug,
    }));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyFormData);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      author: item.author,
      excerpt: item.excerpt,
      content: item.content || item.excerpt,
      image: item.image,
      status: item.status,
      featured: item.featured,
    });
    setIsModalOpen(true);
  };

  const handleOpenPreview = (item: NewsItem) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const handlePreviewCurrentForm = () => {
    const draftItem: NewsItem = {
      id: editingId || `preview-${Date.now()}`,
      title: formData.title || "Judul Pratinjau Berita",
      slug: formData.slug || "pratinjau-berita",
      category: formData.category,
      author: formData.author || "Penulis",
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: formData.status,
      excerpt: formData.excerpt || formData.title,
      content: formData.content || "<p>Belum ada isi konten berita...</p>",
      image: formData.image || "/img/pendidikan-jenjang.jpg",
      featured: formData.featured,
    };
    setPreviewItem(draftItem);
    setIsPreviewOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: formData.title,
                slug: formData.slug || item.slug,
                category: formData.category,
                author: formData.author,
                excerpt: formData.excerpt || formData.title,
                content: formData.content,
                image: formData.image,
                status: formData.status,
                featured: formData.featured,
              }
            : item
        )
      );
    } else {
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        title: formData.title,
        slug: formData.slug || `berita-${Date.now()}`,
        category: formData.category,
        excerpt: formData.excerpt || formData.title,
        author: formData.author,
        date: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: formData.status,
        image: formData.image,
        content: formData.content,
        featured: formData.featured,
      };
      setNewsList([newItem, ...newsList]);
    }

    setIsModalOpen(false);
    setFormData(emptyFormData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel berita ini?")) {
      setNewsList((prev) => prev.filter((item) => item.id !== id));
      if (previewItem?.id === id) {
        setIsPreviewOpen(false);
        setPreviewItem(null);
      }
    }
  };

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredNews = newsList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === "Semua" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const paginatedNews = filteredNews.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Manajemen Berita"
        description="Kelola publikasi warta, liputan kegiatan, dan dokumentasi pendidikan & kebudayaan Kabupaten Konawe Selatan."
        badge={<Badge variant="gold">{newsList.length} Artikel</Badge>}
        action={
          <Button
            variant="gold"
            icon={<Icon name="plus" size={16} />}
            onClick={handleOpenCreate}
          >
            Tambah Berita
          </Button>
        }
      />

      <Card className="border border-white/80 shadow-xs">
        {/* Filter & Search Bar di dalam Card */}
        <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 backdrop-blur-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari judul berita atau penulis..."
              leftIcon={<Icon name="search" size={16} />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {[
              "Semua",
              "Pendidikan",
              "Kebudayaan",
              "GTK & Guru",
              "Sarana Prasarana",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#2d2410] text-white shadow-2xs"
                    : "bg-white/60 text-slate-600 border border-white/80 hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Semantik Native HTML */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Judul & Ringkasan</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Kategori</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Penulis</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152]">Tanggal</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-center">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7d7152] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-transparent">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#7d7152] text-xs font-medium">
                    Tidak ada artikel yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginatedNews.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-xs align-middle max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#2d2410] line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-xs text-[#7d7152] line-clamp-1">
                          {item.excerpt}
                        </span>
                        {item.featured && (
                          <span className="inline-block text-[10px] text-amber-700 font-bold">
                            ★ Berita Utama (Featured)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-[#5e5133]">
                      {item.author}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-[#7d7152]">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle text-center whitespace-nowrap">
                      <Badge
                        variant={item.status === "Terbit" ? "success" : "warning"}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs align-middle whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Pratinjau / Preview Berita"
                          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100/60"
                          onClick={() => handleOpenPreview(item)}
                        >
                          <Icon name="eye" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Berita"
                          className="text-slate-600 hover:text-[#2d2410] hover:bg-slate-100"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Hapus Berita"
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Icon name="trash" size={15} />
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
            total={filteredNews.length}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </Card>

      {/* ── Modal Tambah / Ubah Berita ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Artikel Berita" : "Tambah Berita Baru"}
        description="Lengkapi formulir di bawah ini untuk menerbitkan artikel warta ke portal website publik."
        maxWidth="3xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              type="button"
              onClick={handlePreviewCurrentForm}
              className="text-amber-900 border-amber-300 hover:bg-amber-100/50"
            >
              <Icon name="eye" size={14} className="mr-1.5" />
              Pratinjau Draf
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button variant="gold" type="submit" form="form-berita">
                {editingId ? "Simpan Perubahan" : "Terbitkan Artikel"}
              </Button>
            </div>
          </div>
        }
      >
        <form id="form-berita" onSubmit={handleSaveNews} className="space-y-4">
          <Input
            label="Judul Berita"
            placeholder="Masukkan judul berita yang menarik..."
            value={formData.title}
            onChange={handleTitleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              placeholder="judul-berita-anda"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              helperText="URL publik: /berita/[slug]"
            />
            <Select
              label="Kategori Berita"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as NewsItem["category"],
                })
              }
              options={[
                { value: "Pendidikan", label: "Pendidikan" },
                { value: "Kebudayaan", label: "Kebudayaan" },
                { value: "GTK & Guru", label: "GTK & Guru" },
                { value: "Sarana Prasarana", label: "Sarana Prasarana" },
                { value: "Prestasi Siswa", label: "Prestasi Siswa" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Penulis / Redaksi"
              placeholder="Contoh: Tim Humas Dikbud"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
            />
            <Select
              label="Status Publikasi"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as NewsItem["status"],
                })
              }
              options={[
                { value: "Terbit", label: "Langsung Terbit (Published)" },
                { value: "Draft", label: "Simpan sebagai Draft" },
              ]}
            />
          </div>

          <Textarea
            label="Ringkasan / Kutipan Pembuka (Excerpt)"
            placeholder="Ringkasan singkat 1-2 kalimat yang tampil pada kartu beranda..."
            rows={2}
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
          />

          <FileInput
            label="Foto Sampul Utama Berita"
            accept="image/*"
            value={formData.image}
            onChange={(fileName) =>
              setFormData({ ...formData, image: fileName })
            }
            helperText="Unggah berkas foto dokumentasi atau banner berita (JPG, PNG, WebP)"
          />

          <RichTextEditor
            label="Isi Berita Lengkap"
            placeholder="Tuliskan berita lengkap dengan format paragraf, subjudul (H2/H3), daftar poin, dan gambar..."
            minHeight={260}
            value={formData.content}
            onChange={(html) =>
              setFormData({ ...formData, content: html })
            }
            helperText="Gunakan toolbar di atas untuk memformat teks, menambahkan subjudul, kutipan, tautan, atau menyisipkan foto di dalam naskah"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
            />
            <label
              htmlFor="featured-check"
              className="text-xs font-semibold text-[#2d2410] cursor-pointer"
            >
              Jadikan Berita Utama (Featured) di Banner Slider Beranda
            </label>
          </div>
        </form>
      </Modal>

      {/* ── Modal Pratinjau / Preview Berita (Full Size) ── */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Pratinjau Tampilan Berita (Layar Penuh)"
        description="Simulasi tampilan artikel persis seperti yang akan dibaca masyarakat di portal website publik."
        maxWidth="full"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2 text-xs text-[#7d7152]">
              <span className="font-semibold text-[#2d2410]">Tautan Publik:</span>
              <span className="font-mono bg-amber-100/60 text-amber-900 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                /berita/{previewItem?.slug || "..."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsPreviewOpen(false)}
              >
                Tutup Pratinjau
              </Button>
              {previewItem && (
                <>
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-amber-800 hover:bg-amber-100"
                    onClick={() => {
                      setIsPreviewOpen(false);
                      handleOpenEdit(previewItem);
                    }}
                  >
                    <Icon name="edit" size={14} className="mr-1.5" />
                    Edit Artikel Ini
                  </Button>
                  <Link
                    href={`/berita/${previewItem.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#f5b82e] hover:bg-[#e0a41d] text-[#241e12] shadow-xs transition-colors"
                  >
                    <span>Buka Halaman Publik</span>
                    <Icon name="external" size={13} />
                  </Link>
                </>
              )}
            </div>
          </div>
        }
      >
        {previewItem && (
          <div className="max-w-5xl mx-auto space-y-6 py-2 px-1 sm:px-4">
            {/* Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <Badge variant="gold">{previewItem.category}</Badge>
                <Badge
                  variant={
                    previewItem.status === "Terbit" ? "success" : "warning"
                  }
                >
                  {previewItem.status}
                </Badge>
                {previewItem.featured && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-400/20 px-2.5 py-0.5 rounded-md">
                    ★ Berita Utama
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#7d7152]">
                <span className="flex items-center gap-1">
                  <Icon name="calendar" size={13} className="text-amber-600" />
                  {previewItem.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-[#2d2410]">
                  ✎ {previewItem.author}
                </span>
              </div>
            </div>

            {/* Headline Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2d2410] tracking-tight leading-snug">
              {previewItem.title}
            </h1>

            {/* Featured Hero Image */}
            {previewItem.image && (
              <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 bg-black/5 aspect-[16/9] max-h-[460px] w-full shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Lead Excerpt */}
            {previewItem.excerpt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 shadow-xs">
                <p className="text-sm sm:text-base font-semibold text-amber-950 italic leading-relaxed">
                  {previewItem.excerpt}
                </p>
              </div>
            )}

            {/* Full Rich Text Article Body */}
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#2d2410] leading-relaxed pt-2"
              dangerouslySetInnerHTML={{
                __html: previewItem.content || `<p>${previewItem.excerpt}</p>`,
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
