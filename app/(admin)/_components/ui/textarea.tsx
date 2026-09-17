"use client";

import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-bold text-[#052552] uppercase tracking-wider flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        className={`w-full p-3 text-sm bg-white text-[#052552] placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-150 resize-y ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-[#d8dfeb] focus:border-[#ffc400] focus:ring-3 focus:ring-[#ffc400]/20"
        } ${className}`}
        {...props}
      />

      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#58708d]">{helperText}</span>
      )}
    </div>
  );
}
