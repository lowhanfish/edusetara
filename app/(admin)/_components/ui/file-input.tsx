"use client";

import React, { useRef, useState } from "react";
import { Icon } from "../admin-icons";

export interface FileInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (fileName: string, file?: File) => void;
}

export function FileInput({
  label,
  error,
  helperText,
  accept,
  required,
  value,
  placeholder = "Pilih atau seret berkas ke sini...",
  className = "",
  onChange,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>(value ?? "");
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync if value changes externally
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedFileName(value);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onChange?.(file.name, file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFileName("");
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
      setSelectedFileName(file.name);
      onChange?.(file.name, file);
    }
  };

  const isImage =
    accept?.includes("image") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedFileName);

  const isPdf =
    accept?.includes("pdf") ||
    /\.pdf$/i.test(selectedFileName);

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#7d7152] flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex items-center justify-between gap-3 p-2.5 bg-white/90 backdrop-blur border rounded-xl cursor-pointer transition-all duration-150 ${
          isDragOver
            ? "border-[#f5b82e] bg-amber-50/70 ring-3 ring-[#f5b82e]/20"
            : error
            ? "border-red-500 bg-red-50/30"
            : "border-[#efe3c2] hover:border-[#f5b82e] hover:bg-amber-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isPdf
                ? "bg-rose-100 text-rose-600"
                : isImage
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <Icon name={isPdf ? "file" : isImage ? "image" : "file"} size={17} />
          </span>

          <div className="min-w-0">
            {selectedFileName ? (
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#2d2410] truncate max-w-xs sm:max-w-md">
                  {selectedFileName}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  ✓ Berkas siap diunggah
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium truncate">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedFileName && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Hapus berkas"
            >
              <Icon name="close" size={14} />
            </button>
          )}
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-400/20 text-amber-900 border border-amber-300/60 hover:bg-amber-400/30 transition-colors">
            {selectedFileName ? "Ganti" : "Pilih Berkas"}
          </span>
        </div>
      </div>

      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#7d7152]">{helperText}</span>
      )}
    </div>
  );
}
