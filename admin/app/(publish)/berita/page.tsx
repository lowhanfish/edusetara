import type { Metadata } from "next";
import { NewsHero, NewsHelp } from "./components/news-shell";
import { NewsFeed } from "./components/news-feed";

export const metadata: Metadata = {
  title: "Warta & Berita Resmi",
  description:
    "Portal berita dan publikasi resmi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. Memuat update inovasi pembelajaran, agenda kebudayaan, sarpras sekolah, dan prestasi siswa.",
};

const newsHighlights = [
  {
    id: "metric-total-news",
    label: "Total Publikasi",
    value: "150+ Rilis",
    sub: "Warta & agenda resmi 2026",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    id: "metric-categories",
    label: "Kanal Informasi",
    value: "5 Kategori",
    sub: "Pendidikan, Budaya, GTK, Sarpras, Prestasi",
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
    id: "metric-coverage",
    label: "Cakupan Daerah",
    value: "25 Kecamatan",
    sub: "Liputan sekolah & sanggar se-Konsel",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    id: "metric-editorial",
    label: "Standar Jurnalistik",
    value: "Terverifikasi",
    sub: "Rilis pers resmi pemerintah daerah",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export default function NewsIndexPage() {

  return (
    <div className="news-index-page">
      <NewsHero />

      <section className="container news-metrics-section" aria-label="Statistik Publikasi">
        <div className="edu-stats-grid">
          {newsHighlights.map((metric) => (
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

      <section className="container news-feed-section" aria-label="Daftar Berita dan Warta">
        <NewsFeed />
      </section>

      <div className="container">
        <NewsHelp />
      </div>
    </div>
  );
}
