"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { adminMenu, MenuItem } from "../../../../_data/admin-menu";
import { Badge, Button, Input, Modal, Select } from "../../../../_components/ui";

type MenuRecord = {
  id: string;
  title: string;
  icon: string;
  path: string;
  index: number;
  children: MenuRecord[];
  created_at: string;
  created_by: string;
};

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

const CURRENT_USER_ID = "USR-ADMIN-001";
const INITIAL_CREATED_AT = "2026-09-17T08:00:00.000Z";
const INITIAL_CREATED_BY = "USR-SYSTEM-001";

function formatAuditDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function makeInitialMenus(items: MenuItem[]): MenuRecord[] {
  let sequence = 0;

  const mapItems = (nodes: MenuItem[]): MenuRecord[] =>
    nodes.map((item, index) => {
      sequence += 1;
      return {
        id: `MNU-${String(sequence).padStart(3, "0")}`,
        title: item.title,
        icon: item.icon,
        path: item.path ?? "",
        index: index + 1,
        children: item.children ? mapItems(item.children) : [],
        created_at: INITIAL_CREATED_AT,
        created_by: INITIAL_CREATED_BY,
      };
    });

  return mapItems(items);
}

function countMenus(items: MenuRecord[]) {
  return items.reduce(
    (total, item) => total + 1 + countMenus(item.children),
    0,
  );
}

function highestMenuId(items: MenuRecord[]): number {
  return items.reduce((highest, item) => {
    const currentId = Number(item.id.replace("MNU-", "")) || 0;
    return Math.max(highest, currentId, highestMenuId(item.children));
  }, 0);
}

function nextMenuId(items: MenuRecord[]): string {
  const highestId = highestMenuId(items);
  return `MNU-${String(highestId + 1).padStart(3, "0")}`;
}

function maxDepth(items: MenuRecord[], depth = 1): number {
  if (items.length === 0) return depth - 1;
  return Math.max(
    ...items.map((item) =>
      item.children.length > 0 ? maxDepth(item.children, depth + 1) : depth,
    ),
  );
}

function findMenu(items: MenuRecord[], id: string): MenuRecord | null {
  for (const item of items) {
    if (item.id === id) return item;
    const nested = findMenu(item.children, id);
    if (nested) return nested;
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
    const nested = findParentId(item.children, targetId, item.id);
    if (nested) return nested;
  }
  return "";
}

function updateMenu(
  items: MenuRecord[],
  id: string,
  update: (item: MenuRecord) => MenuRecord,
): MenuRecord[] {
  return items.map((item) =>
    item.id === id
      ? update(item)
      : { ...item, children: updateMenu(item.children, id, update) },
  );
}

function addMenu(
  items: MenuRecord[],
  parentId: string,
  item: MenuRecord,
): MenuRecord[] {
  if (!parentId) return [...items, item];
  return updateMenu(items, parentId, (parent) => ({
    ...parent,
    children: [...parent.children, item],
  }));
}

function removeMenu(items: MenuRecord[], id: string): MenuRecord[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: removeMenu(item.children, id),
    }));
}

function collectParentOptions(
  items: MenuRecord[],
  depth = 0,
): { value: string; label: string }[] {
  return items.flatMap((item) => [
    {
      value: item.id,
      label: `${"— ".repeat(depth)}${item.icon} ${item.title}`,
    },
    ...collectParentOptions(item.children, depth + 1),
  ]);
}

