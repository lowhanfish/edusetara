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

const PAGE_SIZE = 4;

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const totalPages = Math.max(1, Math.ceil(gridArticles.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedArticles = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return gridArticles.slice(start, start + PAGE_SIZE);
  }, [gridArticles, safeCurrentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handlePageChange = (p: number) => {
    const newPage = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(newPage);
    document.getElementById("news-results-info")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari berita, topik, kata kunci, inovasi..."
            aria-label="Cari artikel berita"
            className="news-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => handleSearchChange("")}
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
                onClick={() => handleCategoryChange(cat)}
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
      <div className="news-results-info" id="news-results-info">
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
              handleCategoryChange("Semua");
              handleSearchChange("");
            }}
          >
            Tampilkan Semua Kategori ✕
          </button>
        )}
      </div>

      {/* Featured Headline Banner (When in default view and on first page) */}
      {featuredArticle && safeCurrentPage === 1 && (
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
      {paginatedArticles.length > 0 ? (
        <>
          <div className="news-modern-grid">
            {paginatedArticles.map((article) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <nav className="news-pagination" aria-label="Navigasi Halaman Berita">
                <button
                  type="button"
                  className="pagination-btn prev-btn"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  aria-label="Halaman sebelumnya"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pagination-chevron"
                    aria-hidden="true"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Sebelumnya
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={`pagination-num${p === safeCurrentPage ? " active" : ""}`}
                      onClick={() => handlePageChange(p)}
                      aria-current={p === safeCurrentPage ? "page" : undefined}
                      aria-label={`Ke halaman ${p}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-btn next-btn"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  aria-label="Halaman selanjutnya"
                >
                  Selanjutnya
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pagination-chevron"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </nav>

              <div className="pagination-meta-info">
                Halaman <strong>{safeCurrentPage}</strong> dari <strong>{totalPages}</strong> (Menampilkan {paginatedArticles.length} dari {gridArticles.length} artikel)
              </div>
            </div>
          )}
        </>
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
              handleSearchChange("");
              handleCategoryChange("Semua");
            }}
          >
            Reset Pencarian &amp; Lihat Semua Berita
          </button>
        </div>
      )}
    </div>
  );
}
