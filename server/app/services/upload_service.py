"""Reusable File Upload Service & Helper for EduSetara Backend."""

import os
import re
import shutil
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile, status

# Allowed extensions strictly excluding .txt
ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".heif",
    ".heic",
    ".gif",
    ".svg",
    ".bmp",
}

ALLOWED_DOCUMENT_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".ppt",
    ".pptx",
}

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".m4v",
    ".m4p",
    ".mkv",
    ".avi",
    ".mov",
    ".webm",
}

ALLOWED_EXTENSIONS = (
    ALLOWED_IMAGE_EXTENSIONS
    | ALLOWED_DOCUMENT_EXTENSIONS
    | ALLOWED_VIDEO_EXTENSIONS
)

BASE_UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"


class FileUploadService:
    """Helper service for validating, sanitizing, saving, and deleting uploaded files.
    
    Can be used as a standalone helper or injected via FastAPI Depends.
    """

    def __init__(
        self,
        module: str = "general",
        allowed_extensions: set[str] | None = None,
        max_size_bytes: int = 50 * 1024 * 1024,  # 50 MB
    ):
        self.module = self.sanitize_module_name(module)
        self.allowed_extensions = allowed_extensions or ALLOWED_EXTENSIONS
        self.max_size_bytes = max_size_bytes

    @staticmethod
    def sanitize_module_name(module: str) -> str:
        """Sanitize module name to prevent path traversal attacks."""
        cleaned = re.sub(r"[^a-zA-Z0-9_\-]", "", module)
        return cleaned if cleaned else "general"

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Create a collision-free and safe filename preserving extension."""
        original_stem = Path(filename).stem
        ext = Path(filename).suffix.lower()
        cleaned_stem = re.sub(r"[^a-zA-Z0-9_\-]", "_", original_stem)[:50]
        return f"{int(time.time())}_{uuid.uuid4().hex[:6]}_{cleaned_stem}{ext}"

    def validate_file(self, file: UploadFile) -> str:
        """Validate filename and ensure extension is in the whitelist."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nama file tidak valid atau kosong",
            )

        ext = Path(file.filename).suffix.lower()
        if ext not in self.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Ekstensi file '{ext}' tidak diizinkan. "
                    "Hanya file gambar (jpg, png, webp, heif, heic), "
                    "dokumen kantor (pdf, doc, docx, xls, xlsx, ppt, pptx), "
                    "dan video (mp4, mkv, avi, mov) yang diperbolehkan."
                ),
            )
        return ext

    async def save_file(self, file: UploadFile) -> dict[str, Any]:
        """Save uploaded file to disk and return file metadata and relative URL."""
        self.validate_file(file)

        saved_filename = self.sanitize_filename(file.filename)
        target_dir = BASE_UPLOAD_DIR / self.module
        target_dir.mkdir(parents=True, exist_ok=True)
        dest_path = target_dir / saved_filename

        try:
            with open(dest_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gagal menyimpan file ke disk: {str(e)}",
            )
        finally:
            await file.close()

        relative_url = f"/uploads/{self.module}/{saved_filename}"

        return {
            "filename": saved_filename,
            "original_filename": file.filename,
            "module": self.module,
            "file_url": relative_url,
            "file_path": f"uploads/{self.module}/{saved_filename}",
            "content_type": file.content_type,
            "size": dest_path.stat().st_size,
        }

    @staticmethod
    def delete_file(relative_url_or_path: str | None) -> bool:
        """Safely delete an uploaded file from disk when entity is deleted or rolled back."""
        if not relative_url_or_path:
            return False
        clean_path = relative_url_or_path.lstrip("/")
        if clean_path.startswith("uploads/"):
            file_path = BASE_UPLOAD_DIR.parent / clean_path
            if file_path.exists() and file_path.is_file():
                try:
                    file_path.unlink()
                    return True
                except Exception:
                    return False
        return False


def get_upload_service(module: str = "general") -> FileUploadService:
    """Dependency provider for FastAPI route injection."""
    return FileUploadService(module=module)
