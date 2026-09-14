/* eslint-disable react/refs -- callback ref keeps the latest completion handler */
import { useEffect, useRef } from "react";

interface Options {
  src: string | null;
  fallbackMs: number;
  active: boolean;
  onEnded(): void;
}

/** Auto mode without a gesture gate. OBS Browser Source is the playback host. */
export function useCaptureAudio({ src, fallbackMs, active, onEnded }: Options) {
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    if (!active) return;
    let finished = false;
    let timer: number | null = null;
    const finish = (delayMs: number) => {
      if (finished) return;
      timer = window.setTimeout(() => {
        if (finished) return;
        finished = true;
        onEndedRef.current();
      }, Math.max(0, delayMs));
    };

    if (!src) {
      finish(fallbackMs);
      return () => {
        finished = true;
        if (timer !== null) window.clearTimeout(timer);
      };
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.addEventListener("ended", () => finish(200));
    audio.addEventListener("error", () => finish(fallbackMs));
    audio.play().catch((error: unknown) => {
      console.warn("OBS Browser Source audio play failed; using timing fallback", error);
      finish(fallbackMs);
    });

    return () => {
      finished = true;
      if (timer !== null) window.clearTimeout(timer);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [active, fallbackMs, src]);
}
