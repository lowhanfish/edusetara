import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CultureHero, CultureNavigation, CultureHelp } from "./components/culture-shell";

export const metadata: Metadata = {
  title: "Warisan & Cagar Budaya",
  description:
    "Inventarisasi situs cagar budaya, tradisi lisan Tolaki, upacara adat Mosehe Wonua, filosofi Kalosara, dan Warisan Budaya Takbenda (WBTb) Kabupaten Konawe Selatan.",
};

const cultureMetrics = [
  {
    id: "heritage-sites",
    label: "Situs Cagar Budaya",
    value: "18 Situs",
    sub: "Terinventarisasi resmi dinas",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z" />
      </svg>
    ),
  },
  {
    id: "wbtb-records",
    label: "Warisan Takbenda (WBTb)",
    value: "12 Karya",
    sub: "Adat, seni, & kemahiran",
    tone: "emerald",
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
    id: "opk-categories",
    label: "Objek Pemajuan Budaya",
    value: "10 Objek",
    sub: "Kategori UU No. 5/2017",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "customary-areas",
    label: "Wilayah Sebaran Adat",
    value: "25 Wilayah",
    sub: "Kecamatan se-Konawe Selatan",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const heritagePillars = [
  {
    id: "tradisi-lisan",
    title: "Tradisi Lisan & Adat Istiadat",
    badge: "Nilai Luhur Adat",
    accent: "gold",
    index: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    description:
      "Filosofi Kalosara sebagai pranata adat pemersatu kehidupan sosial, upacara pensucian negeri Mosehe Wonua, dan tata krama kesantunan Pombepasere masyarakat Tolaki.",
    stats: [
      { label: "Falsafah", value: "Kalosara" },
      { label: "Upacara", value: "Mosehe" },
      { label: "Lembaga Adat", value: "25 Kec." },
    ],
    highlights: [
      "Falsafah Kalosara simbol kehormatan, perdamaian, dan keadilan",
      "Upacara adat Mosehe Wonua untuk pemulihan harmoni alam & manusia",
      "Tradisi tutur sastra lisan Taenua dan peribahasa leluhur Tolaki",
    ],
    actionHref: "/kebudayaan/sanggar-komunitas",
  },
  {
    id: "seni-pertunjukan",
    title: "Seni Pertunjukan & Tari Tradisional",
    badge: "Seni Pertunjukan",
    accent: "ruby",
    index: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    description:
      "Tari pergaulan Lulo yang merangkul semua kalangan tanpa sekat sosial, Tari Mondotambe penyambutan tamu agung, serta tabuhan ritmis instrumen Kanda Wuta dan Gong.",
    stats: [
      { label: "Ragam Tari", value: "8 Jenis" },
      { label: "Musik Etnik", value: "6 Ragam" },
      { label: "Sanggar Seni", value: "42 Grup" },
    ],
    highlights: [
      "Tari Lulo massal sebagai lambang gotong royong dan persaudaraan",
      "Tari Mondotambe dengan gerak anggun penghormatan tamu daerah",
      "Pelestarian alat musik bambu, gong perunggu, dan gendang dimba",
    ],
    actionHref: "/kebudayaan/agenda-festival",
  },
  {
    id: "kriya-tenun",
    title: "Kriya & Tenun Motif Daerah",
    badge: "Kriya Tradisional",
    accent: "sapphire",
    index: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
    description:
      "Kemahiran menenun kain tradisional dengan motif khas Konawe Selatan yang terinspirasi alam dan flora lokal, anyaman rotan serat alam, serta kriya kerajinan kuningan.",
    stats: [
      { label: "Motif Khas", value: "6 Ragam" },
      { label: "Perajin Binaan", value: "84 Jiwa" },
      { label: "Sentra Kriya", value: "4 Sentra" },
    ],
    highlights: [
      "Motif Tenun Khas Daun Jati & ornamen geometris Kalosara",
      "Pengembangan kerajinan anyaman rotan ramah lingkungan",
      "Fasilitasi bantuan alat tenun bukan mesin (ATBM) bagi perajin",
    ],
    actionHref: "/kebudayaan/sanggar-komunitas",
  },
  {
    id: "cagar-budaya",
    title: "Situs Cagar Budaya & Sejarah",
    badge: "Cagar Budaya",
    accent: "emerald",
    index: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    description:
      "Perlindungan situs pemukiman adat tertua, benteng pertahanan batu alam peninggalan masa kerajaan, kompleks makam tokoh pendahulu, dan artefak peninggalan bersejarah.",
    stats: [
      { label: "Situs Terdata", value: "18 Titik" },
      { label: "Kawasan Lindung", value: "6 Lokasi" },
      { label: "Zonasi", value: "100% Ada" },
    ],
    highlights: [
      "Penetapan batas zonasi inti dan penyangga cagar budaya daerah",
      "Pemasangan papan informasi narasi sejarah untuk kunjungan edukasi",
      "Kolaborasi pelestarian bersama juru pelihara (Jupel) situs setempat",
    ],
    actionHref: "/tentang-kami/kontak",
  },
];

const kalosaraValues = [
  {
    title: "Inae Konasara Iye Pinesara",
    text: "Siapa yang menjunjung tinggi adat istiadat dan nilai kesantunan budi pekerti niscaya akan dimuliakan oleh sesama.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Inae Lia Sara Iye Pinekasara",
    text: "Siapa yang mengabaikan atau mencela aturan hukum adat dan norma kesopanan akan menghadapi sanksi moral serta sosial.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    title: "Pombepasere & Kohano-hano",
    text: "Prinsip saling menghargai, tenggang rasa, tolong-menolong, dan menjaga keharmonisan hubungan antarsesama warga.",
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
    title: "Medulu Mepokoaso",
    text: "Semangat bersatu padu, mengutamakan mufakat, dan berhimpun dalam kerukunan demi kemajuan Kabupaten Konawe Selatan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export default function CultureHeritagePage() {
  return (
    <>
      <CultureHero
        current="Warisan & Cagar Budaya"
        title="Menjaga warisan luhur, menguatkan jati diri daerah."
        description="Pelestarian terpadu cagar budaya, tradisi lisan, adat istiadat, dan kearifan lokal Tolaki guna memastikan warisan leluhur tetap lestari dan bermakna bagi generasi masa depan Konawe Selatan."
        status="Data Kebudayaan 2026"
        subStatus="18 Cagar Budaya & 12 WBTb"
        tags={["Kalosara Adat", "Mosehe Wonua", "Kain Tenun Konsel"]}
      />
      <CultureNavigation active="culture-heritage" />

      <div className="container service-content quick-glass-content culture-glass-content">
        {/* Section 1: Ringkasan Inventarisasi Budaya Daerah */}
        <section className="service-section" aria-labelledby="heritage-stats-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Inventarisasi Kebudayaan</p>
              <h2 id="heritage-stats-heading">Potret Cagar Budaya &amp; Warisan Takbenda Daerah</h2>
            </div>
            <p>Data terintegrasi Data Pokok Kebudayaan (Dapobud) mencakup situs cagar budaya, tradisi lisan, dan sebaran adat.</p>
          </div>

          <div className="edu-stats-grid">
            {cultureMetrics.map((item) => (
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

        {/* Section 2: Empat Pilar Warisan Budaya Daerah */}
        <section className="service-section" aria-labelledby="heritage-pillars-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Objek Pemajuan Kebudayaan</p>
              <h2 id="heritage-pillars-heading">Empat Pilar Warisan Budaya Konawe Selatan</h2>
            </div>
            <p>Ruang lingkup pembinaan dan perlindungan nilai budaya luhur daerah sesuai amanat UU No. 5 Tahun 2017.</p>
          </div>

          <div className="edu-levels-grid">
            {heritagePillars.map((item) => (
              <article className={`edu-level-card tone-${item.accent}`} key={item.id}>
                <div className="edu-card-head">
                  <div className="edu-card-head-left">
                    <span className="edu-card-icon" aria-hidden="true">{item.icon}</span>
                    <span className="edu-card-index">{item.index}</span>
                  </div>
                  <span className="edu-card-badge">{item.badge}</span>
                </div>

                <div className="edu-level-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <div className="edu-level-stats-row">
                    {item.stats.map((st) => (
                      <div key={st.label}>
                        <span>{st.label}</span>
                        <strong>{st.value}</strong>
                      </div>
                    ))}
                  </div>

                  <ul className="edu-level-checklist">
                    {item.highlights.map((h, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={item.actionHref} className="edu-card-action-btn">
                  <span>Telusuri Rincian Objek Budaya</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Visual Showcase & Falsafah Nilai Luhur Kalosara */}
        <section className="service-section" aria-labelledby="kalosara-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Falsafah Kearifan Lokal</p>
              <h2 id="kalosara-heading">Pemberdayaan Nilai Adat &amp; Kearifan Suku Tolaki</h2>
            </div>
            <p>Simbol Kalosara sebagai landasan moral keadilan, kesetaraan sosial, dan kerukunan bermasyarakat.</p>
          </div>

          <div className="edu-showcase-grid">
            <div className="edu-photo-card">
              <Image
                src="/img/kebudayaan-warisan.jpg"
                alt="Penari tradisional membawakan tari Mondotambe dengan busana tenun khas Sulawesi Tenggara"
                width={700}
                height={450}
                className="edu-photo-img"
              />
              <div className="edu-photo-overlay">
                <span>✦ Konawe Selatan</span>
                <strong>Pesona Warisan Leluhur Tolaki</strong>
                <p>Gerak tari Mondotambe dan kain tenun adat mencerminkan keanggunan, budi pekerti luhur, dan keramahtamahan.</p>
              </div>
            </div>

            <div className="edu-programs-column">
              {kalosaraValues.map((val) => (
                <div className="edu-program-item" key={val.title}>
                  <div className="edu-program-icon" aria-hidden="true">
                    {val.icon}
                  </div>
                  <div>
                    <h4>{val.title}</h4>
                    <p>{val.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Callout Pengusulan Warisan Budaya */}
        <section className="service-section" aria-labelledby="heritage-callout-heading">
          <div className="edu-callout-card">
            <div className="edu-callout-copy">
              <p className="section-kicker">Partisipasi Pelestarian Budaya</p>
              <h3 id="heritage-callout-heading">Pencatatan &amp; Pengusulan Warisan Budaya Daerah</h3>
              <p>
                Masyarakat, tokoh adat kecamatan, seniman, dan komunitas lokal dapat mengajukan pencatatan karya budaya takbenda, tradisi lisan, atau objek bersejarah ke Bidang Kebudayaan Dikbud Konawe Selatan untuk verifikasi cagar budaya.
              </p>
            </div>
            <div className="edu-callout-action">
              <Link href="/tentang-kami/kontak" className="button primary">
                Konsultasi &amp; Pengusulan <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <CultureHelp />
      </div>
    </>
  );
}
