import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CultureHero, CultureNavigation, CultureHelp } from "../_components/culture-shell";

export const metadata: Metadata = {
  title: "Sanggar & Komunitas Seni | Dikbud Konawe Selatan",
  description:
    "Direktori sanggar tari, kelompok musik tradisional, komunitas kriya tenun, alur pendaftaran Nomor Induk Kesenian (NIK), dan pembinaan seni budaya di Konawe Selatan.",
};

const communityMetrics = [
  {
    id: "active-studios",
    label: "Sanggar Seni Terdaftar",
    value: "42 Sanggar",
    sub: "Memiliki NIK resmi dinas",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "artists-count",
    label: "Pelaku Seni & Pelajar",
    value: "1.250+",
    sub: "Seniman tari, musik, kriya",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "art-branches",
    label: "Cabang Kesenian",
    value: "5 Cabang",
    sub: "Tari, musik, kriya, sastra, teater",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    id: "service-fee",
    label: "Layanan NIK Daerah",
    value: "Gratis 100%",
    sub: "Fasilitasi legalitas resmi",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const studioCategories = [
  {
    id: "tari",
    title: "Sanggar Seni Tari Tradisional & Kreasi",
    badge: "Seni Tari",
    desc: "Pembinaan dan regenerasi penari muda untuk ragam tari pergaulan Lulo, tari sakral Mondotambe, tari prajurit, serta eksplorasi karya koreografi kreasi berakar tradisi.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    details: [
      "Jadwal latihan rutin di sanggar binaan kecamatan",
      "Workshop koreografi dan tata rias busana adat daerah",
      "Prioritas penampil dalam festival dan penyambutan kenegaraan",
    ],
  },
  {
    id: "musik",
    title: "Kelompok Musik Etnik & Karawitan Tradisi",
    badge: "Seni Musik",
    desc: "Wadah musisi dan pengrawit tradisional dalam melestarikan tabuhan instrumen Kanda Wuta, perangkat gong perunggu, gendang dimba, gambus etnik, dan suling bambu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    details: [
      "Perawatan dan konservasi fisik instrumen musik antik",
      "Eksplorasi aransemen musik etnik kolaboratif pelajar",
      "Fasilitasi rekaman dokumentasi lagu-lagu rakyat Tolaki",
    ],
  },
  {
    id: "kriya",
    title: "Komunitas Tenun & Kerajinan Tangan",
    badge: "Kriya Rakyat",
    desc: "Kelompok perajin tenun tradisional khas Konawe Selatan, perajin anyaman rotan dan serat bambu, perajin kriya kayu ukir, serta perkakas besi tradisional daerah.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    details: [
      "Pelatihan teknik pewarnaan alami ramah lingkungan",
      "Bantuan sarana alat tenun bukan mesin (ATBM) daerah",
      "Pameran produk kriya dalam etalase ekonomi kreatif",
    ],
  },
  {
    id: "sastra",
    title: "Paguyuban Sastra Lisan & Adat Tolaki",
    badge: "Bahasa & Sastra",
    desc: "Komunitas penutur sastra tutur Taenua, peribahasa adat, pelantun syair leluhur, dan forum guru bahasa daerah untuk melestarikan bahasa ibu masyarakat setempat.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    details: [
      "Digitalisasi manuskrip dan naskah kuno lisan daerah",
      "Penyusunan modul ajar muatan lokal bahasa daerah",
      "Festival mendongeng dan lomba pidato bahasa daerah",
    ],
  },
];

