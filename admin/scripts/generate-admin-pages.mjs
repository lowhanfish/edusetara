import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const menuDataPath = path.join(rootDir, "app/(admin)/_data/admin-menu.json");
const menuData = JSON.parse(fs.readFileSync(menuDataPath, "utf-8"));

const existingRoutes = new Set([
  "/admin",
  "/admin/publish/berita",
  "/admin/publish/pengumuman",
  "/admin/publish/pendidikan",
  "/admin/sekolah",
  "/admin/publish/kebudayaan",
  "/admin/publish/layanan",
  "/admin/publish/statistik",
  "/admin/publish/profil",
  "/admin/publish/banner",
  "/admin/publish/kontak",
]);


const pagesToCreate = [];

function traverse(items, breadcrumbs = []) {
  for (const item of items) {
    const currentBreadcrumbs = [...breadcrumbs, { label: item.title, href: item.path }];
    if (item.path && !existingRoutes.has(item.path)) {
      pagesToCreate.push({
        title: item.title,
        path: item.path,
        icon: item.icon,
        category: breadcrumbs.length > 0 ? breadcrumbs[0].label : item.title,
        breadcrumbs: currentBreadcrumbs,
      });
    }
    if (item.children) {
      traverse(item.children, currentBreadcrumbs);
    }
  }
}

// Traverse menu items (excluding Publish)
const _publishItem = menuData.find((m) => m.title === "Publish");
const nonPublishItems = menuData.filter((m) => m.title !== "Publish");
traverse(nonPublishItems);

console.log(`Found ${pagesToCreate.length} pages to scaffold.`);

for (const page of pagesToCreate) {
  // e.g. path "/admin/sarpras/tanah" -> target dir "app/(admin)/admin/sarpras/tanah"
  const relativeDir = path.join("app/(admin)", page.path);
  const targetDir = path.join(rootDir, relativeDir);
  const targetFile = path.join(targetDir, "page.tsx");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Calculate relative import to app/(admin)/_components/admin-page-scaffold
  const depth = page.path.split("/").filter(Boolean).length; // e.g. "/admin/sarpras/tanah" -> 3 segments
  // From app/(admin)/admin/sarpras/tanah to app/(admin)/_components is ../../../_components
  const relPrefix = "../".repeat(depth);
  const scaffoldImport = `${relPrefix}_components/admin-page-scaffold`;

  const functionName = page.title
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") + "Page";

  const content = `import { AdminPageScaffold } from "${scaffoldImport}";

export const metadata = {
  title: "${page.title}",
  description: "Manajemen ${page.title} Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function ${functionName}() {
  return (
    <AdminPageScaffold
      title="${page.title}"
      category="${page.category}"
      description="Kelola dan konfigurasi data ${page.title} secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="${page.icon}"
      breadcrumbs={${JSON.stringify(page.breadcrumbs, null, 8).replace(/\n\s{8}/g, "\n      ")}}
    />
  );
}
`;

  fs.writeFileSync(targetFile, content, "utf-8");
  console.log(`Created: ${targetFile}`);
}

console.log("All pages generated successfully!");
