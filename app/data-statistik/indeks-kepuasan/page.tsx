import type { Metadata } from "next";
import Link from "next/link";
import { DataHero, DataNavigation, DataHelp } from "../_components/data-shell";

export const metadata: Metadata = {
  title: "Indeks Kepuasan Masyarakat (IKM) | Dikbud Konawe Selatan",
  description:
    "Hasil pengukuran mutu pelayanan publik Dikbud Konawe Selatan: skor IKM 90.14% (Sangat Baik), tren historis tahunan, dan evaluasi 9 unsur layanan.",
};

const trendData = [
  { year: "2022", value: "85.62%", height: 60, note: "Baik" },
  { year: "2023", value: "93.10%", height: 82, note: "Sangat Baik" },
  { year: "2024", value: "96.14%", height: 96, note: "Sangat Baik" },
  { year: "2025", value: "92.27%", height: 78, note: "Sangat Baik" },
  { year: "2026", value: "90.14%", height: 72, note: "Sangat Baik (Sem. 1)", active: true },
];

const satisfactionElements = [
  {
    num: "01",
    title: "Persyaratan Pelayanan",
    score: "92.4%",
    desc: "Kemudahan dan kejelasan dokumen persyaratan yang diminta sebelum layanan diproses.",
    grade: "Sangat Baik",
  },
  {
    num: "02",
    title: "Sistem, Mekanisme, & Prosedur",
    score: "90.8%",
    desc: "Kemudahan tahapan alur pelayanan yang jelas, terstruktur, dan tidak berbelit-belit.",
    grade: "Sangat Baik",
  },
  {
    num: "03",
    title: "Waktu Penyelesaian Layanan",
    score: "88.5%",
    desc: "Ketepatan durasi pemrosesan berkas sesuai dengan standar estimasi waktu yang dipublikasikan.",
    grade: "Baik",
  },
  {
    num: "04",
    title: "Biaya / Tarif Layanan",
    score: "98.2%",
    desc: "Kepastian biaya layanan publik (seluruh pengurusan tidak dipungut biaya / Rp 0).",
    grade: "Sangat Baik",
  },
  {
    num: "05",
    title: "Produk Spesifikasi Layanan",
    score: "91.1%",
    desc: "Kesesuaian hasil layanan yang diterima pemohon dengan standar yang telah ditetapkan.",
    grade: "Sangat Baik",
  },
  {
    num: "06",
    title: "Kompetensi Pelaksana",
    score: "89.7%",
    desc: "Keahlian, kecakapan teknis, dan penguasaan materi dari petugas loket dan verifikator.",
    grade: "Baik",
  },
  {
    num: "07",
    title: "Perilaku & Kesopanan Petugas",
    score: "93.6%",
    desc: "Sikap ramah, sopan, santun, dan kepedulian petugas dalam melayani setiap warga masyarakat.",
    grade: "Sangat Baik",
  },
  {
    num: "08",
    title: "Kualitas Sarana & Prasarana",
    score: "86.4%",
    desc: "Kenyamanan ruang tunggu, fasilitas ramah disabilitas, ketersediaan informasi, dan kebersihan.",
    grade: "Baik",
  },
  {
    num: "09",
    title: "Penanganan Pengaduan & Saran",
    score: "89.2%",
    desc: "Kecepatan dan keterbukaan tindak lanjut terhadap keluhan, kritik, serta saran pengguna layanan.",
    grade: "Baik",
  },
];

