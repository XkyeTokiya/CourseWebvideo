import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DataToJudgment.css";

const stateByStep = [
  "sources-flowing",
  "processing-governed",
  "mainline-through-judgment",
  "feedback-result-settled",
] as const;

type State = (typeof stateByStep)[number];

const STEPS = [
  {
    no: "01",
    name: "持续采集",
    desc: "接住持续形成的信息。",
    chips: ["设备状态", "生产过程", "业务活动"],
  },
  {
    no: "02",
    name: "处理与必要治理",
    desc: "让信息可被稳定理解和使用。",
  },
  {
    no: "03",
    name: "组织与判断",
    desc: "支撑数字建模，并形成面向生产变化的认识。",
  },
  {
    no: "04",
    name: "用于反馈",
    desc: "把理解和判断带回后续行动。",
  },
] as const;

export default function DataToJudgmentChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const settled = idx >= 3;

  return (
    <div className="dj-scene scene-pad">
      <header className="dj-title">
        <span className="dj-title-mark" />
        <h1 className="dj-title-text">
          数据从持续形成的信息，逐步变成<em>理解、判断与反馈</em>的依据
        </h1>
      </header>

      <div className="dj-track">
        {STEPS.map((s, i) => {
          const lit = idx >= i;
          const active = idx === i;
          const past = lit && !active;
          return (
            <div className="dj-step-slot" key={s.no}>
              {i > 0 && (
                <span
                  className="dj-chevron"
                  data-on={lit}
                  style={{ "--dj-i": i } as CSSProperties}
                  aria-hidden="true"
                />
              )}
              <article
                className={`card dj-step${lit ? " is-lit" : " is-ghost"}${
                  active ? " is-active" : ""
                }${past ? " is-past" : ""}${i === 3 ? " dj-terminal" : ""}`}
                style={{ "--dj-i": i } as CSSProperties}
              >
                <span className="dj-slot">步骤 · {s.no}</span>
                <div className="dj-step-body">
                  <header className="dj-step-head">
                    <span className="hero-num dj-step-no">{s.no}</span>
                    <span className="dj-step-name">{s.name}</span>
                  </header>
                  <p className="dj-step-desc">{s.desc}</p>
                  {i === 0 && (
                    <div className="dj-chips">
                      {s.chips.map((chip, j) => (
                        <span key={chip} className="dj-chip" style={{ "--dj-j": j } as CSSProperties}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {i === 3 && (
                    <div className="dj-result" data-on={settled}>
                      <span className="dj-result-bar" />
                      <span className="dj-result-text">数据推动理解与优化</span>
                    </div>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
