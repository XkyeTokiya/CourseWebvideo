import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005SixStages.css";

const states = [
  "stages-ordered",
  "records-in-systems",
  "heterogeneous-linked",
] as const;

type SxState = (typeof states)[number];

const STAGES = [
  "研发设计",
  "生产制造",
  "质量检验",
  "仓储运输",
  "配送交付",
  "售后服务",
];

const SYSTEMS = ["产品生命周期管理", "制造执行", "仓储管理", "售后服务"];

export default function A005SixStages({ step }: ChapterStepProps) {
  const state: SxState = states[step] ?? states[states.length - 1];
  const recordsOn = state !== "stages-ordered";
  const judgedOn = state === "heterogeneous-linked";

  return (
    <div className={`sx-scene scene-pad${judgedOn ? " is-judged" : ""}`}>
      <header className="sx-head">
        <h1 className="sx-title">一件产品走过的环节</h1>
        <p className="sx-anchor">
          <i aria-hidden />
          同一台产品 · 对象身份不变
        </p>
      </header>

      <div className="sx-band">
        {STAGES.map((name, i) => (
          <div key={name} className="sx-stage-wrap">
            {i > 0 && (
              <span className="sx-arrow" aria-hidden>
                →
              </span>
            )}
            <div
              className="sx-stage card"
              style={{ "--sx-i": String(i) } as CSSProperties}
            >
              <span className="sx-stage-no hero-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sx-stage-name">{name}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`sx-records${recordsOn ? " is-on" : ""}`}
        aria-hidden={!recordsOn}
      >
        <p className="sx-records-lead">每个环节都会留下记录</p>
        <p className="sx-records-systems">
          可能分别存放在{SYSTEMS.join("、")}等系统里
        </p>
      </div>

      <footer className="sx-judgment">
        <p
          className={`sx-judgment-line${judgedOn ? " is-on" : ""}`}
          aria-hidden={!judgedOn}
        >
          <span className="sx-hetero">系统彼此异构、相互并不直接连通</span>
          <span className="sx-linked">
            但它们仍可围绕<b>同一个对象身份</b>建立清楚的关联
          </span>
        </p>
      </footer>
    </div>
  );
}
