"""Script to seed initial Master Data for EduSetara."""

import asyncio

from app.db.connections.edusetara import edusetara_engine, edusetara_session_factory
from app.db.seed_master import seed_all_master_data


async def main() -> None:
    print("Seeding initial Master Data from API_CONTRACT_ADMIN.md...")
    async with edusetara_session_factory() as session:
        counts = await seed_all_master_data(session)
        print("Master Data seeding completed successfully:")
        for table, count in counts.items():
            if count > 0:
                print(f"  - {table}: {count} records inserted")
            else:
                print(f"  - {table}: up to date")

    await edusetara_engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
