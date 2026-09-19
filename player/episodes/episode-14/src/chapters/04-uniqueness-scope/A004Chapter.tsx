import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "one-to-one-established",
  "scope-marked",
  "boundary-concluded",
] as const;

const BENEFITS = ["无歧义地区分对象", "需要的时候还能快速定位"] as const;

const BOUNDARIES = ["明确对象边界", "明确适用范围"] as const;

function TagGlyph() {
  return (
    <svg className="uq-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 5 40 14.5v19L24 43 8 33.5v-19L24 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="7.4" fill="none" stroke="currentColor" strokeWidth="3.6" />
    </svg>
  );
}

function ObjectGlyph() {
  return (
    <svg className="uq-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 6l15 8.5v19L24 42 9 33.5v-19L24 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M9 14.5 24 23l15-8.5M24 23v19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad uq-root" data-state={state}>
      <header className="uq-header">
        <span className="uq-index" aria-hidden="true">
          1/5
        </span>
        <h1 className="uq-headline">第一项：唯一性</h1>
      </header>

      <div className="uq-main">
        <section className="uq-enclosure">
          <svg className="uq-ring" viewBox="0 0 900 690" preserveAspectRatio="none" aria-hidden="true">
            <rect x="2" y="2" width="896" height="686" rx="16" pathLength={1} />
          </svg>
          <span className="uq-ring-label">一定范围内</span>
          <div className="uq-pair">
            <span className="uq-chip uq-chip-code">
              <TagGlyph />
              编码
            </span>
            <span className="uq-pair-link" aria-hidden="true">
              <span className="uq-pair-line" />
              <span className="uq-pair-ratio">1 : 1</span>
            </span>
            <span className="uq-chip uq-chip-object">
              <ObjectGlyph />
              对象
            </span>
          </div>
          <p className="uq-claim">在一定范围内，一个编码只对应一个对象</p>
          <div className="uq-benefits">
            {BENEFITS.map((text) => (
              <p className="uq-benefit" key={text}>
                {text}
              </p>
            ))}
          </div>
        </section>

        <section className="uq-boundary">
          <p className="uq-boundary-kicker">用一套编码之前，先要</p>
          {BOUNDARIES.map((text) => (
            <p className="uq-boundary-row" key={text}>
              {text}
            </p>
          ))}
          <p className="uq-boundary-note">唯一性不等于脱离场景的绝对承诺</p>
        </section>
      </div>

      <div className="uq-thesis">
        <span className="uq-thesis-mark" aria-hidden="true" />
        <p className="uq-thesis-text">
          唯一性限定的是<span className="uq-thesis-scope">这个范围</span>
        </p>
      </div>
    </div>
  );
}
