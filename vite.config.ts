import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** 使用相对路径，便于部署到 GitHub Pages（子路径或根目录均可） */
export default defineConfig({
  base: './',
  plugins: [react()],
});
