import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const docs = new URL('../docs/', import.meta.url);
const page = new URL('index.html', docs);
let html = readFileSync(page, 'utf8');
for (const name of ['search-easter-eggs.css','search-egg-scenes.css','search-egg-effects.css','search-team-effects.css','search-team-effects.js','search-team-stats.css','search-team-stats.js','search-component-effects.css','search-component-effects.js','search-cnc-effects.css','search-cnc-effects.js','search-egg-catalog.js','search-egg-scenes.js','search-egg-effects.js','search-easter-eggs.js']) {
  // Git can check these text files out with CRLF on Windows and LF elsewhere.
  // Hash the same content on both systems so checking out a branch does not stale the versions.
  const source = readFileSync(new URL(name, docs), 'utf8').replace(/\r\n/g, '\n');
  const hash = createHash('sha256').update(source).digest('hex').slice(0,12);
  const escaped = name.replace(/\./g, '\\.');
  html = html.replace(new RegExp('((?:src|href)=")' + escaped + '(?:\\?[^"]*)?"', 'g'),
    (_,prefix) => prefix + name + '?v=' + hash + '"');
}
writeFileSync(page, html);
console.log('Updated search asset versions in ' + fileURLToPath(page));
