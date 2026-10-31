import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementsHero, AnnouncementsHelp } from "./_components/announcements-shell";
import { AnnouncementsFeed } from "./_components/announcements-feed";
import { announcementsData } from "./_data/announcements-data";

export const metadata: Metadata = {
  title: "Pusat Pengumuman & Surat Edaran Kedinasan",
  description:
    "Portal siaran resmi dan dokumen surat edaran Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan: jadwal ANBK 2026, hasil seleksi PPPK Guru, cut-off Dapodik, dan bantuan PIP.",
};

const announcementsMetrics = [
  {
    id: "metric-total-edaran",
    label: "Total Publikasi Edaran",
    value: "6 Surat Resmi",
    sub: "Terbitan aktif periode 2026",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "metric-categories-edaran",
    label: "Kategori Dokumen",
    value: "4 Bidang",
    sub: "ANBK, PPPK, Dapodik, Seni Budaya",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "metric-verification",
    label: "Keabsahan Surat",
    value: "Terverifikasi",
    sub: "Bertanda tangan & bernomor registrasi",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "metric-free-service",
    label: "Biaya Layanan",
    value: "100% Gratis",
    sub: "Bebas dari segala bentuk pungli",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export default function AnnouncementsIndexPage() {
  return (
    <>
      <AnnouncementsHero />

      {/* Unified Quick Glass Canvas */}
      <div className="container service-content quick-glass-content announcements-glass-content">
        {/* Section 1: Ringkasan Metrik Publikasi Dokumen */}
        <section
          className="service-section announcements-metrics-section"
          aria-labelledby="announcements-stats-heading"
        >
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Warta Resmi Kedinasan</p>
              <h2 id="announcements-stats-heading">
                Ringkasan Penerbitan Dokumen &amp; Surat Edaran
              </h2>
            </div>
            <p>
              Seluruh warta dan dokumen resmi yang diterbitkan memuat nomor registrasi
              kedinasan yang sah dan bebas biaya administrasi.
            </p>
          </div>

          <div className="edu-stats-grid">
            {announcementsMetrics.map((metric) => (
              <div key={metric.id} className={`edu-stat-card tone-${metric.tone}`}>
                <span className="edu-stat-icon" aria-hidden="true">
                  {metric.icon}
                </span>
                <div className="edu-stat-body">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 & 3: Feed Interaktif (Sorotan Prioritas, Filter Direktori, Kartu & Modal Maklumat) */}
        <AnnouncementsFeed announcements={announcementsData} />

        {/* Section 4: Maklumat Integritas & Bebas Pungli */}
        <section
          className="service-section announcements-integrity-section"
          aria-label="Maklumat Integritas dan Kebijakan Bebas Pungli"
        >
          <div className="announcements-integrity-card news-glass-card">
            <div className="integrity-icon-shield" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="integrity-body">
              <div className="integrity-title-row">
                <span className="integrity-badge">Jaminan Keabsahan &amp; Integritas</span>
                <h3>Kebijakan Anti-Pungutan Liar (Anti-Pungli) 100% Gratis</h3>
              </div>
              <p>
                Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan menegaskan
                bahwa seluruh proses seleksi PPPK Guru, pendataan sistem Dapodik,
                pencairan bantuan PIP, penyaluran sertifikasi, dan layanan kedinasan{" "}
                <strong>tidak memungut biaya apa pun (100% Bebas Biaya)</strong>.
                Jangan pernah percaya terhadap pihak-pihak atau nomor kontak tidak
                resmi yang mengatasnamakan pimpinan atau pejabat dinas.
              </p>
              <div className="integrity-actions-row">
                <Link
                  href="/tentang-kami/kontak"
                  className="integrity-verify-link"
                >
                  <span>Verifikasi Keaslian Surat Melalui Kanal Resmi</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <span className="integrity-helpline">
                  Pengaduan SMS / WA Terpadu: <strong>+62 822-9000-8442</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Pusat Konfirmasi & Bantuan (Matching Tentang Kami submenu) */}
        <AnnouncementsHelp />
      </div>
    </>
  );
}
