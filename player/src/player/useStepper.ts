import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChapterDefinition, EpisodeDefinition } from "../runtime/types";

export interface Cursor { chapter: number; step: number; }
export interface StepperState {
  cursor: Cursor;
  totalChapters: number;
  chapterTotalSteps: number;
  globalIndex: number;
  totalGlobal: number;
  next(): void;
  prev(): void;
  jumpToChapter(index: number, step?: number): void;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function sanitize(cursor: Cursor, chapters: ChapterDefinition[]): Cursor {
  if (!chapters.length) return { chapter: 0, step: 0 };
  const chapter = clamp(cursor.chapter | 0, 0, chapters.length - 1);
  const maxStep = Math.max(0, chapters[chapter]!.narrations.length - 1);
  return { chapter, step: clamp(cursor.step | 0, 0, maxStep) };
}

export function useStepper(episode: EpisodeDefinition): StepperState {
  const chapters = episode.chapters;
  const storageKey = `webvideo-cursor-v1:${episode.id}`;
  const [cursor, setCursor] = useState<Cursor>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? sanitize(JSON.parse(raw) as Cursor, chapters) : { chapter: 0, step: 0 };
    } catch {
      return { chapter: 0, step: 0 };
    }
  });

  const safeCursor = sanitize(cursor, chapters);
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(safeCursor)), [safeCursor, storageKey]);

  const offsets = useMemo(
    () => chapters.map((_, index) => chapters.slice(0, index).reduce((total, chapter) => total + chapter.narrations.length, 0)),
    [chapters],
  );
  const totalGlobal = chapters.reduce((total, chapter) => total + chapter.narrations.length, 0);

  const next = useCallback(() => setCursor((current) => {
    const chapter = chapters[current.chapter]!;
    if (current.step < chapter.narrations.length - 1) return { ...current, step: current.step + 1 };
    if (current.chapter < chapters.length - 1) return { chapter: current.chapter + 1, step: 0 };
    return current;
  }), [chapters]);
  const prev = useCallback(() => setCursor((current) => {
    if (current.step > 0) return { ...current, step: current.step - 1 };
    if (current.chapter > 0) {
      const previous = chapters[current.chapter - 1]!;
      return { chapter: current.chapter - 1, step: previous.narrations.length - 1 };
    }
    return current;
  }), [chapters]);
  const jumpToChapter = useCallback((index: number, step = 0) => {
    const chapter = clamp(index, 0, chapters.length - 1);
    setCursor({ chapter, step: clamp(step, 0, chapters[chapter]!.narrations.length - 1) });
  }, [chapters]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft" || event.key === "Backspace") { event.preventDefault(); prev(); }
      if (event.key === "Home") jumpToChapter(0);
      if (event.key === "End") jumpToChapter(chapters.length - 1, chapters.at(-1)!.narrations.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapters, next, prev, jumpToChapter]);

  return {
    cursor: safeCursor,
    totalChapters: chapters.length,
    chapterTotalSteps: chapters[safeCursor.chapter]?.narrations.length ?? 0,
    globalIndex: (offsets[safeCursor.chapter] ?? 0) + safeCursor.step,
    totalGlobal,
    next,
    prev,
    jumpToChapter,
  };
}
