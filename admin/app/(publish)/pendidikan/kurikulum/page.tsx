import type { Metadata } from "next";
import Link from "next/link";
import { EducationHero, EducationNavigation, EducationHelp } from "../_components/education-shell";

export const metadata: Metadata = {
  title: "Kurikulum & Pembelajaran",
  description:
    "Pedoman Kurikulum Merdeka, Projek P5 berbasis kearifan lokal, Kalender Pendidikan 2026/2027, dan pelaksanaan Asesmen Nasional (ANBK) di Konawe Selatan.",
};

const curriculumMetrics = [
  {
    id: "curriculum-rate",
    label: "Kurikulum Merdeka",
    value: "100%",
    sub: "Fase Fondasi s.d. Fase D",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    id: "p5-dimensions",
    label: "Dimensi Karakter",
    value: "6 Dimensi",
    sub: "Profil Pelajar Pancasila",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "anbk-readiness",
    label: "Moda ANBK Mandiri",
    value: "100%",
    sub: "Kesiapan server & lab",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "local-wisdom",
    label: "Kearifan Lokal",
    value: "3 Tema",
    sub: "Budaya Tolaki & Ekologi",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const curriculumPillars = [
  {
    id: "intrakurikuler",
    index: "01",
    tag: "Intrakurikuler",
    title: "Pembelajaran Berdiferensiasi",
    desc: "Guru merancang pembelajaran yang disesuaikan dengan tingkat capaian dan kesiapan belajar murid (teaching at the right level), fokus pada pemahaman materi esensial secara kontekstual.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    points: [
      "Asesmen diagnostik awal pembelajaran berkala",
      "Penyusunan modul ajar fleksibel dan adaptif",
      "Pendalaman literasi baca dan numerasi terapan",
    ],
  },
  {
    id: "kokurikuler",
    index: "02",
    tag: "Kokurikuler P5",
    title: "Projek Penguatan Karakter",
    desc: "Kegiatan kolaboratif lintas mata pelajaran untuk mengamati dan mencari solusi nyata atas isu sosial, budaya lokal Konawe Selatan, dan kelestarian alam lingkungan sekitar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    points: [
      "Tema Kearifan Lokal: Seni tenun, kuliner, dan tradisi Tolaki",
      "Tema Gaya Hidup Berkelanjutan & Ekologi Daerah",
      "Tema Kewirausahaan dan rekayasa teknologi aplikatif",
    ],
  },
  {
    id: "ekstrakurikuler",
    index: "03",
    tag: "Ekstrakurikuler",
    title: "Penyaluran Bakat & Minat",
    desc: "Wadah pengembangan potensi non-akademik, kepemimpinan, kepramukaan, cabang olahraga prestasi, dan kecakapan seni budaya guna membentuk pribadi tangguh dan seimbang.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    points: [
      "Pendidikan Kepramukaan wajib & Palang Merah Remaja",
      "Olimpiade Sains Nasional (OSN) & FLS2N Seni",
      "Gala Siswa Indonesia (GSI) cabang sepak bola & atletik",
    ],
  },
];

