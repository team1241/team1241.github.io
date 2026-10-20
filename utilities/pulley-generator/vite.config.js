import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
  base: './',
  worker: { format: 'iife' },
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } },
  },
  plugins: [{
    name: 'theme-before-first-paint',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const theme = readFileSync(new URL('../../docs/theme.js', import.meta.url), 'utf8');
        return html.replace(/(<meta charset="UTF-8"\s*\/?\s*>)/i, (_, meta) =>
          `${meta}<script>${theme.replace(/<\/script/gi, '<\\/script')}</script>`);
      },
    },
  }, {
    name: 'standalone-file-preview',
    apply: 'build',
    generateBundle: {
      order: 'post',
      handler(options, bundle) {
        const html = bundle['index.html'];
        if (!html || html.type !== 'asset') throw new Error('Missing app HTML.');
        const embedded = new Set();
        html.source = String(html.source)
          .replace(/<script\b[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g, (tag, file) => {
            const chunk = bundle[file];
            if (!chunk || chunk.type !== 'chunk') throw new Error(`Missing script: ${file}`);
            embedded.add(file);
            return `<script>${chunk.code.replace(/<\/script/gi, '<\\/script')}</script>`;
          })
          .replace(/<link\b[^>]*rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g, (tag, file) => {
            const css = bundle[file];
            if (!css || css.type !== 'asset') throw new Error(`Missing stylesheet: ${file}`);
            embedded.add(file);
            return `<style>${String(css.source).replace(/<\/style/gi, '<\\/style')}</style>`;
          });
        // Classic scripts must run after the React mount element exists.
        const scripts = [];
        html.source = html.source.replace(/<script>[\s\S]*?<\/script>/g, script => {
          // The tiny shared theme bootstrap stays in the head, before any paint.
          if (script.includes('if (window.siteTheme) return;')) return script;
          scripts.push(script);
          return '';
        }).replace('</body>', () => `${scripts.join('')}</body>`);
        for (const file of embedded) delete bundle[file];
      },
    },
  }],
});
