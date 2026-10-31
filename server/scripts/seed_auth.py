import asyncio
import json
import uuid
import sys
from pathlib import Path

# Add server directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db.session import get_db
from sqlalchemy import text
from app.core.security import hash_password

async def seed_auth():
    async for db in get_db():
        # Check if auth_menus is empty
        res = await db.execute(text("SELECT count(*) FROM auth_menus"))
        count = res.scalar()
        if count == 0:
            print("Seeding auth_menus from admin-menu.json...")
            json_path = Path(__file__).resolve().parent.parent.parent / "admin" / "app" / "(admin)" / "_data" / "admin-menu.json"
            with open(json_path) as f:
                menu_data = json.load(f)
            
            seq = 0
            async def insert_node(nodes, parent_id=None):
                nonlocal seq
                for idx, node in enumerate(nodes, start=1):
                    seq += 1
                    menu_id = f"MNU-{seq:03d}"
                    title = node.get("title", "")
                    icon = node.get("icon", "Folder")
                    path = node.get("path") or ""
                    
                    await db.execute(text("""
                        INSERT INTO auth_menus (id, parent_id, title, icon, path, `index`, is_active, created_by, created_at)
                        VALUES (:id, :parent_id, :title, :icon, :path, :index, 1, 'System Seeder', NOW())
                    """), {
                        "id": menu_id,
                        "parent_id": parent_id,
                        "title": title,
                        "icon": icon,
                        "path": path,
                        "index": idx
                    })
                    
                    children = node.get("children")
                    if children:
                        await insert_node(children, parent_id=menu_id)

            await insert_node(menu_data)
            await db.commit()
            print(f"Successfully seeded {seq} menus into auth_menus!")

        # Seed initial permissions for GRP-001 (Super Admin)
        perm_res = await db.execute(text("SELECT count(*) FROM auth_group_permissions"))
        if perm_res.scalar() == 0:
            print("Seeding default permissions for GRP-001...")
            menus = await db.execute(text("SELECT id FROM auth_menus"))
            for (m_id,) in menus.fetchall():
                p_id = str(uuid.uuid4())
                await db.execute(text("""
                    INSERT INTO auth_group_permissions (id, group_id, menu_id, `create`, `read`, `update`, `delete`, created_by, created_at)
                    VALUES (:id, 'GRP-001', :menu_id, 1, 1, 1, 1, 'System Seeder', NOW())
                """), {"id": p_id, "menu_id": m_id})
            await db.commit()
            print("Seeded permissions for GRP-001!")

        # Seed ASN users if only 1 user exists
        u_res = await db.execute(text("SELECT count(*) FROM users"))
        if u_res.scalar() <= 1:
            print("Seeding ASN users into users table...")
            asn_list = [
                ("19870412 201001 2 001", "Nur Aisyah, S.Pd.", "nur.aisyah@dikbud.go.id", "GRP-002", "Dinas Pendidikan dan Kebudayaan", "Analis Kebijakan"),
                ("19821108 200604 1 004", "La Ode Rahmat, S.Pd.", "laode.rahmat@dikbud.go.id", "GRP-003", "SMP Negeri 1 Andoolo", "Kepala Sekolah"),
                ("19900321 201503 2 006", "Wa Ode Sari, S.Pd.", "waode.sari@dikbud.go.id", "GRP-004", "SD Negeri 4 Palangga", "Guru Kelas"),
                ("19850917 200902 1 003", "Muhammad Fajar, S.Kom.", "mfajar@dikbud.go.id", "GRP-001", "Dinas Pendidikan dan Kebudayaan", "Pranata Komputer"),
                ("19910614 201902 2 008", "Sri Wahyuni, S.Pd.", "sri.wahyuni@dikbud.go.id", "GRP-004", "TK Negeri Pembina Tinanggea", "Guru PAUD"),
                ("19881203 201101 1 009", "Arman, S.Pd., M.Pd.", "arman@dikbud.go.id", "GRP-004", "SMP Negeri 2 Ranomeeto", "Guru Mata Pelajaran"),
                ("19920525 202012 2 012", "Dewi Lestari, S.Pd.", "dewi.lestari@dikbud.go.id", "GRP-005", "SD Negeri 2 Laeya", "Operator Satuan Pendidikan"),
                ("19840309 200801 1 005", "Hasanuddin, S.Pd.", "hasanuddin@dikbud.go.id", "GRP-002", "Dinas Pendidikan dan Kebudayaan", "Pengawas Sekolah"),
            ]
            hashed_pwd = hash_password("Password123!")
            for nip, name, email, grp, unit, jab in asn_list:
                uid = str(uuid.uuid4())
                uname = email.split("@")[0].replace(".", "_")
                await db.execute(text("""
                    INSERT INTO users (id, username, email, password_hash, full_name, is_active, is_verified, group_id, nip, instansi_id, jabatan, created_at, updated_at)
                    VALUES (:id, :uname, :email, :pwd, :name, 1, 1, :grp, :nip, :unit, :jab, NOW(), NOW())
                """), {
                    "id": uid,
                    "uname": uname,
                    "email": email,
                    "pwd": hashed_pwd,
                    "name": name,
                    "grp": grp,
                    "nip": nip,
                    "unit": unit,
                    "jab": jab
                })
            await db.commit()
            print(f"Successfully seeded {len(asn_list)} ASN users!")
        break

if __name__ == "__main__":
    asyncio.run(seed_auth())
