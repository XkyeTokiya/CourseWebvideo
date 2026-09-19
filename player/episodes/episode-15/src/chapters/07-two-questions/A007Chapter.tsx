import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "question-raised",
  "two-tracks-split",
  "unified-side-filled",
  "internal-side-filled",
  "coexistence-concluded",
] as const;

function UnityDiagram() {
  return (
    <svg className="twq-dg" viewBox="0 0 520 210" aria-hidden="true">
      <rect className="twq-dg-bar" x="110" y="8" width="300" height="44" />
      <text className="twq-dg-bar-text" x="260" y="38">
        统一的上层结构
      </text>
      <rect className="twq-dg-scope" x="60" y="66" width="400" height="136" rx="12" pathLength={1} />
      <text className="twq-dg-scope-label" x="260" y="94">
        跨企业 · 跨地域
      </text>
      <path className="twq-dg-line" d="M105 120 260 171" pathLength={1} />
      <path className="twq-dg-line" d="M415 120 260 171" pathLength={1} />
      <path className="twq-dg-line" d="M105 185 260 171" pathLength={1} />
      <path className="twq-dg-line" d="M415 185 260 171" pathLength={1} />
      <circle className="twq-dg-dot" cx="105" cy="120" r="7" />
      <circle className="twq-dg-dot" cx="415" cy="120" r="7" />
      <circle className="twq-dg-dot" cx="105" cy="185" r="7" />
      <circle className="twq-dg-dot" cx="415" cy="185" r="7" />
      <rect className="twq-dg-object" x="195" y="150" width="130" height="42" rx="8" />
      <text className="twq-dg-object-text" x="260" y="178">
        同一对象
      </text>
    </svg>
  );
}

function AdjustGlyph() {
  return (
    <svg className="twq-adjust" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M39 24a15 15 0 1 1-4.4-10.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M36 6v9h-9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function ConvergenceLines() {
  return (
    <svg className="twq-conv" viewBox="0 0 760 46" preserveAspectRatio="none" aria-hidden="true">
      <path className="twq-conv-path" d="M8 6C160 6 320 14 378 40" pathLength={1} />
      <path className="twq-conv-path" d="M752 6C600 6 440 14 382 40" pathLength={1} />
    </svg>
  );
}

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad twq-root" data-state={state}>
      <header className="twq-header">
        <span className="twq-heading-mark" aria-hidden="true" />
        <h1 className="twq-headline">为什么要单独留一段</h1>
      </header>

      <div className="twq-main">
        <div className="twq-question">
          <span className="twq-question-ghost" aria-hidden="true">
            ？
          </span>
          <p className="twq-question-text">企业本来就有内部编号，为什么还要单独留一段？</p>
        </div>

        <div className="twq-cols">
          <span className="twq-divider" aria-hidden="true" />
          <span className="twq-badge">两类问题</span>

          <section className="twq-col twq-col-unified">
            <p className="twq-col-kicker">统一体系</p>
            <h2 className="twq-col-name">统一的上层结构</h2>
            <div className="twq-col-body">
              <p className="twq-claim">
                管<span className="twq-claim-em">跨企业、跨地域</span>的认同
              </p>
              <div className="twq-diagram">
                <UnityDiagram />
              </div>
              <p className="twq-answer">
                让别处的系统知道：
                <span className="twq-answer-strong">属于哪个体系 · 哪家企业</span>
              </p>
            </div>
          </section>

          <section className="twq-col twq-col-internal">
            <p className="twq-col-kicker">企业日常运营</p>
            <h2 className="twq-col-name">企业内部编码</h2>
            <div className="twq-col-body">
              <p className="twq-claim">
                解决企业<span className="twq-claim-em">怎么组织产品</span>的问题
              </p>
              <div className="twq-ledger">
                <div className="twq-ledger-row">
                  <span className="twq-ledger-name">哪个型号</span>
                  <span className="twq-ledger-slot" aria-hidden="true" />
                </div>
                <div className="twq-ledger-row">
                  <span className="twq-ledger-name">哪个批次</span>
                  <span className="twq-ledger-slot" aria-hidden="true" />
                </div>
              </div>
              <p className="twq-answer twq-answer-adjust">
                <span className="twq-adjust-wrap" aria-hidden="true">
                  <AdjustGlyph />
                </span>
                <span className="twq-answer-strong">
                  企业最清楚 · 也最需要随时调整
                </span>
              </p>
            </div>
          </section>
        </div>

        <div className="twq-thesis">
          <ConvergenceLines />
          <div className="twq-thesis-body">
            <p className="twq-thesis-lead">两件事连起来</p>
            <div className="twq-thesis-items">
              <div className="twq-thesis-item">
                <span className="twq-item-tick" aria-hidden="true" />
                <p className="twq-item-text">对象在体系内有了唯一的位置</p>
              </div>
              <div className="twq-thesis-item">
                <span className="twq-item-tick" aria-hidden="true" />
                <p className="twq-item-text">企业原有的管理习惯也能延续</p>
              </div>
            </div>
            <p className="twq-thesis-strong">不必把内部那一套推倒重来</p>
          </div>
        </div>
      </div>
    </div>
  );
}
