import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 ensures correct base path for Vercel
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://knowledge-hub-kk06.onrender.com/",
        changeOrigin: true,
      },
    },
  },
});
