import { useEffect } from "react";
import type { PlaybackMode } from "../runtime/types";

interface Options {
  src: string | null;
  mode: PlaybackMode;
  fallbackMs: number;
  autoStarted: boolean;
  onAutoAdvance(): void;
}

export function useAudioPlayer({ src, mode, fallbackMs, autoStarted, onAutoAdvance }: Options) {
  useEffect(() => {
    if (mode === "manual" || (mode === "auto" && !autoStarted)) return;
    let timer: number | undefined;
    let advanced = false;
    const advance = () => {
      if (mode === "auto" && !advanced) {
        advanced = true;
        onAutoAdvance();
      }
    };
    const audio = src ? new Audio(src) : null;
    if (audio) {
      audio.preload = "auto";
      audio.addEventListener("ended", () => window.setTimeout(advance, 180));
      audio.addEventListener("error", () => { timer = window.setTimeout(advance, fallbackMs); });
      audio.play().catch(() => { timer = window.setTimeout(advance, fallbackMs); });
    } else if (mode === "auto") {
      timer = window.setTimeout(advance, fallbackMs);
    }
    return () => {
      advanced = true;
      if (timer !== undefined) window.clearTimeout(timer);
      audio?.pause();
      if (audio) { audio.removeAttribute("src"); audio.load(); }
    };
  }, [autoStarted, fallbackMs, mode, onAutoAdvance, src]);
}
