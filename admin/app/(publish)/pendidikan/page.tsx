import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EducationHero, EducationNavigation, EducationHelp } from "./_components/education-shell";

export const metadata: Metadata = {
  title: "Jenjang & Satuan Pendidikan | Dikbud Konawe Selatan",
  description:
    "Layanan informasi jenjang PAUD, SD, SMP, dan Pendidikan Kesetaraan (PKBM) di Kabupaten Konawe Selatan. Memastikan akses belajar berkualitas, merata, dan inklusif.",
};

const summaryStats = [
  {
    id: "schools",
    label: "Satuan Pendidikan",
    value: "612",
    sub: "PAUD, SD, SMP, & PKBM",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "students",
    label: "Peserta Didik Aktif",
    value: "98.274",
    sub: "Siswa terdaftar Dapodik",
    tone: "emerald",
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
    id: "teachers",
    label: "Pendidik & GTK",
    value: "6.315",
    sub: "Guru ASN & Non-ASN",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "districts",
    label: "Wilayah Layanan",
    value: "25",
    sub: "Kecamatan se-Konsel",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const educationLevels = [
  {
    id: "paud",
    title: "Pendidikan Anak Usia Dini (PAUD / TK / KB)",
    badge: "Fondasi Awal",
    accent: "gold",
    index: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    description:
      "Membina tumbuh kembang anak secara holistik melalui pendekatan bermain yang bermakna dan transisi PAUD ke SD yang menyenangkan tanpa diskriminasi tes calistung.",
    stats: [
      { label: "Satuan", value: "198" },
      { label: "Siswa", value: "7.820" },
      { label: "Guru", value: "480" },
    ],
    highlights: [
      "Transisi PAUD-SD menyenangkan dan ramah anak",
      "Stimulasi literasi dan numerasi dini melalui dongeng",
      "Penyediaan Alat Permainan Edukatif (APE) ramah lingkungan",
    ],
    searchHref: "/layanan-publik/cari-sekolah?level=paud",
  },
  {
    id: "sd",
    title: "Sekolah Dasar (SD / MI)",
    badge: "Dasar Karakter",
    accent: "ruby",
    index: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    description:
      "Menanamkan dasar literasi, numerasi, pembiasaan karakter Pancasila, serta cinta budaya daerah bagi peserta didik fase A, B, dan C di seluruh kecamatan.",
    stats: [
      { label: "Satuan", value: "284" },
      { label: "Siswa", value: "52.410" },
      { label: "Guru", value: "3.420" },
    ],
    highlights: [
      "Penguatan literasi dan numerasi berbasis Asesmen Awal",
      "Gerakan literasi 15 menit sebelum kegiatan belajar",
      "Pembiasaan nilai kearifan lokal Tolaki dan gotong royong",
    ],
    searchHref: "/layanan-publik/cari-sekolah?level=sd",
  },
  {
    id: "smp",
    title: "Sekolah Menengah Pertama (SMP / MTs)",
    badge: "Penalaran Kritis",
    accent: "sapphire",
    index: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    description:
      "Mengembangkan kemampuan bernalar kritis, eksplorasi sains teknologi, kemandirian siswa, dan penyaluran bakat minat olimpiade serta seni budaya.",
    stats: [
      { label: "Satuan", value: "104" },
      { label: "Siswa", value: "34.180" },
      { label: "Guru", value: "2.150" },
    ],
    highlights: [
      "Pemanfaatan Laboratorium Komputer dan ANBK Mandiri",
      "Bimbingan konseling dan pencegahan perundungan sekolah",
      "Pengembangan projek kewirausahaan & sains terapan (P5)",
    ],
    searchHref: "/layanan-publik/cari-sekolah?level=smp",
  },
  {
    id: "pkbm",
    title: "Pendidikan Kesetaraan & PKBM",
    badge: "Belajar Sepanjang Hayat",
    accent: "emerald",
    index: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    description:
      "Memberikan kesempatan kedua bagi anak tidak sekolah (ATS) dan masyarakat dewasa melalui Paket A, Paket B, Paket C, serta kursus vokasi kecakapan hidup.",
    stats: [
      { label: "Satuan", value: "26" },
      { label: "Siswa", value: "3.864" },
      { label: "Pamong", value: "265" },
    ],
    highlights: [
      "Fleksibilitas jadwal belajar tatap muka dan modul mandiri",
      "Pelatihan vokasi terapan (pertanian, kriya, komputer)",
      "Ujian kesetaraan terstandar dan berijazah resmi nasional",
    ],
    searchHref: "/layanan-publik/cari-sekolah",
  },
];

const priorityPrograms = [
  {
    title: "Konsel Cerdas Berkarakter",
    text: "Penerapan nilai budaya luhur daerah Tolaki (Kalosara & Pombepasere) ke dalam pembiasaan sekolah untuk membentuk pelajar santun dan berintegritas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Digitalisasi Sarana Sekolah",
    text: "Penyaluran perangkat Chromebook, proyektor interaktif, dan router internet satelit ke sekolah pelosok guna pemerataan kualitas pembelajaran.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Sekolah Ramah Anak & Inklusif",
    text: "Penguatan satuan pendidikan aman dari kekerasan, ramah disabilitas, dan memberikan pendampingan psikologis terpadu bagi peserta didik.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Beasiswa Siswa Berprestasi",
    text: "Pemberian bantuan pendidikan bagi siswa berprestasi di bidang sains, seni, dan olahraga serta jaminan keberlanjutan bagi keluarga prasejahtera.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
];

export default function EducationLevelsPage() {
  return (
    <>
      <EducationHero
        current="Jenjang & Satuan Pendidikan"
        title="Membangun fondasi pendidikan unggul dan berkarakter."
        description="Pengelolaan terpadu jenjang PAUD, SD, SMP, serta Pendidikan Nonformal & Kesetaraan guna memastikan akses belajar yang merata, aman, dan inklusif di 25 kecamatan Konawe Selatan."
        status="Tahun Ajaran 2026/2027"
        subStatus="612 Satuan Pendidikan Aktif"
        tags={["Pendidikan Inklusif", "Transisi PAUD-SD", "Sekolah Ramah Anak"]}
      />
      <EducationNavigation active="education-levels" />

      <div className="container service-content quick-glass-content education-glass-content">
        {/* Section 1: Ringkasan Penyelenggaraan & Metrik Utama */}
        <section className="service-section" aria-labelledby="edu-stats-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Ringkasan Penyelenggaraan</p>
              <h2 id="edu-stats-heading">Fondasi Belajar Berkelanjutan di Seluruh Konawe Selatan</h2>
            </div>
            <p>Data terintegrasi Dapodik mencakup satuan sekolah negeri, swasta, pendidik, dan sebaran wilayah.</p>
          </div>

          <div className="edu-stats-grid">
            {summaryStats.map((item) => (
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

        {/* Section 2: Empat Jenjang Penyelenggaraan Belajar */}
        <section className="service-section" aria-labelledby="levels-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Klasifikasi Satuan Pendidikan</p>
              <h2 id="levels-heading">Empat Jenjang Penyelenggaraan Belajar</h2>
            </div>
            <p>Standar kurikulum, sarana pendukung, dan arah pembinaan di setiap tahapan tumbuh kembang murid.</p>
          </div>

          <div className="edu-levels-grid">
            {educationLevels.map((lvl) => (
              <article className={`edu-level-card tone-${lvl.accent}`} key={lvl.id}>
                <div className="edu-card-head">
                  <div className="edu-card-head-left">
                    <span className="edu-card-icon" aria-hidden="true">{lvl.icon}</span>
                    <span className="edu-card-index">{lvl.index}</span>
                  </div>
                  <span className="edu-card-badge">{lvl.badge}</span>
                </div>

                <div className="edu-level-body">
                  <h3>{lvl.title}</h3>
                  <p>{lvl.description}</p>

                  <div className="edu-level-stats-row">
                    {lvl.stats.map((st) => (
                      <div key={st.label}>
                        <span>{st.label}</span>
                        <strong>{st.value}</strong>
                      </div>
                    ))}
                  </div>

                  <ul className="edu-level-checklist">
                    {lvl.highlights.map((h, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={lvl.searchHref} className="edu-card-action-btn">
                  <span>Telusuri Satuan Sekolah di Direktori</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Visual Showcase & Program Prioritas Daerah */}
        <section className="service-section" aria-labelledby="showcase-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Akselerasi Kualitas Belajar</p>
              <h2 id="showcase-heading">Inisiatif Strategis & Program Unggulan Daerah</h2>
            </div>
            <p>Komitmen berkelanjutan pemerintah daerah untuk mewujudkan ekosistem sekolah unggul dan berdaya saing.</p>
          </div>

          <div className="edu-showcase-grid">
            <div className="edu-photo-card">
              <Image
                src="/img/pendidikan-jenjang.jpg"
                alt="Suasana pembelajaran kolaboratif di satuan pendidikan Konawe Selatan"
                width={700}
                height={450}
                className="edu-photo-img"
              />
              <div className="edu-photo-overlay">
                <span>✦ Konawe Selatan</span>
                <strong>Generasi Emas 2045</strong>
                <p>Membina peserta didik berkarakter mandiri, bernalar kritis, dan berwawasan masa depan.</p>
              </div>
            </div>

            <div className="edu-programs-column">
              {priorityPrograms.map((prog) => (
                <div className="edu-program-item" key={prog.title}>
                  <div className="edu-program-icon" aria-hidden="true">
                    {prog.icon}
                  </div>
                  <div>
                    <h4>{prog.title}</h4>
                    <p>{prog.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Callout Shortcut Pencarian Sekolah */}
        <section className="service-section" aria-labelledby="directory-callout-heading">
          <div className="edu-callout-card">
            <div className="edu-callout-copy">
              <p className="section-kicker">Pencarian Terpadu</p>
              <h3 id="directory-callout-heading">Cari Profil &amp; Lokasi Sekolah di Wilayah Anda</h3>
              <p>
                Gunakan modul Direktori Cari Sekolah untuk menemukan Nomor Pokok Sekolah Nasional (NPSN), status akreditasi BAN-PDM, alamat lengkap, dan kontak resmi satuan pendidikan se-Kabupaten Konawe Selatan.
              </p>
            </div>
            <div className="edu-callout-action">
              <Link href="/layanan-publik/cari-sekolah" className="button primary">
                Buka Direktori Sekolah <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <EducationHelp />
      </div>
    </>
  );
}