function filterMenus(items: MenuRecord[], query: string): MenuRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.flatMap((item) => {
    const children = filterMenus(item.children, normalizedQuery);
    const matches = [item.title, item.path, item.id]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    return matches || children.length > 0 ? [{ ...item, children }] : [];
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
  onAddChild: (item: MenuRecord) => void;
  onEdit: (item: MenuRecord) => void;
  onDelete: (item: MenuRecord) => void;
}) {
  const hasChildren = item.children.length > 0;
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
                ? "text-slate-500 hover:bg-slate-200 hover:text-[#052552]"
                : "text-slate-300 cursor-default"
            }`}
            aria-label={hasChildren ? `${expanded ? "Tutup" : "Buka"} ${item.title}` : undefined}
          >
            {hasChildren ? (expanded ? "▼" : "▶") : "•"}
          </button>
          <span className="mr-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff7d6] text-lg ring-1 ring-[#ffc400]/25">
            {item.icon || "📁"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-[#052552]">{item.title}</span>
              {level === 0 ? (
                <Badge size="sm" variant="gold">Induk</Badge>
              ) : (
                <Badge size="sm" variant="neutral">Level {level + 1}</Badge>
              )}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              {item.id} · {item.children.length} submenu
            </p>
            <p className="mt-0.5 truncate text-[9px] text-slate-400">
              {formatAuditDate(item.created_at)} · {item.created_by}
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
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-[#ffc400] hover:bg-[#fff9e6] hover:text-[#052552]"
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
        item.children.map((child) => (
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

export function MenuManagement() {
  const [menus, setMenus] = useState<MenuRecord[]>(() => makeInitialMenus(adminMenu));
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
    const siblings = parent ? parent.children : menus;
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
      setMenus((current) =>
        updateMenu(current, editingId, (item) => ({
          ...item,
          title,
          icon: form.icon.trim() || "📁",
          path: form.path.trim(),
          index: Math.max(1, Number(form.index) || 1),
        })),
      );
      setNotice(`Menu “${title}” diperbarui pada simulasi tampilan.`);
    } else {
      const newItem: MenuRecord = {
        id: nextMenuId(menus),
        title,
        icon: form.icon.trim() || "📁",
        path: form.path.trim(),
        index: Math.max(1, Number(form.index) || 1),
        children: [],
        created_at: new Date().toISOString(),
        created_by: CURRENT_USER_ID,
      };
      setMenus((current) => addMenu(current, form.parentId, newItem));
      if (form.parentId) {
        setExpandedIds((current) => new Set(current).add(form.parentId));
      }
      setNotice(`Menu “${title}” ditambahkan pada simulasi tampilan.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (item: MenuRecord) => {
    const detail = item.children.length > 0
      ? ` beserta ${countMenus(item.children)} submenu di dalamnya`
      : "";
    if (!window.confirm(`Hapus menu “${item.title}”${detail}?`)) return;
    setMenus((current) => removeMenu(current, item.id));
    setNotice(`Menu “${item.title}” dihapus dari simulasi tampilan.`);
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
      .filter((id) => (findMenu(menus, id)?.children.length ?? 0) > 0);
    setExpandedIds(new Set(ids));
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin" className="hover:text-[#052552]">Dashboard</Link>
        <span>/</span>
        <span>Data Master</span>
        <span>/</span>
        <span>Auth</span>
        <span>/</span>
        <span className="font-bold text-[#052552]">Menu</span>
      </nav>

      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffc400] text-xl text-[#052552] shadow-sm">📑</span>
            <Badge variant="gold">Data Master · Auth</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#052552]">Manajemen Menu</h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#58708d]">
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
          { label: "Kedalaman", value: `${depth} level`, icon: "🌳", tone: "bg-violet-50 text-violet-700" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg font-black ${stat.tone}`}>{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-xl font-black text-[#052552]">{stat.value}</p>
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
            <h2 className="text-sm font-extrabold text-[#052552]">Struktur Menu Admin</h2>
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
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-[#052552] outline-none focus:border-[#ffc400] focus:ring-3 focus:ring-[#ffc400]/15"
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

          {visibleMenus.length > 0 ? (
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
            <div className="min-w-[780px] px-6 py-16 text-center">
              <div className="text-3xl">🔍</div>
              <h3 className="mt-3 text-sm font-bold text-[#052552]">Menu tidak ditemukan</h3>
              <p className="mt-1 text-xs text-slate-500">Coba gunakan kata kunci lain.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Menampilkan {totalMenus} menu dalam struktur bertingkat.</span>
          <span className="font-semibold text-amber-700">Mode desain · perubahan belum dikirim ke API</span>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "edit" ? "Edit Menu" : form.parentId ? "Tambah Submenu" : "Tambah Menu Utama"}
        description="Lengkapi identitas menu. ID dan children dikelola otomatis oleh sistem."
        maxWidth="lg"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" form="menu-form" variant="gold">
              {formMode === "edit" ? "Simpan Perubahan" : "Tambahkan Menu"}
            </Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">ID Menu</p>
            <p className="mt-1 text-sm font-extrabold text-[#052552]">
              {editingId ?? "Dibuat otomatis setelah data disimpan"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
            <Input
              label="Nama menu atau submenu"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Contoh: Pengumuman GTK"
              required
              autoFocus
            />
            <Input
              label="Icon"
              value={form.icon}
              onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
              placeholder="📁"
              maxLength={8}
              helperText="Emoji atau simbol"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Input
              label="Path"
              value={form.path}
              onChange={(event) => setForm((current) => ({ ...current, path: event.target.value }))}
              placeholder="/admin/contoh-menu"
              helperText="Boleh dikosongkan jika menu hanya menjadi induk submenu."
            />
            <Input
              label="Index"
              type="number"
              min={1}
              value={form.index}
              onChange={(event) => setForm((current) => ({ ...current, index: event.target.value }))}
              required
              helperText="Urutan tampil"
            />
          </div>

          <Select
            label="Menu induk"
            value={form.parentId}
            onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))}
            disabled={formMode === "edit"}
            helperText={
              formMode === "edit"
                ? "Induk dikunci saat mengedit agar struktur children tetap aman."
                : "Pilih menu induk untuk membuat submenu, atau kosongkan untuk menu utama."
            }
          >
            <option value="">— Tanpa induk (menu utama) —</option>
            {parentOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
            <strong className="text-[#052552]">Children:</strong> otomatis bernilai kosong saat menu dibuat. Submenu dapat ditambahkan kemudian melalui tombol <strong>＋</strong> pada baris menu.
          </div>
        </form>
      </Modal>
    </div>
  );
}
