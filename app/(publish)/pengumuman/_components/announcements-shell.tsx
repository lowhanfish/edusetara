import Link from "next/link";

export function AnnouncementsHero({
  title = "Pusat Pengumuman & Surat Edaran Kedinasan",
  description = "Akses siaran resmi, petunjuk teknis pelaksanaan program, hasil seleksi kepegawaian, dan informasi kedinasan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
  status = "Publikasi Terverifikasi",
  subStatus = "Tahun Anggaran 2026/2027",
  tags = ["Bebas Pungli (Gratis)", "Surat Edaran Resmi", "Juknis ANBK", "PPPK & Dapodik"],
}: {
  title?: string;
  description?: string;
  status?: string;
  subStatus?: string;
  tags?: string[];
}) {
  return (
    <section className="service-hero service-hero-glass announcements-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <strong>Pengumuman &amp; Surat Edaran</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline">
              <span /> Warta Resmi &amp; Surat Edaran Kedinasan Dikbud Konsel
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi verifikasi pengumuman">
            <div className="service-status">
              <span className="service-status-dot" />
              <div>
                <small>{status}</small>
                <strong>{subStatus}</strong>
              </div>
            </div>
            <div className="service-hero-meta">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function AnnouncementsHelp() {
  return (
    <section className="about-cta service-cta news-cta">
      <div>
        <p className="section-kicker">Pusat Konfirmasi &amp; Verifikasi Dokumen</p>
        <h2>Perlu Konfirmasi Keaslian Surat Edaran atau Layanan Kedinasan?</h2>
        <p>
          Seluruh pengurusan administrasi beasiswa PIP, pendataan Dapodik, dan seleksi PPPK di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan <strong>tidak dipungut biaya apapun (100% Gratis)</strong>. Hubungi kanal resmi kami bila Anda membutuhkan klarifikasi.
        </p>
      </div>
      <Link className="button primary" href="/tentang-kami/kontak">
        Hubungi Petugas <span>→</span>
      </Link>
    </section>
  );
}
