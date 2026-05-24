import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const projectRoot = process.cwd();
const localConfigHome = join(projectRoot, '.astro-config');
mkdirSync(localConfigHome, { recursive: true });

const command = process.execPath;
const args = [join(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs'), ...process.argv.slice(2)];

const result = spawnSync(command, args, {
  cwd: projectRoot,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    XDG_CONFIG_HOME: localConfigHome,
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
