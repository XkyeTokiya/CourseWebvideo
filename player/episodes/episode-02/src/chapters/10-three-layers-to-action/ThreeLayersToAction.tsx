import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ThreeLayersToAction.css";

const stateByStep = [
  "three-layers-complete",
  "conversion-takeaway-set",
] as const;

type State = (typeof stateByStep)[number];

const STEPS = [
  {
    no: "01",
    name: "感知控制",
    desc: "取得物理对象和生产过程的信息。",
  },
  {
    no: "02",
    name: "数字模型",
    desc: "把信息组织成可描述、可分析的对象，支撑理解。",
  },
  {
    no: "03",
    name: "决策优化",
    desc: "依据分析结果，形成面向生产和业务目标的判断。",
  },
] as const;

export default function ThreeLayersToActionChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const closed = idx >= 1;

  return (
    <div className={`tl-scene scene-pad${closed ? " is-closed" : ""}`}>
      <header className="tl-title">
        <span className="tl-title-mark" />
        <h1 className="tl-title-text">
          感知控制、数字模型与决策优化，依次支撑现场信息<em>转化为行动</em>
        </h1>
      </header>

      <div className="tl-boundary">
        <span className="tl-boundary-label">三个相互衔接的层次</span>
        <span className="tl-layer-cells" aria-hidden="true">
          <span className="tl-cell is-on">1</span>
          <span className="tl-cell is-on">2</span>
          <span className={`tl-cell${idx >= 0 ? " is-on" : ""}`}>3</span>
        </span>
      </div>

      <div className="tl-track">
        {STEPS.map((s, i) => {
          /* 前两步自上一层延续，进场即为已建立的 past 状态 */
          const past = i < 2;
          const active = i === 2 && idx >= 0;
          const ghost = i === 2 && idx < 0;
          return (
            <div className="tl-step-slot" key={s.no}>
              {i > 0 && (
                <span
                  className="tl-chevron"
                  data-on={i <= 1 + idx}
                  aria-hidden="true"
                />
              )}
              <article
                className={`card tl-step${ghost ? " is-ghost" : ""}${
                  past ? " is-past" : ""
                }${active ? " is-active" : ""}`}
                style={{ "--tl-i": i } as CSSProperties}
              >
                <span className="tl-slot">层次 · {s.no}</span>
                <div className="tl-step-body">
                  <header className="tl-step-head">
                    <span className="hero-num tl-step-no">{s.no}</span>
                    <span className="tl-step-name">{s.name}</span>
                  </header>
                  <p className="tl-step-desc">{s.desc}</p>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <aside className="tl-takeaway" data-on={closed}>
        <span className="tl-takeaway-slot">takeaway · 收束槽</span>
        <div className="tl-takeaway-body">
          <span className="tl-takeaway-mark" />
          <span className="tl-takeaway-text">
            三个层次合在一起，现场信息才可能<em>转化为生产行动</em>
          </span>
        </div>
      </aside>
    </div>
  );
}
