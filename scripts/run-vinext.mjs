import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const minimumMajor = 22;
const currentMajor = Number(process.versions.node.split(".")[0]);
const bundledNode = join(
  homedir(),
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node",
);

let runtime = process.execPath;

if (currentMajor < minimumMajor) {
  if (!existsSync(bundledNode)) {
    console.error(
      `Vinext membutuhkan Node.js ${minimumMajor} atau lebih baru. ` +
        "Jalankan `nvm install 22 && nvm use 22`, lalu ulangi perintah ini.",
    );
    process.exit(1);
  }

  runtime = bundledNode;
  console.log(
    `Node.js ${process.versions.node} terdeteksi; memakai runtime kompatibel secara otomatis.`,
  );
}

const cli = fileURLToPath(
  new URL("../node_modules/vinext/dist/cli.js", import.meta.url),
);
const args = process.argv.slice(2);
const result = spawnSync(runtime, [cli, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${dirname(runtime)}${delimiter}${process.env.PATH ?? ""}`,
  },
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
