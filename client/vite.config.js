// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://knowledge-hub-kk06.onrender.com",
        changeOrigin: true,
        // 👇 Add this line to remove the /api prefix
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
