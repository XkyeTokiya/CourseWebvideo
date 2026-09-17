import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004ThreeBreaks.css";

/**
 * A004 · 三个断点 —— packet A004 / recipe: parallel-cards-self-contained
 *
 * 三张等权困难卡按相邻顺序补齐（并列呈现的因果链，完成后不留当前选中项）：
 * R007 由卡一/卡二的相邻顺序承载（系统独立 → 流向不清）；
 * R008 由卡二/卡三的同列延续承载（流向不清 → 定位难）。
 * 护栏 C004：不把三类困难写成监管判断或行业统计。
 */
const stateByStep = [
  "difficulties-framed", // step 1：建立标题与三张等权空卡
  "siloed-systems-shown", // step 2：卡一补入系统各管一段
  "flow-opaque-shown", // step 3：保持卡一，卡二补入流向不清
  "object-pin-hard-shown", // step 4：保持前两卡，卡三补入定位难；三卡等权收齐
] as const;

type A004State = (typeof stateByStep)[number];

export default function A004ThreeBreaks({ step }: ChapterStepProps) {
  const state: A004State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];

  // 卡内容随 semantic state 逐拍补入；补入后保持等权，不产生当前选中项
  const card1On = state !== "difficulties-framed";
  const card2On = state === "flow-opaque-shown" || state === "object-pin-hard-shown";
  const card3On = state === "object-pin-hard-shown";
  const link12On = card2On; // R007：卡一 → 卡二 相邻顺序
  const link23On = card3On; // R008：卡二 → 卡三 同列延续

  return (
    <div className={`tb-scene scene-pad${state === "difficulties-framed" ? " is-framed" : ""}`}>
      <header className="tb-head">
        <h1 className="tb-title">三个断点</h1>
        <p className="tb-context">割裂之后 · 三类具体困难</p>
      </header>

      <div className="tb-cards">
        {/* 卡一 · 系统各管一段：四段块件落位，间隙留在中间 */}
        <article className={`tb-card${card1On ? " is-on" : ""}`} style={{ "--tb-i": 0 } as CSSProperties}>
          <div className="tb-card-top">
            <span className="tb-no hero-num">01</span>
            <h2 className="tb-card-head">系统各管一段</h2>
          </div>
          <div className="tb-demo" aria-hidden="true">
            <svg className="tb-demo-svg" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid meet">
              <g className="tb-seg" style={{ "--tb-k": 0 } as CSSProperties}>
                <rect x="6" y="90" width="88" height="120" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
                <text className="tb-demo-text" x="50" y="158" textAnchor="middle">生产</text>
              </g>
              <g className="tb-seg" style={{ "--tb-k": 1 } as CSSProperties}>
                <rect x="114" y="90" width="88" height="120" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
                <text className="tb-demo-text" x="158" y="158" textAnchor="middle">包装</text>
              </g>
              <g className="tb-seg" style={{ "--tb-k": 2 } as CSSProperties}>
                <rect x="222" y="90" width="88" height="120" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
                <text className="tb-demo-text" x="266" y="158" textAnchor="middle">仓储</text>
              </g>
              <g className="tb-seg" style={{ "--tb-k": 3 } as CSSProperties}>
                <rect x="330" y="90" width="88" height="120" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
                <text className="tb-demo-text" x="374" y="158" textAnchor="middle">物流</text>
              </g>
              <g className="tb-stub" stroke="var(--theme-structural)" strokeWidth="3.5" strokeLinecap="square">
                <line x1="96" y1="150" x2="101" y2="150" />
                <line x1="107" y1="150" x2="112" y2="150" />
                <line x1="204" y1="150" x2="209" y2="150" />
                <line x1="215" y1="150" x2="220" y2="150" />
                <line x1="312" y1="150" x2="317" y2="150" />
                <line x1="323" y1="150" x2="328" y2="150" />
              </g>
            </svg>
          </div>
          <p className="tb-note">生产、包装、仓储、物流各管一段，相互独立，环节之间接不上。</p>
          <div className="tb-empty" aria-hidden="true" />
        </article>

        <div className={`tb-link tb-link--a${link12On ? " is-on" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 56 36" className="tb-link-svg">
            <g className="tb-link-path">
              <line x1="2" y1="18" x2="34" y2="18" stroke="var(--theme-structural)" strokeWidth="3" strokeDasharray="5 6" />
              <polyline points="36,8 48,18 36,28" fill="none" stroke="var(--theme-structural)" strokeWidth="3.5" strokeLinecap="square" />
            </g>
          </svg>
        </div>

        {/* 卡二 · 流向看不清：链路自绘，远端消散成问号 */}
        <article className={`tb-card${card2On ? " is-on" : ""}`} style={{ "--tb-i": 1 } as CSSProperties}>
          <div className="tb-card-top">
            <span className="tb-no hero-num">02</span>
            <h2 className="tb-card-head">流向看不清</h2>
          </div>
          <div className="tb-demo" aria-hidden="true">
            <svg className="tb-demo-svg" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid meet">
              <g className="tb-fnode" style={{ "--tb-k": 0 } as CSSProperties}>
                <circle cx="26" cy="120" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3.5" />
              </g>
              <g className="tb-fnode" style={{ "--tb-k": 1 } as CSSProperties}>
                <circle cx="112" cy="120" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3.5" />
              </g>
              <g className="tb-fnode" style={{ "--tb-k": 2 } as CSSProperties}>
                <circle cx="198" cy="120" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3.5" />
              </g>
              <g className="tb-fnode" style={{ "--tb-k": 3 } as CSSProperties}>
                <circle cx="284" cy="120" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3.5" />
              </g>
              <line className="tb-flink" style={{ "--tb-k": 0 } as CSSProperties} x1="41" y1="120" x2="97" y2="120" stroke="var(--theme-structural)" strokeWidth="3" />
              <line className="tb-flink" style={{ "--tb-k": 1 } as CSSProperties} x1="127" y1="120" x2="183" y2="120" stroke="var(--theme-structural)" strokeWidth="3" />
              <line className="tb-flink" style={{ "--tb-k": 2 } as CSSProperties} x1="213" y1="120" x2="269" y2="120" stroke="var(--theme-structural)" strokeWidth="3" />
              <line className="tb-ftail" x1="299" y1="120" x2="338" y2="120" stroke="var(--text-mute)" strokeWidth="3" strokeDasharray="4 10" />
              <g className="tb-fq">
                <circle cx="376" cy="120" r="30" fill="var(--surface-2)" stroke="var(--theme-warning)" strokeWidth="3" strokeDasharray="6 7" />
                <text className="tb-demo-text tb-fq-mark" x="376" y="133" textAnchor="middle">？</text>
              </g>
            </svg>
          </div>
          <p className="tb-note">跨主体的流向信息连不起来，药到底流向了哪里，不容易看清楚。</p>
          <div className="tb-empty" aria-hidden="true" />
        </article>

        <div className={`tb-link tb-link--b${link23On ? " is-on" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 56 36" className="tb-link-svg">
            <g className="tb-link-path">
              <line x1="2" y1="18" x2="34" y2="18" stroke="var(--theme-structural)" strokeWidth="3" strokeDasharray="5 6" />
              <polyline points="36,8 48,18 36,28" fill="none" stroke="var(--theme-structural)" strokeWidth="3.5" strokeLinecap="square" />
            </g>
          </svg>
        </div>

        {/* 卡三 · 对象与环节难确定：扫描掠过全场，没有落点 */}
        <article className={`tb-card${card3On ? " is-on" : ""}`} style={{ "--tb-i": 2 } as CSSProperties}>
          <div className="tb-card-top">
            <span className="tb-no hero-num">03</span>
            <h2 className="tb-card-head">对象与环节难确定</h2>
          </div>
          <div className="tb-demo" aria-hidden="true">
            <svg className="tb-demo-svg" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid meet">
              <g className="tb-obj" style={{ "--tb-k": 0 } as CSSProperties}>
                <rect x="40" y="48" width="34" height="34" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <g className="tb-obj" style={{ "--tb-k": 1 } as CSSProperties}>
                <circle cx="150" cy="100" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <g className="tb-obj" style={{ "--tb-k": 2 } as CSSProperties}>
                <rect x="300" y="44" width="34" height="34" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <g className="tb-obj" style={{ "--tb-k": 3 } as CSSProperties}>
                <circle cx="90" cy="170" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <g className="tb-obj" style={{ "--tb-k": 4 } as CSSProperties}>
                <rect x="220" y="180" width="30" height="30" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <g className="tb-obj" style={{ "--tb-k": 5 } as CSSProperties}>
                <circle cx="350" cy="150" r="15" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3" />
              </g>
              <rect className="tb-scan" x="6" y="10" width="10" height="250" rx="3" fill="var(--theme-warning)" />
              <g className="tb-bracket" stroke="var(--theme-warning)" strokeWidth="3" strokeLinecap="square">
                <line x1="24" y1="272" x2="396" y2="272" strokeDasharray="7 8" />
                <line x1="24" y1="264" x2="24" y2="272" />
                <line x1="396" y1="264" x2="396" y2="272" />
              </g>
            </svg>
          </div>
          <p className="tb-note">一旦发生安全事件，问题出在哪个对象、哪个环节，都很难确定。</p>
          <div className="tb-empty" aria-hidden="true" />
        </article>
      </div>
    </div>
  );
}
