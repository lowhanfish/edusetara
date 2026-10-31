"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Input, Modal, Select } from "../../../../_components/ui";
import { MenuRecord } from "./types";
import {
  useMenuTree,
  useCreateMaster,
  useUpdateMaster,
  useDeleteMaster,
} from "./hooks/crud";
import Swal from "sweetalert2";

type FormState = {
  title: string;
  icon: string;
  path: string;
  index: string;
  parentId: string;
};

type FormMode = "add" | "edit";

const emptyForm: FormState = {
  title: "",
  icon: "📁",
  path: "",
  index: "1",
  parentId: "",
};

function formatAuditDate(value: string | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function countMenus(items: MenuRecord[]): number {
  return items.reduce(
    (total, item) => total + 1 + countMenus(item.children || []),
    0,
  );
}

function maxDepth(items: MenuRecord[], depth = 1): number {
  if (items.length === 0) return depth - 1;
  return Math.max(
    ...items.map((item) =>
      item.children && item.children.length > 0 ? maxDepth(item.children, depth + 1) : depth,
    ),
  );
}

function findMenu(items: MenuRecord[], id: string): MenuRecord | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const nested = findMenu(item.children, id);
      if (nested) return nested;
    }
  }
  return null;
}

function findParentId(
  items: MenuRecord[],
  targetId: string,
  parentId = "",
): string {
  for (const item of items) {
    if (item.id === targetId) return parentId;
    if (item.children) {
      const nested = findParentId(item.children, targetId, item.id);
      if (nested) return nested;
    }
  }
  return "";
}

function collectParentOptions(
  items: MenuRecord[],
  prefix = "",
): { value: string; label: string }[] {
  return items.flatMap((item) => {
    const label = prefix ? `${prefix} > ${item.title}` : item.title;
    return [
      { value: item.id, label },
      ...collectParentOptions(item.children || [], label),
    ];
  });
}

function filterMenus(items: MenuRecord[], query: string): MenuRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.flatMap((item) => {
    const children = filterMenus(item.children || [], normalized);
    const matchesSelf =
      item.title.toLowerCase().includes(normalized) ||
      item.path.toLowerCase().includes(normalized) ||
      item.id.toLowerCase().includes(normalized);

    if (matchesSelf || children.length > 0) {
      return [{ ...item, children }];
    }

    return [];
  });
}

