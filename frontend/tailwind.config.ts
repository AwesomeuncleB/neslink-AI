import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f1d33",
          raised: "#16273e",
        },
        paper: {
          DEFAULT: "#faf6ec",
          line: "#e2d9bf",
        },
        gold: {
          DEFAULT: "#b58a3d",
          bright: "#d3a856",
        },
        stamp: {
          red: "#8c2a3b",
        },
        ink: {
          DEFAULT: "#211c15",
          soft: "#57503f",
        },
        fog: "#93a1b8",
      },
      fontFamily: {
        display: ["Petrona", "serif"],
        body: ["PT Serif", "serif"],
        mono: ["Courier Prime", "monospace"],
        main: ["Inter", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
      },
      animation: {
        "stamp-down": "stamp-down 0.35s ease-out",
      },
      keyframes: {
        "stamp-down": {
          "0%": { transform: "rotate(-7deg) scale(1.6)", opacity: "0" },
          "60%": { transform: "rotate(-7deg) scale(0.94)", opacity: "1" },
          "100%": { transform: "rotate(-7deg) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
