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
    success: "bg-emerald-500/15 text-emerald-700",
    warning: "bg-amber-400/20 text-amber-700",
    danger: "bg-rose-500/15 text-rose-600",
    info: "bg-violet-500/15 text-violet-700",
    gold: "bg-violet-500/15 text-violet-700 font-bold",
    neutral: "bg-white/60 text-slate-600 border border-white/80",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full tracking-wide select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
