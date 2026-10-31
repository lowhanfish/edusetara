import Image from "next/image";
import Link from "next/link";

import { latestNews } from "./home-data";
import { Arrow } from "./shared";

const newsThumbnails = [
  "/img/kebudayaan-warisan.jpg",
  "/img/pendidikan-gtk.jpg",
  "/img/kebudayaan-sanggar.jpg",
];

export function NewsSection() {
  return (
    <section className="card news home-news-card" id="berita">
      <div className="home-news-header">
        <div className="home-news-heading">
          <span className="home-news-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6.75 4.75h10.5v14.5H6.75z" />
              <path d="M9.5 8.25h5M9.5 11.5h5M9.5 14.75h3.25" />
              <path d="M4.25 7.25v10.5c0 .83.67 1.5 1.5 1.5h1" />
            </svg>
          </span>
          <div>
            <span className="home-news-kicker">Informasi terbaru</span>
            <h3>Berita Terkini</h3>
          </div>
        </div>
        <Link href="/berita" className="home-news-all-link">
          Semua berita <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="news-layout">
        <article className="lead-news">
          <Link
            href="/berita/teknologi-pembelajaran-sekolah"
            className="lead-news-link"
            aria-label="Baca selengkapnya: Dikbud Konsel Dorong Pemanfaatan Teknologi dalam Pembelajaran di Sekolah"
          >
            <div className="news-photo">
              <Image
                src="/img/pendidikan-jenjang.jpg"
                alt="Kegiatan belajar berbasis teknologi"
                fill
                sizes="440px"
              />
              <span className="tag">Pendidikan</span>
            </div>
            <div className="lead-news-content">
              <time dateTime="2026-09-05">5 September 2026</time>
              <h4>
                Dikbud Konsel Dorong Pemanfaatan Teknologi dalam Pembelajaran di
                Sekolah
              </h4>
              <span className="lead-news-cta">
                Baca selengkapnya <Arrow />
              </span>
            </div>
          </Link>
        </article>
        <div className="news-list">
          {latestNews.map(({ id, slug, title, date, category }, index) => {
            const targetSlug =
              slug ||
              (index === 0
                ? "festival-budaya-daerah-2026"
                : index === 1
                  ? "sosialisasi-kurikulum-merdeka-guru"
                  : "bantuan-sarana-sekolah-pelosok");
            const thumbSrc = newsThumbnails[index % newsThumbnails.length];

            return (
              <article key={id}>
                <Link
                  href={`/berita/${targetSlug}`}
                  className="news-item-link"
                  aria-label={`Baca: ${title}`}
                >
                  <div className={`thumb thumb-${index}`}>
                    <Image
                      src={thumbSrc}
                      alt=""
                      fill
                      sizes="100px"
                    />
                  </div>
                  <div className="news-item-content">
                    <div className="news-item-meta">
                      <span className="mini-tag">{category}</span>
                      <time>{date}</time>
                    </div>
                    <h5>{title}</h5>
                    <span className="news-item-cta" aria-hidden="true">
                      Baca berita <span>→</span>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      <div className="news-footer-action">
        <Link href="/berita" className="view-all-link">
          <span>Lihat semua berita &amp; warta dinas</span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
