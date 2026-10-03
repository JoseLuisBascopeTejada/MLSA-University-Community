// Cross-platform postbuild: copy dist/index.html to dist/404.html
// (GitHub Pages SPA fallback). Wired as the `postbuild` npm script.
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const from = join('dist', 'index.html');
const to = join('dist', '404.html');

if (!existsSync(from)) {
  console.error(`postbuild: ${from} not found, skipping 404.html copy`);
  process.exit(1);
}

copyFileSync(from, to);
console.log(`postbuild: copied ${from} to ${to}`);
