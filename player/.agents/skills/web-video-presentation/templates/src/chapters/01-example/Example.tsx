import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Example.css";

/**
 * Reference chapter — replace with your own content.
 *
 * Demonstrates one persistent composition and an explicit step-to-state map.
 * Repeated semantic states are intentional: narration may continue while the
 * settled visual relationship stays the same. This is an example, not a
 * required number of steps or a Courseplay-only runtime API.
 */
const stateByStep = [
  "question-established",
  "question-established",
  "answer-added",
  "takeaway-added",
] as const;

export default function ExampleChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  const showAnswer = state === "answer-added" || state === "takeaway-added";
  const showTakeaway = state === "takeaway-added";

  return (
    <section className="ex-scene scene-pad">
      <div className="ex-question">
        <span className="kicker">当前问题</span>
        <h1>
          <MaskReveal show duration={900}>
            同一构图，如何承载多个口播节拍？
          </MaskReveal>
        </h1>
        <p>
          {step === 0
            ? "先建立问题与持续槽位。"
            : "保持问题位置，让口播继续补充上下文。"}
        </p>
      </div>

      <div className={`ex-answer ${showAnswer ? "is-visible" : ""}`}>
        <span className="label-mono">稳定关系</span>
        <strong>step 可以推进，semantic state 也可以重复。</strong>
      </div>

      {showTakeaway && (
        <div className="ex-takeaway">口播定 step，内容关系定画面。</div>
      )}
    </section>
  );
}
