import type { ChapterDefinition } from "../runtime/types";
import type { Cursor } from "./useStepper";

export function ProgressBar({ chapters, cursor, onJump }: { chapters: ChapterDefinition[]; cursor: Cursor; onJump(index: number, step?: number): void }) {
  return (
    <nav className="progress-bar" data-no-advance aria-label="章节进度">
      {chapters.map((chapter, index) => (
        <button className={index === cursor.chapter ? "progress-chapter active" : "progress-chapter"} key={chapter.id} onClick={() => onJump(index)}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{chapter.title}</strong>
          {index === cursor.chapter && <small>{cursor.step + 1}/{chapter.narrations.length}</small>}
        </button>
      ))}
    </nav>
  );
}
