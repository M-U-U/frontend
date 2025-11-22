// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Diperlukan untuk memproses JSX/React

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASH_PATH || "/frontend"
});