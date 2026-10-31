"""CLI helper to create or update a superadmin user."""

import argparse
import asyncio
import sys
import uuid

from sqlalchemy import select

from app.core.security import hash_password
from app.db.connections.edusetara import edusetara_session_factory
from app.models.auth.role import Role
from app.models.auth.user import User


async def create_or_update_superadmin(
    username: str,
    email: str,
    password: str,
    full_name: str,
    instansi_id: str = "dinas-pendidikan",
) -> None:
    async with edusetara_session_factory() as session:
        # Get superadmin role
        stmt = select(Role).where(Role.name == "superadmin")
        res = await session.execute(stmt)
        superadmin_role = res.scalar_one_or_none()

        if not superadmin_role:
            print("Error: Role 'superadmin' not found in database. Run seed_roles first.")
            sys.exit(1)

        # Check existing user
        user_stmt = select(User).where((User.username == username) | (User.email == email))
        user_res = await session.execute(user_stmt)
        user = user_res.scalar_one_or_none()

        if user:
            print(f"User '{username}' already exists. Updating password and superadmin role...")
            user.password_hash = hash_password(password)
            user.full_name = full_name
            user.role_id = superadmin_role.id
            user.instansi_id = instansi_id
            user.is_active = True
            user.is_verified = True
        else:
            print(f"Creating new superadmin user '{username}'...")
            user = User(
                id=str(uuid.uuid4()),
                username=username,
                email=email,
                password_hash=hash_password(password),
                full_name=full_name,
                role_id=superadmin_role.id,
                instansi_id=instansi_id,
                is_active=True,
                is_verified=True,
            )
            session.add(user)

        await session.commit()
        await session.refresh(user)
        print(f"Success! Superadmin user '{user.username}' is ready (ID: {user.id}).")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or update superadmin user")
    parser.add_argument("--username", default="kikensbatara", help="Username")
    parser.add_argument("--email", default="kikensbatara@gmail.com", help="Email")
    parser.add_argument("--password", default="cocodark", help="Password")
    parser.add_argument("--full-name", default="Kiken Sukma Batara", help="Full Name")
    parser.add_argument("--instansi-id", default="dinas-pendidikan", help="Instansi ID")

    args = parser.parse_args()
    asyncio.run(
        create_or_update_superadmin(
            username=args.username,
            email=args.email,
            password=args.password,
            full_name=args.full_name,
            instansi_id=args.instansi_id,
        )
    )


if __name__ == "__main__":
    main()
