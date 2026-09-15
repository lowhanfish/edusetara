import type { Metadata } from "next";
import Link from "next/link";
import { DataHero, DataNavigation, DataHelp } from "./_components/data-shell";

export const metadata: Metadata = {
  title: "Statistik Pendidikan | Dikbud Konawe Selatan",
  description:
    "Data agregat pendidikan Kabupaten Konawe Selatan: jumlah sekolah, peserta didik, guru & GTK, sebaran jenjang, akreditasi, dan sebaran per kecamatan.",
};

const keyMetrics = [
  {
    id: "schools",
    label: "Satuan Pendidikan",
    value: "612",
    sub: "PAUD, SD, SMP, & PKBM",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    badge: "Terverifikasi",
    tone: "blue",
  },
  {
    id: "students",
    label: "Peserta Didik Aktif",
    value: "98.274",
    sub: "Siswa terdaftar di Dapodik",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    badge: "Aktif Belajar",
    tone: "emerald",
  },
  {
    id: "teachers",
    label: "Guru & Tenaga Pendidik",
    value: "6.315",
    sub: "PNS, PPPK, & Guru Non-ASN",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    badge: "94.2% S1/S2",
    tone: "amber",
  },
  {
    id: "districts",
    label: "Wilayah Kecamatan",
    value: "25",
    sub: "Kecamatan se-Konawe Selatan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    badge: "100% Terjangkau",
    tone: "purple",
  },
];

const levelBreakdown = [
  {
    level: "PAUD & TK",
    schools: 182,
    students: "7.450",
    teachers: "620",
    percent: 30,
    color: "#f59e0b",
    desc: "Pendidikan Anak Usia Dini & Taman Kanak-Kanak",
  },
  {
    level: "Sekolah Dasar (SD)",
    schools: 320,
    students: "54.120",
    teachers: "3.425",
    percent: 52,
    color: "#eab308",
    desc: "SD Negeri dan SD Swasta se-Kabupaten",
  },
  {
    level: "Sekolah Menengah Pertama (SMP)",
    schools: 84,
    students: "33.854",
    teachers: "2.110",
    percent: 14,
    color: "#3b82f6",
    desc: "SMP Negeri, SMP Satap, dan SMP Swasta",
  },
  {
    level: "Kesetaraan & PKBM",
    schools: 26,
    students: "2.850",
    teachers: "160",
    percent: 4,
    color: "#8b5cf6",
    desc: "Pusat Kegiatan Belajar Masyarakat (Paket A, B, C)",
  },
];

const qualityIndicators = [
  {
    title: "Rasio Peserta Didik per Guru",
    value: "1 : 16",
    note: "Sangat ideal (batas SPM nasional maksimal 1:20)",
    status: "Optimal",
  },
  {
    title: "Kualifikasi Pendidik Minimum S1/D4",
    value: "94.2%",
    note: "Meningkat 2.8% dibandingkan tahun sebelumnya",
    status: "Tinggi",
  },
  {
    title: "Guru Tersertifikasi Profesi (Pendidik)",
    value: "78.6%",
    note: "Terus ditingkatkan melalui program PPG Kemendikdasmen",
    status: "Baik",
  },
  {
    title: "Sekolah Terakreditasi A & B",
    value: "90.2%",
    note: "Standar BAN-PDM untuk mutu layanan sekolah",
    status: "Unggul",
  },
];

const districtSummaries = [
  { name: "Andoolo", schools: 28, students: "4.820", teachers: "340" },
  { name: "Ranomeeto", schools: 38, students: "7.150", teachers: "465" },
  { name: "Konda", schools: 34, students: "6.200", teachers: "410" },
  { name: "Tinanggea", schools: 42, students: "6.940", teachers: "450" },
  { name: "Moramo", schools: 31, students: "5.480", teachers: "375" },
  { name: "Laeya", schools: 32, students: "5.600", teachers: "390" },
  { name: "Landono", schools: 27, students: "4.350", teachers: "295" },
  { name: "Kolono", schools: 29, students: "4.120", teachers: "280" },
];

const downloadReports = [
  {
    title: "Buku Profil Statistik Pendidikan Konsel 2026",
    format: "PDF",
    size: "4.8 MB",
    category: "Publikasi Tahunan",
    updated: "Agustus 2026",
  },
  {
    title: "Rekapitulasi Data Pokok Pendidikan Semester Ganjil 2026/2027",
    format: "XLSX",
    size: "1.5 MB",
    category: "Tabel Data",
    updated: "September 2026",
  },
  {
    title: "Laporan Capaian Standar Pelayanan Minimal (SPM) Pendidikan",
    format: "PDF",
    size: "2.1 MB",
    category: "Laporan Kinerja",
    updated: "Juli 2026",
  },
];

