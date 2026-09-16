import Image from "next/image";
import Link from "next/link";

import { latestNews } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

const newsThumbnails = [
  "/img/kebudayaan-warisan.jpg",
  "/img/pendidikan-gtk.jpg",
  "/img/kebudayaan-sanggar.jpg",
];

export function NewsSection() {
  return (
    <section className="card news" id="berita">
      <SectionHeading icon="▣" title="Berita Terkini" />
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
            </div>
            <span className="tag">Pendidikan</span>
            <h4>
              Dikbud Konsel Dorong Pemanfaatan Teknologi dalam Pembelajaran di
              Sekolah
            </h4>
            <time>5 September 2026</time>
            <Arrow />
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
                  <div>
                    <h5>{title}</h5>
                    <small>{date}</small>
                    <span className="mini-tag">{category}</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      <div className="news-footer-action">
        <Link href="/berita" className="view-all-link">
          <span>Lihat Semua Berita &amp; Warta Dinas</span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
