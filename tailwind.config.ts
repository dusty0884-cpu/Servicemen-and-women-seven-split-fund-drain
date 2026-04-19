import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sb: {
          black: "#020204",
          card: "#0a0a0e",
          surface: "#111116",
          neon: "#39FF14",
          "neon-dim": "#2bcc10",
          border: "rgba(57,255,20,0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite alternate",
        "scan-line": "scan-line 2s linear infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%": { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
