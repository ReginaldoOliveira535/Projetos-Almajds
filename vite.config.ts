/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    host: true,
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});