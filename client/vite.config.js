import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../server/client-build", // ✅ Збірка йде в папку серверу
    emptyOutDir: true
  }
});

