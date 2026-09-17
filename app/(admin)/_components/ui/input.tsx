"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-[#052552] uppercase tracking-wider flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 text-base pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          required={required}
          className={`w-full h-10 px-3 py-2 text-sm bg-white text-[#052552] placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-150 ${
            leftIcon ? "pl-9" : ""
          } ${rightIcon ? "pr-9" : ""} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#d8dfeb] focus:border-[#ffc400] focus:ring-3 focus:ring-[#ffc400]/20"
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 text-slate-400 text-base pointer-events-none flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#58708d]">{helperText}</span>
      )}
    </div>
  );
}
