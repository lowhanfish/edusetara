"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Input, Modal } from "../../../../../_components/ui";
import { GroupRecord, PermissionRule } from "../types";
import {
  useGroupPermissions,
  useUpdateGroupPermissions,
} from "../hooks/crud";

interface PermissionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupRecord | null;
}

export default function PermissionMatrixModal({
  isOpen,
  onClose,
  group,
}: PermissionMatrixModalProps) {
  const { data: permData, isLoading: isFetching } = useGroupPermissions(
    group?.id ?? null
  );
  const updatePermissionsMutation = useUpdateGroupPermissions();

  const [permissions, setPermissions] = useState<PermissionRule[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (permData?.data?.permissions) {
      setPermissions(permData.data.permissions);
    }
  }, [permData]);

  if (!group) return null;

  const handleToggle = (
    menuId: string,
    action: "create" | "read" | "update" | "delete"
  ) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.menu_id === menuId
          ? { ...item, [action]: !item[action] }
          : item
      )
    );
  };

  const handleSelectAll = (action: "create" | "read" | "update" | "delete", value: boolean) => {
    setPermissions((prev) =>
      prev.map((item) => ({ ...item, [action]: value }))
    );
  };

  const handleSave = () => {
    updatePermissionsMutation.mutate(
      {
        groupId: group.id,
        permissions,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const filteredPermissions = permissions.filter((p) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      (p.menu_title?.toLowerCase().includes(term) ?? false) ||
      (p.menu_path?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pengaturan Hak Akses: ${group.title}`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Role Group</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {group.title}
            </span>
          </div>
          <Badge variant={group.level === 1 ? "primary" : "neutral"}>
            {group.level === 1 ? "Level 1 (Dinas/Semua)" : "Level 2 (Satuan Pendidikan)"}
          </Badge>
          <div className="w-full sm:w-64">
            <Input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari menu..."
              className="text-xs py-1"
            />
          </div>
        </div>

        {/* Global batch toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Toggle Semua:</span>
          <Button
            type="button"
            variant="outline"
            className="text-xs py-1 px-2"
            onClick={() => handleSelectAll("read", true)}
          >
            Aktifkan Semua Read
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-xs py-1 px-2"
            onClick={() => {
              handleSelectAll("create", true);
              handleSelectAll("read", true);
              handleSelectAll("update", true);
              handleSelectAll("delete", true);
            }}
          >
            Aktifkan Full CRUD
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-xs py-1 px-2 text-rose-500"
            onClick={() => {
              handleSelectAll("create", false);
              handleSelectAll("read", false);
              handleSelectAll("update", false);
              handleSelectAll("delete", false);
            }}
          >
            Nonaktifkan Semua
          </Button>
        </div>

        {/* Permissions Table */}
        <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          {isFetching ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Memuat hak akses menu...
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 z-10 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Nama Menu</th>
                  <th className="py-2.5 px-3">Path</th>
                  <th className="py-2.5 px-2 text-center w-16">Create</th>
                  <th className="py-2.5 px-2 text-center w-16">Read</th>
                  <th className="py-2.5 px-2 text-center w-16">Update</th>
                  <th className="py-2.5 px-2 text-center w-16">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredPermissions.map((item) => (
                  <tr
                    key={item.menu_id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {item.menu_title}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 truncate max-w-[180px]">
                      {item.menu_path || "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.create}
                        onChange={() => handleToggle(item.menu_id, "create")}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.read}
                        onChange={() => handleToggle(item.menu_id, "read")}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.update}
                        onChange={() => handleToggle(item.menu_id, "update")}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.delete}
                        onChange={() => handleToggle(item.menu_id, "delete")}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </td>
                  </tr>
                ))}
                {filteredPermissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">
                      Tidak ada menu yang sesuai dengan pencarian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Total {permissions.length} menu terkonfigurasi
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updatePermissionsMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={updatePermissionsMutation.isPending}
            >
              {updatePermissionsMutation.isPending
                ? "Menyimpan..."
                : "Simpan Hak Akses"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
