import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006FunctionBeauty.css";

const STATES = [
  "two-goals-set",
  "marketing-grounded",
  "goals-specified",
  "both-required",
] as const;

export default function A006FunctionBeauty({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const thesisIn = state !== "two-goals-set";
  const colsIn = state === "goals-specified" || state === "both-required";
  const focal = state === "both-required";

  return (
    <div className="a6-root scene-pad">
      <header className={`a6-head${focal ? " is-focal" : ""}`}>
        <h1 className="a6-title">功能与美观，在同一版面上并列成立</h1>
      </header>

      <div className="a6-cols">
        <section className={`a6-col card${colsIn ? " is-in" : ""}`}>
          <p className="a6-col-name">功能</p>
          <svg className="a6-demo" viewBox="0 0 320 180" aria-hidden>
            <rect className="a6-labelbody" x="24" y="14" width="272" height="152" rx="12" />
            <rect className="a6-hero" x="52" y="40" width="180" height="52" rx="8" />
            <rect className="a6-ring" x="44" y="32" width="196" height="68" rx="14" pathLength="1" />
            <rect className="a6-sub" x="52" y="112" width="120" height="22" rx="6" />
            <rect className="a6-sub" x="188" y="112" width="80" height="22" rx="6" />
          </svg>
          <p className="a6-col-line">关键信息，要能被注意到。</p>
        </section>

        <section className={`a6-col card${colsIn ? " is-in is-late" : ""}`}>
          <p className="a6-col-name">美观</p>
          <svg className="a6-demo" viewBox="0 0 320 180" aria-hidden>
            <rect className="a6-labelbody" x="24" y="14" width="272" height="152" rx="12" />
            <path className="a6-guide" d="M 160 14 V 166" />
            <path className="a6-guide" d="M 24 104 H 296" />
            <rect className="a6-hero" x="52" y="40" width="180" height="52" rx="8" />
            <rect className="a6-sub" x="52" y="118" width="110" height="22" rx="6" />
            <rect className="a6-sub" x="186" y="118" width="110" height="22" rx="6" />
          </svg>
          <p className="a6-col-line">整体要有秩序、要耐看。</p>
        </section>
      </div>

      <aside className={`a6-thesis${thesisIn ? " is-in" : ""}`}>
        <p className="a6-thesis-tag">共同来源</p>
        <p className="a6-thesis-text">
          产品营销、防伪，要求<strong>关键信息突出</strong>
          ——信息突出，也让产品更有美感、更容易被接受。
        </p>
      </aside>
    </div>
  );
}
