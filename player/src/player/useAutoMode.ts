import { useCallback, useEffect, useState } from "react";
import type { PlaybackMode } from "../runtime/types";

const modes: PlaybackMode[] = ["manual", "audio", "auto"];

export function useAutoMode() {
  const [mode, setModeState] = useState<PlaybackMode>(() => {
    const query = new URLSearchParams(window.location.search);
    return query.get("auto") === "1" ? "auto" : query.get("audio") === "1" ? "audio" : "manual";
  });
  const [autoStarted, setAutoStarted] = useState(false);
  const setMode = useCallback((next: PlaybackMode) => {
    setModeState(next);
    const url = new URL(window.location.href);
    url.searchParams.delete("audio");
    url.searchParams.delete("auto");
    if (next === "audio") url.searchParams.set("audio", "1");
    if (next === "auto") url.searchParams.set("auto", "1");
    window.history.replaceState(null, "", url);
    if (next !== "auto") setAutoStarted(false);
  }, []);
  const cycleMode = useCallback(() => setMode(modes[(modes.indexOf(mode) + 1) % modes.length]!), [mode, setMode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "m") { event.preventDefault(); cycleMode(); }
      if (event.key === " " && mode === "auto" && !autoStarted) { event.preventDefault(); setAutoStarted(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoStarted, cycleMode, mode]);

  return { mode, cycleMode, autoStarted, setAutoStarted };
}
