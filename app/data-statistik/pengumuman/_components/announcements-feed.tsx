"use client";

import { useId, useMemo, useState } from "react";

export interface AnnouncementItem {
  id: string;
  number: string;
  day: string;
  month: string;
  year: string;
  category: "Akademik & ANBK" | "Kepegawaian / PPPK" | "Pendataan & Dapodik" | "Kebudayaan & Event";
  title: string;
  summary: string;
  attachmentName: string;
  attachmentSize: string;
}

const CATEGORIES = [
  "Semua",
  "Akademik & ANBK",
  "Kepegawaian / PPPK",
  "Pendataan & Dapodik",
  "Kebudayaan & Event",
] as const;

interface AnnouncementsFeedProps {
  announcements: AnnouncementItem[];
}

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  const searchId = useId();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return announcements.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;

      if (!matchCategory) return false;

      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchNumber = item.number.toLowerCase().includes(q);
        return matchTitle || matchSummary || matchNumber;
      }

      return true;
    });
  }, [announcements, selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("Semua");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "Semua" || Boolean(searchQuery);

  return (
    <div className="announcements-feed-container">
      {/* Search & Category Filter Bar */}
      <section className="announcements-filter-bar" aria-label="Filter Pengumuman">
        <div className="announcements-search-row">
          <div className="announcement-search-wrapper">
            <svg
              className="search-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id={searchId}
              type="search"
              className="announcement-search-input"
              placeholder="Cari pengumuman, nomor surat, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus kata kunci pencarian"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="announcement-categories-wrap" role="group" aria-label="Kategori Pengumuman">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`announcement-cat-pill${selectedCategory === cat ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              className="school-reset-chip"
              onClick={resetFilters}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="reset-icon-svg"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Counter */}
      <div className="announcements-result-meta">
        <p>
          Menampilkan <strong>{filteredItems.length}</strong> pengumuman resmi
          {selectedCategory !== "Semua" && (
            <span> pada kategori <strong>{selectedCategory}</strong></span>
          )}
          {searchQuery && (
            <span> dengan kata kunci &quot;<strong>{searchQuery}</strong>&quot;</span>
          )}
        </p>
      </div>

      {/* Announcements List */}
      {filteredItems.length > 0 ? (
        <div className="announcements-cards-list">
          {filteredItems.map((item) => (
            <article className="announcement-card-modern" key={item.id}>
              {/* Left: Modern Calendar Badge */}
              <div className="announcement-date-col">
                <time className="announcement-calendar-badge" dateTime={`${item.year}-${item.month}-${item.day}`}>
                  <span className="cal-month">{item.month}</span>
                  <span className="cal-day">{item.day}</span>
                  <span className="cal-year">{item.year}</span>
                </time>
              </div>

              {/* Middle: Content */}
              <div className="announcement-main-col">
                <div className="announcement-meta-top">
                  <span className="announcement-category-tag">{item.category}</span>
                  <span className="announcement-number-tag">
                    <small>No:</small> {item.number}
                  </span>
                </div>

                <h3 className="announcement-title-modern">{item.title}</h3>
                <p className="announcement-summary-modern">{item.summary}</p>

                <div className="announcement-attachment-box">
                  <div className="attachment-file-info">
                    <svg
                      className="attachment-svg-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>
                      <strong>{item.attachmentName}</strong>
                      <small>PDF · {item.attachmentSize}</small>
                    </span>
                  </div>

                  <a
                    href="#unduh"
                    className="announcement-download-link"
                    aria-label={`Unduh berkas ${item.attachmentName}`}
                  >
                    <span>Unduh Lampiran</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="download-chevron-svg"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="school-empty-state">
          <div className="empty-icon-wrap">
            <svg
              className="empty-search-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3>Tidak ada pengumuman yang cocok</h3>
          <p>
            Coba periksa kembali kata kunci pencarian Anda atau pilih kategori
            pengumuman lainnya.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={resetFilters}
          >
            Tampilkan Semua Pengumuman
          </button>
        </div>
      )}
    </div>
  );
}
