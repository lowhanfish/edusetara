import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsHero, NewsHelp } from "../_components/news-shell";
import { ShareButton } from "../_components/share-button";
import { getNewsBySlug, getRelatedNews, newsArticles } from "../_data/news-data";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const article = getNewsBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  return {
    title: `${article.title}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const article = getNewsBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedNews(article.slug, 3);

  return (
    <div className="news-detail-page">
      <NewsHero
        articleTitle={article.title}
        description={article.excerpt}
        status={`Kategori: ${article.category}`}
        subStatus={`Terbit: ${article.date}`}
        tags={article.tags}
      />

      <div className="container news-detail-container">
        <div className="news-detail-layout">
          {/* Main Article Content */}
          <article className="news-main-article news-glass-card">
            {/* Meta Bar */}
            <div className="article-meta-bar">
              <div className="meta-left">
                <span className="article-category-badge">{article.category}</span>
                <span className="meta-dot" aria-hidden="true">•</span>
                <time dateTime={article.publishedAt} className="article-time">
                  {article.date}
                </time>
                <span className="meta-dot" aria-hidden="true">•</span>
                <span className="article-readtime">{article.readTime}</span>
              </div>
              <div className="meta-author">
                <span className="author-avatar" aria-hidden="true">
                  ✎
                </span>
                <div>
                  <strong>{article.author}</strong>
                  <small>{article.authorRole}</small>
                </div>
              </div>
            </div>

            {/* Article Headline Title */}
            <h1 className="article-title">{article.title}</h1>

            {/* Featured Image */}
            <div className="article-featured-image">
              <div className="image-ratio-box">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 850px"
                  className="article-img"
                />
              </div>
              {article.imageCaption && (
                <figcaption className="article-caption">
                  <span className="caption-icon" aria-hidden="true">
                    📷
                  </span>
                  <span>{article.imageCaption}</span>
                </figcaption>
              )}
            </div>

            {/* Lead Paragraph */}
            <div className="article-lead-box">
              <p className="article-lead">{article.content.lead}</p>
            </div>

            {/* Body Paragraphs */}
            <div className="article-body-text">
              {article.content.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Quote Box (if available) */}
            {article.content.quote && (
              <blockquote className="article-quote-box">
                <div className="quote-mark" aria-hidden="true">
                  “
                </div>
                <p className="quote-text">{article.content.quote.text}</p>
                <footer className="quote-author">
                  <strong>{article.content.quote.author}</strong>
                  <cite>{article.content.quote.role}</cite>
                </footer>
              </blockquote>
            )}

            {/* Key Highlights Bullet Box */}
            {article.content.highlights && article.content.highlights.length > 0 && (
              <div className="article-highlights-box">
                <div className="highlights-header">
                  <span className="highlights-icon" aria-hidden="true">
                    ★
                  </span>
                  <h3>{article.content.highlightsTitle || "Poin Kunci & Sasaran:"}</h3>
                </div>
                <ul className="highlights-list">
                  {article.content.highlights.map((item, idx) => (
                    <li key={idx}>
                      <span className="bullet-indicator" aria-hidden="true">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags Cloud */}
            <div className="article-tags-wrap">
              <span className="tags-label">Kata Kunci Terkait:</span>
              <div className="tags-cloud">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Action Footer */}
            <div className="article-footer-nav">
              <Link href="/berita" className="btn-back-news">
                <span aria-hidden="true">←</span>
                <span>Kembali ke Daftar Berita</span>
              </Link>
              <div className="article-share-group">
                <span className="share-label">Bagikan warta ini:</span>
                <ShareButton title={article.title} />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="news-detail-sidebar" aria-label="Informasi Tambahan">
            {/* Quick Summary Widget */}
            <div className="sidebar-card news-glass-card">
              <div className="sidebar-card-header">
                <span className="header-dot" />
                <h4>Ringkasan Berita</h4>
              </div>
              <ul className="sidebar-info-list">
                <li>
                  <small>Kategori</small>
                  <strong>{article.category}</strong>
                </li>
                <li>
                  <small>Tanggal Rilis</small>
                  <strong>{article.date}</strong>
                </li>
                <li>
                  <small>Penulis / Redaksi</small>
                  <strong>{article.author}</strong>
                </li>
                <li>
                  <small>Waktu Baca</small>
                  <strong>{article.readTime}</strong>
                </li>
              </ul>
            </div>

            {/* Official Help Widget */}
            <div className="sidebar-card news-glass-card tone-blue">
              <h4>Kanal Pengaduan &amp; Informasi</h4>
              <p>
                Memerlukan klarifikasi atau konfirmasi resmi terkait warta dan program Dinas Pendidikan dan Kebudayaan?
              </p>
              <Link href="/tentang-kami/kontak" className="sidebar-cta-link">
                Hubungi PPID &amp; Humas →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related News Section - ALL CLICKABLE */}
        {relatedArticles.length > 0 && (
          <section className="related-news-section" aria-label="Berita Terkait">
            <div className="related-header">
              <div className="related-kicker">
                <span className="kicker-line" />
                <span>Rekomendasi Bacaan</span>
              </div>
              <h2>Warta &amp; Berita Terkait Lainnya</h2>
            </div>

            <div className="related-grid">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="related-news-card news-glass-card"
                  aria-label={`Baca warta: ${item.title}`}
                >
                  <div className="related-img-box">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="related-thumb"
                    />
                    <span className="related-cat">{item.category}</span>
                  </div>
                  <div className="related-body">
                    <time className="related-time">{item.date}</time>
                    <h3 className="related-title">{item.title}</h3>
                    <p className="related-desc">{item.excerpt}</p>
                    <span className="related-link-text">
                      Baca Selengkapnya <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <NewsHelp />
      </div>
    </div>
  );
}
