"""Generic CRUD router for Master Aset resources.

Every slug exposes the same endpoints (see admin/API_CONTRACT_ADMIN.md, section 4):
GET /option, GET /read, GET /{id}, POST /create, PUT /update/{id}, DELETE /delete/{id}.
"""

import uuid
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, create_model
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.base import Base
from app.db.transaction import commit_or_raise_unique_conflict
from app.models.auth.user import User

Row = dict[str, Any]
Validator = Callable[[AsyncSession, Row], Awaitable[None]]
Enricher = Callable[[AsyncSession, list[Row]], Awaitable[None]]
Guard = Callable[[AsyncSession, Any], Awaitable[None]]


@dataclass
class AsetMasterSpec:
    """Describes one Master Aset resource for `build_router`."""

    model: type[Base]
    create_schema: type[BaseModel]
    update_schema: type[BaseModel]
    response_schema: type[BaseModel]
    #: Attribute holding the business code returned as `id` by /option.
    code_attr: str
    #: Builds the label returned as `value` by /option.
    option_label: Callable[[Any], str]
    #: Returns a SQLAlchemy clause for the free-text `search` parameter.
    search: Callable[[str], Any]
    order_by: tuple[Any, ...]
    #: Query parameter name -> model column (integer columns are compared as integers).
    filters: dict[str, Any] = field(default_factory=dict)
    #: Fields that cannot change once created (business keys).
    lock_fields: tuple[str, ...] = ()
    #: Adds derived columns before insert (e.g. level of a kode barang).
    derive: Callable[[Row], Row] | None = None
    #: Cross-table checks on the full row (create or merged update).
    validate: Validator | None = None
    #: Adds computed response fields to the listed rows.
    enrich: Enricher | None = None
    #: Raises HTTPException(409) when the row is still referenced.
    guard_delete: Guard | None = None


def to_row(obj: Any) -> Row:
    return {col.name: getattr(obj, col.name) for col in obj.__table__.columns}


def build_router(spec: AsetMasterSpec) -> APIRouter:
    """Create the CRUD router; every route requires an authenticated user."""
    router = APIRouter(dependencies=[Depends(get_current_user)])
    model = spec.model
    name = model.__name__

    list_schema = create_model(
        f"{name}List",
        total=(int, ...),
        skip=(int, 0),
        limit=(int, 100),
        data=(list[spec.response_schema], ...),  # type: ignore[name-defined]
    )

    async def respond(db: AsyncSession, objs: list[Any]) -> list[Row]:
        rows = [to_row(o) for o in objs]
        if spec.enrich:
            await spec.enrich(db, rows)
        return rows

    async def get_or_404(db: AsyncSession, id: str) -> Any:
        obj = (await db.execute(select(model).where(model.id == id))).scalar_one_or_none()
        if obj is None:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return obj

    @router.get("/option")
    async def option(
        db: AsyncSession = Depends(get_db),
        search: str | None = None,
    ) -> list[dict[str, str]]:
        query = select(model)
        if search:
            query = query.where(spec.search(search))
        query = query.order_by(*spec.order_by).limit(50)
        objs = (await db.execute(query)).scalars().all()
        return [
            {"id": str(getattr(o, spec.code_attr)), "value": spec.option_label(o)} for o in objs
        ]

    @router.get("", response_model=list_schema)
    @router.get("/", response_model=list_schema)
    @router.get("/read", response_model=list_schema)
    async def read(
        request: Request,
        db: AsyncSession = Depends(get_db),
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
    ) -> Row:
        query = select(model)
        if search:
            query = query.where(spec.search(search))
        for param, column in spec.filters.items():
            raw = request.query_params.get(param)
            if not raw:
                continue
            if column.type.python_type is not int:
                query = query.where(column == raw)
                continue
            try:
                query = query.where(column == int(raw))
            except ValueError:
                raise HTTPException(
                    status_code=422, detail=f"Filter {param} harus berupa angka"
                ) from None

        total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
        query = query.order_by(*spec.order_by).offset(max(skip, 0)).limit(min(max(limit, 1), 500))
        objs = list((await db.execute(query)).scalars().all())
        return {"total": total, "skip": skip, "limit": limit, "data": await respond(db, objs)}

    @router.get("/{id}", response_model=spec.response_schema)
    async def get_one(id: str, db: AsyncSession = Depends(get_db)) -> Row:
        obj = await get_or_404(db, id)
        return (await respond(db, [obj]))[0]

    @router.post("", response_model=spec.response_schema, status_code=status.HTTP_201_CREATED)
    @router.post(
        "/create", response_model=spec.response_schema, status_code=status.HTTP_201_CREATED
    )
    async def create(
        payload: spec.create_schema,  # type: ignore[name-defined]
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ) -> Row:
        data = payload.model_dump()
        if spec.derive:
            data.update(spec.derive(data))
        if spec.validate:
            await spec.validate(db, data)
        obj = model(
            id=str(uuid.uuid4()),
            created_by=getattr(current_user, "username", "admin"),
            **data,
        )
        db.add(obj)
        await commit_or_raise_unique_conflict(
            db, conflict_message="Data dengan kode/kunci yang sama sudah ada."
        )
        await db.refresh(obj)
        return (await respond(db, [obj]))[0]

    @router.put("/{id}", response_model=spec.response_schema)
    @router.put("/update/{id}", response_model=spec.response_schema)
    async def update(
        id: str,
        payload: spec.update_schema,  # type: ignore[name-defined]
        db: AsyncSession = Depends(get_db),
    ) -> Row:
        obj = await get_or_404(db, id)
        incoming = payload.model_dump(exclude_unset=True)
        # null is ignored for required columns; nullable ones can be cleared.
        current = to_row(obj)
        columns = obj.__table__.columns
        incoming = {k: v for k, v in incoming.items() if v is not None or columns[k].nullable}

        for key in spec.lock_fields:
            if key in incoming and incoming[key] != current[key]:
                raise HTTPException(
                    status_code=400, detail=f"{key} tidak dapat diubah setelah dibuat."
                )
        merged = {**current, **incoming}
        if spec.validate:
            await spec.validate(db, merged)
        for key, value in incoming.items():
            setattr(obj, key, value)
        await commit_or_raise_unique_conflict(
            db, conflict_message="Data dengan kode/kunci yang sama sudah ada."
        )
        await db.refresh(obj)
        return (await respond(db, [obj]))[0]

    @router.delete("/{id}")
    @router.delete("/delete/{id}")
    async def delete(id: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
        obj = await get_or_404(db, id)
        if spec.guard_delete:
            await spec.guard_delete(db, obj)
        await db.delete(obj)
        await commit_or_raise_unique_conflict(db)
        return {"message": "Berhasil menghapus data", "id": id, "data": {"id": id}}

    return router
