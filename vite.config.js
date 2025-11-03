import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/country-clash/",     // ← para GitHub Pages (si el repo se llama así)
  plugins: [react()],
});