const pancasilaDimensions = [
  {
    num: "01",
    title: "Beriman & Bertakwa",
    desc: "Menghayati nilai spiritualitas, toleransi antarumat beragama, dan integritas moral dalam kehidupan bermasyarakat.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Berkebhinekaan Global",
    desc: "Mencintai dan melestarikan budaya luhur daerah sekaligus berpikiran terbuka terhadap keragaman budaya bangsa dan dunia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Bergotong Royong",
    desc: "Kemampuan bekerjasama secara sukarela, peduli terhadap sesama, dan berbagi peran dalam menyelesaikan tantangan bersama.",
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
    num: "04",
    title: "Mandiri",
    desc: "Bertanggung jawab atas proses dan hasil belajarnya sendiri dengan disiplin, percaya diri, dan pantang menyerah.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Bernalar Kritis",
    desc: "Mampu memproses informasi secara objektif, menganalisis persoalan secara logis, dan mengevaluasi keputusan secara bijak.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Kreatif",
    desc: "Mampu memodifikasi dan menghasilkan karya orisinal, bernilai guna, dan menjadi solusi atas permasalahan lingkungan sekitar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
];

const academicEvents = [
  {
    semester: "Ganjil",
    date: "13 Jul",
    year: "2026",
    badge: "Awal Semester",
    title: "Hari Pertama Masuk Sekolah & MPLS Ramah Anak",
    desc: "Masa Pengenalan Lingkungan Sekolah yang edukatif, berkarakter, dan bebas dari segala bentuk perpeloncoan.",
  },
  {
    semester: "Ganjil",
    date: "17 Agu",
    year: "2026",
    badge: "Asesmen Nasional",
    title: "Pelaksanaan ANBK Mandiri Jenjang SMP",
    desc: "Asesmen Nasional Berbasis Komputer untuk mengukur literasi, numerasi, dan survei karakter murid kelas 8.",
  },
  {
    semester: "Ganjil",
    date: "21 Sep",
    year: "2026",
    badge: "Asesmen Nasional",
    title: "Pelaksanaan ANBK Mandiri Jenjang SD",
    desc: "Pelaksanaan simulasi dan asesmen utama bagi siswa kelas 5 di seluruh satuan SD negeri dan swasta se-Konsel.",
  },
  {
    semester: "Ganjil",
    date: "07 Des",
    year: "2026",
    badge: "Evaluasi Belajar",
    title: "Penilaian Sumatif Akhir Semester (SAS)",
    desc: "Evaluasi capaian pembelajaran intrakurikuler dan gelar karya projek penguatan profil pelajar Pancasila (P5).",
  },
  {
    semester: "Ganjil",
    date: "19 Des",
    year: "2026",
    badge: "Laporan Hasil",
    title: "Pembagian Rapor Hasil Belajar Semester Ganjil",
    desc: "Penyerahan buku laporan hasil belajar murid dan laporan perkembangan projek karakter kepada orang tua.",
  },
  {
    semester: "Genap",
    date: "04 Jan",
    year: "2027",
    badge: "Awal Semester",
    title: "Hari Pertama Pembelajaran Semester Genap",
    desc: "Dimulainya kegiatan belajar mengajar semester genap tahun ajaran 2026/2027 serentak di semua tingkatan.",
  },
  {
    semester: "Genap",
    date: "15 Mar",
    year: "2027",
    badge: "Ujian Akhir",
    title: "Penilaian Sumatif Akhir Jenjang SMP",
    desc: "Asesmen akhir jenjang bagi murid kelas 9 sebagai instrumen kelulusan dan peminatan jenjang lanjutan.",
  },
  {
    semester: "Genap",
    date: "18 Jun",
    year: "2027",
    badge: "Kelulusan",
    title: "Penyerahan Rapor Kenaikan Kelas & Ijazah",
    desc: "Puncak evaluasi akademik tahunan dan penerimaan ijazah resmi dinas bagi siswa tingkat akhir.",
  },
];

export default function CurriculumPage() {
  return (
    <>
      <EducationHero
        current="Kurikulum & Pembelajaran"
        title="Transformasi pembelajaran berpusat pada peserta didik."
        description="Panduan implementasi Kurikulum Merdeka, Projek Penguatan Profil Pelajar Pancasila (P5) berbasis kearifan lokal, agenda kalender pendidikan, dan kesiapan Asesmen Nasional di Kabupaten Konawe Selatan."
        status="Kurikulum Merdeka 100%"
        subStatus="Fase Fondasi hingga Fase D"
        tags={["P5 Kearifan Lokal", "ANBK Mandiri", "Rapor Pendidikan"]}
      />
      <EducationNavigation active="education-curriculum" />

      <div className="container service-content quick-glass-content education-glass-content">
        {/* Section 1: Metrik Implementasi Kurikulum */}
        <section className="service-section" aria-labelledby="curriculum-overview-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Standar Kurikulum Nasional</p>
              <h2 id="curriculum-overview-heading">Penerapan Kurikulum Merdeka di Konawe Selatan</h2>
            </div>
            <p>Memberikan fleksibilitas bagi guru untuk merancang pembelajaran mendalam yang adaptif terhadap kebutuhan murid.</p>
          </div>

          <div className="edu-stats-grid">
            {curriculumMetrics.map((item) => (
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

        {/* Section 2: Tiga Komponen Pokok Kurikulum */}
        <section className="service-section" aria-labelledby="pillars-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Struktur Pembelajaran</p>
              <h2 id="pillars-heading">Tiga Komponen Pokok Kurikulum Merdeka</h2>
            </div>
            <p>Keseimbangan antara pendalaman materi akademik, penguatan karakter budi pekerti, dan penyaluran minat bakat.</p>
          </div>

          <div className="edu-pillars-grid">
            {curriculumPillars.map((pillar) => (
              <article className="edu-pillar-card" key={pillar.id}>
                <div className="pillar-head">
                  <span className="pillar-icon-box" aria-hidden="true">{pillar.icon}</span>
                  <span className="pillar-badge-tag">{pillar.tag}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                <ul className="pillar-features">
                  {pillar.points.map((pt, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: 6 Dimensi Profil Pelajar Pancasila */}
        <section className="service-section" aria-labelledby="dimensions-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Profil Karakter</p>
              <h2 id="dimensions-heading">6 Dimensi Profil Pelajar Pancasila</h2>
            </div>
            <p>Standar kompetensi lulusan holistik yang terintegrasi dalam intrakurikuler dan budaya sekolah sehari-hari.</p>
          </div>

          <div className="edu-dimensions-grid">
            {pancasilaDimensions.map((dim) => (
              <div className="edu-dimension-card" key={dim.num}>
                <div className="dim-header">
                  <span className="dim-icon-wrap" aria-hidden="true">
                    {dim.icon}
                  </span>
                  <span className="dim-num">{dim.num}</span>
                </div>
                <h3>{dim.title}</h3>
                <p>{dim.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Kalender Pendidikan TA 2026/2027 */}
        <section className="service-section" id="kalender-pendidikan" aria-labelledby="calendar-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Jadwal Kedinasan</p>
              <h2 id="calendar-heading">Kalender Pendidikan TA 2026/2027</h2>
            </div>
            <p>Jadwal resmi kegiatan belajar mengajar, pelaksanaan asesmen, dan libur akademik se-Kabupaten Konawe Selatan.</p>
          </div>

          <div className="edu-calendar-box">
            <div className="edu-calendar-header-bar">
              <div className="cal-meta-text">
                <strong>Keputusan Kepala Dinas Pendidikan &amp; Kebudayaan Kab. Konawe Selatan</strong>
                <span>Nomor: 421/082/2026 tentang Pedoman Kalender Pendidikan Daerah</span>
              </div>
              <a href="#kalender-pendidikan" className="button primary cal-download-link">
                <span>Unduh Kalender PDF</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="edu-events-grid">
              {academicEvents.map((evt, index) => (
                <article className="edu-event-card" key={index}>
                  <div className="edu-event-date-badge">
                    <span className="cal-badge-semester">Sem. {evt.semester}</span>
                    <strong className="cal-badge-day">{evt.date}</strong>
                    <span className="cal-badge-year">{evt.year}</span>
                  </div>
                  <div className="edu-event-info">
                    <span className="event-tag-pill">{evt.badge}</span>
                    <h3>{evt.title}</h3>
                    <p>{evt.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Kesiapan Asesmen Nasional (ANBK) & Rapor Pendidikan */}
        <section className="service-section" aria-labelledby="anbk-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Evaluasi Sistem Pendidikan</p>
              <h2 id="anbk-heading">Kesiapan Asesmen Nasional &amp; Rapor Pendidikan</h2>
            </div>
            <p>Evaluasi menyeluruh untuk memotret mutu input, proses, dan hasil pembelajaran di seluruh satuan pendidikan.</p>
          </div>

          <div className="edu-anbk-grid">
            <div className="edu-anbk-main-card">
              <h3>Instrumen Evaluasi Mutu Sekolah</h3>
              <p>
                Asesmen Nasional (ANBK) bukan merupakan penentu kelulusan individual murid, melainkan dasar penyusunan Rapor Pendidikan untuk perencanaan berbasis data (PBD) sekolah dan dinas.
              </p>

              <div className="anbk-items-grid">
                <div className="anbk-item">
                  <strong>AKM Literasi &amp; Numerasi</strong>
                  <small>Mengukur kompetensi kognitif bernalar mendalam</small>
                </div>
                <div className="anbk-item">
                  <strong>Survei Karakter</strong>
                  <small>Memotret kebiasaan sikap dan nilai Profil Pelajar</small>
                </div>
                <div className="anbk-item">
                  <strong>Survei Lingkungan Belajar</strong>
                  <small>Menilai iklim keamanan, inklusivitas, dan mutu KBM</small>
                </div>
              </div>
            </div>

            <div className="edu-anbk-status-card">
              <div>
                <span className="anbk-status-kicker">Status Kesiapan Infrastruktur ANBK</span>
                <div className="anbk-status-val">100% Siap</div>
                <p>
                  Seluruh satuan SD dan SMP di 25 kecamatan terverifikasi siap moda mandiri dan tumpangan dengan dukungan jaringan satelit daerah.
                </p>
              </div>

              <Link href="/data-statistik" className="button secondary anbk-action-btn">
                Lihat Data Statistik Pendidikan <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <EducationHelp />
      </div>
    </>
  );
}
