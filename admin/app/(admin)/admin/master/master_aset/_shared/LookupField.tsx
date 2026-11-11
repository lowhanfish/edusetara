"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/app/(admin)/_components/ui";
import { useLookupSearch } from "./hooks";
import type { FieldDef } from "./types";

interface Props {
  field: FieldDef;
  /** Nilai tersimpan (id baris yang dipilih) atau string kosong. */
  value: string;
  valueLabel: string;
  onChange: (value: string, label: string) => void;
}

/** Memilih satu baris dari endpoint lain lewat pencarian; hasil diambil dari server. */
export default function LookupField({ field, value, valueLabel, onChange }: Props) {
  const lookup = field.lookup!;
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setSearch(text.trim()), 350);
    return () => clearTimeout(handler);
  }, [text]);

  const active = !value && search.length >= 2;
  const { items, isLoading, isError } = useLookupSearch(lookup.path, search, active);
  const choices = items.map(lookup.toChoice).slice(0, 20);

  if (value) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[#7d7152]">
          {field.label}
          {field.required && <span className="text-rose-500"> *</span>}
        </span>
        <div className="flex items-center justify-between gap-2 min-h-10 px-3 py-2 text-xs bg-amber-50/70 border border-amber-200 rounded-xl">
          <span className="font-semibold text-[#2d2410] break-words">{valueLabel || value}</span>
          <button
            type="button"
            onClick={() => {
              onChange("", "");
              setText("");
            }}
            className="shrink-0 px-2 py-1 rounded-lg text-rose-700 hover:bg-rose-50 font-semibold"
          >
            Lepas
          </button>
        </div>
        {field.helper && <p className="text-[11px] text-[#9c8e6b]">{field.helper}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        label={field.label}
        required={field.required}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={field.placeholder ?? "Ketik minimal 2 huruf untuk mencari..."}
        helperText={field.helper}
      />
      {active && (
        <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e2d9c8] bg-white/90 p-1 text-xs">
          {isLoading ? (
            <p className="px-3 py-2 text-[#7d7152]">Mencari...</p>
          ) : isError ? (
            <p className="px-3 py-2 text-rose-700">Gagal memuat hasil pencarian.</p>
          ) : choices.length === 0 ? (
            <p className="px-3 py-2 text-[#7d7152]">Tidak ada hasil untuk &quot;{search}&quot;.</p>
          ) : (
            choices.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange(c.value, c.label)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 flex flex-col gap-0.5"
              >
                <span className="font-semibold text-[#2d2410]">{c.label}</span>
                {c.description && <span className="text-[11px] text-[#7d7152]">{c.description}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
