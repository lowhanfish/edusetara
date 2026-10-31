import json
import re

with open("ref/clean_parsed_modules.json", "r", encoding="utf-8") as f:
    modules = json.load(f)

print(f"Loaded {len(modules)} modules from clean_parsed_modules.json")

def format_module(m):
    num = m["num"]
    title = m["title"]
    category = m["category"]
    route = m["route"]
    endpoint = m["endpoint"]
    table = m["table"]
    raw = m["raw_text"]
    
    # Split raw text into Penjelasan, Form, and Contoh
    penjelasan = ""
    forms = []
    contoh = ""
    
    # Extract penjelasan
    # Starts after "Penjelasan:" or "Penjelasan :"
    p_match = re.search(r"Penjelasan\s*\d*\s*:(.*?)(?=(Form|\Z))", raw, re.DOTALL)
    if p_match:
        penjelasan = p_match.group(1).strip()
    else:
        # If no Penjelasan keyword (like Verifikasi BOSP), get text up to first Form
        f_idx = raw.find("Form")
        if f_idx != -1:
            penjelasan = raw[:f_idx].strip()
        else:
            penjelasan = raw.strip()
            
    # Clean title repeated in penjelasan
    lines_p = [l.strip() for l in penjelasan.split("\n") if l.strip()]
    cleaned_p = "\n\n".join(lines_p)
    
    # Find all Form blocks
    # regex to match "Form ... : { ... }" or "Form ... : { ... }."
    form_matches = list(re.finditer(r"(Form[^\n:]*):?\s*(\{.*?\n\})", raw, re.DOTALL))
    if form_matches:
        for f_m in form_matches:
            f_title = f_m.group(1).strip()
            f_body = f_m.group(2).strip()
            forms.append((f_title, f_body))
    else:
        # Check if JSON-like block exists without "Form" keyword
        j_match = re.search(r"(\{.*?\n\})", raw, re.DOTALL)
        if j_match:
            forms.append(("Form (Contract API)", j_match.group(1).strip()))
            
    # Find Contoh block
    c_match = re.search(r"Contoh\s*:(.*)", raw, re.DOTALL)
    if c_match:
        contoh = c_match.group(1).strip()
        
    out = []
    out.append(f"### {num}. {title}")
    out.append(f"**Kategori:** `{category}`  ")
    out.append(f"**Route Frontend:** [`{route}`](http://localhost:3000{route})  ")
    out.append(f"**Endpoint Backend:** `http://localhost:8000{endpoint}`  ")
    out.append(f"**Tabel Database:** `{table}`  ")
    out.append("")
    
    out.append("#### Deskripsi & Bisnis Logika")
    out.append(f"> {cleaned_p}")
    out.append("")
    
    if forms:
        out.append("#### Kontrak Payload JSON (API Contract)")
        for f_title, f_body in forms:
            out.append(f"**{f_title}**")
            out.append("```json")
            out.append(f_body)
            out.append("```")
            out.append("")
    else:
        out.append("#### Kontrak Payload JSON (API Contract)")
        out.append("```json\n{\n  \"id\": \"string, <generate otomatis | backend>\",\n  \"title\": \"string <input>\",\n  \"desc\": \"string <input>\",\n  \"created_at\": \"date, <generate otomatis | backend>\",\n  \"created_by\": \"string, <generate otomatis | backend>\"\n}\n```\n")

    if contoh:
        out.append("#### Contoh Data Riil (Konawe Selatan)")
        out.append("```text")
        out.append(contoh)
        out.append("```")
        out.append("")
        
    out.append("---")
    out.append("")
    return "\n".join(out)

