import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      }
    },
  },
  plugins: [],
};
export default config;