"use client";

import React, { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface AutoCompleteProps<T> {
  label?: string;
  placeholder?: string;
  options: readonly T[];
  getOptionLabel: (item: T) => string;
  getOptionKey?: (item: T) => string | number;
  getOptionDescription?: (item: T) => string;
  value?: T | null;
  onChange: (item: T | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  emptyMessage?: string;
  className?: string;
}

export function AutoComplete<T>({
  label,
  placeholder = "Ketik untuk mencari...",
  options,
  getOptionLabel,
  getOptionKey,
  getOptionDescription,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  emptyMessage = "Tidak ada hasil ditemukan",
  className = "",
}: AutoCompleteProps<T>) {
  const id = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(value ? getOptionLabel(value) : "");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Sinkronisasi text saat value dari parent berubah
  useEffect(() => {
    if (value) {
      setText(getOptionLabel(value));
    } else if (!open) {
      setText("");
    }
  }, [value, getOptionLabel, open]);

  // Filter options berdasarkan input
  const filteredOptions = options.filter((item) =>
    getOptionLabel(item).toLowerCase().includes(text.toLowerCase())
  );

  const activeIndex = highlightIndex < filteredOptions.length ? highlightIndex : -1;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
        if (!value) {
          setText("");
        } else {
          setText(getOptionLabel(value));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, getOptionLabel]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
        selectOption(filteredOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
    }
  };

  const selectOption = (item: T) => {
    setText(getOptionLabel(item));
    onChange(item);
    setOpen(false);
    setHighlightIndex(-1);
  };

  const clearSelection = () => {
    setText("");
    onChange(null);
    setOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={boxRef} className={`relative flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#7d7152] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setHighlightIndex(-1);
            if (value) onChange(null);
          }}
          className={`w-full h-10 px-3 pr-9 text-sm bg-white/90 backdrop-blur text-[#2d2410] placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-150 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#efe3c2] focus:border-[#f5b82e] focus:ring-3 focus:ring-[#f5b82e]/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {text && !disabled ? (
          <button
            type="button"
            aria-label="Hapus pilihan"
            onClick={clearSelection}
            className="absolute right-2.5 w-5 h-5 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        ) : (
          <span className="absolute right-3 text-slate-400 pointer-events-none text-xs">
            ▼
          </span>
        )}
      </div>

      {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}

      {/* Dropdown Hasil Pencarian */}
      {open && !disabled && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 top-full mt-1.5 w-full max-h-60 overflow-y-auto overscroll-contain glass backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl p-1.5 space-y-1"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-[#a89b7b] font-medium">
              🔍 {emptyMessage}
            </div>
          ) : (
            filteredOptions.map((item, idx) => {
              const isSelected = activeIndex === idx;
              const key = getOptionKey ? getOptionKey(item) : idx;
              const desc = getOptionDescription ? getOptionDescription(item) : null;

              return (
                <div
                  key={key}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onClick={() => selectOption(item)}
                  className={`px-3 py-2 rounded-xl cursor-pointer transition-all text-xs flex flex-col gap-0.5 ${
                    isSelected
                      ? "bg-amber-400/25 border border-amber-300/40 text-[#2d2410] font-semibold"
                      : "hover:bg-white/60 text-[#2d2410]"
                  }`}
                >
                  <span className="font-semibold">{getOptionLabel(item)}</span>
                  {desc && <span className="text-[11px] text-[#7d7152] font-normal">{desc}</span>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
