/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "'Comic Sans MS'", "cursive", "sans-serif"],
      },
      colors: {
        // Legacy palette — still used by Login/Signup/Visualizers/Quiz/Battle
        // until those get redesigned in a later pass.
        quest: {
          purple: "#7C3AED",
          pink: "#EC4899",
          blue: "#3B82F6",
          green: "#10B981",
          yellow: "#F59E0B",
          bg: "#F5F3FF",
        },
        // New neutral-first design system (Navbar, Dashboard, and onward).
        // Mostly grayscale; accent is used sparingly for state, not decoration.
        accent: {
          DEFAULT: "#E8790C",
          hover: "#CC6A09",
          soft: "#FCEEDD",
        },
        success: { DEFAULT: "#1AA260", soft: "#E4F6ED" },
        danger: { DEFAULT: "#E43D3D", soft: "#FCEAEA" },
        info: { DEFAULT: "#3170D0", soft: "#EAF1FB" },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
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
