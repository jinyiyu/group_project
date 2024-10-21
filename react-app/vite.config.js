import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true, // Handle different origins
        rewrite: (path) => path.replace(/^\/users/, "/users"),
      },
    },
  },
});
