import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SupportNotEquation.css";

const states = ["support-domain-set", "inequality-judged"] as const;

type SupportNotEquationState = (typeof states)[number];

const SUPPORT_CHIPS = ["连接", "数据", "能力复用", "协同"];
const GOAL_CHIPS = ["产业结构", "科技创新", "绿色发展", "制度", "人才"];

export default function SupportNotEquation({ step }: ChapterStepProps) {
  const state: SupportNotEquationState = states[step] ?? states[states.length - 1];
  const judged = state === "inequality-judged";

  return (
    <div className={`se-scene scene-pad${judged ? " is-judged" : ""}`}>
      <h1 className="se-thesis">
        工业互联网支撑新型工业化，但两者<em>不等同</em>
      </h1>

      <div className="se-cols">
        <section className="se-col se-col--support">
          <p className="se-col-kicker">工业互联网 · 支撑域</p>
          <div className="se-chips">
            {SUPPORT_CHIPS.map((chip) => (
              <span key={chip} className="se-chip">
                {chip}
              </span>
            ))}
          </div>
          <p className="se-col-note">
            重要支撑，却不是新型工业化的<i>全部</i>，也不是<i>唯一条件</i>
          </p>
        </section>

        <section className="se-col se-col--goal">
          <p className="se-col-kicker">新型工业化 · 目标域</p>
          <p className="se-col-lead">范围更广</p>
          <div className="se-chips">
            {GOAL_CHIPS.map((chip) => (
              <span key={chip} className="se-chip">
                {chip}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className={`se-bar${judged ? " is-on" : ""}`} aria-hidden={!judged}>
        <span className="se-neq hero-num" aria-hidden="true">
          ≠
        </span>
        <div className="se-bar-lines">
          <p>把两者画成等号，会夸大技术作用；</p>
          <p>只看见目标而忽略支撑，又会低估工业互联网在工业运行中的位置。</p>
        </div>
      </div>
    </div>
  );
}
