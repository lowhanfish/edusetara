import type { Metadata } from "next";
import Link from "next/link";
import { CultureHero, CultureNavigation, CultureHelp } from "../_components/culture-shell";

export const metadata: Metadata = {
  title: "Agenda & Festival Budaya",
  description:
    "Jadwal Pekan Kebudayaan Daerah (PKD), Festival Seni Pelajar, pameran kriya tenun, pawai budaya, dan kalender festival tahunan Kabupaten Konawe Selatan.",
};

const festivalMetrics = [
  {
    id: "annual-events",
    label: "Agenda Budaya Tahunan",
    value: "8 Event",
    sub: "Pekan budaya & festival seni",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "districts-contingents",
    label: "Kontingen Wilayah",
    value: "25 Kec.",
    sub: "Partisipasi seluruh kecamatan",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "student-performers",
    label: "Peserta & Penampil",
    value: "3.500+",
    sub: "Pelajar & seniman sanggar",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "visitor-interest",
    label: "Apresiasi Publik",
    value: "25.000+",
    sub: "Masyarakat & wisatawan",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const festivalHighlights = [
  {
    id: "pkd",
    index: "01",
    tag: "Event Akbar Daerah",
    title: "Pekan Kebudayaan Daerah (PKD) Konsel",
    desc: "Perhelatan akbar tahunan yang menampilkan lomba tari kreasi tradisi, pagelaran musik etnik, parade kuliner warisan Sinonggi & Kasoami, dan musyawarah adat pemajuan kebudayaan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    points: [
      "Perlombaan Tari Lulo & Mondotambe antar-sanggar kecamatan",
      "Pentas seni teater rakyat dan pertunjukan tutur sastra Taenua",
      "Sarasehan budayawan dan pameran manuskrip sejarah daerah",
    ],
  },
  {
    id: "fls2n",
    index: "02",
    tag: "Talenta Pelajar",
    title: "Festival Seni & Budaya Pelajar (FLS2N)",
    desc: "Ajang apresiasi dan seleksi kompetensi kesenian bagi peserta didik jenjang SD dan SMP di bidang tari tradisi, kriya anyam, mendongeng cerita rakyat, dan vokal solo lagu daerah.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    points: [
      "Kompetisi berjenjang dari tingkat gugus hingga seleksi kabupaten",
      "Pembinaan intensif bagi juara menuju festival seni tingkat provinsi",
      "Pameran instalasi seni rupa dan gambar bercerita karya murid",
    ],
  },
  {
    id: "pameran-tenun",
    index: "03",
    tag: "Pameran & Expo",
    title: "Pameran Kriya & Tenun Khas Konawe Selatan",
    desc: "Eksibisi karya unggulan perajin tenun ikat motif lokal, anyaman rotan, kerajinan kuningan, dan peragaan busana adat modifikasi yang ramah bagi generasi milenial.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    points: [
      "Peragaan busana tenun motif daun jati & ornamen Kalosara",
      "Demonstrasi langsung teknik menenun tradisional ATBM",
      "Fasilitasi temu pembeli dan promosi produk ekonomi kreatif",
    ],
  },
  {
    id: "pawai-budaya",
    index: "04",
    tag: "Parade Kebangsaan",
    title: "Karnaval Budaya & Pawai Adat Nusantara",
    desc: "Pawai akbar busana adat dan atraksi seni yang melibatkan kontingen 25 kecamatan serta paguyuban lintas etnis dalam rangka memeriahkan Hari Jadi Kabupaten Konawe Selatan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    points: [
      "Parade kendaraan hias ornamen luhur rumah adat Tolaki",
      "Atraksi seni kolosal 500 penari gabungan pelajar daerah",
      "Panggung rakyat terbuka dan pesta kuliner gratis masyarakat",
    ],
  },
];

