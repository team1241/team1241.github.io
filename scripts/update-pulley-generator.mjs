import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Build into the folder served by this site's existing /docs deployment.
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(project, 'utilities/pulley-generator');
const output = resolve(project, 'docs/pulley-generator');
const vite = resolve(source, 'node_modules/vite/bin/vite.js');
if (!existsSync(vite)) {
  throw new Error('Install dependencies first: npm ci --prefix utilities/pulley-generator');
}
const build = spawnSync(process.execPath, [vite, 'build', source, '--configLoader', 'runner',
  '--outDir', output, '--emptyOutDir'], { cwd: source, stdio: 'inherit' });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status || 1);

console.log('Pulley Generator is ready in docs/pulley-generator/.');
