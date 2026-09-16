"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { NewsArticle } from "../_data/news-data";

interface NewsFeedProps {
  initialArticles: NewsArticle[];
}

const CATEGORIES = [
  "Semua",
  "Pendidikan",
  "Kebudayaan",
  "GTK & Guru",
  "Sarana Prasarana",
  "Prestasi Siswa",
] as const;

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchCategory && matchQuery;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  // Featured news article (only shown at top if we're on "Semua" without active search)
  const isDefaultView = selectedCategory === "Semua" && !searchQuery.trim();
  const featuredArticle = isDefaultView
    ? initialArticles.find((a) => a.featured) ?? initialArticles[0]
    : null;

  const gridArticles = useMemo(() => {
    if (featuredArticle && isDefaultView) {
      return filteredArticles.filter((a) => a.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle, isDefaultView]);

  return (
    <div className="news-feed-container">
      {/* Search & Filter Controls */}
      <div className="news-filter-bar news-glass-card">
        <div className="news-search-box">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita, topik, kata kunci, inovasi..."
            aria-label="Cari artikel berita"
            className="news-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Bersihkan pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="news-category-pills" role="tablist" aria-label="Kategori berita">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "Semua"
                ? initialArticles.length
                : initialArticles.filter((a) => a.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`news-cat-pill${isActive ? " active" : ""}`}
              >
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="news-results-info">
        <div className="results-badge">
          <span className="live-dot" />
          <span>
            {searchQuery
              ? `Hasil pencarian "${searchQuery}": ${filteredArticles.length} berita`
              : `Menampilkan ${filteredArticles.length} warta & publikasi resmi`}
          </span>
        </div>
        {selectedCategory !== "Semua" && (
          <button
            type="button"
            className="reset-filter-btn"
            onClick={() => {
              setSelectedCategory("Semua");
              setSearchQuery("");
            }}
          >
            Tampilkan Semua Kategori ✕
          </button>
        )}
      </div>

      {/* Featured Headline Banner (When in default view) */}
      {featuredArticle && (
        <section className="news-headline-section" aria-label="Berita Utama">
          <Link
            href={`/berita/${featuredArticle.slug}`}
            className="news-headline-card news-glass-card"
            aria-label={`Baca berita utama: ${featuredArticle.title}`}
          >
            <div className="headline-image-wrap">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 550px"
                className="headline-img"
              />
              <span className="headline-badge">Berita Utama</span>
            </div>
            <div className="headline-content">
              <div className="headline-meta-top">
                <span className="news-cat-tag">{featuredArticle.category}</span>
                <span className="meta-bullet">•</span>
                <time className="news-date">{featuredArticle.date}</time>
                <span className="meta-bullet">•</span>
                <span className="read-time">{featuredArticle.readTime}</span>
              </div>
              <h2 className="headline-title">{featuredArticle.title}</h2>
              <p className="headline-excerpt">{featuredArticle.excerpt}</p>
              <div className="headline-tags">
                {featuredArticle.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="meta-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="headline-cta">
                <span className="read-more-text">Baca Selengkapnya</span>
                <span className="cta-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* News Grid */}
      {gridArticles.length > 0 ? (
        <div className="news-modern-grid">
          {gridArticles.map((article) => (
            <Link
              key={article.id}
              href={`/berita/${article.slug}`}
              className="news-card-modern news-glass-card"
              aria-label={`Baca artikel: ${article.title}`}
            >
              <div className="card-thumb-wrap">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="card-thumb-img"
                />
                <span className="card-cat-badge">{article.category}</span>
              </div>
              <div className="card-body">
                <div className="card-meta-row">
                  <time className="card-date">{article.date}</time>
                  <span className="meta-sep">/</span>
                  <span className="card-read-time">{article.readTime}</span>
                </div>
                <h3 className="card-title">{article.title}</h3>
                <p className="card-excerpt">{article.excerpt}</p>
                <div className="card-footer">
                  <span className="card-author">Oleh {article.author}</span>
                  <span className="card-arrow" aria-hidden="true">
                    Baca Warta ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="news-empty-state news-glass-card">
          <div className="empty-icon" aria-hidden="true">
            ⌕
          </div>
          <h3>Tidak Ada Berita yang Ditemukan</h3>
          <p>
            Maaf, kami tidak menemukan berita yang sesuai dengan kata kunci &ldquo;
            {searchQuery}&rdquo; pada kategori &ldquo;{selectedCategory}&rdquo;.
          </p>
          <button
            type="button"
            className="clear-all-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
            }}
          >
            Reset Pencarian &amp; Lihat Semua Berita
          </button>
        </div>
      )}
    </div>
  );
}
