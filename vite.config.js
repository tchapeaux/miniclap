import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteFonts from "vite-plugin-fonts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteFonts({
      // Custom fonts.
      custom: {
        families: [
          {
            name: "Chivo",
            local: "Chivo",
            src: "../assets/Chivo-Regular.otf",
          },
        ],
        display: "auto",
        preload: true,
      },
    }),
  ],
});