# Build Header
header = """# Single Source of Truth (SSOT) Kontrak API & Arsitektur Admin EduSetara
**Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan**

> [!IMPORTANT]
> Dokumen ini diselaraskan 100% secara langsung dengan dokumen spesifikasi resmi **`ref/Arsitektur Sistem (1).docx`** dan struktur rute menu aktif **`admin/app/(admin)/_data/admin-menu.json`**.
> Dokumen ini mengatur seluruh kontrak API antara Frontend Next.js Admin (`http://localhost:3000/admin/*`) dan Backend FastAPI (`http://localhost:8000/api/v1/*`).
> **Dilarang keras mengarang atau menambahkan field, relasi, maupun enum di luar ketentuan dokumen resmi ini.**

---

## 1. Prinsip Utama & Standar Arsitektur

### 1.1 Standar Data Master (Master Lookup Tables)
Berdasarkan spesifikasi resmi `Arsitektur Sistem (1).docx`, seluruh tabel Data Master (seperti *Master Jenjang, Triwulan, Jenis Penerima, Kelas Penerima, Bahan Ajar, Materi Ajar, Kelas, Agama, Tempat Tinggal, Transportasi, Pendidikan, Pekerjaan, Penghasilan, Bangunan, Kepemilikan, Sumber Dana, Kondisi Alat, Jenis Bantuan, BK Jenis Layanan, BK Kegiatan Layanan, Model Pembelajaran, Pendampingan, Tugas, Kategori*) menggunakan skema standar:
```json
{
  "id": "string, <generate otomatis | backend>",
  "title": "string <input>",
  "desc": "string <input>",
  "created_at": "date, <generate otomatis | backend>",
  "created_by": "string, <generate otomatis | backend>"
}
```
* **Kesesuaian Database MySQL**: Pada basis data MySQL `edusetara`, field `title` berkorespondensi dengan kolom `uraian`, dan `desc` berkorespondensi dengan kolom `keterangan`. Backend FastAPI menggunakan SQLAlchemy `synonym` sehingga endpoint secara transparan menerima dan menghasilkan format JSON resmi `title` & `desc`.
* **Field Terlarang / Halusinasi**: Tidak ada kolom `kode`, `nip_pembina`, `bidang_pembina`, maupun kategori buatan di tabel Master Lookup ini.

### 1.2 Penanganan Field Otomatis Backend vs Input Pengguna
Field yang diberi penanda `<generate otomatis | backend>` seperti:
* `id`: Dihasilkan otomatis oleh database / backend (UUID / autoincrement).
* `nip` & `unit_kerja`: Untuk modul operasional (Sarpras, Jurnal, Usulan, Rombel, dll.), field ini **TIDAK DIINPUT OLEH PENGGUNA**. Backend menginjeksi nilainya secara otomatis dari token sesi ASN yang sedang login (`get_current_active_user`).
* `created_at` & `created_by`: Diisi otomatis oleh sistem backend.

### 1.3 Format Standar Respons API
Semua endpoint REST API FastAPI menggunakan format envelope standar:

**Daftar Data (List / Query):**
```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  }
}
```

**Operasi Tunggal / Mutasi (Create / Update / Delete):**
```json
{
  "status": "success",
  "message": "Data berhasil disimpan",
  "data": { ... }
}
```

**Respons Galat (Error):**
```json
{
  "status": "error",
  "message": "Rincian pesan validasi atau alasan kegagalan",
  "code": 400,
  "details": null
}
```

---

### 1.4 Pola Arsitektur Frontend (Hooks, TanStack Query, & Fetch Data)
Seluruh modul admin (termasuk Data Master) wajib mengadopsi pola arsitektur yang konsisten sesuai standar `guru-kelas` dan implementasi referensi `master-ref-taspen`:

1. **Struktur Direktori Komponen Modul**:
   ```
   app/(admin)/admin/[kategori]/[modul]/
   ├── page.tsx                 # Halaman utama (PageHeader, MetricStatCards, Table, Filter)
   ├── types.ts                 # Definisi tipe TypeScript (Item, FormInput, ApiResponse)
   ├── data.ts                  # Mock data fallback & definisi kolom tabel
   ├── Form[Modul]Modal.tsx     # Modal Tambah & Ubah (Form handling)
   ├── Detail[Modul]Modal.tsx   # Modal Detail (Read-only viewer)
   ├── DeleteConfirmModal.tsx   # Modal konfirmasi hapus data
   └── hooks/
       └── crud.tsx             # Custom React Hook TanStack Query (CRUD operations)
   ```

2. **Pola Custom Hook TanStack Query (`hooks/crud.tsx`)**:
   Setiap modul menyediakan custom hook yang merangkum:
   * `useQuery`: Mengambil data dengan cache key spesifik (e.g., `["master-jenjang", params]`), pagination, dan debounced search.
   * `useMutation` (Create, Update, Delete): Melakukan mutasi via API client `fetchData` dan otomatis menjalankan `queryClient.invalidateQueries({ queryKey: [...] })` saat mutasi berhasil.

3. **Penanganan Autentikasi & Token**:
   Panggilan API menggunakan token JWT Bearer yang tersimpan di cookies/session. Jika sesi kedaluwarsa atau tidak valid, sistem secara otomatis mengarahkan pengguna ke halaman login publik (`http://localhost:3000/login` atau `http://localhost:3000/`).

---

## 2. Tabel Ringkasan Rute & Modul Admin EduSetara

| No | Modul | Kategori | Route Frontend | Endpoint Backend | Tabel Database |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""

table_rows = []
for m in modules:
    num = m["num"]
    title = m["title"]
    category = m["category"]
    route = m["route"]
    endpoint = m["endpoint"]
    table = m["table"]
    table_rows.append(f"| {num} | **{title}** | {category} | `{route}` | `{endpoint}` | `{table}` |")

full_content = header + "\n".join(table_rows) + "\n\n---\n\n## 3. Spesifikasi Lengkap Modul (1 s/d 70)\n\n"

for m in modules:
    full_content += format_module(m)

with open("admin/API_CONTRACT_ADMIN.md", "w", encoding="utf-8") as out:
    out.write(full_content)

print(f"Generated admin/API_CONTRACT_ADMIN.md successfully ({len(full_content.splitlines())} lines)")
