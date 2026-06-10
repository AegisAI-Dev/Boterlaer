import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ee",
          100: "#dfe9de",
          200: "#c7d7c4",
          300: "#a8bba2",
          400: "#89a083",
          500: "#6f8868",
          600: "#556b2f",
          700: "#445b32",
          800: "#304639",
          900: "#1e3a2f",
        },
        secondary: {
          50: "#fff7f2",
          100: "#fce8df",
          200: "#f6cfbe",
          300: "#eda989",
          400: "#df8562",
          500: "#c86b4a",
          600: "#a95437",
          700: "#8a432d",
          800: "#6a3323",
          900: "#482117",
        },
        accent: {
          DEFAULT: "#1e3a2f",
          light: "#556b2f",
          dark: "#142720",
        },
        botanical: {
          forest: "#1e3a2f",
          moss: "#556b2f",
          sage: "#a8bba2",
          cream: "#f8f5ec",
          terracotta: "#c86b4a",
          gold: "#d4af37",
          sand: "#f8f5ec",
          earth: "#e8deca",
          mint: "#dce7d8",
          ink: "#233129",
        },
        neutral: {
          offwhite: "#f8f5ec",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        botanical: "0 20px 60px rgba(30, 58, 47, 0.12)",
        paper: "0 14px 40px rgba(35, 49, 41, 0.08)",
      },
      backgroundImage: {
        paper:
          "radial-gradient(circle at top, rgba(255,255,255,0.7), rgba(248,245,236,0.92) 55%, rgba(232,222,202,0.95))",
      },
    },
  },
  plugins: [],
};

export default config;

