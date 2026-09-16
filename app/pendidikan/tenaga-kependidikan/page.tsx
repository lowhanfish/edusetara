import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EducationHero, EducationNavigation, EducationHelp } from "../_components/education-shell";

export const metadata: Metadata = {
  title: "Pendidik & Tenaga Kependidikan | Dikbud Konawe Selatan",
  description:
    "Layanan pembinaan profesi guru, sertifikasi pendidik (PPG), formasi PPPK, Komunitas Belajar (Kombel), dan pengelolaan kinerja GTK Dikbud Konawe Selatan.",
};

const gtkMetrics = [
  {
    id: "total-teachers",
    label: "Total Guru & GTK",
    value: "6.315",
    sub: "PNS, PPPK, & Non-ASN",
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
    id: "academic-degree",
    label: "Kualifikasi S1/S2",
    value: "94.2%",
    sub: "Standar kualifikasi nasional",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    id: "certified-rate",
    label: "Sertifikasi Pendidik",
    value: "78.6%",
    sub: "Penerima TPG terverifikasi",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    id: "kombel-count",
    label: "Komunitas Belajar",
    value: "48 Kombel",
    sub: "Gugus aktif 25 kecamatan",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
];

const gtkPillars = [
  {
    id: "sertifikasi",
    badge: "Profesi & TPG",
    title: "Sertifikasi Pendidik & PPG",
    desc: "Fasilitasi verifikasi berkas PPG Dalam Jabatan, pendampingan uji kompetensi peserta PPG, serta verifikasi kelayakan penerima Tunjangan Profesi Guru (TPG).",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    details: [
      "Verifikasi berkas NUPTK dan linieritas ijazah",
      "Pencairan TPG triwulanan secara transparan",
      "Pendampingan uji kompetensi guru berkala",
    ],
  },
  {
    id: "pppk",
    badge: "Kepegawaian",
    title: "Formasi & Karir Guru ASN/PPPK",
    desc: "Penataan formasi kebutuhan guru satuan pendidikan, advokasi kuota pengadaan PPPK formasi guru daerah, serta layanan mutasi dan kenaikan jenjang fungsional.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    details: [
      "Pemetaan rasio kebutuhan guru per mapel",
      "Sosialisasi dan pemberkasan seleksi PPPK",
      "Pengusulan penetapan angka kredit jabatan guru",
    ],
  },
  {
    id: "kinerja",
    badge: "Akuntabilitas",
    title: "Pengelolaan Kinerja (PMM & BKN)",
    desc: "Integrasi perencanaan Sasaran Kinerja Pegawai (SKP) guru dan kepala sekolah melalui Platform Merdeka Mengajar yang terhubung langsung dengan sistem BKN.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    details: [
      "Praktik observasi kelas berbasis 8 indikator",
      "Pengembangan kompetensi melalui pelatihan mandiri",
      "Refleksi tindak lanjut peningkatan mutu belajar",
    ],
  },
  {
    id: "kesejahteraan",
    badge: "Kesejahteraan",
    title: "Tunjangan Khusus Guru Terpencil",
    desc: "Pemberian insentif tambahan bagi guru yang mengabdi di wilayah terpencil, kepulauan, dan perbatasan daerah Konawe Selatan sebagai bentuk apresiasi dedikasi.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    details: [
      "Verifikasi titik koordinat sekolah kategori khusus",
      "Penyaluran Tunjangan Khusus Guru (TKG) resmi",
      "Prioritas bantuan sarana rumah dinas guru pelosok",
    ],
  },
];

const upcomingWorkshops = [
  {
    date: "22 – 24 September 2026",
    title: "Bimtek Pemanfaatan Platform Digital & AI Edukasi",
    location: "Aula Pertemuan Dikbud Konsel · Andoolo",
    target: "Guru Kelas SD & Guru Informatika SMP",
    status: "Pendaftaran Dibuka",
  },
  {
    date: "06 – 08 Oktober 2026",
    title: "Workshop Penyusunan Modul Ajar Berdiferensiasi",
    location: "Gedung Guru Konawe Selatan",
    target: "Perwakilan Kombel Gugus Kecamatan",
    status: "Segera Hadir",
  },
  {
    date: "20 – 22 Oktober 2026",
    title: "Pelatihan Pengelolaan Anggaran BOSP Sekolah Berbasis Digital",
    location: "Hotel Wonua Monapa · Ranomeeto",
    target: "Kepala Sekolah & Bendahara BOS",
    status: "Jadwal Terbit",
  },
  {
    date: "10 – 12 November 2026",
    title: "Pembekalan Uji Kompetensi Kenaikan Jabatan Fungsional Guru",
    location: "Daring (Zoom Dikbud Konsel)",
    target: "Guru Golongan III/d ke IV/a",
    status: "Rencana",
  },
];