const upcomingWorkshops = [
  {
    date: "14 – 16 Oktober 2026",
    title: "Bimtek Manajemen Organisasi & Pendataan Digital Sanggar Seni",
    location: "Aula Dinas Dikbud Konsel · Andoolo",
    target: "Ketua & Sekretaris Sanggar se-Kabupaten",
    status: "Pendaftaran Dibuka",
  },
  {
    date: "28 – 30 Oktober 2026",
    title: "Workshop Koreografi Tari Tradisi Tingkat Pelajar SMP",
    location: "Gedung Olah Seni Konawe Selatan",
    target: "Pembina Seni Sekolah & Koreografer Muda",
    status: "Segera Hadir",
  },
  {
    date: "11 – 13 November 2026",
    title: "Pelatihan Konservasi & Teknik Menabuh Instrumen Kanda Wuta",
    location: "Sanggar Seni Wonua Tolaki · Konda",
    target: "Pengrawit Musik Etnik & Pelajar",
    status: "Jadwal Terbit",
  },
  {
    date: "02 – 04 Desember 2026",
    title: "Temu Dialog Kebudayaan & Gelar Karya Komunitas Seni 2026",
    location: "Panggung Terbuka Ranomeeto",
    target: "Seniman, Budayawan, & Masyarakat Luas",
    status: "Rencana",
  },
];

