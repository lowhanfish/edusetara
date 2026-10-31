"use client";

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "../../../_components/ui";

import { ResponseInterface, SiswaRecord } from "./types";
import FormSiswaModal from "./components/FormSiswaModal";
import DetailSiswaModal from "./components/DetailSiswaModal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function MasterSiswaPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { List, isLoading, isError, error, refetch } = useResponseListMaster(
    page,
    pageSize,
    debouncedSearch
  );
  const deleteMutation = useDeleteMaster();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SiswaRecord | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {
    nama: "",
    nisn: "",
    nik: "",
    jns_kelamin: "Laki-laki",
    kelas_id: "",
    tmp_lahir: "",
    tgl_lahir: "",
    agama: "Islam",
    alamat: "",
    nama_ayah: "",
    nama_ibu: "",
    nama_wali: "",
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  const rawList: SiswaRecord[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  const totalItems = List?.total ?? rawList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handleOpenAdd = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: SiswaRecord) => {
    setFormMode("edit");
    setFormData({
      id: record.id,
      nama: record.nama,
      nisn: record.nisn,
      nik: record.nik,
      jns_kelamin: record.jns_kelamin,
      kelas_id: record.kelas_id || "",
      tmp_lahir: record.tmp_lahir || "",
      tgl_lahir: record.tgl_lahir || "",
      agama: record.agama || "",
      alamat: record.alamat,
      nama_ayah: record.nama_ayah || "",
      nama_ibu: record.nama_ibu || "",
      nama_wali: record.nama_wali || "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: SiswaRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: SiswaRecord) => {
    Swal.fire({
      title: "Hapus Data Siswa?",
      text: `Apakah Anda yakin ingin menghapus siswa "${record.nama}" (NISN: ${record.nisn})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(record.id);
      }
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama?.trim()) {
      Swal.fire("Perhatian", "Nama lengkap siswa wajib diisi.", "warning");
      return;
    }
    if (!formData.nisn?.trim() || !formData.nik?.trim()) {
      Swal.fire("Perhatian", "NISN dan NIK wajib diisi.", "warning");
      return;
    }
    if (!formData.tgl_lahir) {
      Swal.fire("Perhatian", "Tanggal lahir wajib diisi.", "warning");
      return;
    }
    if (!formData.alamat?.trim()) {
      Swal.fire("Perhatian", "Alamat domisili wajib diisi.", "warning");
      return;
    }

    const payload: Partial<ResponseInterface> = {
      nama: formData.nama.trim(),
      nisn: formData.nisn.trim(),
      nik: formData.nik.trim(),
      jns_kelamin: formData.jns_kelamin || "Laki-laki",
      kelas_id: formData.kelas_id || null,
      tmp_lahir: formData.tmp_lahir?.trim() || null,
      tgl_lahir: formData.tgl_lahir,
      agama: formData.agama || null,
      alamat: formData.alamat.trim(),
      nama_ayah: formData.nama_ayah?.trim() || null,
      nama_ibu: formData.nama_ibu?.trim() || null,
      nama_wali: formData.nama_wali?.trim() || null,
    };

    if (formMode === "add") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          emptyForm();
        },
      });
    } else {
      if (!formData.id) return;
      updateMutation.mutate(
        { body: payload, id: formData.id },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            emptyForm();
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Peserta Didik (Siswa)"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Data Master", href: "/admin/master" },
          { label: "Master Siswa" },
        ]}
        description="Pangkalan data profil peserta didik dari berbagai satuan pendidikan naungan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="hidden sm:inline-flex"
            >
              🔄 Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={handleOpenAdd}>
              + Tambah Siswa
            </Button>
          </div>
        }
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Total Siswa</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{totalItems}</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Terdaftar Aktif</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🎓
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Satuan Pendidikan</p>
              <h4 className="text-2xl font-bold text-amber-700 mt-1">Konsel</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">SD & SMP</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🏫
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Status API</p>
              <h4 className="text-2xl font-bold text-emerald-700 mt-1">Terhubung</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">FastAPI & MySQL</p>
            </div>
            <span className="text-3xl p-3 bg-emerald-50 rounded-2xl border border-emerald-200/50">
              ⚡
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Integritas Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">NISN & NIK</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">Pangkalan Valid</p>
            </div>
            <span className="text-3xl p-3 bg-blue-50 rounded-2xl border border-blue-200/50">
              📋
            </span>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-white/80 bg-white/70 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e2d9c8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Cari nama siswa, NISN, atau sekolah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7d7152]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Jumlah data per halaman"
              className="text-xs bg-white border border-[#d5cbba] rounded-lg px-2 py-1.5 text-[#2d2410] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={5}>5 baris</option>
              <option value={10}>10 baris</option>
              <option value={20}>20 baris</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NISN</th>
                <th className="py-3 px-4">Sekolah / Rombel</th>
                <th className="py-3 px-4">Gender & TTL</th>
                <th className="py-3 px-4">Alamat Domisili</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7d7152]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data peserta didik...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat data master siswa</p>
                    <p className="text-[11px] mt-1 text-[#7d7152]">
                      {error?.message || "Terjadi kesalahan koneksi ke server."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => refetch()}
                    >
                      Coba Lagi
                    </Button>
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">🎓</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data Siswa
                    </p>
                    <p className="text-xs text-[#9c8e6b] mt-0.5">
                      {debouncedSearch
                        ? `Tidak ada data yang cocok dengan "${debouncedSearch}"`
                        : "Klik tombol '+ Tambah Siswa' untuk menambahkan data peserta didik baru."}
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {
                  const no = listindex(page, pageSize, index);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-medium text-[#7d7152]">
                        {no}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2d2410]">
                          {item.nama}
                        </div>
                        <div className="text-[11px] text-[#7d7152] font-mono mt-0.5">
                          NISN: {item.nisn}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#2d2410]">
                          {item.unit_kerja || "Satdik Konawe Selatan"}
                        </div>
                        <Badge variant="outline" className="text-[10px] mt-1 bg-amber-50 border-amber-200">
                          {item.kelas_uraian || item.kelas_id || "Kelas Terdaftar"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#2d2410]">{item.jns_kelamin}</div>
                        <div className="text-[11px] text-[#7d7152] mt-0.5">
                          {item.tmp_lahir ? `${item.tmp_lahir}, ` : ""}
                          {item.tgl_lahir
                            ? new Intl.DateTimeFormat("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }).format(new Date(item.tgl_lahir))
                            : "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#5e5133] max-w-xs">
                        <span className="line-clamp-2">{item.alamat}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            title="Lihat Biodata"
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Ubah Data"
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus Data"
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#e2d9c8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbf9f4]/40">
          <span className="text-xs text-[#7d7152]">
            Menampilkan{" "}
            <strong className="text-[#2d2410]">
              {rawList.length > 0 ? (page - 1) * pageSize + 1 : 0}
            </strong>{" "}
            sampai{" "}
            <strong className="text-[#2d2410]">
              {Math.min(page * pageSize, totalItems)}
            </strong>{" "}
            dari <strong className="text-[#2d2410]">{totalItems}</strong> siswa
          </span>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      </Card>

      <FormSiswaModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DetailSiswaModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