const culturalCalendar = [
  {
    season: "Semester I",
    date: "02 Mei",
    year: "2026",
    badge: "Seni Pelajar",
    title: "Pembukaan Festival Seni & Budaya Pelajar (FLS2N Daerah)",
    desc: "Lomba tari kreasi tradisi, mendongeng cerita rakyat, dan menyanyi solo lagu daerah di Gedung Olah Seni Andoolo.",
  },
  {
    season: "Semester I",
    date: "18 Mei",
    year: "2026",
    badge: "HUT Daerah",
    title: "Karnaval Budaya & Pawai Adat Nusantara Konawe Selatan",
    desc: "Pawai busana adat 25 kecamatan dan defile kerukunan paguyuban budaya menyusuri jalan protokol ibukota kabupaten.",
  },
  {
    season: "Semester II",
    date: "24 – 28 Agu",
    year: "2026",
    badge: "Pekan Budaya",
    title: "Pekan Kebudayaan Daerah (PKD) Kabupaten Konawe Selatan 2026",
    desc: "Puncak pagelaran seni tradisi tahunan, lomba tari Lulo massal, pameran kuliner warisan, dan sarasehan kebudayaan.",
  },
  {
    season: "Semester II",
    date: "15 – 17 Sep",
    year: "2026",
    badge: "Ritual Adat",
    title: "Upacara Adat Mosehe Wonua & Refleksi Nilai Kalosara",
    desc: "Upacara adat pensucian negeri dan pembersihan spiritual daerah bersama Lembaga Adat Tolaki (LAT) se-Konsel.",
  },
  {
    season: "Semester II",
    date: "08 – 11 Okt",
    year: "2026",
    badge: "Expo Kriya",
    title: "Pameran Kriya Tradisional & Peragaan Busana Tenun Konsel",
    desc: "Eksibisi produk tenun motif khas daerah, anyaman rotan, kriya kuningan, dan temu bisnis pelaku ekonomi kreatif.",
  },
  {
    season: "Semester II",
    date: "10 – 12 Nov",
    year: "2026",
    badge: "Musik Etnik",
    title: "Festival Musik Tradisional & Parade Tabuh Kanda Wuta",
    desc: "Kompetisi grup karawitan musik perkusi bambu dan gong perunggu bagi generasi muda tingkat kabupaten.",
  },
  {
    season: "Semester II",
    date: "05 – 07 Des",
    year: "2026",
    badge: "Tari Kreasi",
    title: "Gelar Karya Tari Tradisi & Lulo Kreasi Pelajar Daerah",
    desc: "Pementasan karya terbaik hasil pembinaan seniman masuk sekolah (GSMS) di panggung terbuka Ranomeeto.",
  },
  {
    season: "Semester II",
    date: "20 – 22 Des",
    year: "2026",
    badge: "Cagar Budaya",
    title: "Pameran Pusaka Leluhur & Arsip Sejarah Cagar Budaya",
    desc: "Pameran artefak peninggalan kerajaan, senjata pusaka tradisional, dan dokumentasi foto sejarah cagar budaya Konsel.",
  },
];

