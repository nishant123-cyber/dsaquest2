/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#111827",
        soft: "#F7F7F8",
        panel: "#FFFFFF",
        line: "#E5E7EB",
        muted: "#64748B",
        gold: "#F59E0B",
        orange: "#F97316",
        success: "#16A34A",
        info: "#2563EB",
        danger: "#EF4444",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(17,24,39,0.02), 0 6px 18px rgba(17,24,39,0.04)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      }
    },
  },
  plugins: [],
};
