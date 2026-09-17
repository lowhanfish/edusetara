"use client";

import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export function Select({
  label,
  error,
  helperText,
  options,
  children,
  className = "",
  id,
  required,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-bold text-[#052552] uppercase tracking-wider flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          id={selectId}
          required={required}
          className={`w-full h-10 px-3 pr-8 text-sm bg-white text-[#052552] border rounded-xl outline-none appearance-none transition-all duration-150 cursor-pointer ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#d8dfeb] focus:border-[#ffc400] focus:ring-3 focus:ring-[#ffc400]/20"
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <span className="absolute right-3 text-slate-400 text-xs pointer-events-none">
          ▼
        </span>
      </div>

      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#58708d]">{helperText}</span>
      )}
    </div>
  );
}
