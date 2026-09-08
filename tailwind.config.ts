import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: "#2A0D38",
          deep: "#170720",
          royal: "#4A185F",
        },
        gold: {
          warm: "#D6AD55",
          champagne: "#E9CD8A",
          light: "#F7E9BD",
        },
        ivory: "#FAF7F0",
        cream: "#F4EFE5",
        ink: "#1D1721",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        gold: "0 0 40px rgba(214,173,85,0.25)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(150%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shine: "shine 1.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
