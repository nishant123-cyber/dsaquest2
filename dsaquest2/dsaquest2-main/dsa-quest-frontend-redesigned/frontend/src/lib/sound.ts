import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dsaquest_sound_enabled";

let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioCtx) audioCtx = new AudioCtor();
  return audioCtx;
}

function beep(freq: number, duration: number, delay = 0, type: OscillatorType = "sine", gain = 0.06) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ctx.destination);
  const start = ctx.currentTime + delay;
  osc.start(start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.stop(start + duration);
}

/** Reads/writes the persisted sound-effects preference. */
export function useSoundPreference() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) !== "off");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  }, [enabled]);

  return { enabled, toggle: () => setEnabled((e) => !e) };
}

/** Small library of game-feel sound effects, gated by the user's preference. */
export function useSoundEffects() {
  const { enabled } = useSoundPreference();

  const play = useCallback(
    (kind: "correct" | "incorrect" | "levelup" | "click" | "complete") => {
      if (!enabled) return;
      try {
        if (kind === "correct") {
          beep(660, 0.12, 0, "triangle", 0.07);
          beep(880, 0.15, 0.08, "triangle", 0.07);
        } else if (kind === "incorrect") {
          beep(180, 0.22, 0, "sawtooth", 0.05);
        } else if (kind === "levelup") {
          beep(523, 0.12, 0, "square", 0.06);
          beep(659, 0.12, 0.1, "square", 0.06);
          beep(784, 0.18, 0.2, "square", 0.06);
        } else if (kind === "click") {
          beep(440, 0.05, 0, "sine", 0.04);
        } else if (kind === "complete") {
          beep(392, 0.1, 0, "triangle", 0.06);
          beep(523, 0.1, 0.09, "triangle", 0.06);
          beep(659, 0.2, 0.18, "triangle", 0.06);
        }
      } catch {
        // Audio can fail silently (autoplay policy) — never block UX for it
      }
    },
    [enabled]
  );

  return { play };
}
