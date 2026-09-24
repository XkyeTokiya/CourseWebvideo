import type { CSSProperties } from "react";
import "./A012Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A012 · 三问检查 —— condition-key-goal
 * 三张问句卡等权排布（R011 载体），价值注记逐卡补充，不产生当前选中项；
 * 顶部 Handle 结构标尺（前缀 | 后缀，完整标识括弧）被三根探针对位三问；
 * takeaway 收束「缺一不可」，三卡底部汇聚线落向结论条（R011 convergent）。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "questions-established",
  "governance-guarded",
  "internal-retained",
  "info-converged",
  "triad-locked",
] as const;

type A012State = (typeof stateByStep)[number];

/** 抽象标识段：条码状竖线，示意结构，不指向任何真实编码 */
function SegmentGlyph() {
  return (
    <svg className="tq-seg-glyph" viewBox="0 0 96 28" aria-hidden="true">
      <path
        d="M6 3v22M14 3v22M18 3v22M30 3v22M42 3v22M50 3v22M64 3v22M72 3v22M76 3v22M90 3v22"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
      />
    </svg>
  );
}

/** 第一问演示：命名空间里两段编码被治理边界分开，不再撞在一起 */
function NamespaceDemo() {
  return (
    <svg className="tq-demo-svg" viewBox="0 0 220 118" aria-hidden="true">
      <rect className="tq-ns-ground" x="10" y="96" width="200" height="5" />
      <g className="tq-ns-block tq-ns-block--a">
        <rect x="26" y="30" width="66" height="46" />
        <path d="M38 44v18M46 44v18M56 44v18M70 44v18M80 44v18" strokeWidth="2.4" fill="none" stroke="currentColor" />
        <text x="59" y="92" textAnchor="middle">组织 A</text>
      </g>
      <g className="tq-ns-block tq-ns-block--b">
        <rect x="128" y="30" width="66" height="46" />
        <path d="M140 44v18M150 44v18M160 44v18M172 44v18M182 44v18" strokeWidth="2.4" fill="none" stroke="currentColor" />
        <text x="161" y="92" textAnchor="middle">组织 B</text>
      </g>
      <g className="tq-ns-boundary">
        <path d="M110 16v88" strokeDasharray="5 6" strokeWidth="3" fill="none" stroke="currentColor" />
      </g>
    </svg>
  );
}

