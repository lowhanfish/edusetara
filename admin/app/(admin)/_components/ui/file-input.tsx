"use client";

import React, { useRef, useState, useEffect } from "react";
import { Icon } from "../admin-icons";
import { useUrlStore } from "@/store/useUrlStore";

export interface FileInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  required?: boolean;
  value?: string | File;
  placeholder?: string;
  className?: string;
  module?: string;
  onChange?: (fileNameOrUrl: string, file?: File) => void;
}

export function FileInput({
  label,
  error,
  helperText,
  accept,
  required,
  value,
  placeholder = "Klik atau seret berkas ke sini...",
  className = "",
  module = "general",
  onChange,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);

  const baseUrl = useUrlStore((state) => state.URL.APP) || "http://127.0.0.1:8000";

  // Sync if value changes externally (e.g. opening edit modal or reset)
  useEffect(() => {
    if (value) {
      if (typeof File !== "undefined" && value instanceof File) {
        setSelectedFileName(value.name);
        setFileSizeStr(formatBytes(value.size));
        if (value.type.startsWith("image/")) {
          setLocalPreview(URL.createObjectURL(value));
          setImgError(false);
        }
      } else if (typeof value === "string" && value.trim()) {
        const parts = value.split("/");
        setSelectedFileName(parts[parts.length - 1] || value);
        setFileSizeStr("Tersimpan di server");
        setImgError(false);
      }
    } else {
      setSelectedFileName("");
      setLocalPreview(null);
      setFileSizeStr("");
      setImgError(false);
    }
  }, [value]);

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleSelectFile = (file: File) => {
    setSelectedFileName(file.name);
    setFileSizeStr(formatBytes(file.size));
    setImgError(false);

    if (file.type.startsWith("image/")) {
      const objUrl = URL.createObjectURL(file);
      setLocalPreview(objUrl);
    } else {
      setLocalPreview(null);
    }

    onChange?.(file.name, file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFileName("");
    setLocalPreview(null);
    setFileSizeStr("");
    setImgError(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.("", undefined);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleSelectFile(file);
    }
  };

  const stringVal = typeof value === "string" ? value : "";
  const isImage =
    accept?.includes("image") ||
    /\.(jpg|jpeg|png|webp|gif|svg|heic|heif)$/i.test(selectedFileName || stringVal);

  const isPdf =
    accept?.includes("pdf") ||
    /\.pdf$/i.test(selectedFileName || stringVal);

  // Determine full preview URL (local blob URL takes precedence over server URL)
  const previewUrl: string | null =
    localPreview ||
    (stringVal
      ? stringVal.startsWith("http")
        ? stringVal
        : `${baseUrl}${stringVal.startsWith("/") ? "" : "/"}${stringVal}`
      : null);

  const hasFile = Boolean(selectedFileName || previewUrl);

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#2d2410] flex items-center justify-between">
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500">*</span>}
          </span>
          {fileSizeStr && (
            <span className="text-[10px] text-[#7d7152] font-normal">
              {fileSizeStr}
            </span>
          )}
        </label>
      )}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept={
          accept ||
          "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.mkv,.avi,.mov"
        }
        className="hidden"
        onChange={handleFileChange}
      />

      {/* When File is Selected / Already Attached */}
      {hasFile ? (
        <div className="relative rounded-2xl border border-amber-300/80 bg-gradient-to-br from-white via-amber-50/20 to-amber-100/30 overflow-hidden shadow-xs transition-all">
          {/* IMAGE PREVIEW CARD */}
          {isImage && previewUrl && !imgError ? (
            <div className="relative w-full bg-slate-900/5 min-h-[160px] max-h-[220px] flex items-center justify-center overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={selectedFileName || "Pratinjau Berkas"}
                className="w-full h-full max-h-[220px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                onError={() => setImgError(true)}
              />

              {/* Floating Action Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/95 text-stone-900 text-xs font-semibold shadow hover:bg-white flex items-center gap-1.5 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  🔍 Perbesar
                </a>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold shadow hover:bg-amber-600 flex items-center gap-1.5 cursor-pointer"
                >
                  🔄 Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ) : (
            /* NON-IMAGE / DOCUMENT / FALLBACK PREVIEW CARD */
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isPdf
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  <Icon name={isPdf ? "file" : "image"} size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#2d2410] truncate">
                    {selectedFileName || "Berkas Terlampir"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      ✓ Siap Digunakan
                    </span>
                    {fileSizeStr && (
                      <span className="text-[10px] text-stone-500">{fileSizeStr}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                    title="Buka Berkas"
                  >
                    ↗ Buka
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-900 border border-amber-400/40 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                  title="Hapus Berkas"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Caption Bar */}
          <div className="px-3 py-2 bg-white/90 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-[#7d7152]">
            <span className="truncate max-w-[260px] sm:max-w-md font-medium text-[#2d2410]">
              📄 {selectedFileName}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Ganti Berkas
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE / DROPZONE */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-150 text-center ${
            isDragOver
              ? "border-amber-500 bg-amber-50/80 ring-4 ring-amber-500/10"
              : error
              ? "border-red-400 bg-red-50/30"
              : "border-[#dfd3b2] bg-white/70 hover:border-amber-500 hover:bg-amber-50/40"
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-2 shadow-xs border border-amber-200/60">
            <Icon name="upload" size={20} />
          </div>
          <p className="text-xs font-bold text-[#2d2410]">{placeholder}</p>
          <p className="text-[11px] text-[#7d7152] mt-0.5">
            Format: Gambar (JPG, PNG, WEBP), PDF, Video atau Dokumen (Maks 50MB)
          </p>
        </div>
      )}

      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#7d7152]">{helperText}</span>
      )}
    </div>
  );
}
