import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
  // Adicione isso para lidar com as rotas do React Router
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  },
});
