import { spawnSync } from "node:child_process";
import { renameSync, existsSync, rmSync } from "node:fs";

const apiDir = "app/api";
const apiBackup = "/tmp/gia-api-backup";
const instrumentation = "instrumentation.ts";
const instrumentationBackup = "/tmp/gia-instrumentation.ts";

function move(from, to) {
  if (existsSync(from)) renameSync(from, to);
}

function restore() {
  move(apiBackup, apiDir);
  move(instrumentationBackup, instrumentation);
}

rmSync(".next", { recursive: true, force: true });
rmSync(apiBackup, { recursive: true, force: true });
rmSync(instrumentationBackup, { force: true });

move(apiDir, apiBackup);
move(instrumentation, instrumentationBackup);

const build = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_STATIC: "true",
  },
});

restore();
process.exit(build.status ?? 1);
