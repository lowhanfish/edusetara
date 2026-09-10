import Image from "next/image";

const navItems = [
  "Beranda",
  "Tentang Kami",
  "Layanan Publik",
  "Data & Statistik",
  "Pendidikan",
  "Kebudayaan",
  "Berita",
  "Pengumuman",
  "Hubungi Kami",
];
const audiences = [
  ["👥", "Siswa &\nOrang Tua", "gold"],
  ["🧑‍🏫", "Guru & GTK", "sand"],
  ["🏫", "Sekolah", "mint"],
  ["💻", "Operator", "sand"],
  ["👨‍👩‍👧", "Masyarakat", "gold"],
];
const announcements = [
  ["05", "SEP", "Pemberitahuan Jadwal Pelaksanaan ANBK 2026"],
  ["03", "SEP", "Pengumuman Hasil Seleksi Administrasi PPPK Guru 2026"],
  ["28", "AGT", "Undangan Sosialisasi Dapodik Tahun Ajaran 2026/2027"],
  ["25", "AGT", "Pelaksanaan Festival Budaya Konawe Selatan 2026"],
];
const quickLinks = [
  ["▣", "Dapodik", "Unduh aplikasi & informasi terbaru", "blue"],
  ["♙", "SPM Pendidikan", "Standar Pelayanan Minimal", "gold"],
  ["♟", "Pengaduan", "Sampaikan aspirasi dan pengaduan", "teal"],
  ["▤", "Regulasi", "Peraturan & kebijakan", "red"],
  ["↓", "Download", "Formulir, dokumen, dan panduan", "orange"],
  ["?", "FAQ", "Pertanyaan yang sering diajukan", "blue"],
];
const cultureLinks = [
  "Situs & Cagar Budaya",
  "Seni Tradisional",
  "Sanggar & Komunitas",
  "Agenda Budaya",
  "Galeri Budaya",
];
const standards = [
  ["Standar Pelayanan Publik Dikbud Konsel", "PDF · 1.2 MB"],
  ["Maklumat Pelayanan", "PDF · 800 KB"],
  ["Surat Keputusan Layanan", "PDF · 1.1 MB"],
];

