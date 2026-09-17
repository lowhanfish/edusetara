import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "gold";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  }[size];

  const variantClasses = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    gold: "bg-[#fff8dd] text-[#052552] border border-[#ffc400]/40 font-bold",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-lg tracking-wide select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
