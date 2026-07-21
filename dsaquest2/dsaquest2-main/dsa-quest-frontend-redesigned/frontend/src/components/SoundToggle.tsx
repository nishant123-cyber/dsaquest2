import { Volume2, VolumeX } from "lucide-react";
import { useSoundPreference } from "../lib/sound";

export default function SoundToggle() {
  const { enabled, toggle } = useSoundPreference();

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      title={enabled ? "Sound effects on" : "Sound effects off"}
      className="p-2 rounded-full transition-colors duration-150 hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}
