"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/40 border border-white/60 rounded-xl ${className}`}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-white/40 border border-white/60 rounded-lg ${
            i === lines - 1 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 6,
  className = "",
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden animate-pulse ${className}`}>
      {/* Skeleton Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/30 border-b border-white/60">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-white/50 rounded-md ${
              i === 0 ? "w-10" : i === 1 ? "w-32" : "flex-1"
            }`}
          />
        ))}
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-white/40">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-3 px-4 py-3.5">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-4 bg-white/40 rounded-md ${
                  c === 0 ? "w-8" : c === 1 ? "w-28" : "flex-1"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`p-5 glass rounded-3xl border border-white/70 shadow-xs animate-pulse flex items-center justify-between ${className}`}
    >
      <div className="space-y-2 flex-1 mr-4">
        <div className="h-3 w-24 bg-white/40 rounded-md" />
        <div className="h-6 w-36 bg-white/60 rounded-lg" />
        <div className="h-3 w-20 bg-white/30 rounded-md" />
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/50 border border-white/70" />
    </div>
  );
}
