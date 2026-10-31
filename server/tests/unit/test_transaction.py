"""Unit tests for transaction helpers and MySQL IntegrityError conflict mapping."""

from unittest.mock import AsyncMock

import pytest
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import BadRequestException, ConflictException
from app.db.transaction import commit_or_raise_unique_conflict, is_mysql_duplicate_key_error


class MockMySQLOrigException:
    def __init__(self, args: tuple):
        self.args = args


def test_is_mysql_duplicate_key_error_detection() -> None:
    # 1. Error code 1062 in args
    mysql_orig = MockMySQLOrigException((1062, "Duplicate entry 'test' for key 'code'"))
    err_with_orig = IntegrityError(
        statement="INSERT ...",
        params={},
        orig=mysql_orig,
    )
    assert is_mysql_duplicate_key_error(err_with_orig)

    # 2. Text in message
    err_text = IntegrityError(
        statement="INSERT ...",
        params={},
        orig=Exception("Duplicate entry 'admin@gmail.com' for key 'users.email'"),
    )
    assert is_mysql_duplicate_key_error(err_text)

    # 3. Non-duplicate integrity error (e.g., Foreign Key 1452)
    fk_orig = MockMySQLOrigException((1452, "Cannot add or update a child row"))
    err_fk = IntegrityError(statement="INSERT ...", params={}, orig=fk_orig)
    assert not is_mysql_duplicate_key_error(err_fk)


@pytest.mark.asyncio
async def test_commit_or_raise_unique_conflict_success() -> None:
    session = AsyncMock()
    await commit_or_raise_unique_conflict(session)
    session.commit.assert_awaited_once()
    session.rollback.assert_not_called()


@pytest.mark.asyncio
async def test_commit_or_raise_unique_conflict_on_duplicate() -> None:
    session = AsyncMock()
    mysql_orig = MockMySQLOrigException((1062, "Duplicate entry for key 'code'"))
    session.commit.side_effect = IntegrityError("INSERT ...", {}, mysql_orig)

    with pytest.raises(ConflictException, match="Duplicate code detected"):
        await commit_or_raise_unique_conflict(session, conflict_message="Duplicate code detected.")

    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_commit_or_raise_unique_conflict_on_foreign_key() -> None:
    session = AsyncMock()
    fk_orig = MockMySQLOrigException((1452, "Cannot add or update a child row"))
    session.commit.side_effect = IntegrityError("INSERT ...", {}, fk_orig)

    with pytest.raises(BadRequestException, match="integrity constraint violation"):
        await commit_or_raise_unique_conflict(session)

    session.rollback.assert_awaited_once()
