import { defineConfig } from "vite";
import path from "path";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#556cd6",
        secondary: "#19857b",
        error: "#ff1744", // matches red.A400 from MUI
        // Optional: extend default Tailwind palette
        muted: colors.gray[500],
      },
    },
  },
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
