import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 05-three-segments · 三段总览页（outline §5 · S-A005 ·
 * parallel-cards-with-takeaway，band-to-band-mapping）
 * 持续总览场景：段名带在上与问题带在下逐项对齐，对应关系随口播点亮；
 * step 3 分派点亮、判断区收束"三段各回答一个"，不改动段序、不轮播。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - structure-announced：段名带三段依次落位后等权保留（step 1）
 * - questions-listed：问题带三问逐项对齐落位，完成后三问等权
 *   （step 2，R009 由段名带与问题带的逐项对应承载）
 * - answers-dispatched：分派线点亮，判断区收束（step 3，
 *   R010 由问题带向分派线的收束承载）
 * 护栏：总览页不出现示例数字，也不补各段内部字段。
 */
const stateByStep = [
  "structure-announced",
  "questions-listed",
  "answers-dispatched",
] as const;

type A005State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A005State, number> = {
  "structure-announced": 0,
  "questions-listed": 1,
  "answers-dispatched": 2,
};

/** 段名带（G015；不补内部字段） */
const SEGMENTS = ["V", "NSI", "MD"] as const;

/** 三个阅读问题，逐项对应三段（G016） */
const QUESTIONS = [
  "这一条按什么数据结构来读？",
  "它属于哪一类标识体系？",
  "它承载的是哪个行业或应用系统里的标准化编码？",
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state: A005State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];
  const dispatchOn = at >= 2;

  return (
    <div className="dg-root" data-state={state}>
      <header className="dg-head">
        <h1 className="dg-headline">三段总览：一段一个阅读问题</h1>
        <p className="dg-head-note">它们不是随手拼在一起的三个字段</p>
      </header>

      <div className="dg-bands">
        <div className="dg-band dg-segments">
          {SEGMENTS.map((label, index) => (
            <div
              key={label}
              className="dg-seg"
              style={{ "--dg-i": index } as React.CSSProperties}
            >
              <span className="dg-seg-no">第 {index + 1} 段</span>
              <span className="dg-seg-name" data-seg={label}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="dg-band dg-questions">
          {QUESTIONS.map((label, index) => (
            <div
              key={label}
              className={`dg-q${at >= 1 ? " is-on" : ""}`}
              style={{ "--dg-i": index } as React.CSSProperties}
            >
              <span className="dg-q-mark" aria-hidden="true">
                ？
              </span>
              <span className="dg-q-text">{label}</span>
            </div>
          ))}
        </div>

        <span
          className={`dg-mapping${at >= 1 ? " is-on" : ""}`}
          aria-hidden="true"
        />
      </div>

      <div className={`dg-takeaway${dispatchOn ? " is-on" : ""}`}>
        <span className="dg-takeaway-line" aria-hidden="true" />
        <p className="dg-takeaway-text">
          <b>三个问题</b>，<i>三段</i>各回答一个
        </p>
      </div>
    </div>
  );
}
