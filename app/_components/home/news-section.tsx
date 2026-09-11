import Image from "next/image";

import { latestNews } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

export function NewsSection() {
  return (
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
            Dikbud Konsel Dorong Pemanfaatan Teknologi dalam Pembelajaran di
            Sekolah
          </h4>
          <time>5 September 2026</time>
          <Arrow />
        </article>
        <div className="news-list">
          {latestNews.map(({ title, date, category }, index) => (
            <article key={title}>
              <div className={`thumb thumb-${index}`}>
                <Image src="/img/hero-konsel.png" alt="" fill sizes="100px" />
              </div>
              <div>
                <h5>{title}</h5>
                <small>{date}</small>
                <span className="mini-tag">{category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
