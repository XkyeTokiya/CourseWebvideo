import type { Narration } from "../../registry/types";

/**
 * Per-step narration for this chapter.
 *
 * Length === number of steps the chapter component renders.
 * Index i === the spoken text for `step === i` in `Example.tsx`.
 *
 * Audio synthesis uses this file directly (see scripts/extract-narrations.ts).
 * Auto-play mode plays `public/audio/<chapter-id>/<i+1>.mp3` at each step
 * and advances when the audio ends (+ a tiny trail pad).
 *
 * Empty string ("") = no audio for this step (silent transition);
 * Auto mode falls back to a short estimate so the presentation still
 * progresses.
 *
 * Visual animation duration MUST be ≤ narration duration. A long narration
 * may hold the same semantic state. Split narration only for a new semantic
 * focus, not merely to give animation more time.
 */
export const narrations: Narration[] = [
  // step 0 — establish the persistent question scene
  "先建立问题和持续槽位。把这一行换成当前节拍的口播文案。",
  // step 1 — same semantic state, narration continues
  "这一拍继续补充上下文，画面仍然保持同一个语义状态，不需要为了口播推进重新构图。",
  // step 2 — add the answer inside the same composition
  "现在在固定答案槽位中加入核心回答，问题的位置和主要构图仍然保留。",
  // step 3 — add the takeaway without replacing the scene
  "最后加入共同判断。数组长度必须与章节实际支持的 step 数严格一致。",
];
