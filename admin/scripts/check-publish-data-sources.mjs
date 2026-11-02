import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../app/(publish)');
const allowedJson = new Set(['components/home-data.json']);
const allowedKeys = new Set(['navItems', 'audiences', 'footerQuickLinks', 'footerServices']);
const failures = [];
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (!/\.(tsx?|jsx?)$/.test(path)) continue;
    const source = await readFile(path, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']([^"']+\.json)["']/g)) {
      const target = relative(root, resolve(dirname(path), match[1]));
      if (!allowedJson.has(target)) failures.push(`${relative(root, path)} imports ${match[1]}`);
    }
    if (/from\s*["'][^"']*\/(?:news-data|announcements-data)["']/.test(source) && !/import\s+type/.test(source)) {
      failures.push(`${relative(root, path)} imports a local content dataset`);
    }
  }
}
await inspect(root);
const navigation = JSON.parse(await readFile(resolve(root, 'components/home-data.json'), 'utf8'));
for (const key of Object.keys(navigation)) {
  if (!allowedKeys.has(key)) failures.push(`Admin-managed content in local JSON: ${key}`);
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Publish data sources checked: local JSON is limited to navigation and audience shortcuts.');
