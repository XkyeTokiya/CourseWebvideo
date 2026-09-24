import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "silos-established",
  "common-entry-reached",
  "linkage-clarified",
] as const;

type A011State = (typeof stateByStep)[number];

/** 三个系统名称按口播原文；塔高错落表达“各自系统” */
const SYSTEMS = [
  { name: "生产企业", height: 380 },
  { name: "维护单位", height: 352 },
  { name: "回收单位", height: 368 },
] as const;

const SLIP_HEIGHTS = [56, 70, 48] as const;

/** 标题记号：三段分离的竖线＋一道门拱，呼应“分散→共同入口” */
function GateMark() {
  return (
    <svg className="ce-mark" viewBox="0 0 52 46" aria-hidden="true">
      <path className="ce-mark-bar" d="M6 10v26M16 10v26M26 10v26" fill="none" strokeLinecap="round" />
      <path className="ce-mark-arch" d="M36 36v-8a7 7 0 0 1 14 0v8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 断链记号：系统之间不连通 */
function BreakLink() {
  return (
    <svg className="ce-break-glyph" viewBox="0 0 48 36" aria-hidden="true">
      <path d="M6 18a9 9 0 0 1 9-9h7" fill="none" strokeLinecap="round" />
      <path d="M42 18a9 9 0 0 0-9 9h-7" fill="none" strokeLinecap="round" />
      <path d="M10 30 38 6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 抽象标识符号：条码状竖线，不指向任何真实编码示例 */
function CodeBars() {
  return (
    <svg className="ce-codebars" viewBox="0 0 150 34" aria-hidden="true">
      <path
        d="M8 6v22M20 4v26M32 8v18M52 5v24M64 7v20M84 4v26M96 8v18M108 6v22M128 5v24M140 7v20"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 门拱：共同入口的自绘演示 */
function ArchGate() {
  return (
    <svg className="ce-arch" viewBox="0 0 150 120" aria-hidden="true">
      <path className="ce-arch-base" d="M15 112h120" fill="none" />
      <path className="ce-arch-path" d="M25 112V56a50 50 0 0 1 100 0v56" fill="none" strokeLinecap="round" pathLength={1} />
      <circle className="ce-arch-key" cx="75" cy="10" r="5" />
    </svg>
  );
}

/** 被禁止的搬运：数据不搬进字符串 */
function NoTransferGlyph() {
  return (
    <svg className="ce-notransfer-glyph" viewBox="0 0 220 48" aria-hidden="true">
      <path d="M210 24H44" fill="none" strokeLinecap="round" />
      <path d="M56 14 40 24l16 10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="127" cy="24" r="15" fill="none" />
      <path d="M118 15l18 18M136 15l-18 18" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 位置锚：保存位置不变 */
function AnchorGlyph() {
  return (
    <svg className="ce-anchor-glyph" viewBox="0 0 22 26" aria-hidden="true">
      <path d="M11 3v9" fill="none" strokeLinecap="round" />
      <circle cx="11" cy="17" r="5" fill="none" />
      <path d="M4 23.5h14" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 推进箭头：线性步骤的双箭头 */
function Chevrons() {
  return (
    <svg className="ce-chev" viewBox="0 0 40 48" aria-hidden="true">
      <path d="M8 6l16 18-16 18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 6l16 18-16 18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function A011Chapter({ step }: ChapterStepProps) {
  const state: A011State = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad ce-root" data-state={state}>
      <header className="ce-header">
        <GateMark />
        <h1 className="ce-headline">信息分散，入口共同</h1>
      </header>

      <div className="ce-steps">
        <section className="ce-station ce-station-silos">
          <div className="ce-towers">
            {SYSTEMS.map((sys, i) => (
              <div key={sys.name} className={`ce-tower ce-tower-${i + 1}`} style={{ height: sys.height }}>
                <span className="ce-tower-name">{sys.name}</span>
                <span className="ce-tower-sub">各自的系统</span>
                <div className="ce-slips">
                  {SLIP_HEIGHTS.map((h, j) => (
                    <span key={j} className="ce-slip" style={{ height: h }}>
                      <span className="ce-slip-line ce-slip-line-a" />
                      <span className="ce-slip-line ce-slip-line-b" />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <span className="ce-break ce-break-1">
              <BreakLink />
            </span>
            <span className="ce-break ce-break-2">
              <BreakLink />
            </span>
          </div>
          <div className="ce-ground">
            <span className="ce-ground-line" aria-hidden="true" />
            <p className="ce-ground-note">彼此之间并不连通</p>
          </div>
        </section>

        <span className="ce-arrow ce-arrow-1" aria-hidden="true">
          <Chevrons />
        </span>

        <section className="ce-station ce-station-entry">
          <div className="ce-gate">
            <ArchGate />
            <span className="ce-gate-code">
              <CodeBars />
            </span>
            <p className="ce-gate-title">完整的 Handle 标识</p>
            <span className="ce-gate-tag">共同的入口</span>
          </div>
        </section>

        <span className="ce-arrow ce-arrow-2" aria-hidden="true">
          <Chevrons />
        </span>

        <section className="ce-station ce-station-link">
          <div className="ce-linkwrap">
            <div className="ce-relation">
              <div className="ce-chip ce-chip-id">
                <span className="ce-chip-code">
                  <CodeBars />
                </span>
                <span className="ce-chip-name">标识</span>
              </div>
              <div className="ce-link">
                <span className="ce-link-label">关联 · 访问</span>
                <span className="ce-link-line" aria-hidden="true" />
                <span className="ce-link-tip" aria-hidden="true" />
              </div>
              <div className="ce-chip ce-chip-info">
                <span className="ce-chip-box" aria-hidden="true" />
                <span className="ce-chip-name">对象信息</span>
                <span className="ce-chip-anchor">
                  <AnchorGlyph />
                </span>
              </div>
            </div>
            <span className="ce-notransfer">
              <NoTransferGlyph />
            </span>
          </div>
        </section>
      </div>

      <div className="ce-terminal">
        <span className="ce-terminal-ghost" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <div className="ce-terminal-fill">
          <span className="ce-terminal-mark" aria-hidden="true" />
          <div className="ce-terminal-text">
            <p className="ce-terminal-hero">
              分散在各自系统的信息，可以<span className="ce-terminal-key">通过共同入口</span>被找到。
            </p>
            <p className="ce-terminal-sub">
              标识与对象信息之间是关联和访问的关系——数据不搬进字符串，保存位置不变
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
