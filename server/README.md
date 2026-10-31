# EduSetara Backend API

Backend RESTful API untuk Sistem Informasi Dinas Pendidikan & Kebudayaan Kabupaten Konawe Selatan (**EduSetara**).

## Tech Stack
- **Framework**: FastAPI (Python 3.12+)
- **Database Utama**: MySQL 8.0+ (`edusetara`)
- **Database Eksternal (Opsional / Read-Only)**: `simpeg`, `egov`
- **ORM**: SQLAlchemy 2.x Async (`asyncmy` driver) dengan gaya deklaratif klasik `Column()`
- **Migrasi**: Alembic (khusus mengelola database `edusetara`)
- **Validasi Data**: Pydantic v2 & `pydantic-settings`
- **Autentikasi**: HttpOnly Cookies + JWT + Argon2id
- **Testing**: `pytest`, `pytest-asyncio`, `httpx`
- **Linter**: `Ruff`

---

## 1. Persiapan Database MySQL
Pastikan MySQL 8.0+ sedang berjalan. Buat database utama `edusetara` dengan query berikut:

```sql
CREATE DATABASE IF NOT EXISTS edusetara
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Buat user khusus aplikasi (atau sesuaikan dengan konfigurasi .env)
CREATE USER IF NOT EXISTS 'edusetara_user'@'localhost' IDENTIFIED BY 'password_aman_anda';
GRANT ALL PRIVILEGES ON edusetara.* TO 'edusetara_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 2. Instalasi & Konfigurasi Lingkungan

1. Buat dan aktifkan virtual environment (Python 3.12+):
   ```bash
   python3.12 -m venv .venv
   source .venv/bin/activate
   ```

2. Pasang dependencies:
   ```bash
   pip install -e ".[dev]"
   ```

3. Siapkan file `.env`:
   ```bash
   cp .env.example .env
   # Sesuaikan kredensial DB_USER, DB_PASSWORD, dan JWT_SECRET_KEY pada .env
   ```

---

## 3. Menjalankan Server Pengembangan

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- Endpoint Health Check: `GET http://127.0.0.1:8000/api/v1/health`
- Dokumentasi Interaktif OpenAPI (Swagger): `http://127.0.0.1:8000/docs`

---

## 4. Database Migration (Alembic)
Alembic dikonfigurasi **hanya** untuk mengelola database `edusetara`:

```bash
# Membuat migrasi baru berdasarkan perubahan model
alembic revision --autogenerate -m "create_initial_tables"

# Menjalankan migrasi ke versi terbaru
alembic upgrade head

# Rollback satu langkah
alembic downgrade -1
```

---

## 5. Pengujian (Testing) & Linting

```bash
# Jalankan test suite
pytest

# Jalankan linter dan formatting check
ruff check .
```