function MenuTreeRow({
  item,
  level,
  isExpanded,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
}: {
  item: MenuRecord;
  level: number;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  onAddChild: (parent: MenuRecord) => void;
  onEdit: (item: MenuRecord) => void;
  onDelete: (item: MenuRecord) => void;
}) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const expanded = isExpanded(item.id);

  return (
    <>
      <div className="grid grid-cols-[minmax(260px,1.5fr)_minmax(190px,1fr)_80px_140px] items-center min-w-[780px] border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
        <div className="flex items-center min-w-0 px-4 py-3" style={{ paddingLeft: `${16 + level * 24}px` }}>
          <button
            type="button"
            onClick={() => hasChildren && onToggle(item.id)}
            className={`mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] transition-colors ${
              hasChildren
                ? "text-slate-500 hover:bg-slate-200 hover:text-[#2d2410]"
                : "text-slate-300 cursor-default"
            }`}
            aria-label={hasChildren ? `${expanded ? "Tutup" : "Buka"} ${item.title}` : undefined}
          >
            {hasChildren ? (expanded ? "▼" : "▶") : "•"}
          </button>
          <span className="mr-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff6dc] text-lg ring-1 ring-[#f5b82e]/25">
            {item.icon || "📁"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-[#2d2410]">{item.title}</span>
              {level === 0 ? (
                <Badge size="sm" variant="gold">Induk</Badge>
              ) : (
                <Badge size="sm" variant="neutral">Level {level + 1}</Badge>
              )}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              {item.id} · {(item.children || []).length} submenu
            </p>
            <p className="mt-0.5 truncate text-[9px] text-slate-400">
              {formatAuditDate(item.created_at)} · {item.created_by || "System"}
            </p>
          </div>
        </div>

        <div className="px-4 py-3">
          {item.path ? (
            <code className="inline-flex max-w-full truncate rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
              {item.path}
            </code>
          ) : (
            <span className="text-xs italic text-slate-400">Tidak memiliki path</span>
          )}
        </div>

        <div className="px-4 py-3 text-center">
          <span className="inline-grid h-7 min-w-7 place-items-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600">
            {item.index}
          </span>
        </div>

        <div className="flex items-center justify-end gap-1.5 px-4 py-3">
          <button
            type="button"
            onClick={() => onAddChild(item)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-[#f5b82e] hover:bg-[#fffaea] hover:text-[#2d2410]"
            aria-label={`Tambah submenu ke ${item.title}`}
            title="Tambah submenu"
          >
            ＋
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            aria-label={`Edit ${item.title}`}
            title="Edit menu"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            aria-label={`Hapus ${item.title}`}
            title="Hapus menu"
          >
            🗑
          </button>
        </div>
      </div>

      {hasChildren && expanded &&
        (item.children || []).map((child) => (
          <MenuTreeRow
            key={child.id}
            item={child}
            level={level + 1}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onAddChild={onAddChild}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}

export default function MasterAuthMenuPage() {
  const { data: treeData, isLoading } = useMenuTree();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();
  const deleteMutation = useDeleteMaster();

  const menus = useMemo(() => treeData?.data || [], [treeData]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const totalMenus = countMenus(menus);
  const rootMenus = menus.length;
  const submenuCount = totalMenus - rootMenus;
  const depth = maxDepth(menus);
  const parentOptions = useMemo(() => collectParentOptions(menus), [menus]);
  const visibleMenus = useMemo(() => filterMenus(menus, query), [menus, query]);
  const isSearching = query.trim().length > 0;

  const openAddForm = (parent?: MenuRecord) => {
    const siblings = parent ? parent.children || [] : menus;
    setFormMode("add");
    setEditingId(null);
    setForm({
      ...emptyForm,
      parentId: parent?.id ?? "",
      index: String(siblings.length + 1),
    });
    setIsModalOpen(true);
  };

  const openEditForm = (item: MenuRecord) => {
    setFormMode("edit");
    setEditingId(item.id);
    setForm({
      title: item.title,
      icon: item.icon,
      path: item.path,
      index: String(item.index),
      parentId: findParentId(menus, item.id),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    if (formMode === "edit" && editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          body: {
            title,
            icon: form.icon.trim() || "📁",
            path: form.path.trim(),
            index: Math.max(1, Number(form.index) || 1),
            parent_id: form.parentId || null,
          },
        },
        {
          onSuccess: () => {
            setNotice(`Menu “${title}” berhasil diperbarui di database.`);
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          title,
          icon: form.icon.trim() || "📁",
          path: form.path.trim(),
          index: Math.max(1, Number(form.index) || 1),
          parent_id: form.parentId || null,
          is_active: true,
        },
        {
          onSuccess: () => {
            if (form.parentId) {
              setExpandedIds((current) => new Set(current).add(form.parentId));
            }
            setNotice(`Menu “${title}” berhasil ditambahkan ke database.`);
            setIsModalOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = (item: MenuRecord) => {
    const detail =
      item.children && item.children.length > 0
        ? ` beserta ${countMenus(item.children)} submenu di dalamnya`
        : "";

    Swal.fire({
      title: `Hapus menu “${item.title}”?`,
      text: `Menu ini${detail} akan dihapus secara permanen dari database.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(item.id, {
          onSuccess: () => {
            setNotice(`Menu “${item.title}” berhasil dihapus dari database.`);
          },
        });
      }
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const ids = parentOptions
      .map((option) => option.value)
      .filter((id) => ((findMenu(menus, id)?.children || []).length > 0));
    setExpandedIds(new Set(ids));
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin" className="hover:text-[#2d2410]">Dashboard</Link>
        <span>/</span>
        <span>Data Master</span>
        <span>/</span>
        <span>Auth</span>
        <span>/</span>
        <span className="font-bold text-[#2d2410]">Menu</span>
      </nav>

      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5b82e] text-xl text-[#3b2a05] shadow-sm">📑</span>
            <Badge variant="gold">Data Master · Auth</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#2d2410]">Manajemen Menu</h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#7d7152]">
            Susun menu dan submenu yang tampil pada sidebar admin. Setiap menu dapat memiliki turunan tanpa batas tingkat.
          </p>
        </div>
        <Button variant="gold" size="md" onClick={() => openAddForm()} icon={<span>＋</span>}>
          Tambah Menu Utama
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan menu">
        {[
          { label: "Total Menu", value: totalMenus, icon: "📚", tone: "bg-sky-50 text-sky-700" },
          { label: "Menu Utama", value: rootMenus, icon: "🗂️", tone: "bg-amber-50 text-amber-700" },
          { label: "Submenu", value: submenuCount, icon: "↳", tone: "bg-emerald-50 text-emerald-700" },
          { label: "Kedalaman", value: `${depth} level`, icon: "🌳", tone: "bg-amber-50 text-amber-800" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg font-black ${stat.tone}`}>{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-xl font-black text-[#2d2410]">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span>✓ {notice}</span>
          <button type="button" onClick={() => setNotice("")} className="text-emerald-600 hover:text-emerald-900" aria-label="Tutup pemberitahuan">✕</button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#2d2410]">Struktur Menu Admin</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">Gunakan tombol panah untuk membuka hierarki submenu.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 sm:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama, path, atau ID menu..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-[#2d2410] outline-none focus:border-[#f5b82e] focus:ring-3 focus:ring-[#f5b82e]/15"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>Buka Semua</Button>
              <Button variant="outline" size="sm" onClick={() => setExpandedIds(new Set())}>Tutup Semua</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[780px] grid-cols-[minmax(260px,1.5fr)_minmax(190px,1fr)_80px_140px] border-b border-slate-200 bg-white text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <div className="px-4 py-3">Nama dan Hierarki</div>
            <div className="px-4 py-3">Path</div>
            <div className="px-4 py-3 text-center">Index</div>
            <div className="px-4 py-3 text-right">Aksi</div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Memuat data menu dari database...
            </div>
          ) : visibleMenus.length > 0 ? (
            visibleMenus.map((item) => (
              <MenuTreeRow
                key={item.id}
                item={item}
                level={0}
                isExpanded={(id) => isSearching || expandedIds.has(id)}
                onToggle={toggleExpanded}
                onAddChild={openAddForm}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="px-4 py-16 text-center text-xs text-slate-500">
              {query ? `Tidak ada menu yang cocok dengan "${query}"` : "Belum ada menu terdaftar"}
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "edit" ? "Edit Menu" : "Tambah Menu"}
        description={
          formMode === "edit"
            ? "Perbarui informasi dan lokasi menu pada hierarki."
            : "Menu baru akan ditambahkan langsung pada sidebar aplikasi."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="menu-form"
              variant="gold"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : formMode === "edit"
                  ? "Simpan Perubahan"
                  : "Tambahkan Menu"}
            </Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Menu Induk (Parent)"
            value={form.parentId}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                parentId: event.target.value,
              }))
            }
            helperText="Pilih induk untuk menjadikan menu ini sebagai submenu. Kosongkan untuk menu utama."
          >
            <option value="">-- Menu Utama (Tingkat Teratas) --</option>
            {parentOptions
              .filter((option) => option.value !== editingId)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Select>

          <Input
            label="Nama Menu"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Contoh: Rombongan Belajar"
            required
            autoFocus
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Ikon (Emoji / Teks)"
              value={form.icon}
              onChange={(event) =>
                setForm((current) => ({ ...current, icon: event.target.value }))
              }
              placeholder="Contoh: 👥 atau Users"
              helperText="Ikon yang tampil di sidebar."
            />
            <Input
              label="Nomor Urut (Index)"
              type="number"
              min="1"
              value={form.index}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  index: event.target.value,
                }))
              }
              helperText="Urutan tampilan di antara menu selevel."
              required
            />
          </div>

          <Input
            label="Alamat URL (Path)"
            value={form.path}
            onChange={(event) =>
              setForm((current) => ({ ...current, path: event.target.value }))
            }
            placeholder="Contoh: /admin/rombel"
            helperText="Kosongkan jika menu ini hanya berfungsi sebagai grup submenu."
          />
        </form>
      </Modal>
    </div>
  );
}