function Arrow() {
  return <span className="round-arrow">→</span>;
}
function SectionHeading({
  icon,
  title,
  action = "Lihat Semua",
}: {
  icon: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <span className="heading-icon">{icon}</span>
      <h3>{title}</h3>
      <a href="#">
        {action} <span>→</span>
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="topbar container">
          <a
            className="brand"
            href="#beranda"
            aria-label="Beranda Dinas Pendidikan dan Kebudayaan"
          >
            <Image
              src="/img/logo_loght.png"
              width={70}
              height={70}
              alt="Logo Konawe Selatan"
              priority
            />
            <span className="brand-copy">
              <strong>
                Dinas Pendidikan
                <br />
                dan Kebudayaan
              </strong>
              <small>Kabupaten Konawe Selatan</small>
            </span>
          </a>
          <span className="motto">
            Cerdas Berkarakter
            <br />
            Lestari Budayanya
            <br />
            Maju Konselnya
          </span>
          <div className="top-actions">
            <a href="#footer">⊙ PPID</a>
            <a href="#footer">♿ Aksesibilitas</a>
            <a href="#footer">▣ Peta Situs</a>
            <label className="search">
              <input
                type="search"
                placeholder="Cari informasi..."
                aria-label="Cari informasi"
              />
              <span>⌕</span>
            </label>
            <button className="login">Masuk</button>
          </div>
        </div>
        <nav className="main-nav" aria-label="Navigasi utama">
          <div className="nav-inner container">
            {navItems.map((item, index) => (
              <a
                className={index === 0 ? "active" : ""}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {index === 0 && <span>⌂</span>}
                {item}
                {index > 0 && index < 6 ? <small>⌄</small> : null}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section className="hero" id="beranda">
        <Image
          className="hero-photo"
          src="/img/hero-konsel.png"
          alt="Pelajar dan penari tradisional dengan latar alam Sulawesi Tenggara"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">Kabupaten Konawe Selatan</p>
          <h1>
            Pendidikan
            <br />
            <span>Berkualitas</span>
          </h1>
          <h2>
            untuk Generasi Konawe Selatan
            <br />
            yang Lebih Maju
          </h2>
          <p className="hero-description">
            Bersama kita wujudkan layanan pendidikan yang inklusif,
            <br />
            berkarakter, dan berdaya saing, serta melestarikan
            <br />
            kebudayaan daerah untuk masa depan yang lebih baik.
          </p>
          <div className="hero-buttons">
            <a className="button primary" href="#layanan">
              Jelajahi Layanan <span>→</span>
            </a>
            <a className="button secondary" href="#tentang-kami">
              Tentang Kami <span>→</span>
            </a>
          </div>
          <div className="hero-dots" aria-hidden="true">
            <b />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      <div className="content-shell container">
        <section className="audience-panel" id="layanan">
          <div className="audience-list">
            {audiences.map(([icon, label, tone]) => (
              <a
                className={`audience ${tone}`}
                href="#layanan-cepat"
                key={label}
              >
                <span>{icon}</span>
                <strong>
                  {label.split("\n").map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </strong>
                <Arrow />
              </a>
            ))}
          </div>
          <a className="welcome-card" href="#tentang-kami">
            <div className="welcome-image">
              <Image
                src="/img/hero-konsel.png"
                alt="Pemandangan Konawe Selatan"
                fill
                sizes="300px"
              />
            </div>
            <strong>
              Bersama Mewujudkan
              <br />
              Pendidikan dan Kebudayaan
              <br />
              Konawe Selatan yang Unggul
            </strong>
            <Arrow />
          </a>
        </section>

        <div className="dashboard-grid top-grid">
          <section className="card news" id="berita">
            <SectionHeading icon="▣" title="Berita Terkini" />
            <div className="news-layout">
              <article className="lead-news">
                <div className="news-photo">
                  <Image
                    src="/img/hero-konsel.png"
                    alt="Kegiatan belajar berbasis teknologi"
                    fill
                    sizes="440px"
                  />
                </div>
                <span className="tag">Pendidikan</span>
                <h4>
                  Dikbud Konsel Dorong Pemanfaatan Teknologi dalam Pembelajaran
                  di Sekolah
                </h4>
                <time>5 September 2026</time>
                <Arrow />
              </article>
              <div className="news-list">
                {[
                  "Konawe Selatan Gelar Festival Budaya Daerah 2026",
                  "Sosialisasi Kurikulum Merdeka bagi Guru se-Konawe Selatan",
                  "Dinas Pendidikan Salurkan Bantuan Sarana untuk Sekolah",
                ].map((title, i) => (
                  <article key={title}>
                    <div className={`thumb thumb-${i}`}>
                      <Image
                        src="/img/hero-konsel.png"
                        alt=""
                        fill
                        sizes="100px"
                      />
                    </div>
                    <div>
                      <h5>{title}</h5>
                      <small>{4 - i} September 2026</small>
                      <span className="mini-tag">
                        {i === 0
                          ? "Budaya"
                          : i === 1
                            ? "Pendidikan"
                            : "Sarpras"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="card announcements" id="pengumuman">
            <SectionHeading icon="♟" title="Pengumuman" />
            <div>
              {announcements.map(([date, month, title]) => (
                <a className="announcement" href="#" key={title}>
                  <time>
                    <b>{date}</b>
                    <small>{month}</small>
                  </time>
                  <strong>{title}</strong>
                  <Arrow />
                </a>
              ))}
            </div>
          </section>

          <section className="card quick" id="layanan-cepat">
            <SectionHeading icon="ϟ" title="Layanan Cepat" action="" />
            <div>
              {quickLinks.map(([icon, title, sub, tone]) => (
                <a className="quick-link" href="#" key={title}>
                  <span className={`quick-icon ${tone}`}>{icon}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{sub}</small>
                  </span>
                  <Arrow />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-grid mid-grid">
          <section className="card school-finder">
            <SectionHeading
              icon="⌖"
              title="Cari Sekolah di Konawe Selatan"
              action=""
            />
            <p>
              Temukan informasi sekolah (SD, SMP, PAUD) di seluruh kecamatan.
            </p>
            <div className="finder-body">
              <form>
                <select aria-label="Pilih jenjang" defaultValue="">
                  <option value="" disabled>
                    Pilih Jenjang
                  </option>
                  <option>SD</option>
                  <option>SMP</option>
                  <option>PAUD</option>
                </select>
                <select aria-label="Pilih kecamatan" defaultValue="">
                  <option value="" disabled>
                    Pilih Kecamatan
                  </option>
                  <option>Andoolo</option>
                  <option>Laeya</option>
                  <option>Palangga</option>
                </select>
                <input
                  placeholder="Ketik nama sekolah..."
                  aria-label="Nama sekolah"
                />
                <button type="submit">Cari Sekolah</button>
              </form>
              <div
                className="map-graphic"
                aria-label="Ilustrasi peta lokasi sekolah"
              >
                <span>●</span>
                <i>●</i>
                <b>●</b>
                <em>●</em>
                <a href="#">Lihat Peta Selengkapnya</a>
              </div>
            </div>
          </section>

          <section className="card stats" id="data-&-statistik">
            <SectionHeading
              icon="▥"
              title="Statistik Pendidikan"
              action="Lihat Detail"
            />
            <div className="stats-grid">
              {[
                ["🏫", "612", "Jumlah Sekolah", "blue"],
                ["👥", "98.274", "Jumlah Siswa", "green"],
                ["👨‍🏫", "6.315", "Jumlah Guru", "orange"],
                ["⌖", "25", "Kecamatan", "purple"],
              ].map(([icon, num, label, tone]) => (
                <div className={`stat ${tone}`} key={label}>
                  <span>{icon}</span>
                  <b>{num}</b>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="card culture" id="kebudayaan">
            <SectionHeading
              icon="♬"
              title="Kebudayaan Konawe Selatan"
              action=""
            />
            <p>Jaga warisan budaya, kuatkan jati diri daerah.</p>
            <div className="culture-body">
              <div>
                {cultureLinks.map((item, i) => (
                  <a href="#" key={item}>
                    <span>{["⌂", "♨", "♣", "▣", "▤"][i]}</span>
                    {item}
                  </a>
                ))}
              </div>
              <div className="culture-photo">
                <Image
                  src="/img/hero-konsel.png"
                  alt="Seni budaya Konawe Selatan"
                  fill
                  sizes="300px"
                />
                <a className="culture-button" href="#">
                  Jelajahi Kebudayaan <b>→</b>
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-grid bottom-grid">
          <section className="card satisfaction">
            <SectionHeading
              icon="▥"
              title="Indeks Kepuasan Masyarakat"
              action="Lihat Detail"
            />
            <div className="satisfaction-body">
              <div className="score">
                <span>Nilai IKM Terbaru</span>
                <b>
                  90.14<small>%</small>
                </b>
                <p>Tahun 2026 (Semester 1)</p>
              </div>
              <div className="chart">
                <strong>Grafik Tren IKM</strong>
                <div className="bars">
                  {[
                    ["85.62%", "2022", 58],
                    ["93.10%", "2023", 76],
                    ["96.14%", "2024", 88],
                    ["92.27%", "2025", 73],
                    ["90.14%", "2026", 67],
                  ].map(([v, y, h]) => (
                    <div key={y}>
                      <b>{v}</b>
                      <i style={{ height: `${h}px` }} />
                      <span>{y}</span>
                    </div>
                  ))}
                </div>
                <small>
                  <i /> Terkini　 ◯ Sebelumnya
                </small>
              </div>
              <div className="survey-links">
                <a href="#">
                  <span>♨</span>
                  <strong>
                    Isi Survei<small>Beri penilaian Anda</small>
                  </strong>
                </a>
                <a href="#">
                  <span>▤</span>
                  <strong>
                    Hasil Survei<small>Lihat analisis lengkap</small>
                  </strong>
                </a>
              </div>
            </div>
          </section>
          <section className="card standards">
            <SectionHeading icon="♟" title="Standar Pelayanan" />
            <div>
              {standards.map(([title, size]) => (
                <a href="#" key={title}>
                  <span className="doc-icon">▤</span>
                  <strong>
                    {title}
                    <small>{size}</small>
                  </strong>
                  <span className="download">↓</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer id="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div>
              <Image
                src="/img/logo_loght.png"
                width={70}
                height={70}
                alt="Logo Konawe Selatan"
              />
              <strong>
                Dinas Pendidikan dan Kebudayaan
                <small>Kabupaten Konawe Selatan</small>
              </strong>
            </div>
            <p>
              Jl. Poros Andoolo – Kendari, Kompleks Perkantoran Bupati
              <br />
              Kabupaten Konawe Selatan, Sulawesi Tenggara
            </p>
            <p>☎ (0408) 123 4567　 ✉ dikbud@konaweselatankab.go.id</p>
          </div>
          <div>
            <h4>Tautan Cepat</h4>
            {[
              "Beranda",
              "Tentang Kami",
              "Layanan Publik",
              "Data & Statistik",
              "Pendidikan",
              "Kebudayaan",
            ].map((x) => (
              <a href="#" key={x}>
                › {x}
              </a>
            ))}
          </div>
          <div>
            <h4>Layanan</h4>
            {[
              "Dapodik",
              "Pengaduan",
              "Download",
              "Regulasi",
              "PPID",
              "FAQ",
            ].map((x) => (
              <a href="#" key={x}>
                › {x}
              </a>
            ))}
          </div>
          <div className="social">
            <h4>Ikuti Kami</h4>
            <div>
              <a href="#">f</a>
              <a href="#">◎</a>
              <a href="#">▶</a>
              <a href="#">♪</a>
            </div>
            <strong>
              Konawe Selatan
              <br />
              <em>Maju Bersama</em>
            </strong>
          </div>
        </div>
        <div className="container copyright">
          <span>
            © 2026 Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. All
            rights reserved.
          </span>
          <span>Kebijakan Privasi　|　Syarat & Ketentuan　|　Peta Situs</span>
        </div>
      </footer>
    </main>
  );
}
