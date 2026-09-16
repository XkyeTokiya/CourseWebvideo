import { useEffect, useRef } from "react";
import type { CaptureCursor, CaptureWindow } from "./types";
import type { CaptureStatus } from "./useCaptureTimeline";

interface Options {
  episodeId: string;
  cursor: CaptureCursor;
  range: CaptureWindow;
  status: CaptureStatus;
}

type CaptureSignalState = "loading" | "ready" | "playing" | "completed";

function emit(state: CaptureSignalState, options: Options) {
  const detail = {
    state,
    episodeId: options.episodeId,
    cursor: options.cursor,
    range: options.range,
  };
  document.documentElement.dataset.obsCaptureState = state;
  window.dispatchEvent(new CustomEvent("webvideo:obs-capture", { detail }));
  window.parent.postMessage({ type: "webvideo:obs-capture", ...detail }, "*");
}

/**
 * Stable lifecycle signals for a future OBS WebSocket controller and for
 * browser-source smoke tests. The page remains self-contained if no listener
 * is installed.
 */
export function useObsCaptureSignals(options: Options) {
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (readyRef.current) {
      emit(options.status === "completed" ? "completed" : "playing", options);
      return () => {
        cancelled = true;
      };
    }

    emit("loading", options);
    const images = Array.from(document.images);
    const imageReady = images.map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      }));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([fontsReady, ...imageReady]).then(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        readyRef.current = true;
        emit("ready", options);
        emit(options.status === "completed" ? "completed" : "playing", options);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [options]);

}