const digitalPortals = [
  {
    name: "Info GTK Kemendikbud",
    desc: "Cek validasi SKTP, beban jam mengajar mingguan, dan status pencairan tunjangan profesi.",
    href: "https://info.gtk.kemdikbud.go.id",
    action: "Buka Info GTK",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    name: "SIMPKB Layanan Guru",
    desc: "Akses Program Pendidikan Profesi Guru (PPG), Program Guru Penggerak, dan Diklat kedinasan.",
    href: "https://paspor-gtk.belajar.kemdikbud.go.id",
    action: "Login SIMPKB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    name: "Platform Merdeka Mengajar",
    desc: "Akses modul ajar, bukti karya inovatif, dan pengelolaan kinerja guru terintegrasi nasional.",
    href: "https://guru.kemdikbud.go.id",
    action: "Buka PMM",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    name: "E-Kinerja BKN",
    desc: "Sinkronisasi laporan kinerja aparatur sipil negara, matriks peran hasil, dan angka kredit.",
    href: "https://kinerja.bkn.go.id",
    action: "Buka E-Kinerja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export default function TeachersPage() {
  return (
    <>
      <EducationHero
        current="Pendidik & Tenaga Kependidikan"
        title="Mendorong pendidik profesional, sejahtera, dan berdaya."
        description="Layanan terpadu pembinaan karir guru, sertifikasi pendidik, formasi ASN PPPK, pengelolaan E-Kinerja, dan penguatan Komunitas Belajar (Kombel) di Kabupaten Konawe Selatan."
        status="6.315 Guru & GTK"
        subStatus="94.2% Kualifikasi S1/S2"
        tags={["Sertifikasi PPG", "Kombel Sekolah", "E-Kinerja PMM"]}
      />
      <EducationNavigation active="education-teachers" />

      <div className="container service-content quick-glass-content education-glass-content">
        {/* Section 1: Profil Ketenagaan GTK */}
        <section className="service-section" aria-labelledby="gtk-overview-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Profil Ketenagaan Daerah</p>
              <h2 id="gtk-overview-heading">Potret Pendidik &amp; Tenaga Kependidikan</h2>
            </div>
            <p>Data terintegrasi SIMPKB dan Dapodik mencakup kualifikasi, sertifikasi, serta keaktifan gugus guru.</p>
          </div>

          <div className="edu-stats-grid">
            {gtkMetrics.map((item) => (
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

        {/* Section 2: 4 Pilar Pembinaan Karir & Layanan GTK */}
        <section className="service-section" aria-labelledby="gtk-pillars-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Layanan & Pembinaan GTK</p>
              <h2 id="gtk-pillars-heading">Empat Pilar Pengembangan Profesi Pendidik</h2>
            </div>
            <p>Mendampingi perjalanan karir guru dari kualifikasi awal hingga pencapaian kepangkatan tertinggi.</p>
          </div>

          <div className="edu-gtk-grid">
            {gtkPillars.map((pillar) => (
              <article className="edu-gtk-card" key={pillar.id}>
                <div className="gtk-card-top-row">
                  <span className="gtk-icon-wrap" aria-hidden="true">
                    {pillar.icon}
                  </span>
                  <span className="gtk-badge-pill">{pillar.badge}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                <ul className="gtk-points-list">
                  {pillar.details.map((d, i) => (
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

        {/* Section 3: Visual Showcase & Komunitas Belajar (Kombel) */}
        <section className="service-section" aria-labelledby="kombel-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Gerakan Transformasi Guru</p>
              <h2 id="kombel-heading">Komunitas Belajar (Kombel) Daerah Konawe Selatan</h2>
            </div>
            <p>Ruang kolaborasi terbuka bagi pendidik untuk saling berbagi praktik baik dan meningkatkan kualitas belajar murid.</p>
          </div>

          <div className="edu-kombel-showcase">
            <div className="edu-photo-card">
              <Image
                src="/img/pendidikan-gtk.jpg"
                alt="Para guru dan pendidik Konawe Selatan dalam workshop kurikulum"
                width={700}
                height={450}
                className="edu-photo-img"
              />
              <div className="edu-photo-overlay">
                <span>✦ Pendidik Penggerak</span>
                <strong>Kolaborasi Berkelanjutan</strong>
                <p>Mendorong budaya belajar bersama demi menghadirkan pembelajaran yang bermakna bagi setiap anak.</p>
              </div>
            </div>

            <div className="edu-kombel-card">
              <div>
                <h3>Budaya Belajar Bersama di Satuan Pendidikan</h3>
                <p>
                  Komunitas Belajar di Kabupaten Konawe Selatan bergerak di tiga tingkatan: Kombel dalam sekolah, Kombel antarsekolah (KKG/MGMP/MKKS), dan Kombel daring di Platform Merdeka Mengajar (PMM).
                </p>

                <div className="kombel-values-grid">
                  <div className="kombel-val-box">
                    <strong>Fokus pada Murid</strong>
                    <small>Setiap diskusi diarahkan pada peningkatan mutu belajar siswa.</small>
                  </div>
                  <div className="kombel-val-box">
                    <strong>Kolaboratif</strong>
                    <small>Membangun budaya saling mendukung tanpa hierarki kaku.</small>
                  </div>
                  <div className="kombel-val-box">
                    <strong>Berbasis Bukti</strong>
                    <small>Memanfaatkan asesmen kelas untuk evaluasi bersama.</small>
                  </div>
                </div>
              </div>

              <div className="kombel-action-row">
                <span>Terhubung ke Platform Merdeka Mengajar (PMM)</span>
                <Link href="https://guru.kemdikbud.go.id" target="_blank" rel="noopener noreferrer" className="button primary">
                  Akses Kombel PMM <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Agenda Pelatihan & Workshop GTK 2026 */}
        <section className="service-section" aria-labelledby="workshops-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Agenda Peningkatan Kompetensi</p>
              <h2 id="workshops-heading">Jadwal Workshop &amp; Bimtek GTK 2026</h2>
            </div>
            <p>Pelatihan berkala yang difasilitasi oleh narasumber ahli, Balai Guru Penggerak (BGP), dan Pengawas Sekolah.</p>
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

        {/* Section 5: Portal Layanan Digital GTK */}
        <section className="service-section" aria-labelledby="portals-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Akses Resmi</p>
              <h2 id="portals-heading">Portal Layanan Digital Pendidik</h2>
            </div>
            <p>Tautan rujukan resmi kementerian untuk urusan administrasi tunjangan, sertifikasi, dan karir ASN.</p>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edu-portal-btn"
                >
                  <span>{portal.action}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <EducationHelp />
      </div>
    </>
  );
}
