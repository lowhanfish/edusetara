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
  content?: string;
  featured: boolean;
}

const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital dalam Pembelajaran di Sekolah",
    slug: "teknologi-pembelajaran-sekolah",
    category: "Pendidikan",
    excerpt: "Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan mempercepat digitalisasi ruang kelas.",
    author: "Tim Publikasi & Media",
    date: "05 Sep 2026",
    status: "Terbit",
    image: "/img/pendidikan-jenjang.jpg",
    featured: true,
  },
  {
    id: "news-2",
    title: "Pelestarian Seni Musik Tradisional Tolaki Melalui Pembinaan Ekstrakurikuler Sekolah",
    slug: "pelestarian-seni-musik-tolaki",
    category: "Kebudayaan",
    excerpt: "Gamelan bambu dan tarian lulo khas Tolaki kini masuk sebagai muatan lokal unggulan sekolah dasar.",
    author: "Bidang Kebudayaan",
    date: "28 Agu 2026",
    status: "Terbit",
    image: "/img/kebudayaan-sanggar.jpg",
    featured: false,
  },
  {
    id: "news-3",
    title: "Diseminasi Praktik Baik Pembelajaran Berdiferensiasi Jenjang SMP se-Konawe Selatan",
    slug: "diseminasi-pembelajaran-berdiferensiasi",
    category: "GTK & Guru",
    excerpt: "Ratusan guru mata pelajaran berkumpul di Andoolo untuk berbagi strategi asesmen formatif adaptif.",
    author: "Kelompok Kerja Guru (KKG)",
    date: "14 Agu 2026",
    status: "Draft",
    image: "/img/pendidikan-gtk.jpg",
    featured: false,
  },
  {
    id: "news-4",
    title: "Revitalisasi Ruang Kelas & Laboratorium IPA 15 SMP Negeri Tuntas Sebelum Tahun Ajaran Baru",
    slug: "revitalisasi-lab-smp",
    category: "Sarana Prasarana",
    excerpt: "Peningkatan mutu fisik sarana pendidikan Konawe Selatan berlanjut di semester ganjil tahun ini.",
    author: "Bidang Sarpras Dikbud",
    date: "02 Agu 2026",
    status: "Terbit",
    image: "/img/pendidikan-jenjang.jpg",
    featured: false,
  },
];

export default function BeritaAdminPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Pendidikan" as NewsItem["category"],
    author: "Humas Dikbud Konsel",
    excerpt: "",
    content: "",
    image: "/img/pendidikan-jenjang.jpg",
    status: "Terbit" as NewsItem["status"],
    featured: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, title: val, slug: generatedSlug }));
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: formData.title,
      slug: formData.slug || `berita-${Date.now()}`,
      category: formData.category,
      excerpt: formData.excerpt || formData.title,
      author: formData.author,
      date: "17 Sep 2026",
      status: formData.status,
      image: formData.image,
      content: formData.content,
      featured: formData.featured,
    };

    setNewsList([newItem, ...newsList]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      slug: "",
      category: "Pendidikan",
      author: "Humas Dikbud Konsel",
      excerpt: "",
      content: "",
      image: "/img/pendidikan-jenjang.jpg",
      status: "Terbit",
      featured: false,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      setNewsList(newsList.filter((item) => item.id !== id));
    }
  };

  const filteredNews = newsList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === "Semua" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Berita"
        description="Kelola publikasi warta, liputan kegiatan, dan dokumentasi pendidikan & kebudayaan Kabupaten Konawe Selatan."
        badge={<Badge variant="gold">{newsList.length} Artikel</Badge>}
        action={
          <Button
            variant="gold"
            icon="✍️"
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Berita
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Cari judul berita atau penulis..."
            leftIcon="🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#052552] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul & Ringkasan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNews.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  Tidak ada artikel yang sesuai dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[#052552] line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-xs text-[#58708d] line-clamp-1">
                        {item.excerpt}
                      </span>
                      {item.featured && (
                        <span className="inline-block text-[10px] text-amber-700 font-bold">
                          ★ Berita Utama (Featured)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="neutral">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-slate-600">
                    {item.author}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-slate-500">
                    {item.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant={item.status === "Terbit" ? "success" : "warning"}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Edit artikel: ${item.title}`)}
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
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Tambah Berita */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Berita Baru"
        description="Lengkapi formulir di bawah ini untuk menerbitkan artikel warta ke portal website publik."
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
              form="form-berita"
            >
              Simpan & Terbitkan
            </Button>
          </>
        }
      >
        <form
          id="form-berita"
          onSubmit={handleCreateNews}
          className="space-y-4"
        >
          <Input
            label="Judul Berita"
            placeholder="Masukkan judul berita yang menarik..."
            required
            value={formData.title}
            onChange={handleTitleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Slug URL"
              placeholder="otomatis-dari-judul"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              helperText="URL halaman berita: /berita/[slug]"
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
              label="Sumber"
              placeholder="Misal: Humas Sekolah, Dinas Pendidikan"
              required
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
            label="Deskripsi (Ringkasan)"
            placeholder="Ringkasan singkat 1-2 kalimat yang tampil pada kartu beranda..."
            rows={2}
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
          />

          <Input
            label="Foto"
            placeholder="URL / nama berkas, misal: prestasi_olimpiade_sains_2026.jpg"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            helperText="Berkas gambar banner/thumbnail berita atau URL foto"
          />

          <Textarea
            label="Isi Berita"
            placeholder="Tuliskan isi berita lengkap di sini..."
            rows={5}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
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
              className="text-xs font-semibold text-[#052552] cursor-pointer"
            >
              Jadikan sebagai Berita Utama (Tampil di carousel/highlight beranda)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
