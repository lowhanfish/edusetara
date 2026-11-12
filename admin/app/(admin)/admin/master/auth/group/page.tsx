"use client";

import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Modal, Select } from "../../../../_components/ui";
import { GroupRecord, PermissionRule } from "./types";
import {
  useResponseListMaster,
  useCreateMaster,
  useUpdateMaster,
  useDeleteMaster,
  useUpdateGroupPermissions,
} from "./hooks/crud";
import { useMenuTree } from "../menu/hooks/crud";
import { MenuRecord } from "../menu/types";
import Swal from "sweetalert2";

type CrudPermission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type PermissionAction = "create" | "read" | "update" | "delete";
type PermissionMap = Record<string, CrudPermission>;

const emptyPermission: CrudPermission = {
  create: false,
  read: false,
  update: false,
  delete: false,
};

function formatAuditDate(value: string | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function flattenMenus(items: MenuRecord[]): MenuRecord[] {
  return items.flatMap((item) => [item, ...flattenMenus(item.children || [])]);
}

function filterPermissionMenus(items: MenuRecord[], query: string): MenuRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.flatMap((item) => {
    const children = filterPermissionMenus(item.children || [], normalized);
    return item.title.toLowerCase().includes(normalized) || children.length > 0
      ? [{ ...item, children }]
      : [];
  });
}



function PermissionRow({
  item,
  level,
  permissions,
  expandedIds,
  query,
  onToggleExpanded,
  onTogglePermission,
}: {
  item: MenuRecord;
  level: number;
  permissions: PermissionMap;
  expandedIds: Set<string>;
  query: string;
  onToggleExpanded: (id: string) => void;
  onTogglePermission: (id: string, action: PermissionAction) => void;
}) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const expanded = query.trim() ? true : expandedIds.has(item.id);
  const permission = permissions[item.id] ?? emptyPermission;

  return (
    <>
      <div className="grid min-w-[650px] grid-cols-[minmax(260px,1fr)_repeat(4,72px)] items-center border-b border-slate-100 hover:bg-slate-50/80">
        <div
          className="flex min-w-0 items-center py-2.5 pr-3"
          style={{ paddingLeft: `${12 + level * 22}px` }}
        >
          <button
            type="button"
            onClick={() => hasChildren && onToggleExpanded(item.id)}
            className={`mr-2 grid h-6 w-6 shrink-0 place-items-center rounded text-[9px] ${
              hasChildren
                ? "text-slate-500 hover:bg-slate-200"
                : "cursor-default text-slate-300"
            }`}
            aria-label={
              hasChildren
                ? `${expanded ? "Tutup" : "Buka"} ${item.title}`
                : undefined
            }
          >
            {hasChildren ? (expanded ? "▼" : "▶") : "•"}
          </button>
          <span className="mr-2 text-base">{item.icon || "📁"}</span>
          <span className="truncate text-xs font-semibold text-[#2d2410]">
            {item.title}
          </span>
          {level > 0 && (
            <span className="ml-2 text-[9px] font-bold text-slate-400">
              L{level + 1}
            </span>
          )}
        </div>

        {(["create", "read", "update", "delete"] as const).map((action) => (
          <label
            key={action}
            className="grid h-full min-h-11 cursor-pointer place-items-center border-l border-slate-100"
          >
            <input
              type="checkbox"
              checked={permission[action]}
              onChange={() => onTogglePermission(item.id, action)}
              className="h-4 w-4 cursor-pointer accent-[#2d2410]"
              aria-label={`${action} ${item.title}`}
            />
          </label>
        ))}
      </div>

      {hasChildren &&
        expanded &&
        (item.children || []).map((child) => (
          <PermissionRow
            key={child.id}
            item={child}
            level={level + 1}
            permissions={permissions}
            expandedIds={expandedIds}
            query={query}
            onToggleExpanded={onToggleExpanded}
            onTogglePermission={onTogglePermission}
          />
        ))}
    </>
  );
}

