import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A014WhatChanges.css";

/**
 * A014 · 变化发生在哪里 —— packet A014 / recipe: split-compare-with-thesis
 *
 * 4 拍持续对照场景（结构指纹 headline | left | right | bottom-thesis）+ 1 拍 accent：
 *   0  answer-framed             建立标题与对照骨架：左「未变 · 参与者数量没有改变」、
 *                                右「改变 · 识别方式变了」，底部判断条亮出 exact 论点
 *   1  past-verification-shown   保持骨架，左栏补入旧方式：同一盒药在系统/企业/环节
 *                                各自记录，靠「?」与回环反复确认才能对上
 *   2  present-lookup-shown      保持左栏，右栏补入新方式：查询入口先定位对象，
 *                                再沿各个阶段的记录查找
 *   3  governance-open-shown     保持对照并弱化，底部判断条补入「不等于治理已经完成」
 *                                与 授权/标准/流程/信任
 *   4  K-A014-01 · accent        全屏强调：有了一套编码，只是有了一个可以对齐的起点
 *
 * R022（对比改变与未变）由左「未变」与右「改变」的左右对照承载；
 * R023（识别方式改变带来查询方式改变）由过去/现在两栏的方式差异承载
 * （左栏「反复确认才能对上」对右栏「先定位对象 · 沿各阶段记录查找」）。
 * exact S053「改变的是识别同一对象的方式」自第 1 拍起在底部判断条逐字完整可见。
 * 护栏 C015：判断条明确写「不等于治理已经完成」，全章不写成治理已经完成。
 */
const stateByStep = [
  "answer-framed",
  "past-verification-shown",
  "present-lookup-shown",
  "governance-open-shown",
] as const;

type A014State = (typeof stateByStep)[number];

const ACCENT_STEP = 4;

/* 底部判断条第 4 拍补入的治理项（beat 4：授权、标准、流程、信任） */
const GOVERNANCE = ["授权", "标准", "流程", "信任"];

/* 左栏演示：三个各自记录的版位与标签（beat 2：不同的系统/企业/环节） */
const PAST_PANELS = [
  { x: 260, label: "不同系统" },
  { x: 430, label: "不同企业" },
  { x: 600, label: "不同环节" },
];

/* 左栏演示：反复确认的「?」节点（起点、终点、圆心） */
const PAST_LINKS = [
  { from: 148, to: 252, q: 200 },
  { from: 366, to: 424, q: 395 },
  { from: 536, to: 594, q: 565 },
];

/* 右栏演示：各阶段记录的版位 */
const RECORD_X = [64, 244, 424, 604];

function A014StatementFrame() {
  return (
    <div className="wc-statement scene-pad">
      <span className="wc-statement-rule" aria-hidden="true" />
      <p className="wc-statement-kicker">有了一套编码</p>
      <h1 className="wc-statement-line">
        只是有了一个<em>可以对齐的起点</em>。
      </h1>
    </div>
  );
}

/* 左栏演示：同一盒药 → 三个各自记录，靠「?」与回环反复确认 */
function A014PastDemo() {
  return (
    <svg
      className="wc-demo-svg"
      viewBox="0 0 720 380"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g className="wc-same-box">
        <rect className="wc-sb-frame" x="30" y="182" width="110" height="86" />
        <rect className="wc-sb-tag" x="44" y="198" width="52" height="24" />
        <rect className="wc-sb-cross-v" x="100" y="196" width="14" height="44" />
        <rect className="wc-sb-cross-h" x="85" y="211" width="44" height="14" />
        <text className="wc-sb-cap" x="85" y="334" textAnchor="middle">
          同一盒药
        </text>
      </g>

      {PAST_PANELS.map(({ x, label }, i) => (
        <g key={x} className={`wc-panel wc-panel-${i}`}>
          <rect className="wc-pn-frame" x={x} y="150" width="100" height="150" />
          <rect className="wc-pn-box" x={x + 16} y="164" width="34" height="26" />
          <rect className="wc-pn-strip" x={x + 12} y="204" width="76" height="16" />
          <line className="wc-pn-line" x1={x + 12} y1="240" x2={x + 88} y2="240" />
          <line className="wc-pn-line" x1={x + 12} y1="260" x2={x + 72} y2="260" />
          <text className="wc-pn-cap" x={x + 50} y="334" textAnchor="middle">
            {label}
          </text>
        </g>
      ))}

      {PAST_LINKS.map(({ from, to, q }, i) => (
        <g key={q} className={`wc-link wc-link-${i}`}>
          <line className="wc-link-line" x1={from} y1="225" x2={to} y2="225" />
          <circle className="wc-link-mark" cx={q} cy="225" r="15" />
          <text className="wc-link-q" x={q} y="233" textAnchor="middle">
            ?
          </text>
        </g>
      ))}

      <g className="wc-loop">
        <path className="wc-loop-path" d="M650 144 C 650 52 85 52 85 174" />
        <polyline className="wc-loop-head" points="72,160 85,180 98,160" />
      </g>
      <text className="wc-loop-label" x="365" y="116" textAnchor="middle">
        反复确认才能对上
      </text>
    </svg>
  );
}

