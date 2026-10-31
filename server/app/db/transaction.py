"""Database transaction management and MySQL IntegrityError handler."""

import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ConflictException

logger = logging.getLogger("edusetara.transaction")


def is_mysql_duplicate_key_error(exc: IntegrityError) -> bool:
    """
    Determine if an IntegrityError originated from a MySQL duplicate key violation (Error 1062).
    """
    orig = getattr(exc, "orig", None)
    if orig is not None:
        # Check args for MySQL error code 1062
        args = getattr(orig, "args", ())
        if args and len(args) > 0:
            if args[0] == 1062:
                return True
            if any("1062" in str(arg) for arg in args):
                return True

    # Fallback inspection of error message text
    msg = str(exc).lower()
    return "duplicate entry" in msg or "1062" in msg


async def commit_or_raise_unique_conflict(
    session: AsyncSession,
    conflict_message: str = "A resource with these unique attributes already exists.",
) -> None:
    """
    Commit the ongoing transaction. If a unique constraint violation occurs (MySQL 1062),
    safely rollback and raise a ConflictException (HTTP 409).
    For other database integrity errors, rollback and raise a sanitized
    BadRequestException (HTTP 400).
    """
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        logger.warning(f"IntegrityError encountered: {exc}")

        if is_mysql_duplicate_key_error(exc):
            raise ConflictException(message=conflict_message) from exc

        # Other integrity constraint violations (foreign key or null constraint)
        raise BadRequestException(
            message="Database integrity constraint violation. Please verify referenced records."
        ) from exc
    except Exception as exc:
        await session.rollback()
        logger.error(f"Unexpected database error during commit: {exc}", exc_info=True)
        raise
