import { useCallback, useState } from "react";
import type { ChapterDef } from "../shared/presentation-runtime/registry/types";
import type { CaptureCursor } from "./types";

export type CaptureStatus = "playing" | "completed";

function isSameCursor(a: CaptureCursor, b: CaptureCursor): boolean {
  return a.chapter === b.chapter && a.step === b.step;
}

function nextCursor(cursor: CaptureCursor, chapters: ChapterDef[], end: CaptureCursor): CaptureCursor | null {
  if (isSameCursor(cursor, end)) return null;
  const chapter = chapters[cursor.chapter]!;
  if (cursor.step < chapter.narrations.length - 1) {
    return { chapter: cursor.chapter, step: cursor.step + 1 };
  }
  return { chapter: cursor.chapter + 1, step: 0 };
}

export function useCaptureTimeline(chapters: ChapterDef[]) {
  const start: CaptureCursor = { chapter: 0, step: 0 };
  const end: CaptureCursor = {
    chapter: chapters.length - 1,
    step: Math.max(0, chapters.at(-1)?.narrations.length ?? 1) - 1,
  };
  const endChapter = end.chapter;
  const endStep = end.step;
  const [cursor, setCursor] = useState<CaptureCursor>(start);
  const [status, setStatus] = useState<CaptureStatus>("playing");

  const advance = useCallback(() => {
    setCursor((current) => {
      const next = nextCursor(current, chapters, { chapter: endChapter, step: endStep });
      if (!next) {
        setStatus("completed");
        return current;
      }
      return next;
    });
  }, [chapters, endChapter, endStep]);

  return { cursor, status, advance, start, end };
}