/* 右栏演示：查询入口 → 统一标识定位对象 → 沿各阶段记录查找 */
function A014PresentDemo() {
  return (
    <svg
      className="wc-demo-svg"
      viewBox="0 0 720 380"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g className="wc-entry">
        <circle className="wc-en-ring" cx="88" cy="76" r="24" />
        <circle className="wc-en-dot" cx="88" cy="76" r="6" />
        <line className="wc-en-tick" x1="88" y1="42" x2="88" y2="52" />
        <line className="wc-en-tick" x1="88" y1="100" x2="88" y2="110" />
        <line className="wc-en-tick" x1="54" y1="76" x2="64" y2="76" />
        <line className="wc-en-tick" x1="112" y1="76" x2="122" y2="76" />
        <text className="wc-en-cap" x="88" y="142" textAnchor="middle">
          查询入口
        </text>
      </g>
      <line className="wc-entry-link" x1="140" y1="76" x2="266" y2="76" pathLength={100} />
      <polyline className="wc-entry-head" points="252,64 272,76 252,88" />

      <g className="wc-object">
        <rect className="wc-ob-frame" x="280" y="20" width="240" height="112" />
        <rect className="wc-ob-box" x="302" y="46" width="62" height="54" />
        <rect className="wc-ob-tag" x="312" y="56" width="26" height="12" />
        <rect className="wc-ob-chip" x="392" y="58" width="106" height="36" />
        <text className="wc-ob-chip-text" x="445" y="84" textAnchor="middle">
          统一标识
        </text>
      </g>

      <g className="wc-reticle">
        <path d="M270 34 L270 10 L294 10" />
        <path d="M506 10 L530 10 L530 34" />
        <path d="M530 118 L530 142 L506 142" />
        <path d="M294 142 L270 142 L270 118" />
      </g>
      <text className="wc-loc-label" x="400" y="174" textAnchor="middle">
        先定位对象
      </text>

      <line className="wc-fan wc-fan-0" x1="400" y1="134" x2="120" y2="270" pathLength={100} />
      <line className="wc-fan wc-fan-1" x1="400" y1="134" x2="300" y2="270" pathLength={100} />
      <line className="wc-fan wc-fan-2" x1="400" y1="134" x2="480" y2="270" pathLength={100} />
      <line className="wc-fan wc-fan-3" x1="400" y1="134" x2="660" y2="270" pathLength={100} />

      {RECORD_X.map((x, i) => (
        <g key={x} className={`wc-record wc-record-${i}`}>
          <rect className="wc-rd-frame" x={x} y="272" width="112" height="64" />
          <rect className="wc-rd-on" x={x} y="272" width="112" height="64" />
          <line className="wc-rd-line" x1={x + 14} y1="292" x2={x + 98} y2="292" />
          <line className="wc-rd-line" x1={x + 14} y1="312" x2={x + 82} y2="312" />
        </g>
      ))}
      <polygon className="wc-scan" points="0,286 16,296 0,306" />

      <text className="wc-chain-cap" x="390" y="374" textAnchor="middle">
        沿各个阶段的记录查找
      </text>
    </svg>
  );
}

function A014Scene({ state }: { state: A014State }) {
  const pastShown = state !== "answer-framed";
  const presentShown =
    state === "present-lookup-shown" || state === "governance-open-shown";
  const govOpen = state === "governance-open-shown";

  return (
    <div
      className={`wc-scene scene-pad${pastShown ? " is-past-shown" : ""}${
        presentShown ? " is-present-shown" : ""
      }${govOpen ? " is-governance-open" : ""}`}
    >
      {/* ── headline slot · S051：改变的是识别方式 ── */}
      <header className="wc-head">
        <p className="wc-kicker">回到一开始的问题</p>
        <h1 className="wc-title">改变的是识别方式</h1>
      </header>

      <div className="wc-compare">
        {/* ── left slot · U041：未变项 + 过去旧方式（第 2 拍补入演示） ── */}
        <section className="wc-col wc-col--past">
          <div className="wc-axis-row">
            <span className="wc-axis">未变</span>
            <h2 className="wc-cap">参与者数量没有改变</h2>
          </div>
          <p className="wc-cond">没有共同标识关联的时候</p>
          <div className="wc-body">
            <div className="wc-body-ph" aria-hidden="true" />
            <A014PastDemo />
          </div>
        </section>

        {/* ── right slot · U043：改变项 + 现在新方式（第 3 拍补入演示） ── */}
        <section className="wc-col wc-col--present">
          <div className="wc-axis-row">
            <span className="wc-axis">改变</span>
            <h2 className="wc-cap">识别方式变了</h2>
          </div>
          <p className="wc-cond">建立统一识别与查询入口之后</p>
          <div className="wc-body">
            <div className="wc-body-ph" aria-hidden="true" />
            <A014PresentDemo />
          </div>
        </section>
      </div>

      {/* ── bottom-thesis slot · U042：exact S053 + 第 4 拍补入治理项 ── */}
      <section className="wc-thesis">
        <p className="wc-thesis-lead">唯一标识</p>
        <p className="wc-thesis-text">
          改变的是<em>识别同一对象的方式</em>
        </p>
        <span className="wc-thesis-divider" aria-hidden="true" />
        <div className="wc-gov">
          <p className="wc-gov-kicker">不等于治理已经完成</p>
          <div className="wc-gov-row">
            <p className="wc-gov-lead">数据共享仍然需要</p>
            {GOVERNANCE.map((term) => (
              <span className="wc-gov-chip" key={term}>
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function A014WhatChanges({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <A014StatementFrame />;
  const state: A014State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <A014Scene state={state} />;
}
