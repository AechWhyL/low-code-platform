import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import path from "path";
const config = defineConfig({
  server: {
    proxy: {
      "/api": "http://template.josephxia.com",
    },
  },
  plugins: [reactPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

export default config;