/** 第二问演示：同一组织内部，三个不同对象各自被指认 */
function ObjectsDemo() {
  return (
    <svg className="tq-demo-svg" viewBox="0 0 220 118" aria-hidden="true">
      <rect className="tq-ob-frame" x="12" y="12" width="196" height="94" strokeDasharray="6 6" />
      <g className="tq-obj">
        <circle cx="56" cy="62" r="17" />
        <path className="tq-obj-tick" d="M48 62l6 6 11-13" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="tq-obj">
        <rect x="96" y="45" width="32" height="32" />
        <path className="tq-obj-tick" d="M104 61l6 6 11-13" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="tq-obj">
        <path d="M168 44l19 33h-38z" />
        <path className="tq-obj-tick" d="M160 61l6 6 11-13" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** 第三问演示：分散保存的信息卡，围绕同一个身份节点被查询 */
function ConvergeDemo() {
  return (
    <svg className="tq-demo-svg" viewBox="0 0 220 118" aria-hidden="true">
      <path className="tq-cv-line" d="M46 30L96 54" pathLength="1" />
      <path className="tq-cv-line" d="M46 90L96 68" pathLength="1" />
      <path className="tq-cv-line" d="M176 30L126 54" pathLength="1" />
      <g className="tq-cv-chip">
        <rect x="18" y="16" width="30" height="22" />
        <path d="M24 24h18M24 30h12" strokeWidth="2" fill="none" stroke="currentColor" />
      </g>
      <g className="tq-cv-chip">
        <rect x="18" y="80" width="30" height="22" />
        <path d="M24 88h18M24 94h12" strokeWidth="2" fill="none" stroke="currentColor" />
      </g>
      <g className="tq-cv-chip">
        <rect x="174" y="16" width="30" height="22" />
        <path d="M180 24h18M180 30h12" strokeWidth="2" fill="none" stroke="currentColor" />
      </g>
      <g className="tq-cv-node">
        <circle cx="111" cy="61" r="21" />
        <path d="M103 52v18M109 52v18M115 52v18M121 52v18" strokeWidth="2.2" fill="none" stroke="currentColor" />
      </g>
    </svg>
  );
}

const QUESTIONS = [
  { no: "第一问", role: "前缀", q: "前缀属于哪个管理范围？", demo: <NamespaceDemo />, demoNote: "命名空间" },
  { no: "第二问", role: "后缀", q: "后缀区分的是哪个内部对象？", demo: <ObjectsDemo />, demoNote: "同一组织内部" },
  { no: "第三问", role: "完整标识", q: "完整标识关联着哪些对象信息？", demo: <ConvergeDemo />, demoNote: "分散的信息" },
] as const;

const VALUES = [
  { main: "保护命名空间的治理位置", sub: "不同组织的编码不会撞在一起" },
  { main: "保留企业内部管理对象的能力", sub: "谁的对象谁最清楚" },
  { main: "围绕同一个身份被查询", sub: "分散保存的信息由此汇聚" },
] as const;

const TRIAD = ["前缀管范围", "后缀管对象", "完整标识关联信息"] as const;

export default function A012Chapter({ step }: ChapterStepProps) {
  const state: A012State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad tq-root" data-state={state}>
      <header className="tq-header">
        <span className="tq-heading-mark" aria-hidden="true" />
        <div className="tq-heading-text">
          <h1 className="tq-headline">三个问题检查一次 Handle</h1>
          <p className="tq-subline">用三个问题收束职责分工与边界</p>
        </div>
      </header>

      {/* Handle 结构标尺：完整标识括弧 + 前缀/后缀分段 + 三根检查探针 */}
      <div className="tq-ruler" aria-hidden="true">
        <div className="tq-brace">
          <span className="tq-brace-label">完整标识</span>
        </div>
        <div className="tq-bar">
          <div className="tq-seg tq-seg--prefix">
            <span className="tq-seg-name">前缀</span>
            <SegmentGlyph />
          </div>
          <div className="tq-seg tq-seg--suffix">
            <span className="tq-seg-name">后缀</span>
            <SegmentGlyph />
          </div>
        </div>
        <span className="tq-probe tq-probe--1" />
        <span className="tq-probe tq-probe--2" />
        <span className="tq-probe tq-probe--3" />
      </div>

      {/* 三张问句卡：等权排布，价值注记逐卡补充 */}
      <div className="tq-cards">
        {QUESTIONS.map((item, i) => (
          <article className="tq-card" key={item.no}>
            <header className="tq-card-head">
              <span className="tq-card-no">{item.no}</span>
              <span className="tq-card-role">{item.role}</span>
            </header>
            <p className="tq-card-q">{item.q}</p>
            <div className="tq-card-demo">
              {item.demo}
              <span className="tq-demo-note">{item.demoNote}</span>
            </div>
            <footer className={`tq-value tq-value--${i + 1}`}>
              <p className="tq-value-main">{VALUES[i].main}</p>
              <p className="tq-value-sub">{VALUES[i].sub}</p>
            </footer>
          </article>
        ))}
      </div>

      {/* 三问汇聚线：R011 convergent 的落点动作 */}
      <div className="tq-converge" aria-hidden="true">
        <span
          className="tq-converge-line tq-converge-line--l"
          style={{ "--tq-lean": "-14deg" } as CSSProperties}
        />
        <span className="tq-converge-line tq-converge-line--c" />
        <span
          className="tq-converge-line tq-converge-line--r"
          style={{ "--tq-lean": "14deg" } as CSSProperties}
        />
      </div>

      {/* takeaway：缺一不可 */}
      <div className="tq-takeaway">
        <div className="tq-triad">
          {TRIAD.map((tag) => (
            <span className="tq-triad-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="tq-verdict">
          <p className="tq-verdict-strong">缺一不可</p>
          <p className="tq-verdict-risk">
            缺一问，都会把 Handle <em>误读成普通的内部编号</em>
          </p>
        </div>
      </div>
    </div>
  );
}
