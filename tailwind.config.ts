import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D060",
          dark: "#A67C00",
          glow: "#FFE566",
        },
        crimson: {
          DEFAULT: "#8B0000",
          light: "#B22222",
          deep: "#5C0000",
        },
        "warm-black": "#0D0500",
        "warm-dark": "#1A0800",
        "warm-mid": "#2A1200",
        "card-bg": "rgba(26, 8, 0, 0.85)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-radial": "radial-gradient(ellipse at center, #FFE566 0%, #D4AF37 40%, #A67C00 100%)",
        "crimson-glow": "radial-gradient(ellipse at center, #B22222 0%, #8B0000 60%, #5C0000 100%)",
      },
      animation: {
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
      },
      keyframes: {
        goldPulse: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
