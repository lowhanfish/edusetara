import Link from "next/link";

export function NewsHero({
  title = "Pusat Warta & Kabar Pendidikan Kebudayaan",
  description = "Menyajikan perkembangan terbaru seputar kebijakan sekolah, prestasi siswa, inovasi guru, agenda kebudayaan, serta pemenuhan sarana dan prasarana di Kabupaten Konawe Selatan.",
  articleTitle,
  status = "Warta Terverifikasi",
  subStatus = "Update September 2026",
  tags = ["Pendidikan Terpadu", "Kebudayaan Daerah", "Inovasi GTK", "Prestasi Siswa"],
}: {
  title?: string;
  description?: string;
  articleTitle?: string;
  status?: string;
  subStatus?: string;
  tags?: string[];
}) {
  return (
    <section className="service-hero service-hero-glass news-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          {articleTitle ? (
            <>
              <Link href="/berita">Berita</Link>
              <span aria-hidden="true">/</span>
              <strong className="breadcrumb-current-truncate">{articleTitle}</strong>
            </>
          ) : (
            <strong>Berita &amp; Informasi</strong>
          )}
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline">
              <span /> Portal Berita Resmi Dikbud Konawe Selatan
            </p>
            <h1>{articleTitle || title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi publikasi warta">
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

export function NewsHelp() {
  return (
    <section className="about-cta service-cta news-cta">
      <div>
        <p className="section-kicker">Redaksi Berita &amp; Media Komunikasi</p>
        <h2>Punya Liputan Prestasi Sekolah atau Kegiatan Budaya di Wilayah Anda?</h2>
        <p>
          Tim Redaksi Dikbud Konawe Selatan menyambut kiriman siaran pers, dokumentasi inovasi pembelajaran guru, dan liputan pementasan sanggar budaya untuk dipublikasikan pada portal resmi dinas.
        </p>
      </div>
      <Link className="button primary" href="/tentang-kami/kontak">
        Hubungi Redaksi <span>→</span>
      </Link>
    </section>
  );
}
