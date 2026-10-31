"use client";

import React from "react";

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  value?: string;
  onChange?: (dateString: string) => void;
  showTodayShortcut?: boolean;
}

export function DateInput({
  label,
  error,
  helperText,
  required,
  value = "",
  onChange,
  showTodayShortcut = true,
  className = "",
  id,
  ...props
}: DateInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    onChange?.(today);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#7d7152] flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {showTodayShortcut && (
          <button
            type="button"
            onClick={setToday}
            className="text-[11px] font-semibold text-[#a86a00] hover:text-[#2d2410] underline transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
        )}
      </div>

      <div className="relative flex items-center w-full">
        <span className="absolute left-3 text-slate-400 text-sm pointer-events-none flex items-center">
          📅
        </span>

        <input
          id={inputId}
          type="date"
          required={required}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full h-10 pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur text-[#2d2410] border rounded-xl outline-none transition-all duration-150 cursor-pointer ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#efe3c2] focus:border-[#f5b82e] focus:ring-3 focus:ring-[#f5b82e]/20"
          }`}
          {...props}
        />
      </div>

      {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-[#7d7152]">{helperText}</span>
      )}
    </div>
  );
}