const digitalPortals = [
  {
    name: "Pengajuan NIK Sanggar",
    desc: "Layanan mandiri pendaftaran Nomor Induk Kesenian bagi kelompok seni daerah.",
    href: "/tentang-kami/standar-pelayanan",
    action: "Pelajari Persyaratan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    name: "Data Pokok Kebudayaan (Dapobud)",
    desc: "Portal satu data kebudayaan terintegrasi kementerian untuk sanggar dan cagar budaya.",
    href: "https://dapobud.kemdikbud.go.id",
    action: "Buka Dapobud",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: "Konsultasi Legalitas Komunitas",
    desc: "Bantuan konsultasi akta pendirian, rekomendasi pentas seni, dan fasilitasi.",
    href: "/tentang-kami/kontak",
    action: "Hubungi Petugas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    name: "Agenda Pekan Kebudayaan",
    desc: "Daftar gelaran festival kesenian dan jadwal seleksi penampil daerah tahun 2026.",
    href: "/kebudayaan/agenda-festival",
    action: "Lihat Agenda Budaya",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function CultureCommunitiesPage() {
  return (
    <>
      <CultureHero
        current="Sanggar & Komunitas Seni"
        title="Menghidupkan ruang kreasi, memberdayakan pelaku seni."
        description="Layanan fasilitasi legalitas Nomor Induk Kesenian (NIK), pembinaan sanggar seni daerah, bantuan sarana prasarana kesenian, dan penyediaan ruang ekspresi budaya bagi generasi muda Konawe Selatan."
        status="Registrasi Sanggar 2026"
        subStatus="42 Sanggar Seni Terdaftar"
        tags={["Nomor Induk Kesenian (NIK)", "Sanggar Tari & Musik", "Generasi Muda"]}
      />
      <CultureNavigation active="culture-communities" />

      <div className="container service-content quick-glass-content culture-glass-content">
        {/* Section 1: Ringkasan Metrik Komunitas Seni */}
        <section className="service-section" aria-labelledby="community-stats-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Ekosistem Kesenian Daerah</p>
              <h2 id="community-stats-heading">Potret Komunitas &amp; Pelaku Seni Binaan</h2>
            </div>
            <p>Data terintegrasi kelompok kesenian terdaftar dinas di 25 kecamatan se-Kabupaten Konawe Selatan.</p>
          </div>

          <div className="edu-stats-grid">
            {communityMetrics.map((item) => (
              <div className={`edu-stat-card tone-${item.tone}`} key={item.id}>
                <span className="edu-stat-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="edu-stat-body">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 4 Kategori Kelompok Seni Budaya */}
        <section className="service-section" aria-labelledby="categories-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Klasifikasi Sanggar Binaan</p>
              <h2 id="categories-heading">Empat Bidang Kesenian &amp; Komunitas Budaya</h2>
            </div>
            <p>Fasilitasi pembinaan terarah untuk memastikan regenerasi seniman dan kesinambungan tradisi.</p>
          </div>

          <div className="edu-gtk-grid">
            {studioCategories.map((cat) => (
              <article className="edu-gtk-card" key={cat.id}>
                <div className="gtk-card-top-row">
                  <span className="gtk-icon-wrap" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className="gtk-badge-pill">{cat.badge}</span>
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <ul className="gtk-points-list">
                  {cat.details.map((d, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Visual Showcase & Alur Pendaftaran NIK */}
        <section className="service-section" aria-labelledby="nik-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Legalitas & Pemberdayaan</p>
              <h2 id="nik-heading">Pendaftaran Nomor Induk Kesenian (NIK) Daerah</h2>
            </div>
            <p>Pengakuan resmi keabsahan sanggar seni sebagai mitra kebudayaan pemerintah daerah.</p>
          </div>

          <div className="edu-kombel-showcase">
            <div className="edu-photo-card">
              <Image
                src="/img/kebudayaan-sanggar.jpg"
                alt="Generasi muda dan seniman Konawe Selatan berlatih instrumen musik tradisional gong dan dimba di sanggar seni"
                width={700}
                height={450}
                className="edu-photo-img"
              />
              <div className="edu-photo-overlay">
                <span>✦ Sanggar Seni Binaan</span>
                <strong>Kolaborasi Seni Generasi Muda</strong>
                <p>Latihan bersama instrumen musik etnik menumbuhkan rasa bangga dan memelihara akar budaya lokal.</p>
              </div>
            </div>

            <div className="edu-kombel-card">
              <div>
                <h3>Prosedur 3 Langkah Penerbitan NIK Sanggar</h3>
                <p>
                  Nomor Induk Kesenian (NIK) memberikan kepastian status hukum bagi sanggar seni untuk memperoleh bantuan pembinaan sarana prasarana, fasilitasi pementasan, dan sertifikasi pentas resmi.
                </p>

                <div className="kombel-values-grid">
                  <div className="kombel-val-box">
                    <strong>1. Pengajuan Berkas</strong>
                    <small>Menyerahkan susunan pengurus, domisili, dan profil karya.</small>
                  </div>
                  <div className="kombel-val-box">
                    <strong>2. Verifikasi Lapang</strong>
                    <small>Pengecekan aktivitas latihan dan inventaris alat musik.</small>
                  </div>
                  <div className="kombel-val-box">
                    <strong>3. Penerbitan SK</strong>
                    <small>Penetapan piagam NIK resmi dinas tanpa biaya retribusi.</small>
                  </div>
                </div>
              </div>

              <div className="kombel-action-row">
                <span>Konsultasi Berkas NIK Sanggar Kesenian</span>
                <Link href="/tentang-kami/standar-pelayanan" className="button primary">
                  Lihat Standar Layanan <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Agenda Pelatihan & Lokakarya Kesenian 2026 */}
        <section className="service-section" aria-labelledby="workshops-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Penguatan Kapasitas Seniman</p>
              <h2 id="workshops-heading">Jadwal Workshop &amp; Bimtek Kesenian 2026</h2>
            </div>
            <p>Program pembinaan teknis manajemen sanggar dan peningkatan keterampilan seni bagi pelaku budaya daerah.</p>
          </div>

          <div className="edu-workshops-grid">
            {upcomingWorkshops.map((ws, i) => (
              <article className="edu-workshop-card" key={i}>
                <div className="ws-head">
                  <span className="ws-date-text">{ws.date}</span>
                  <span className="ws-status-pill">{ws.status}</span>
                </div>
                <h3>{ws.title}</h3>
                <div className="ws-meta-box">
                  <div className="ws-meta-line">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{ws.location}</span>
                  </div>
                  <div className="ws-meta-line">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>{ws.target}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 5: Portal Layanan Digital Kesenian */}
        <section className="service-section" aria-labelledby="portals-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Kanal Layanan Resmi</p>
              <h2 id="portals-heading">Pusat Layanan Fasilitasi Komunitas Seni</h2>
            </div>
            <p>Pintasan cepat untuk pengurusan dokumen perizinan, pendaftaran sanggar, dan konsultasi cagar budaya.</p>
          </div>

          <div className="edu-portals-grid">
            {digitalPortals.map((portal) => (
              <article className="edu-portal-card" key={portal.name}>
                <div className="portal-icon-rail" aria-hidden="true">
                  {portal.icon}
                </div>
                <h3>{portal.name}</h3>
                <p>{portal.desc}</p>
                <Link
                  href={portal.href}
                  className="edu-portal-btn"
                >
                  <span>{portal.action}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <CultureHelp />
      </div>
    </>
  );
}
