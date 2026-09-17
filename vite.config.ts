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
  const activePortal = process.env.VITE_PORTAL || customEnv.VITE_PORTAL || 'all';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(activeUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(activeKey),
      'import.meta.env.VITE_PORTAL': JSON.stringify(activePortal),
    },
    resolve: {
      alias: [
        ...(activePortal === 'customer'
          ? [
              {
                find: '@/routes/partnerRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
              {
                find: '@/routes/adminRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
            ]
          : activePortal === 'partner'
          ? [
              {
                find: '@/routes/customerRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
              {
                find: '@/routes/adminRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
            ]
          : activePortal === 'admin'
          ? [
              {
                find: '@/routes/customerRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
              {
                find: '@/routes/partnerRoutes',
                replacement: path.resolve(__dirname, './src/routes/emptyRoutes.ts'),
              },
            ]
          : []),
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    },
  };
});
