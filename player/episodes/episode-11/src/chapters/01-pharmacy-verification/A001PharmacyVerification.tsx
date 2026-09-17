import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001PharmacyVerification.css";

const stateByStep = [
  "verification-scene-set",
  "trace-questions-open",
  "questions-converged",
] as const;

type A001State = (typeof stateByStep)[number];

const ISSUES = [
  { no: "01", question: "这盒药是谁生产的？", note: "生产环节藏在链条哪一段" },
  { no: "02", question: "经过了哪些环节？", note: "仓储与物流的中转路径" },
];

export default function A001PharmacyVerification({ step }: ChapterStepProps) {
  const state: A001State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const questionsOn = state !== "verification-scene-set";
  const converged = state === "questions-converged";

  return (
    <div className={`pv-scene scene-pad${converged ? " is-converged" : ""}`}>
      <header className="pv-head">
        <div className="pv-head-copy">
          <h1 className="pv-title">药房收货时的一次核验</h1>
          <p className="pv-context">收货第一件事 · 核验这盒药的身份</p>
        </div>
        <div className="pv-media" aria-hidden="true" />
      </header>

      <div className="pv-demo" aria-hidden="true">
        <svg className="pv-demo-svg" viewBox="0 0 1500 300" preserveAspectRatio="xMidYMax meet">
          <rect className="pv-counter" x="60" y="238" width="1380" height="16" rx="3" />
          <g className="pv-box">
            <rect x="180" y="128" width="230" height="110" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="5" />
            <rect x="202" y="150" width="104" height="30" fill="var(--theme-cool-surface)" stroke="var(--theme-structural)" strokeWidth="2" />
            <g stroke="var(--theme-structural)" strokeWidth="3">
              <line x1="212" y1="160" x2="212" y2="170" />
              <line x1="226" y1="158" x2="226" y2="172" />
              <line x1="240" y1="160" x2="240" y2="170" />
              <line x1="254" y1="158" x2="254" y2="172" />
            </g>
            <rect x="286" y="164" width="18" height="48" fill="var(--theme-process)" />
            <rect x="271" y="179" width="48" height="18" fill="var(--theme-process)" />
          </g>
          <g className="pv-beam">
            <rect x="0" y="96" width="46" height="152" fill="var(--accent-soft)" />
            <line x1="46" y1="96" x2="46" y2="248" stroke="var(--accent)" strokeWidth="4" />
          </g>
          <g className="pv-verdict">
            <circle className="pv-ring" cx="470" cy="118" r="40" pathLength={100} fill="var(--surface-2)" stroke="var(--theme-process)" strokeWidth="7" />
            <path className="pv-check" d="M452 118 L466 134 L492 104" pathLength={100} fill="none" stroke="var(--theme-process)" strokeWidth="7" strokeLinecap="square" />
            <text className="pv-verdict-label" x="470" y="196" textAnchor="middle">核验通过</text>
          </g>
          <g className="pv-lead">
            <path className="pv-lead-path" d="M356 262 C 436 280 540 288 632 286" fill="none" stroke="var(--theme-structural)" strokeWidth="3" strokeDasharray="10 12" />
            <polyline className="pv-lead-arrow" points="616,274 638,286 616,296" fill="none" stroke="var(--theme-structural)" strokeWidth="3" />
          </g>
        </svg>
      </div>

      <div className="pv-cards">
        {ISSUES.map((item, i) => (
          <article
            key={item.no}
            className={`pv-issue${questionsOn ? " is-on" : ""}`}
            style={{ "--pv-i": String(i) } as CSSProperties}
          >
            <span className="pv-issue-no hero-num">{item.no}</span>
            <div className="pv-issue-body">
              <h2>{item.question}</h2>
              <p>{item.note}</p>
            </div>
          </article>
        ))}

        <svg className="pv-converge" viewBox="0 0 320 150" aria-hidden="true">
          <path className="pv-converge-path" d="M6 32 C 110 32 170 75 272 75" fill="none" stroke="var(--theme-structural)" strokeWidth="3.5" strokeDasharray="9 10" />
          <path className="pv-converge-path pv-converge-path--b" d="M6 118 C 110 118 170 75 272 75" fill="none" stroke="var(--theme-structural)" strokeWidth="3.5" strokeDasharray="9 10" />
          <polyline className="pv-converge-arrow" points="256,61 278,75 256,89" fill="none" stroke="var(--theme-process)" strokeWidth="4" />
        </svg>

        <article className={`pv-takeaway${converged ? " is-on" : ""}`}>
          <span className="pv-issue-no hero-num">03</span>
          <div className="pv-issue-body">
            <h2>出了问题，向谁追查？</h2>
          </div>
        </article>
      </div>
    </div>
  );
}
