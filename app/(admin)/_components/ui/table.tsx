import React from "react";

export function Table({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left text-sm border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead className={`border-b border-white/60 bg-white/35 text-xs font-semibold text-[#7d7152] ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={`divide-y divide-white/60 bg-transparent ${className}`}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={`hover:bg-white/50 transition-colors duration-150 ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={`py-3.5 px-4 font-semibold ${className}`}>{children}</th>;
}

export function TableCell({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return <td colSpan={colSpan} className={`py-3.5 px-4 align-middle text-slate-700 ${className}`}>{children}</td>;
}

export function TableEmpty({
  colSpan,
  message = "Tidak ada data yang ditemukan.",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12 text-slate-400 text-sm">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">🔍</span>
          <span>{message}</span>
        </div>
      </td>
    </tr>
  );
}