export default function MasterAuthGroupPage() {
  const { List, isLoading } = useResponseListMaster(1, 100);
  const { data: menuTreeData } = useMenuTree();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();
  const deleteMutation = useDeleteMaster();
  const updatePermissionsMutation = useUpdateGroupPermissions();

  const groups = useMemo(() => List?.data || [], [List]);
  const permissionMenus = useMemo(
    () => menuTreeData?.data || [],
    [menuTreeData],
  );
  const allPermissionMenus = useMemo(
    () => flattenMenus(permissionMenus),
    [permissionMenus],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupRecord | null>(null);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<1 | 2>(1);
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const visibleMenus = useMemo(
    () => filterPermissionMenus(permissionMenus, query),
    [permissionMenus, query],
  );
  const levelOneGroups = groups.filter((group) => group.level === 1).length;

  // Initialize expanded parent IDs when menus load
  useEffect(() => {
    if (permissionMenus.length > 0) {
      setExpandedIds(
        new Set(
          permissionMenus
            .filter((item) => item.children && item.children.length > 0)
            .map((item) => item.id),
        ),
      );
    }
  }, [permissionMenus]);

  const openAdd = () => {
    setEditingGroup(null);
    setTitle("");
    setLevel(1);
    // Default read permissions
    const defaultPerms: PermissionMap = {};
    for (const m of allPermissionMenus) {
      defaultPerms[m.id] = { create: false, read: true, update: false, delete: false };
    }
    setPermissions(defaultPerms);
    setQuery("");
    setIsModalOpen(true);
  };

  const openEdit = async (group: GroupRecord) => {
    setEditingGroup(group);
    setTitle(group.title);
    setLevel(group.level as 1 | 2);
    setQuery("");

    // Fetch existing permissions matrix for this group from backend API
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admin/master/auth/group/${group.id}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        },
      );
      if (res.ok) {
        const json = await res.json();
        const permList: PermissionRule[] = (json as any)?.data?.permissions || [];
        const pMap: PermissionMap = {};
        for (const p of permList) {
          pMap[p.menu_id] = {
            create: p.create,
            read: p.read,
            update: p.update,
            delete: p.delete,
          };
        }
        setPermissions(pMap);
      } else {
        const defaultPerms: PermissionMap = {};
        for (const m of allPermissionMenus) {
          defaultPerms[m.id] = { create: false, read: true, update: false, delete: false };
        }
        setPermissions(defaultPerms);
      }
    } catch {
      const defaultPerms: PermissionMap = {};
      for (const m of allPermissionMenus) {
        defaultPerms[m.id] = { create: false, read: true, update: false, delete: false };
      }
      setPermissions(defaultPerms);
    }

    setIsModalOpen(true);
  };

  const togglePermission = (menuId: string, action: PermissionAction) => {
    setPermissions((current) => ({
      ...current,
      [menuId]: {
        ...(current[menuId] ?? emptyPermission),
        [action]: !(current[menuId] ?? emptyPermission)[action],
      },
    }));
  };

  const setAllPermissions = (checked: boolean) => {
    setPermissions(() =>
      Object.fromEntries(
        allPermissionMenus.map((item) => [
          item.id,
          {
            create: checked,
            read: checked,
            update: checked,
            delete: checked,
          },
        ]),
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const formattedPerms: PermissionRule[] = allPermissionMenus.map((m) => {
      const p = permissions[m.id] ?? emptyPermission;
      return {
        menu_id: m.id,
        create: Boolean(p.create),
        read: Boolean(p.read),
        update: Boolean(p.update),
        delete: Boolean(p.delete),
      };
    });

    if (editingGroup) {
      updateMutation.mutate(
        {
          id: editingGroup.id,
          body: { title: cleanTitle, level },
        },
        {
          onSuccess: () => {
            updatePermissionsMutation.mutate({
              groupId: editingGroup.id,
              permissions: formattedPerms,
            });
            setNotice(`Role Group “${cleanTitle}” dan matriks hak akses berhasil disimpan ke database.`);
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(
        { title: cleanTitle, level },
        {
          onSuccess: (res: any) => {
            const newGroupId = res?.data?.id;
            if (newGroupId) {
              updatePermissionsMutation.mutate({
                groupId: newGroupId,
                permissions: formattedPerms,
              });
            }
            setNotice(`Role Group “${cleanTitle}” berhasil ditambahkan ke database.`);
            setIsModalOpen(false);
          },
        },
      );
    }
  };

  const handleDelete = (group: GroupRecord) => {
    Swal.fire({
      title: `Hapus role group “${group.title}”?`,
      text: "Group dan seluruh matriks izinnya akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(group.id, {
          onSuccess: () => {
            setNotice(`Role Group “${group.title}” berhasil dihapus dari database.`);
          },
        });
      }
    });
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
        <span className="font-bold text-[#2d2410]">Group</span>
      </nav>

      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5b82e] text-xl shadow-sm">👥</span>
            <Badge variant="gold">Data Master · Auth</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#2d2410]">Role Group & Hak Akses</h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#7d7152]">
            Tentukan cakupan pengguna dan izin Create, Read, Update, Delete pada setiap menu admin.
          </p>
        </div>
        <Button variant="gold" onClick={openAdd} icon={<span>＋</span>}>
          Tambah Group
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Ringkasan group">
        {[
          { label: "Total Group", value: groups.length, icon: "👥", tone: "bg-sky-50 text-sky-700" },
          { label: "Akses Semua Satdik", value: levelOneGroups, icon: "🌐", tone: "bg-amber-50 text-amber-700" },
          { label: "Akses Unit Sendiri", value: groups.length - levelOneGroups, icon: "🏫", tone: "bg-emerald-50 text-emerald-700" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${stat.tone}`}>{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="text-xl font-black text-[#2d2410]">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span>✓ {notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">✕</button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
          <h2 className="text-sm font-extrabold text-[#2d2410]">Daftar Group</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">Pilih atur akses untuk mengatur level dan matriks izin menu.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Nama Group</th>
                <th className="px-4 py-3">Level Akses</th>
                <th className="px-4 py-3">Anggota ASN</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <SkeletonTableRows cols={4} />
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    Belum ada role group terdaftar.
                  </td>
                </tr>
              ) : (
                groups.map((group) => {
                  return (
                    <tr key={group.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff6dc]">🔐</span>
                          <div>
                            <p className="text-sm font-bold text-[#2d2410]">{group.title}</p>
                            <p className="text-[10px] font-medium text-slate-400">{group.id}</p>
                            <p className="mt-0.5 text-[9px] text-slate-400">
                              {formatAuditDate(group.created_at)} · {group.created_by || "System"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={group.level === 1 ? "info" : "success"}>
                          {group.level === 1 ? "1 · Semua Satuan Pendidikan" : "2 · Unit Pengguna"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-700">
                          {group.member_count ?? 0} Pegawai
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(group)}>
                            Atur Akses
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(group)}
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? "Edit Group & Hak Akses" : "Tambah Group & Hak Akses"}
        description="Form identitas group dan matriks izin disimpan secara real-time ke database."
        maxWidth="3xl"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="group-form"
              variant="gold"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : editingGroup
                  ? "Simpan Perubahan"
                  : "Tambahkan Group"}
            </Button>
          </>
        }
      >
        <form id="group-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_280px]">
            <Input
              label="Nama Role"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Operator Bidang GTK"
              required
              autoFocus
            />
            <Select
              label="Level Akses"
              value={String(level)}
              onChange={(event) => setLevel(Number(event.target.value) as 1 | 2)}
              helperText="Menentukan cakupan data yang dapat dilihat."
            >
              <option value="1">Level 1 · Semua Satuan Pendidikan</option>
              <option value="2">Level 2 · Unit Pendidikan Pengguna</option>
            </Select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#2d2410]">Matriks Hak Akses Menu</h3>
                <p className="text-[11px] text-slate-500">
                  Centang tindakan yang diizinkan untuk setiap menu atau submenu.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari menu..."
                  className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#f5b82e]"
                />
                <Button type="button" size="sm" variant="outline" onClick={() => setAllPermissions(true)}>
                  Pilih Semua
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setAllPermissions(false)}>
                  Kosongkan
                </Button>
              </div>
            </div>
            <div className="max-h-[44vh] overflow-auto">
              <div className="sticky top-0 z-10 grid min-w-[650px] grid-cols-[minmax(260px,1fr)_repeat(4,72px)] border-b border-slate-200 bg-white text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                <div className="px-3 py-2.5">Menu / Submenu</div>
                <div className="border-l border-slate-100 py-2.5 text-center">Create</div>
                <div className="border-l border-slate-100 py-2.5 text-center">Read</div>
                <div className="border-l border-slate-100 py-2.5 text-center">Update</div>
                <div className="border-l border-slate-100 py-2.5 text-center">Delete</div>
              </div>
              {visibleMenus.map((item) => (
                <PermissionRow
                  key={item.id}
                  item={item}
                  level={0}
                  permissions={permissions}
                  expandedIds={expandedIds}
                  query={query}
                  onToggleExpanded={(id) =>
                    setExpandedIds((current) => {
                      const next = new Set(current);
                      if (next.has(id)) next.delete(id);
                      else next.add(id);
                      return next;
                    })
                  }
                  onTogglePermission={togglePermission}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
