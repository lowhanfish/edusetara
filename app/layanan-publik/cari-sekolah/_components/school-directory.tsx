"use client";

import { useId, useMemo, useState } from "react";

export interface SchoolItem {
  npsn: string;
  name: string;
  address: string;
  village: string;
  district: string;
  level: "SD" | "SMP" | string;
  status: "NEGERI" | "SWASTA" | string;
  url: string;
}

interface SchoolDirectoryProps {
  schools: SchoolItem[];
}

const ITEMS_PER_PAGE = 12;

export function SchoolDirectory({ schools }: SchoolDirectoryProps) {
  const searchInputId = useId();
  const districtSelectId = useId();

  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique sorted districts
  const districts = useMemo(() => {
    return Array.from(new Set(schools.map((s) => s.district))).sort((a, b) =>
      a.localeCompare(b, "id"),
    );
  }, [schools]);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools.filter((school) => {
      if (district && school.district !== district) return false;
      if (level && school.level !== level) return false;
      if (status && school.status !== status) return false;
      if (q) {
        const matchName = school.name.toLowerCase().includes(q);
        const matchNpsn = school.npsn.toLowerCase().includes(q);
        const matchVillage = school.village.toLowerCase().includes(q);
        const matchAddress = school.address.toLowerCase().includes(q);
        return matchName || matchNpsn || matchVillage || matchAddress;
      }
      return true;
    });
  }, [schools, query, district, level, status]);

  // Reset pagination when filter changes
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };
  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setCurrentPage(1);
  };
  const handleLevelChange = (val: string) => {
    setLevel((prev) => (prev === val ? "" : val));
    setCurrentPage(1);
  };
  const handleStatusChange = (val: string) => {
    setStatus((prev) => (prev === val ? "" : val));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setQuery("");
    setDistrict("");
    setLevel("");
    setStatus("");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(query || district || level || status);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentSchools = filteredSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="school-directory-container">
      {/* Modern Filter Dashboard Panel */}
      <section className="school-filter-panel" aria-label="Filter Pencarian Sekolah">
        {/* Row 1: Search Input & District Selector */}
        <div className="school-filter-top-row">
          <div className="school-search-box">
            <label htmlFor={searchInputId} className="school-filter-label">
              Cari Satuan Pendidikan
            </label>
            <div className="school-search-input-wrapper">
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
                id={searchInputId}
                type="search"
                className="school-search-input"
                placeholder="Ketik nama sekolah, NPSN, atau nama desa..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => handleQueryChange("")}
                  aria-label="Hapus kata kunci pencarian"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="clear-icon-svg"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="school-district-box">
            <label htmlFor={districtSelectId} className="school-filter-label">
              Wilayah Kecamatan
            </label>
            <div className="school-select-wrapper">
              <select
                id={districtSelectId}
                className="school-filter-select"
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                <option value="">Semua Kecamatan ({districts.length})</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    Kec. {d}
                  </option>
                ))}
              </select>
              <svg
                className="select-chevron-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Modern Pill Toggles for Level and Status */}
        <div className="school-filter-bottom-row">
          <div className="pill-filter-group">
            <span className="school-filter-label">Jenjang:</span>
            <div className="pill-buttons-wrap" role="group" aria-label="Filter Jenjang">
              <button
                type="button"
                className={`filter-pill${level === "" ? " active" : ""}`}
                onClick={() => handleLevelChange("")}
              >
                Semua
              </button>
              <button
                type="button"
                className={`filter-pill${level === "SD" ? " active" : ""}`}
                onClick={() => handleLevelChange("SD")}
              >
                <span className="pill-indicator indicator-sd" />
                SD (Dasar)
              </button>
              <button
                type="button"
                className={`filter-pill${level === "SMP" ? " active" : ""}`}
                onClick={() => handleLevelChange("SMP")}
              >
                <span className="pill-indicator indicator-smp" />
                SMP (Menengah)
              </button>
            </div>
          </div>

          <div className="pill-filter-group">
            <span className="school-filter-label">Status:</span>
            <div className="pill-buttons-wrap" role="group" aria-label="Filter Status">
              <button
                type="button"
                className={`filter-pill${status === "" ? " active" : ""}`}
                onClick={() => handleStatusChange("")}
              >
                Semua
              </button>
              <button
                type="button"
                className={`filter-pill${status === "NEGERI" ? " active" : ""}`}
                onClick={() => handleStatusChange("NEGERI")}
              >
                <span className="pill-indicator indicator-negeri" />
                Negeri
              </button>
              <button
                type="button"
                className={`filter-pill${status === "SWASTA" ? " active" : ""}`}
                onClick={() => handleStatusChange("SWASTA")}
              >
                <span className="pill-indicator indicator-swasta" />
                Swasta
              </button>
            </div>
          </div>

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
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset Filter
            </button>
          )}
        </div>
      </section>

      {/* Results Header / Counter */}
      <div className="school-results-header">
        <div className="school-count-info">
          <span className="count-pulse-dot" />
          <span>
            Menemukan <strong>{filteredSchools.length}</strong> sekolah
            {hasActiveFilters ? " dari hasil filter" : " di Konawe Selatan"}
          </span>
        </div>

        {totalPages > 1 && (
          <span className="school-page-indicator">
            Halaman {page} dari {totalPages}
          </span>
        )}
      </div>

      {/* School Cards Grid */}
      {currentSchools.length > 0 ? (
        <div className="school-cards-grid">
          {currentSchools.map((school) => (
            <article className="school-card" key={school.npsn}>
              <div className="school-card-top">
                <div className="school-badges">
                  <span
                    className={`school-badge badge-${school.level.toLowerCase()}`}
                  >
                    <span className="badge-dot" />
                    {school.level}
                  </span>
                  <span
                    className={`school-badge badge-${school.status.toLowerCase()}`}
                  >
                    {school.status}
                  </span>
                </div>
                <span className="school-npsn">
                  <small>NPSN</small>
                  <strong>{school.npsn}</strong>
                </span>
              </div>

              <h3 className="school-name">{school.name}</h3>

              <div className="school-meta">
                <p className="school-location">
                  <svg
                    className="meta-svg-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    Kec. <strong>{school.district}</strong>
                    {school.village && school.village !== "-"
                      ? `, Desa/Kel. ${school.village}`
                      : ""}
                  </span>
                </p>

                {school.address && school.address !== "-" && (
                  <p className="school-address">
                    <svg
                      className="meta-svg-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>{school.address}</span>
                  </p>
                )}
              </div>

              <div className="school-card-footer">
                <a
                  href={school.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="school-external-link"
                >
                  <span>Data Referensi Kemendikdasmen</span>
                  <svg
                    className="arrow-svg-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
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
          <h3>Satuan pendidikan tidak ditemukan</h3>
          <p>
            Tidak ada sekolah yang cocok dengan kriteria pencarian Anda. Coba
            periksa ejaan kata kunci atau reset filter wilayah dan jenjang.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={resetFilters}
          >
            Tampilkan Semua Sekolah
          </button>
        </div>
      )}

      {/* Modern Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="school-pagination"
          aria-label="Navigasi Halaman Direktori Sekolah"
        >
          <button
            type="button"
            className="pagination-btn prev-btn"
            disabled={page <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Sebelumnya
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
                );
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <span key={p} className="pagination-num-group">
                    {showEllipsis && (
                      <span className="pagination-ellipsis">…</span>
                    )}
                    <button
                      type="button"
                      className={`pagination-num${p === page ? " active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                      aria-current={p === page ? "page" : undefined}
                      aria-label={`Ke halaman ${p}`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
          </div>

          <button
            type="button"
            className="pagination-btn next-btn"
            disabled={page >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}
