"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      if (typeof window !== "undefined") {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else if (navigator.share) {
          await navigator.share({
            title,
            url: window.location.href,
          });
        }
      }
    } catch {
      // Ignore if user dismisses or clipboard blocked
    }
  }

  return (
    <button
      type="button"
      className={`share-btn${copied ? " copied" : ""}`}
      title="Salin tautan berita ke clipboard"
      aria-label="Salin tautan berita ke clipboard"
      onClick={handleShare}
    >
      {copied ? (
        <>
          <span aria-hidden="true" style={{ color: "#10b981", fontWeight: "bold" }}>
            ✓
          </span>
          <span style={{ color: "#059669" }}>Tautan Disalin!</span>
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="share-svg"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>Salin Tautan</span>
        </>
      )}
    </button>
  );
}