export default function EducationStatisticsPage() {
  return (
    <>
      <DataHero
        current="Statistik Pendidikan"
        title="Satu data pendidikan terintegrasi untuk Konawe Selatan."
        description="Transparansi data pokok pendidikan Kabupaten Konawe Selatan yang akurat, mutakhir, dan dapat dipertanggungjawabkan guna mendukung perencanaan dan pemerataan mutu belajar."
      />
      <DataNavigation active="data-education-statistics" />

      <div className="container about-content">
        {/* Section 1: Main Metric Cards */}
        <section aria-labelledby="metrics-heading">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Indikator Utama 2026</p>
              <h2 id="metrics-heading">Potret Pendidikan Daerah</h2>
            </div>
            <p>Data bersumber dari sinkronisasi Dapodik dan pendataan terpadu dinas.</p>
          </div>

          <div className="data-metrics-grid">
            {keyMetrics.map((item) => (
              <article className={`data-metric-card tone-${item.tone}`} key={item.id}>
                <div className="data-metric-top">
                  <span className="data-metric-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="data-metric-badge">{item.badge}</span>
                </div>
                <strong className="data-metric-value">{item.value}</strong>
                <h3 className="data-metric-label">{item.label}</h3>
                <p className="data-metric-sub">{item.sub}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 2: Breakdown by Level */}
        <section className="about-section" id="sebaran-jenjang">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Komposisi Jenjang</p>
              <h2>Sebaran Satuan Pendidikan</h2>
            </div>
            <p>Distribusi jumlah lembaga, siswa, dan tenaga pendidik menurut jenjang.</p>
          </div>

          <div className="data-breakdown-grid">
            {levelBreakdown.map((item) => (
              <article className="data-breakdown-card" key={item.level}>
                <div className="data-breakdown-header">
                  <div>
                    <h3>{item.level}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <span className="data-breakdown-count">
                    <strong>{item.schools}</strong>
                    <small>Sekolah</small>
                  </span>
                </div>

                <div className="data-progress-bar-wrap">
                  <div
                    className="data-progress-bar"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>

                <div className="data-breakdown-stats">
                  <div>
                    <span>Peserta Didik</span>
                    <strong>{item.students}</strong>
                  </div>
                  <div>
                    <span>Guru & Pendidik</span>
                    <strong>{item.teachers}</strong>
                  </div>
                  <div>
                    <span>Porsi Total</span>
                    <strong>{item.percent}%</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Quality Indicators */}
        <section className="about-section" id="indikator-mutu">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Standar Pelayanan Minimal</p>
              <h2>Indikator Mutu Pembelajaran</h2>
            </div>
            <p>Tolok ukur efektivitas, rasio kelas, dan kompetensi tenaga pendidik.</p>
          </div>

          <div className="data-quality-grid">
            {qualityIndicators.map((ind) => (
              <article className="data-quality-card" key={ind.title}>
                <div className="data-quality-top">
                  <span className="data-quality-status">{ind.status}</span>
                  <strong className="data-quality-value">{ind.value}</strong>
                </div>
                <h3>{ind.title}</h3>
                <p>{ind.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Regional Distribution Summary */}
        <section className="about-section" id="sebaran-wilayah">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Sebaran Geografis</p>
              <h2>Distribusi per Kecamatan</h2>
            </div>
            <p>Contoh persebaran di kecamatan utama. Data lengkap dapat ditelusuri di Cari Sekolah.</p>
          </div>

          <div className="data-district-table-wrap">
            <div className="data-district-table" role="table" aria-label="Tabel sebaran data per kecamatan">
              <div className="data-district-head" role="row">
                <span role="columnheader">Wilayah Kecamatan</span>
                <span role="columnheader">Satuan Pendidikan</span>
                <span role="columnheader">Peserta Didik</span>
                <span role="columnheader">Tenaga Pendidik</span>
                <span role="columnheader">Aksi</span>
              </div>
              {districtSummaries.map((d) => (
                <div className="data-district-row" role="row" key={d.name}>
                  <div role="cell" className="district-name-cell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="district-pin-icon" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <strong>Kec. {d.name}</strong>
                  </div>
                  <div role="cell"><strong>{d.schools}</strong> unit</div>
                  <div role="cell"><strong>{d.students}</strong> siswa</div>
                  <div role="cell"><strong>{d.teachers}</strong> guru</div>
                  <div role="cell">
                    <Link href={`/layanan-publik/cari-sekolah`} className="district-link">
                      Lihat Sekolah →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Data Downloads & Publications */}
        <section className="about-section" id="unduh-data">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Katalog Data</p>
              <h2>Publikasi & Dokumen Statistik</h2>
            </div>
            <p>Unduh berkas resmi agregat statistik untuk referensi akademik dan kebijakan.</p>
          </div>

          <div className="data-downloads-grid">
            {downloadReports.map((report) => (
              <article className="data-download-card" key={report.title}>
                <div className="download-format-badge">{report.format}</div>
                <div className="download-body">
                  <small>{report.category} · {report.updated}</small>
                  <h3>{report.title}</h3>
                  <p>Ukuran berkas: {report.size}</p>
                </div>
                <a
                  href="#unduh-data"
                  className="download-action-btn"
                  aria-label={`Unduh berkas ${report.title}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="download-svg-icon" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <DataHelp />
      </div>
    </>
  );
}
