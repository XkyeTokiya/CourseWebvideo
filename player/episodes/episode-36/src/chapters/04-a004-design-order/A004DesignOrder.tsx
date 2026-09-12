import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004DesignOrder.css";

const STATES = [
  "wrong-way-marked",
  "observation-ordered",
  "layout-decided",
  "no-universal-ratio",
] as const;

export default function A004DesignOrder({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const firstMeasured = state !== "wrong-way-marked";
  const secondMeasured = firstMeasured;
  const decided = state === "layout-decided" || state === "no-universal-ratio";
  const bounded = state === "no-universal-ratio";

  return (
    <div className="a4-root scene-pad">
      <header className="a4-head">
        <h1 className="a4-title">版式要服从载体与附着物的关系</h1>
      </header>

      <div className="a4-band">
        <article className="a4-step a4-nope card">
          <p className="a4-badge">不能做</p>
          <svg className="a4-demo" viewBox="0 0 300 132" aria-hidden>
            <rect className="a4-demo-part" x="30" y="26" width="240" height="88" rx="16" />
            <circle className="a4-demo-shape" cx="66" cy="70" r="36" />
            <g className="a4-demo-cross">
              <line x1="38" y1="34" x2="60" y2="56" />
              <line x1="60" y1="34" x2="38" y2="56" />
            </g>
          </svg>
          <p className="a4-step-text">先画好圆形或方形，再硬贴到产品上去</p>
        </article>

        <svg className={`a4-arrow${firstMeasured ? " is-in" : ""}`} viewBox="0 0 48 24" aria-hidden>
          <line x1="4" y1="12" x2="36" y2="12" pathLength="1" />
          <path d="M 30 5 L 40 12 L 30 19" pathLength="1" />
        </svg>

        <article className={`a4-step card${firstMeasured ? " is-in" : ""}`}>
          <p className="a4-no hero-num">01</p>
          <p className="a4-step-text">先看清附着物的外形</p>
        </article>

        <svg className={`a4-arrow${secondMeasured ? " is-in is-late" : ""}`} viewBox="0 0 48 24" aria-hidden>
          <line x1="4" y1="12" x2="36" y2="12" pathLength="1" />
          <path d="M 30 5 L 40 12 L 30 19" pathLength="1" />
        </svg>

        <article className={`a4-step card${secondMeasured ? " is-in is-late" : ""}`}>
          <p className="a4-no hero-num">02</p>
          <p className="a4-step-text">量一下可用区域有多大，再看两者怎么接触</p>
        </article>

        <svg className={`a4-arrow${decided ? " is-in is-final" : ""}`} viewBox="0 0 48 24" aria-hidden>
          <line x1="4" y1="12" x2="36" y2="12" pathLength="1" />
          <path d="M 30 5 L 40 12 L 30 19" pathLength="1" />
        </svg>

        <article className={`a4-step a4-terminal card${decided ? " is-in is-final" : ""}`}>
          <p className="a4-no hero-num">03</p>
          <p className="a4-step-text">看清楚了，才决定载体的形状和版面</p>
        </article>
      </div>

      <p className={`a4-bound${bounded ? " is-in" : ""}`}>
        没有一套比例能套用到所有产品——
        <strong>要服从这个关系的，是版面。</strong>
      </p>
    </div>
  );
}
