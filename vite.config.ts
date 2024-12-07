import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'three-stdlib'],
  },
  server: {
    fs: {
      strict: false
    }
  },
  build: {
    chunkSizeWarningLimit: 20000,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-deps': ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  },
  base: '/',
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
  publicDir: 'public'
});