export default function SatisfactionIndexPage() {
  return (
    <>
      <DataHero
        current="Indeks Kepuasan"
        title="Evaluasi mutu dan kepuasan pelayanan publik masyarakat."
        description="Hasil pengukuran komprehensif kepuasan masyarakat terhadap penyelenggaraan layanan pendidikan dan kebudayaan sesuai PermenPAN-RB No. 14 Tahun 2017."
      />
      <DataNavigation active="data-satisfaction-index" />

      <div className="container service-content quick-glass-content data-glass-content">
        {/* Section 1: Hero Score & Overview */}
        <section className="service-section" aria-labelledby="ikm-overview-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Laporan Hasil Evaluasi</p>
              <h2 id="ikm-overview-heading">Skor Mutu Pelayanan Terkini</h2>
            </div>
            <p>Berdasarkan survei berkala kepuasan masyarakat pengguna layanan publik dinas.</p>
          </div>

          <div className="ikm-hero-banner">
            <div className="ikm-score-box">
              <span className="ikm-score-kicker">Nilai Indeks IKM</span>
              <div className="ikm-score-number">
                <strong>90.14</strong>
                <small>%</small>
              </div>
              <div className="ikm-grade-pill">
                <span className="ikm-grade-dot" />
                <span>Mutu A (Sangat Baik)</span>
              </div>
              <p className="ikm-period-text">Periode Survei: Semester 1 Tahun 2026</p>
            </div>

            <div className="ikm-overview-details">
              <h3>Komitmen Peningkatan Mutu Berkelanjutan</h3>
              <p>
                Survei Kepuasan Masyarakat (SKM) diselenggarakan secara berkala untuk memperoleh umpan balik nyata mengenai kualitas layanan dinas, mulai dari urusan administrasi kelembagaan sekolah, konsultasi guru, hingga layanan perizinan kebudayaan.
              </p>

              <div className="ikm-stat-chips">
                <div className="ikm-chip">
                  <span className="ikm-chip-icon">👥</span>
                  <div>
                    <strong>1.428 Responden</strong>
                    <small>Jumlah pemohon layanan</small>
                  </div>
                </div>
                <div className="ikm-chip">
                  <span className="ikm-chip-icon">⚖</span>
                  <div>
                    <strong>9 Unsur Pelayanan</strong>
                    <small>Sesuai PermenPAN-RB</small>
                  </div>
                </div>
                <div className="ikm-chip">
                  <span className="ikm-chip-icon">✓</span>
                  <div>
                    <strong>Bebas Pungli</strong>
                    <small>Seluruh layanan Rp 0</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Historical Trend Bar Chart */}
        <section className="service-section" id="tren-historis">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Tren Kinerja 5 Tahun</p>
              <h2>Grafik Perkembangan Nilai IKM</h2>
            </div>
            <p>Konsistensi capaian kepuasan masyarakat rentang waktu 2022 hingga 2026.</p>
          </div>

          <div className="ikm-chart-card">
            <div className="ikm-chart-header">
              <div>
                <strong>Tren Nilai Kepuasan (2022 – 2026)</strong>
                <p>Skala persentase konversi indeks 0 – 100%</p>
              </div>
              <div className="ikm-chart-legend">
                <span><i className="legend-dot active" /> Tahun Berjalan (2026)</span>
                <span><i className="legend-dot" /> Tahun Sebelumnya</span>
              </div>
            </div>

            <div className="ikm-bars-container">
              {trendData.map((item) => (
                <div className={`ikm-bar-col${item.active ? " active-bar" : ""}`} key={item.year}>
                  <strong className="bar-value">{item.value}</strong>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${item.height}%` }}
                    />
                  </div>
                  <span className="bar-year">{item.year}</span>
                  <small className="bar-note">{item.note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: 9 Service Elements */}
        <section className="service-section" id="unsur-pelayanan">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Rincian Komponen Evaluasi</p>
              <h2>9 Unsur Penilaian Pelayanan Publik</h2>
            </div>
            <p>Standar evaluasi kementerian untuk mengukur setiap titik kontak pelayanan.</p>
          </div>

          <div className="ikm-elements-grid">
            {satisfactionElements.map((el) => (
              <article className="ikm-element-card" key={el.num}>
                <div className="ikm-element-top">
                  <span className="ikm-element-num">{el.num}</span>
                  <span className="ikm-element-score">
                    <strong>{el.score}</strong>
                    <small>{el.grade}</small>
                  </span>
                </div>
                <h3>{el.title}</h3>
                <p>{el.desc}</p>
                <div className="ikm-element-progress">
                  <div
                    className="ikm-element-progress-fill"
                    style={{ width: el.score }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Citizen Participation & Action */}
        <section className="service-section ikm-participate-section">
          <div className="ikm-participate-box">
            <div className="participate-copy">
              <span className="section-kicker" style={{ color: "#ffd23b" }}>Suara Anda Membangun Kami</span>
              <h2>Pernah menerima layanan dari Dikbud Konawe Selatan?</h2>
              <p>
                Beri kami masukan dan nilai pengalaman layanan yang Anda terima. Partisipasi Anda sangat berharga untuk terus membenahi transparansi dan kenyamanan pelayanan publik daerah.
              </p>
            </div>
            <div className="participate-actions">
              <Link href="/tentang-kami/kontak" className="button primary">
                Beri Penilaian & Ulasan <span>→</span>
              </Link>
              <Link href="/tentang-kami/standar-pelayanan" className="button secondary">
                Standar Pelayanan <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        <DataHelp />
      </div>
    </>
  );
}
