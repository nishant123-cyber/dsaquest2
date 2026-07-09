/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "'Comic Sans MS'", "cursive", "sans-serif"],
      },
      colors: {
        quest: {
          purple: "#7C3AED",
          pink: "#EC4899",
          blue: "#3B82F6",
          green: "#10B981",
          yellow: "#F59E0B",
          bg: "#F5F3FF",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        wiggle: "wiggle 0.6s ease-in-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
