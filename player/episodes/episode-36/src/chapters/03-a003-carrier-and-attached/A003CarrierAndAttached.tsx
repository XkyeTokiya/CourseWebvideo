import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003CarrierAndAttached.css";

const STATES = ["carrier-defined", "objects-opposed", "relation-decides"] as const;

const OUTCOMES = ["被看见", "被使用", "被维护"] as const;

export default function A003CarrierAndAttached({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const rightIn = state !== "carrier-defined";
  const pivotIn = state === "relation-decides";

  return (
    <div className="a3-root scene-pad">
      <header className="a3-head">
        <h1 className="a3-title">载体与附着物</h1>
      </header>

      <div className="a3-body">
        <section className="a3-panel a3-left card">
          <svg className="a3-glyph" viewBox="0 0 360 190" aria-hidden>
            <rect className="a3-labelbody" x="10" y="8" width="340" height="174" rx="14" />
            <g className="a3-code">
              <rect x="36" y="36" width="10" height="54" />
              <rect x="54" y="36" width="6" height="54" />
              <rect x="68" y="36" width="14" height="54" />
              <rect x="90" y="36" width="6" height="54" />
              <rect x="104" y="36" width="10" height="54" />
              <rect x="122" y="36" width="6" height="54" />
            </g>
            <g className="a3-qr">
              <rect x="272" y="32" width="14" height="14" />
              <rect x="292" y="32" width="14" height="14" />
              <rect x="272" y="52" width="14" height="14" />
              <rect x="296" y="52" width="10" height="10" />
              <rect x="272" y="72" width="14" height="14" />
              <rect x="292" y="72" width="14" height="14" />
            </g>
            <rect className="a3-textbar" x="36" y="118" width="180" height="9" rx="4.5" />
            <rect className="a3-textbar" x="36" y="140" width="122" height="9" rx="4.5" />
          </svg>
          <p className="a3-name">载体</p>
          <p className="a3-desc">承载编码的那一层 · 比如一张标签</p>
        </section>

        <aside className={`a3-pivot${pivotIn ? " is-in" : ""}`}>
          <div className="a3-pivot-inner">
            <p className="a3-pivot-tag">设计关系</p>
            <p className="a3-pivot-line">两者的关系，决定标识——</p>
            <ul className="a3-outcomes">
              {OUTCOMES.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className={`a3-panel a3-right card${rightIn ? " is-in" : ""}`}>
          <svg className="a3-glyph" viewBox="0 0 360 190" aria-hidden>
            <rect className="a3-partbody" x="30" y="26" width="300" height="138" rx="20" />
            <g className="a3-tag">
              <rect x="118" y="62" width="124" height="66" rx="8" />
              <rect x="130" y="76" width="58" height="8" rx="4" />
              <rect x="130" y="90" width="40" height="8" rx="4" />
              <rect x="130" y="104" width="50" height="8" rx="4" />
            </g>
            <path className="a3-seam" d="M 118 62 h 124 v 66 h -124 z" pathLength="1" />
          </svg>
          <p className="a3-name">附着物</p>
          <p className="a3-desc">载体贴上去的那个物件</p>
          <p className="a3-note">不是被动的背景</p>
        </section>
      </div>
    </div>
  );
}
