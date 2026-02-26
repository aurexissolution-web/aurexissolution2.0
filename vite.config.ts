import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        target: 'esnext',
        modulePreload: true,
        cssCodeSplit: true,
        minify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 700,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('/react-router-dom/')) return 'vendor-router';
                if (id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react';
                if (id.includes('/framer-motion/')) return 'vendor-motion';
                if (id.includes('/@supabase/')) return 'vendor-supabase';
                if (id.includes('/lucide-react/')) return 'vendor-icons';
                if (id.includes('/three/')) return 'vendor-three';
                if (id.includes('/recharts/')) return 'vendor-charts';
                if (id.includes('/swiper/')) return 'vendor-swiper';
                return 'vendor';
              }
            },
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
