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
        db_obj = self.model(**obj_in)
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
            for field, value in obj_in.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)

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
