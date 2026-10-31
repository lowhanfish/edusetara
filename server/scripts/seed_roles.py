"""Seed initial standard roles for EduSetara."""

import asyncio
import uuid

from sqlalchemy import select

from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory
from app.models.auth.role import Role

DEFAULT_ROLES = [
    {
        "name": "superadmin",
        "description": "Super Administrator dengan akses penuh ke seluruh modul sistem",
    },
    {
        "name": "admin",
        "description": "Administrator Dinas Pendidikan dan Kebudayaan",
    },
    {
        "name": "operator",
        "description": "Operator Sekolah dan Instansi",
    },
    {
        "name": "guru",
        "description": "Tenaga Pendidik / Guru",
    },
    {
        "name": "user",
        "description": "Pengguna standar terdaftar",
    },
]


async def seed() -> None:
    """Insert default roles if they do not exist."""
    print("Seeding initial roles...")
    async with edusetara_session_factory() as session:  # type: AsyncSession
        for role_data in DEFAULT_ROLES:
            stmt = select(Role).where(Role.name == role_data["name"])
            res = await session.execute(stmt)
            existing = res.scalars().first()
            if not existing:
                new_role = Role(
                    id=str(uuid.uuid4()),
                    name=role_data["name"],
                    description=role_data["description"],
                )
                session.add(new_role)
                print(f"Created role: {role_data['name']}")
            else:
                print(f"Role already exists: {role_data['name']}")
        await session.commit()
    await edusetara_engine.dispose()
    print("Role seeding completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
