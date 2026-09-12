import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009ThreeLayerReview.css";

const STATES = [
  "question-framed",
  "first-layer-named",
  "second-layer-named",
  "third-layer-named",
] as const;

const LAYERS = [
  { kicker: "第一层", line: "载体和附着物的边界" },
  { kicker: "第二层", line: "信息和图形在版面上怎么排" },
  { kicker: "第三层", line: "功能和美观有没有一起出现" },
] as const;

export default function A009ThreeLayerReview({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const filled = ["first-layer-named", "second-layer-named", "third-layer-named"].indexOf(
    state,
  );

  return (
    <div className="a9-root scene-pad">
      <header className="a9-head">
        <h1 className="a9-title">用三层关系复核一个标识设计</h1>
      </header>

      <div className="a9-cards">
        {LAYERS.map((l, i) => (
          <article
            key={l.kicker}
            className={`a9-card card${i <= filled ? " is-in" : ""}`}
            style={{ "--a9-i": String(i) } as CSSProperties}
          >
            <p className="a9-card-kicker">{l.kicker}</p>
            <svg className="a9-demo" viewBox="0 0 220 120" aria-hidden>
              {i === 0 && (
                <g>
                  <rect className="a9-part" x="18" y="26" width="184" height="70" rx="12" />
                  <rect className="a9-mark" x="70" y="38" width="80" height="46" rx="8" />
                  <rect className="a9-boundbox" x="62" y="30" width="96" height="62" rx="12" pathLength="1" />
                </g>
              )}
              {i === 1 && (
                <g>
                  <rect className="a9-part" x="18" y="18" width="184" height="84" rx="10" />
                  <rect className="a9-hero" x="34" y="32" width="96" height="30" rx="6" />
                  <rect className="a9-sub" x="34" y="72" width="66" height="14" rx="6" />
                  <rect className="a9-sub" x="140" y="32" width="46" height="54" rx="6" />
                </g>
              )}
              {i === 2 && (
                <g>
                  <rect className="a9-part" x="18" y="18" width="184" height="84" rx="10" />
                  <rect className="a9-hero" x="34" y="32" width="76" height="30" rx="6" />
                  <rect className="a9-ring" x="28" y="26" width="88" height="42" rx="10" pathLength="1" />
                  <rect className="a9-sub" x="34" y="72" width="152" height="14" rx="6" />
                  <rect className="a9-sub" x="128" y="32" width="58" height="30" rx="6" />
                </g>
              )}
            </svg>
            <p className="a9-card-line">{l.line}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
