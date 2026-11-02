"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import type { AnnouncementItem } from "../types";
import { usePublicAnnouncements } from "../hooks/useAnnouncements";

const CATEGORIES = [
  "Semua",
  "Akademik & ANBK",
  "Kepegawaian / PPPK",
  "Pendataan & Dapodik",
  "Kebudayaan & Event",
] as const;

const PAGE_SIZE = 4;


export function AnnouncementsFeed() {
  const { announcements, isLoading, isError } = usePublicAnnouncements();
  const searchId = useId();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<AnnouncementItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalItem(null);
      }
    };
    if (modalItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalItem]);

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
        const matchCategoryText = item.category.toLowerCase().includes(q);
        const matchAudience = item.targetAudience.toLowerCase().includes(q);
        return (
          matchTitle ||
          matchSummary ||
          matchNumber ||
          matchCategoryText ||
          matchAudience
        );
      }

      return true;
    });
  }, [announcements, selectedCategory, searchQuery]);

  const urgentAnnouncements = useMemo(() => {
    return announcements.filter((item) => item.important);
  }, [announcements]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, safeCurrentPage]);

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
    document.getElementById("directory-results-meta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setSelectedCategory("Semua");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== "Semua" || Boolean(searchQuery);

  const handleDownload = (item: AnnouncementItem) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      setDownloadingId(null);
      const content = [
        "==========================================================================",
        "PEMERINTAH KABUPATEN KONAWE SELATAN",
        "DINAS PENDIDIKAN DAN KEBUDAYAAN",
        "Kompleks Perkantoran Pemerintah Daerah Kab. Konawe Selatan, Andoolo 93382",
        "==========================================================================",
        "",
        `SURAT EDARAN RESMI NOMOR: ${item.number}`,
        `Tanggal Penetapan : ${item.day} ${item.month} ${item.year}`,
        `Kategori          : ${item.category}`,
        `Perihal           : ${item.title}`,
        `Sasaran Dokumen   : ${item.targetAudience}`,
        `Batas Waktu       : ${item.deadline}`,
        `Penandatangan     : ${item.signatory}`,
        "",
        "RINGKASAN EKSEKUTIF:",
        item.summary,
        "",
        "POIN-POIN MAKLUMAT & PETUNJUK TEKNIS:",
        ...item.keyPoints.map((pt, idx) => `  ${idx + 1}. ${pt}`),
        "",
        "MAKLUMAT INTEGRITAS & KEABSAHAN:",
        "Dokumen ini diterbitkan secara sah dan terdaftar pada Sistem Informasi",
        "Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
        "Seluruh tahapan layanan dan koordinasi 100% BEBAS BIAYA (GRATIS).",
        "==========================================================================",
      ].join("\n");

      if (item.fileUrl) {
        const link = document.createElement("a");
        link.href = item.fileUrl;
        link.download = item.attachmentName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.attachmentName.replace(".pdf", ".txt");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 500);
  };

  if (isLoading) return <p>Memuat pengumuman…</p>;
  if (isError) return <p role="alert">Pengumuman belum dapat dimuat.</p>;
  return (
    <div className="announcements-feed-container">
      {/* SECTION: Sorotan Pengumuman Prioritas (Tampil jika filter belum aktif) */}
      {!hasActiveFilters && urgentAnnouncements.length > 0 && (
        <section
          className="service-section announcements-spotlight-section"
          aria-labelledby="spotlight-heading"
        >
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Perhatian Segera</p>
              <h2 id="spotlight-heading">Sorotan Pengumuman Prioritas &amp; Mendesak</h2>
            </div>
            <p>
              Instruksi dan edaran dengan batas waktu penuntasan terdekat yang
              memerlukan tindak lanjut cepat dari satuan pendidikan dan masyarakat.
            </p>
          </div>

          <div className="announcements-spotlight-grid">
            {urgentAnnouncements.map((item) => {
              const isDownloading = downloadingId === item.id;
              return (
                <article
                  key={`spotlight-${item.id}`}
                  className={`announcement-spotlight-card tone-${item.tone} news-glass-card`}
                >
                  <div className="spotlight-card-head">
                    <div className="spotlight-badge-wrap">
                      <span className="spotlight-pulse-dot" aria-hidden="true" />
                      <span className="spotlight-urgent-tag">Mendesak / Prioritas</span>
                    </div>
                    <span className="spotlight-category-chip">{item.category}</span>
                  </div>

                  <div className="spotlight-card-body">
                    <div className="spotlight-meta-row">
                      <span className="spotlight-number">No: {item.number}</span>
                      <span className="meta-bullet">•</span>
                      <time className="spotlight-date">
                        {item.day} {item.month} {item.year}
                      </time>
                    </div>

                    <h3 className="spotlight-title">{item.title}</h3>
                    <p className="spotlight-summary">{item.summary}</p>

                    <div className="spotlight-quick-info">
                      <div className="quick-info-item">
                        <span className="quick-info-label">Sasaran:</span>
                        <strong className="quick-info-value">{item.targetAudience}</strong>
                      </div>
                      <div className="quick-info-item highlight-deadline">
                        <span className="quick-info-label">Batas Waktu:</span>
                        <strong className="quick-info-value">{item.deadline}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="spotlight-card-footer">
                    <button
                      type="button"
                      className="spotlight-btn-view"
                      onClick={() => setModalItem(item)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="btn-icon"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Buka Maklumat Resmi</span>
                      <span className="btn-arrow" aria-hidden="true">→</span>
                    </button>

                    <button
                      type="button"
                      className="spotlight-btn-download"
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      aria-label={`Unduh ${item.attachmentName}`}
                    >
                      {isDownloading ? (
                        <span>Mengunduh...</span>
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="btn-icon"
                            aria-hidden="true"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Unduh PDF ({item.attachmentSize})</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION: Direktori Lengkap & Filter */}
      <section
        className="service-section announcements-directory-section"
        aria-labelledby="directory-heading"
      >
        <div className="service-section-heading">
          <div>
            <p className="section-kicker">Direktori Publikasi</p>
            <h2 id="directory-heading">Koleksi Lengkap Surat Edaran &amp; Juknis</h2>
          </div>
          <p>
            Gunakan kotak pencarian atau pilih kategori bidang untuk menelusuri
            surat edaran dan pedoman teknis yang telah diterbitkan.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="announcements-filter-bar news-glass-card" role="search">
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
                placeholder="Cari pengumuman, perihal, nomor surat edaran, atau sasaran..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Cari pengumuman dan surat edaran"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => handleSearchChange("")}
                  aria-label="Hapus kata kunci pencarian"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div
            className="announcement-categories-wrap"
            role="tablist"
            aria-label="Kategori Dokumen"
          >
            {CATEGORIES.map((cat) => {
              const count =
                cat === "Semua"
                  ? announcements.length
                  : announcements.filter((item) => item.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  type="button"
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  className={`announcement-cat-pill${isActive ? " active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  <span>{cat}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}

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
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="announcements-result-meta" id="directory-results-meta">
          <div className="results-badge">
            <span className="live-dot" />
            <span>
              Menampilkan <strong>{filteredItems.length}</strong> publikasi dokumen
              resmi
              {selectedCategory !== "Semua" && (
                <> pada bidang <strong>{selectedCategory}</strong></>
              )}
              {searchQuery && (
                <> dengan kata kunci &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
              )}
            </span>
          </div>
        </div>

        {/* Announcements Cards Grid */}
        {filteredItems.length > 0 ? (
          <>
            <div className="announcements-cards-list">
              {paginatedItems.map((item) => {
              const isDownloading = downloadingId === item.id;

              return (
                <article
                  className={`announcement-card-modern tone-${item.tone} news-glass-card`}
                  key={item.id}
                  id={item.id}
                >
                  {/* Left: Modern Calendar Badge */}
                  <div className="announcement-date-col">
                    <time
                      className="announcement-calendar-badge"
                      dateTime={`${item.year}-${item.month}-${item.day}`}
                    >
                      <span className="cal-month">{item.month}</span>
                      <span className="cal-day">{item.day}</span>
                      <span className="cal-year">{item.year}</span>
                    </time>
                    {item.important && (
                      <span className="announcement-priority-badge">Prioritas</span>
                    )}
                  </div>

                  {/* Middle: Content */}
                  <div className="announcement-main-col">
                    <div className="announcement-meta-top">
                      <span className="announcement-category-tag">
                        {item.category}
                      </span>
                      <span className="meta-bullet">•</span>
                      <span className="announcement-number-tag">
                        <small>No Surat:</small> {item.number}
                      </span>
                    </div>

                    <h3 className="announcement-title-modern">{item.title}</h3>
                    <p className="announcement-summary-modern">{item.summary}</p>

                    {/* Quick Metadata */}
                    <div className="announcement-card-meta-chips">
                      <div className="meta-chip-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="chip-icon"
                          aria-hidden="true"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>{item.targetAudience}</span>
                      </div>
                      <div className="meta-chip-item deadline-chip">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="chip-icon"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{item.deadline}</span>
                      </div>
                    </div>

                    {/* Attachment Bar & Actions */}
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
                        <div>
                          <strong>{item.attachmentName}</strong>
                          <small>Dokumen Resmi PDF · {item.attachmentSize}</small>
                        </div>
                      </div>

                      <div className="announcement-card-actions">
                        <button
                          type="button"
                          onClick={() => setModalItem(item)}
                          className="announcement-view-btn"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="action-svg-icon"
                            aria-hidden="true"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>Buka Maklumat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="announcement-download-link"
                          aria-label={`Unduh berkas ${item.attachmentName}`}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <span>Mengunduh...</span>
                          ) : (
                            <>
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
                              <span>Unduh Dokumen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <nav
                className="announcements-pagination"
                aria-label="Navigasi halaman pengumuman"
              >
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        className={`pagination-num${
                          p === safeCurrentPage ? " active" : ""
                        }`}
                        onClick={() => handlePageChange(p)}
                        aria-current={
                          p === safeCurrentPage ? "page" : undefined
                        }
                        aria-label={`Ke halaman ${p}`}
                      >
                        {p}
                      </button>
                    )
                  )}
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
                Halaman <strong>{safeCurrentPage}</strong> dari{" "}
                <strong>{totalPages}</strong> (Menampilkan{" "}
                {paginatedItems.length} dari {filteredItems.length} publikasi)
              </div>
            </div>
          )}
        </>
      ) : (
          <div className="news-empty-state news-glass-card">
            <div className="empty-icon" aria-hidden="true">
              ⌕
            </div>
            <h3>Tidak Ada Pengumuman yang Cocok</h3>
            <p>
              Maaf, kami tidak menemukan pengumuman atau surat edaran dengan kata
              kunci &ldquo;{searchQuery}&rdquo; pada bidang &ldquo;
              {selectedCategory}&rdquo;.
            </p>
            <button
              type="button"
              className="clear-all-btn"
              onClick={resetFilters}
            >
              Reset Filter &amp; Tampilkan Semua
            </button>
          </div>
        )}
      </section>

      {/* MODAL: Pembaca Dokumen & Maklumat Resmi */}
      {modalItem && (
        <div
          className="announcement-modal-backdrop"
          onClick={() => setModalItem(null)}
          role="presentation"
        >
          <div
            className="announcement-modal news-glass-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-announcement-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Kop Surat Resmi Dinas */}
            <div className="modal-kop-surat">
              <div className="kop-logo-wrap">
                <Image
                  src="/img/logo_loght.png"
                  alt="Logo Kabupaten Konawe Selatan"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div className="kop-text">
                <h4>PEMERINTAH KABUPATEN KONAWE SELATAN</h4>
                <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
                <p>
                  Kompleks Perkantoran Pemerintah Daerah Kab. Konawe Selatan, Andoolo 93382
                </p>
                <small>Pos-el: dikbud@konaweselatankab.go.id · Laman: dikbud.konaweselatankab.go.id</small>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalItem(null)}
                aria-label="Tutup jendela maklumat"
              >
                ×
              </button>
            </div>

            <div className="kop-divider" aria-hidden="true">
              <span className="divider-line-thick" />
              <span className="divider-line-thin" />
            </div>

            {/* Modal Body */}
            <div className="modal-decree-body">
              {/* Decree Metadata */}
              <div className="decree-meta-strip">
                <div className="decree-meta-item">
                  <span className="meta-title">Nomor Dokumen</span>
                  <strong>{modalItem.number}</strong>
                </div>
                <div className="decree-meta-item">
                  <span className="meta-title">Tanggal Penetapan</span>
                  <strong>
                    {modalItem.day} {modalItem.month} {modalItem.year}
                  </strong>
                </div>
                <div className="decree-meta-item">
                  <span className="meta-title">Bidang Urusan</span>
                  <span className="decree-cat-badge">{modalItem.category}</span>
                </div>
                <div className="decree-meta-item">
                  <span className="meta-title">Status Legalitas</span>
                  <span className="decree-verified-badge">
                    <span className="verified-dot" /> Terverifikasi Sah
                  </span>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="decree-subject-box">
                <span className="subject-kicker">Perihal Edaran / Maklumat:</span>
                <h2 id="modal-announcement-title" className="decree-subject-heading">
                  {modalItem.title}
                </h2>
              </div>

              {/* Targets & Schedule */}
              <div className="decree-target-grid">
                <div className="decree-target-card">
                  <span className="card-label">Sasaran Penerima Edaran:</span>
                  <strong className="card-val">{modalItem.targetAudience}</strong>
                </div>
                <div className="decree-target-card alert-card">
                  <span className="card-label">Batas Waktu Pelaksanaan:</span>
                  <strong className="card-val">{modalItem.deadline}</strong>
                </div>
              </div>

              {/* Summary */}
              <div className="decree-content-block">
                <h4>Ringkasan Latar Belakang</h4>
                <p>{modalItem.summary}</p>
              </div>

              {/* Key Instructions Points */}
              <div className="decree-content-block">
                <h4>Butir-Butir Instruksi &amp; Petunjuk Pelaksanaan</h4>
                <ol className="decree-instructions-list">
                  {modalItem.keyPoints.map((point, index) => (
                    <li key={point}>
                      <span className="point-number">{String(index + 1).padStart(2, "0")}</span>
                      <p>{point}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Signatory Seal */}
              <div className="decree-signatory-wrap">
                <div className="signatory-box">
                  <small>Ditetapkan di Andoolo</small>
                  <p>Atas Nama Pemerintah Kabupaten Konawe Selatan</p>
                  <strong>{modalItem.signatory}</strong>
                  <div className="decree-seal-badge">
                    <span>SEALED &amp; VERIFIED</span>
                    <small>DIKBUD KONSEL DIGITAL REPOSITORY</small>
                  </div>
                </div>
              </div>

              {/* Anti-Pungli Reminder inside Modal */}
              <div className="decree-integrity-alert">
                <span className="alert-icon" aria-hidden="true">🛡</span>
                <p>
                  <strong>Jaminan Bebas Pungutan Liar (100% Bebas Biaya):</strong> Pelaksanaan
                  seluruh agenda dan administrasi edaran ini tidak dikenakan tarif apa pun.
                  Lapor segera jika menemukan pungli ke Inspektorat atau Kanal Layanan Resmi Dikbud Konsel.
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer-actions">
              <div className="file-desc-pill">
                <span className="file-name">{modalItem.attachmentName}</span>
                <span className="file-size">({modalItem.attachmentSize})</span>
              </div>

              <div className="footer-btns-group">
                <button
                  type="button"
                  className="modal-btn-close"
                  onClick={() => setModalItem(null)}
                >
                  Tutup Maklumat
                </button>
                <button
                  type="button"
                  className="modal-btn-download"
                  onClick={() => handleDownload(modalItem)}
                  disabled={downloadingId === modalItem.id}
                >
                  {downloadingId === modalItem.id ? (
                    <span>Mengunduh...</span>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="btn-svg-icon"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Unduh Salinan Dokumen Resmi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
