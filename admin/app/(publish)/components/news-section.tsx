"use client";

import Image from "next/image";
import Link from "next/link";

import { useHomeNews } from "../hooks/useHomeData";
import { Arrow } from "./shared";

const defaultThumbs = [
  "/img/kebudayaan-warisan.jpg",
  "/img/pendidikan-gtk.jpg",
  "/img/kebudayaan-sanggar.jpg",
];

export function NewsSection() {
  const { data: newsItems } = useHomeNews();

  const items = newsItems ?? [];
  const leadNews = items[0];
  const otherNews = items.slice(1, 4);

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
        {leadNews && (
          <article className="lead-news">
            <Link
              href={`/berita/${leadNews.slug || leadNews.id}`}
              className="lead-news-link"
              aria-label={`Baca selengkapnya: ${leadNews.title}`}
            >
              <div className="news-photo relative h-48 w-full">
                <Image
                  src={leadNews.image || "/img/pendidikan-jenjang.jpg"}
                  alt={leadNews.title}
                  fill
                  sizes="440px"
                  className="object-cover"
                  unoptimized={leadNews.image?.startsWith("http")}
                />
                <span className="tag">{leadNews.category || "Pendidikan"}</span>
              </div>
              <div className="lead-news-content">
                <time>{leadNews.date}</time>
                <h4>{leadNews.title}</h4>
                <p className="line-clamp-2 text-sm text-gray-600 mt-1">{leadNews.excerpt}</p>
                <span className="lead-news-cta">
                  Baca selengkapnya <Arrow />
                </span>
              </div>
            </Link>
          </article>
        )}

        <div className="news-list">
          {otherNews.map((item, index) => {
            const thumbSrc = item.image || defaultThumbs[index % defaultThumbs.length];

            return (
              <article key={item.id}>
                <Link
                  href={`/berita/${item.slug || item.id}`}
                  className="news-item-link"
                  aria-label={`Baca: ${item.title}`}
                >
                  <div className={`thumb relative w-20 h-20 shrink-0 overflow-hidden rounded`}>
                    <Image
                      src={thumbSrc}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="object-cover"
                      unoptimized={thumbSrc.startsWith("http")}
                    />
                  </div>
                  <div className="news-item-content">
                    <div className="news-item-meta">
                      <span className="mini-tag">{item.category}</span>
                      <time>{item.date}</time>
                    </div>
                    <h5>{item.title}</h5>
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
