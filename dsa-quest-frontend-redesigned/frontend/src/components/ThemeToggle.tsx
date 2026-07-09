import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useSoundEffects } from "../lib/sound";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { play } = useSoundEffects();

  return (
    <button
      onClick={() => {
        play("click");
        toggleTheme();
      }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-full transition-colors duration-150 hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
