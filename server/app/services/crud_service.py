"""Reusable CRUD operations shared by multiple resources (e-office pattern)."""

from typing import Any, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base
from app.db.transaction import commit_or_raise_unique_conflict

ModelType = TypeVar("ModelType", bound=Base)


class CRUDBase[ModelType: Base]:
    """Standard generic CRUD service for SQLAlchemy models."""

    def __init__(self, model: type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> ModelType | None:
        """Ambil 1 data berdasarkan ID."""
        query = select(self.model).filter(self.model.id == id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ModelType]:
        """Tampilkan data dengan pagination."""
        query = select(self.model).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: dict[str, Any]) -> ModelType:
        """Tambah data baru ke database."""
        model_cols = {col.name for col in self.model.__table__.columns} if hasattr(self.model, "__table__") else set()
        clean_data = {}
        for k, v in obj_in.items():
            if k in model_cols or hasattr(self.model, k):
                clean_data[k] = v
            elif k == "title" and "uraian" in model_cols:
                clean_data["uraian"] = v
            elif k == "desc" and "keterangan" in model_cols:
                clean_data["keterangan"] = v
            elif k == "keterangan" and "desc" in model_cols:
                clean_data["desc"] = v
            elif k == "uraian" and "title" in model_cols:
                clean_data["title"] = v

        db_obj = self.model(**clean_data)
        db.add(db_obj)
        await commit_or_raise_unique_conflict(db)
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        id: Any,
        obj_in: dict[str, Any],
    ) -> ModelType | None:
        """Ubah data berdasarkan ID."""
        query = select(self.model).filter(self.model.id == id)
        result = await db.execute(query)
        db_obj = result.scalar_one_or_none()

        if db_obj:
            model_cols = {col.name for col in self.model.__table__.columns} if hasattr(self.model, "__table__") else set()
            for field, value in obj_in.items():
                if field in model_cols or hasattr(db_obj, field):
                    try:
                        setattr(db_obj, field, value)
                    except Exception:
                        pass
                elif field == "title" and "uraian" in model_cols:
                    setattr(db_obj, "uraian", value)
                elif field == "desc" and "keterangan" in model_cols:
                    setattr(db_obj, "keterangan", value)

            await commit_or_raise_unique_conflict(db)
            await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: Any) -> bool:
        """Hapus data berdasarkan ID."""
        query = select(self.model).filter(self.model.id == id)
        result = await db.execute(query)
        db_obj = result.scalar_one_or_none()

        if db_obj:
            await db.delete(db_obj)
            await commit_or_raise_unique_conflict(db)
            return True
        return False
