import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // <-- REMOVA ESTA LINHA

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // plugins: [react(), mode === "development" && componentTagger()].filter(Boolean), // <-- SUBSTITUA ESTA LINHA
  plugins: [react()], // <-- POR ESTA
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));