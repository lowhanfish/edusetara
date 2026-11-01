import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero, ServiceNavigation, ServiceHelp } from "./components/service-shell";

export const metadata: Metadata = {
  title: "Layanan Berdasarkan Pengguna",
  description:
    "Temukan layanan pendidikan bagi siswa, orang tua, guru, sekolah, operator, dan masyarakat Kabupaten Konawe Selatan.",
};

interface AudienceGroup {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  links: { label: string; href: string }[];
  note: string;
}

const groups: AudienceGroup[] = [
  {
    id: "siswa-orang-tua",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Siswa & Orang Tua",
    description:
      "Informasi untuk mendampingi perjalanan belajar anak dan mengenal profil sekolah di wilayah Anda.",
    links: [
      { label: "Cari direktori sekolah di wilayah Anda", href: "/layanan-publik/cari-sekolah" },
      { label: "Konsultasi kebutuhan & administrasi siswa", href: "/tentang-kami/kontak" },
      { label: "Tanya jawab seputar bantuan & layanan", href: "/layanan-publik/layanan-cepat#faq" },
    ],
    note: "Untuk pertanyaan tentang siswa, siapkan nama sekolah dan pokok kebutuhan Anda.",
  },
  {
    id: "guru-gtk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Guru & Tenaga Kependidikan",
    description:
      "Akses informasi pemutakhiran data, regulasi pendidikan, sertifikasi, dan fasilitasi bagi guru dan tenaga pendidik.",
    links: [
      { label: "Panduan dan pemutakhiran data Dapodik", href: "/layanan-publik/layanan-cepat#dapodik" },
      { label: "Telusuri produk hukum & regulasi pendidikan", href: "/layanan-publik/layanan-cepat#regulasi" },
      { label: "Hubungi layanan konsultasi GTK", href: "/tentang-kami/kontak" },
    ],
    note: "Untuk kendala pendataan, catat bagian data yang perlu diperiksa bersama operator sekolah.",
  },
  {
    id: "sekolah",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Satuan Pendidikan",
    description:
      "Rujukan tata kelola administrasi kelembagaan sekolah, kepatuhan standar pelayanan, dan dokumen dinas.",
    links: [
      { label: "Standar dan alur pelayanan kelembagaan", href: "/tentang-kami/standar-pelayanan" },
      { label: "Unduhan dokumen dan panduan resmi", href: "/layanan-publik/layanan-cepat#unduhan" },
      { label: "Periksa data referensi sekolah", href: "/layanan-publik/cari-sekolah" },
    ],
    note: "Siapkan NPSN dan nomor surat dinas, bila ada, untuk memudahkan konsultasi cepat.",
  },
  {
    id: "operator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Operator Satuan Pendidikan",
    description:
      "Tautan pendataan sinkronisasi Dapodik dan panduan teknis pengelolaan data pokok pendidikan.",
    links: [
      { label: "Buka portal resmi Dapodik Kemendikdasmen", href: "/layanan-publik/layanan-cepat#dapodik" },
      { label: "Unduhan aplikasi, patch, dan panduan", href: "/layanan-publik/layanan-cepat#unduhan" },
      { label: "Pusat bantuan kendala pendataan", href: "/tentang-kami/kontak" },
    ],
    note: "Catat kode error dan langkah yang sudah dicoba. Jangan pernah membagikan kata sandi akun.",
  },
  {
    id: "masyarakat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Masyarakat & Pelaku Budaya",
    description:
      "Akses informasi publik, kanal aspirasi/pengaduan, serta konsultasi pelestarian seni budaya daerah.",
    links: [
      { label: "Kanal penyampaian pengaduan & aspirasi", href: "/layanan-publik/layanan-cepat#pengaduan" },
      { label: "Maklumat dan komitmen standar pelayanan", href: "/tentang-kami/standar-pelayanan" },
      { label: "Konsultasi program pendidikan & kebudayaan", href: "/tentang-kami/kontak" },
    ],
    note: "Sampaikan pokok pertanyaan secara ringkas agar petugas kami dapat segera membantu.",
  },
];

export default function PublicServicesPage() {
  return (
    <>
      <ServiceHero
        current="Layanan Berdasarkan Pengguna"
        title="Mulai dari siapa Anda. Kami arahkan layanannya."
        description="Jalur cepat untuk siswa, orang tua, pendidik, satuan pendidikan, operator, dan masyarakat yang membutuhkan layanan Dikbud Konawe Selatan."
        variant="glass"
      />
      <ServiceNavigation active="service-by-audience" />

      <div className="container service-content quick-glass-content audience-glass-content">
        <section className="service-section" aria-labelledby="audience-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Pilih profil pengguna</p>
              <h2 id="audience-heading">Satu pintu, jalur yang lebih jelas.</h2>
            </div>
            <p>Setiap profil berisi tiga rute utama yang paling sering dibutuhkan.</p>
          </div>

          <div className="public-audience-grid">
            {groups.map((group, index) => (
              <article className="public-service-card audience-card" key={group.id} id={group.id}>
                <div className="audience-card-head">
                  <span className="public-card-icon" aria-hidden="true">{group.icon}</span>
                  <span className="audience-index">0{index + 1}</span>
                </div>
                <div className="audience-card-copy">
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <ul className="public-link-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <span>{link.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="public-card-note"><strong>Siapkan sebelum mulai</strong>{group.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="service-process">
          <div>
            <p className="section-kicker">Cara menggunakan portal</p>
            <h2>Dari kebutuhan menuju layanan.</h2>
            <p>Alur sederhana untuk membantu Anda sampai ke kanal resmi tanpa berputar-putar.</p>
          </div>
          <ol className="service-process-list">
            <li>
              <span>1</span>
              <div>
                <strong>Kenali jalur Anda</strong>
                <small>Pilih profil pengguna yang paling mendekati kebutuhan.</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Periksa persiapan</strong>
                <small>Baca catatan dan siapkan identitas atau dokumen pendukung.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Lanjutkan ke layanan</strong>
                <small>Buka portal rujukan atau hubungi petugas bila perlu arahan.</small>
              </div>
            </li>
          </ol>
        </section>

        <ServiceHelp />
      </div>
    </>
  );
}
