import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for clean client-side routing on Vercel/Netlify
  build: {
    outDir: "dist",
  },
});
