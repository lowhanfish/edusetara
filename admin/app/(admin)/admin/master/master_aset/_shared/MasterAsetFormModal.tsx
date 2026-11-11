"use client";

import React from "react";
import { Button, Input, Modal, Select, Textarea } from "@/app/(admin)/_components/ui";
import { useMasterAsetOption } from "./hooks";
import LookupField from "./LookupField";
import type { FieldDef, MasterAsetConfig } from "./types";

export type FormValues = Record<string, string>;

/** Kunci tambahan di FormValues untuk label pilihan field "lookup" (tidak ikut dikirim). */
export const lookupLabelKey = (key: string) => `${key}__label`;

interface Props {
  config: MasterAsetConfig;
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  values: FormValues;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

/** Dropdown yang pilihannya berasal dari master lain; hook dipanggil per field. */
function SourceSelect({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  const { List, isLoading, isError } = useMasterAsetOption(field.optionSource ?? "");
  return (
    <Select
      label={field.label}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText={field.helper}
    >
      <option value="">
        {isLoading ? "Memuat pilihan..." : isError ? "Gagal memuat pilihan" : "-- Pilih --"}
      </option>
      {List.map((o) => (
        <option key={o.id} value={String(o.id)}>
          {o.value}
        </option>
      ))}
    </Select>
  );
}

export default function MasterAsetFormModal({
  config,
  isOpen,
  onClose,
  mode,
  values,
  setValues,
  onSubmit,
  isLoading = false,
}: Props) {
  const formId = `form-master-aset-${config.slug}`;
  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? `+ Tambah ${config.singular}` : `✎ Edit ${config.singular}`}
      description={`Mengikuti struktur SIMDA BMD (${config.simdaSource}).`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form={formId} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : mode === "add" ? `Simpan ${config.singular}` : `Perbarui ${config.singular}`}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.fields.map((field) => {
          const value = values[field.key] ?? "";
          const locked = mode === "edit" && field.lockOnEdit;
          const wrapper = field.span === 2 || field.type === "textarea" ? "sm:col-span-2" : "";

          return (
            <div key={field.key} className={wrapper}>
              {field.type === "lookup" && field.lookup ? (
                <LookupField
                  field={field}
                  value={value}
                  valueLabel={values[lookupLabelKey(field.key)] ?? ""}
                  onChange={(v, label) =>
                    setValues((prev) => ({ ...prev, [field.key]: v, [lookupLabelKey(field.key)]: label }))
                  }
                />
              ) : field.type === "select" && field.optionSource ? (
                <SourceSelect field={field} value={value} onChange={(v) => set(field.key, v)} />
              ) : field.type === "select" ? (
                <Select
                  label={field.label}
                  required={field.required}
                  value={value}
                  onChange={(e) => set(field.key, e.target.value)}
                  options={[{ value: "", label: "-- Pilih --" }, ...(field.options ?? [])]}
                  helperText={field.helper}
                />
              ) : field.type === "textarea" ? (
                <>
                  <label className="block text-xs font-semibold text-[#7d7152] mb-1.5">
                    {field.label}
                    {field.required && <span className="text-rose-500"> *</span>}
                  </label>
                  <Textarea
                    rows={3}
                    value={value}
                    onChange={(e) => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                  {field.helper && <p className="text-[11px] text-[#9c8e6b] mt-1">{field.helper}</p>}
                </>
              ) : (
                <Input
                  label={field.label}
                  required={field.required}
                  type={field.type === "number" ? "number" : "text"}
                  min={field.min}
                  max={field.max}
                  value={value}
                  disabled={locked}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  helperText={locked ? "Kode tidak dapat diubah setelah dibuat." : field.helper}
                />
              )}
            </div>
          );
        })}
      </form>
    </Modal>
  );
}