export default function CultureAgendaPage() {
  return (
    <>
      <CultureHero
        current="Agenda & Festival Budaya"
        title="Merayakan keberagaman seni, menggerakkan kebanggaan daerah."
        description="Jadwal resmi pagelaran kebudayaan tahunan, Pekan Kebudayaan Daerah (PKD), Festival Seni Pelajar, pameran pusaka leluhur, serta panggung ekspresi seni tradisi se-Kabupaten Konawe Selatan."
        status="Kalender Festival 2026/2027"
        subStatus="8 Agenda Budaya Utama"
        tags={["Pekan Kebudayaan Daerah", "Festival Seni Pelajar", "Pawai Budaya"]}
      />
      <CultureNavigation active="culture-agenda" />

      <div className="container service-content quick-glass-content culture-glass-content">
        {/* Section 1: Ringkasan Metrik Festival */}
        <section className="service-section" aria-labelledby="festival-stats-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Kalender Event Daerah</p>
              <h2 id="festival-stats-heading">Potret Perhelatan Budaya &amp; Seni Konawe Selatan</h2>
            </div>
            <p>Jadwal pagelaran resmi terintegrasi yang melibatkan sanggar seni, sekolah, tokoh adat, dan publik.</p>
          </div>

          <div className="edu-stats-grid">
            {festivalMetrics.map((item) => (
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

        {/* Section 2: 4 Sorotan Event Unggulan */}
        <section className="service-section" aria-labelledby="highlights-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Program Unggulan</p>
              <h2 id="highlights-heading">Empat Gelaran Festival Kebudayaan Utama</h2>
            </div>
            <p>Ruang apresiasi seni terpadu untuk merawat tradisi sekaligus menggerakkan sektor pariwisata daerah.</p>
          </div>

          <div className="edu-levels-grid">
            {festivalHighlights.map((hl) => (
              <article className="edu-level-card tone-gold" key={hl.id}>
                <div className="edu-card-head">
                  <div className="edu-card-head-left">
                    <span className="edu-card-icon" aria-hidden="true">{hl.icon}</span>
                    <span className="edu-card-index">{hl.index}</span>
                  </div>
                  <span className="edu-card-badge">{hl.tag}</span>
                </div>

                <div className="edu-level-body">
                  <h3>{hl.title}</h3>
                  <p>{hl.desc}</p>

                  <ul className="edu-level-checklist">
                    {hl.points.map((pt, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="#kalender-agenda" className="edu-card-action-btn">
                  <span>Lihat Jadwal Perhelatan</span>
                  <span aria-hidden="true">↓</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Kalender Agenda Kebudayaan TA 2026/2027 */}
        <section className="service-section" id="kalender-agenda" aria-labelledby="agenda-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Jadwal Perhelatan Resmi</p>
              <h2 id="agenda-heading">Kalender Agenda Kebudayaan TA 2026/2027</h2>
            </div>
            <p>Rincian waktu pelaksanaan festival, lokasi panggung terbuka, dan cakupan peserta se-Kabupaten Konawe Selatan.</p>
          </div>

          <div className="edu-calendar-box">
            <div className="edu-calendar-header-bar">
              <div className="cal-meta-text">
                <strong>Keputusan Dinas Pendidikan &amp; Kebudayaan Kab. Konawe Selatan</strong>
                <span>Nomor: 430/112/2026 tentang Kalender Event Kebudayaan &amp; Kesenian Daerah</span>
              </div>
              <a href="#kalender-agenda" className="button primary cal-download-link">
                <span>Unduh Jadwal PDF</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="edu-events-grid">
              {culturalCalendar.map((evt, index) => (
                <article className="edu-event-card" key={index}>
                  <div className="edu-event-date-badge">
                    <span className="cal-badge-semester">{evt.season}</span>
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

        {/* Section 4: Dokumentasi & Partisipasi Pengisi Acara */}
        <section className="service-section" aria-labelledby="participation-heading">
          <div className="edu-anbk-grid">
            <div className="edu-anbk-main-card">
              <h3>Dokumentasi &amp; Pameran Karya Seni Pelajar</h3>
              <p>
                Seluruh dokumentasi pagelaran tari massal, rekaman alunan musik tradisi, dan foto pameran pusaka diarsipkan secara digital guna mendukung kurikulum muatan lokal sekolah di Konawe Selatan.
              </p>

              <div className="anbk-items-grid">
                <div className="anbk-item">
                  <strong>Video Dokumenter</strong>
                  <small>Arsip rekaman upacara adat &amp; tari sakral</small>
                </div>
                <div className="anbk-item">
                  <strong>Katalog Kriya</strong>
                  <small>Dokumentasi motif tenun &amp; seni rupa daerah</small>
                </div>
                <div className="anbk-item">
                  <strong>Audio Etnik</strong>
                  <small>Master rekaman tabuhan musik Kanda Wuta</small>
                </div>
              </div>
            </div>

            <div className="edu-anbk-status-card">
              <div>
                <span className="anbk-status-kicker">Kanal Partisipasi Seniman</span>
                <div className="anbk-status-val">Terbuka</div>
                <p>
                  Sanggar seni, paguyuban adat, dan kontingen sekolah dipersilakan mendaftarkan karya tari atau grup musik untuk kurasi penampilan event daerah.
                </p>
              </div>

              <Link href="/tentang-kami/kontak" className="button secondary anbk-action-btn">
                Daftar Sebagai Pengisi Acara <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <CultureHelp />
      </div>
    </>
  );
}
