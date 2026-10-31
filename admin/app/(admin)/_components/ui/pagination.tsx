"use client";

import React, { useMemo } from "react";

export interface PaginationProps {
  page: number;
  onPageChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange?: (newPageSize: number) => void;
  total: number;
  pageSizeOptions?: number[];
  pageShow?: number;
  className?: string;
  showSummary?: boolean;
}

export function Pagination({
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
  pageSizeOptions = [5, 10, 20, 50],
  pageShow = 5,
  className = "",
  showSummary = true,
}: PaginationProps) {
  const totalPages = useMemo(() => {
    if (!total || !pageSize) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const listPage = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const startGroup = Math.floor((safePage - 1) / pageShow) * pageShow + 1;
    const pages: number[] = [];
    for (let i = 0; i < pageShow; i++) {
      const p = startGroup + i;
      if (p <= totalPages) {
        pages.push(p);
      }
    }
    return pages;
  }, [page, pageShow, totalPages]);

  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7d7152] ${className}`}
    >
      {/* 1. Informasi Ringkasan & Pilihan Limit */}
      {showSummary && (
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Menampilkan <strong className="text-[#2d2410]">{startEntry}</strong> -{" "}
            <strong className="text-[#2d2410]">{endEntry}</strong> dari{" "}
            <strong className="text-[#2d2410]">{total}</strong> data
          </span>

          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[11px] text-[#a89b7b]">| Tampilkan:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  onPageSizeChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="bg-white/80 border border-white/90 text-[#2d2410] font-semibold text-xs rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#f5b82e]/30 cursor-pointer shadow-2xs"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} baris
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* 2. Tombol Navigasi Halaman */}
      <div className="flex items-center gap-1 font-medium">
        {/* Tombol Pertama & Sebelumnya */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          title="Halaman Pertama"
          className="w-8 h-8 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#2d2410] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs cursor-pointer text-xs font-bold"
        >
          «
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          title="Sebelumnya"
          className="px-2.5 h-8 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#2d2410] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer text-xs"
        >
          ‹ <span className="hidden md:inline text-[11px]">Prev</span>
        </button>

        {/* Angka Nomor Halaman */}
        <div className="flex items-center gap-1 px-1">
          {listPage.map((p) => {
            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-[#2d2410] text-[#ffd666] shadow-xs scale-105"
                    : "bg-white/60 hover:bg-white text-[#2d2410] border border-white/80 shadow-2xs"
                }`}
              >
                {p}
              </button>
            );
          })}

          {totalPages > pageShow && !listPage.includes(totalPages) && (
            <>
              <span className="px-1 text-[#a89b7b] font-bold">...</span>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  page === totalPages
                    ? "bg-[#2d2410] text-[#ffd666] shadow-xs"
                    : "bg-white/60 hover:bg-white text-[#2d2410] border border-white/80 shadow-2xs"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Tombol Selanjutnya & Terakhir */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          title="Berikutnya"
          className="px-2.5 h-8 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#2d2410] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer text-xs"
        >
          <span className="hidden md:inline text-[11px]">Next</span> ›
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          title="Halaman Terakhir"
          className="w-8 h-8 rounded-xl border border-white/80 bg-white/70 hover:bg-white text-[#2d2410] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs cursor-pointer text-xs font-bold"
        >
          »
        </button>
      </div>
    </div>
  );
}
