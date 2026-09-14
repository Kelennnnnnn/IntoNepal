import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function getCustomEnv() {
  const customEnv: Record<string, string> = {};
  for (const file of ['.env.example', '.env.local', '.env']) {
    try {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const line of content.split('\n')) {
          const match = line.match(/^([^#=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim();
            if (val && !customEnv[key]) {
              customEnv[key] = val;
            }
          }
        }
      }
    } catch {}
  }
  return customEnv;
}

export default defineConfig(() => {
  const customEnv = getCustomEnv();
  const activeUrl = customEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const activeKey = customEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(activeUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(activeKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
