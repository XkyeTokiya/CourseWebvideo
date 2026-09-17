import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A013EntryVsMechanism.css";

/**
 * A013 · 入口与机制分开 —— packet A013 / recipe: parallel-cards-with-takeaway
 *
 * 机制 compare-and-reweight：两卡左右并列边界持续，权重随判断推进，不轮流高亮。
 * 两拍：先立标题与并列骨架（右卡保持虚线待亮状态），左卡亮出"查询入口"职责
 * （帮助定位对象和关联信息）；保持左卡等权，右卡激活亮出协同机制，
 * 授权、标准、流程三道依据依次点亮，可信检验勾出，底部"找得到 ≠ 用得可信"收束。
 * R021（入口与机制是两件事，contrast）由入口卡与机制卡的左右并列边界承载。
 * 护栏 C014：不把查询入口写成信息使用权限 —— 入口卡只说"找得到/定位"，
 * 授权、可信使用的语义全部留在机制卡一侧。
 * 无媒体需求。
 */
const stateByStep = [
  "entry-card-stated", // step 1：标题 + 并列骨架 + 左卡亮出查询入口职责
  "mechanism-card-stated", // step 2：保持左卡，右卡亮出协同机制及其授权、标准、流程依据
] as const;

type A013State = (typeof stateByStep)[number];

const GATES = [
  { key: 0, x: 208, label: "授权" },
  { key: 1, x: 328, label: "标准" },
  { key: 2, x: 448, label: "流程" },
];

const TARGETS = [
  { key: 0, y: 26, label: "对象" },
  { key: 1, y: 162, label: "关联信息" },
];

export default function A013EntryVsMechanism({ step }: ChapterStepProps) {
  const state: A013State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const mechanism = state === "mechanism-card-stated";

  return (
    <div className={`ev-scene scene-pad${mechanism ? " is-mechanism" : ""}`}>
      <header className="ev-head">
        <h1 className="ev-title">查询入口与协同机制</h1>
        <hr className="ev-rule rule" />
      </header>

      <div className="ev-cards">
        {/* 左卡 · 查询入口：只讲"找得到"，不讲"有权用"（C014） */}
        <article className="ev-card ev-card-entry">
          <span className="ev-card-tag">入口</span>
          <div className="ev-glyph" aria-hidden="true">
            <svg
              className="ev-glyph-svg"
              viewBox="0 0 640 240"
              preserveAspectRatio="xMidYMid meet"
            >
              <g className="ev-node">
                <rect
                  x={36}
                  y={78}
                  width={128}
                  height={92}
                  fill="var(--surface-3)"
                  stroke="var(--theme-structural)"
                  strokeWidth={3}
                />
                <rect x={58} y={98} width={84} height={9} fill="var(--theme-structural)" />
                <rect x={58} y={116} width={84} height={9} fill="var(--theme-structural)" />
                <rect x={58} y={134} width={56} height={9} fill="var(--theme-structural)" />
              </g>
              <g className="ev-mag">
                <circle
                  cx={150}
                  cy={64}
                  r={20}
                  fill="var(--surface-2)"
                  stroke="var(--theme-structural)"
                  strokeWidth={5}
                />
                <line
                  x1={164}
                  y1={78}
                  x2={182}
                  y2={96}
                  stroke="var(--theme-structural)"
                  strokeWidth={6}
                  strokeLinecap="square"
                />
              </g>
              <path
                className="ev-lead"
                style={{ "--ev-i": 0 } as CSSProperties}
                d="M 168 104 C 300 62 360 56 462 56"
                pathLength={100}
                fill="none"
                stroke="var(--theme-structural)"
                strokeWidth={3}
              />
              <path
                className="ev-lead"
                style={{ "--ev-i": 1 } as CSSProperties}
                d="M 168 144 C 300 186 360 192 462 192"
                pathLength={100}
                fill="none"
                stroke="var(--theme-structural)"
                strokeWidth={3}
              />
              <polyline
                className="ev-lead-arrow"
                style={{ "--ev-i": 0 } as CSSProperties}
                points="450,46 464,56 450,66"
                fill="none"
                stroke="var(--theme-structural)"
                strokeWidth={3.5}
              />
              <polyline
                className="ev-lead-arrow"
                style={{ "--ev-i": 1 } as CSSProperties}
                points="450,182 464,192 450,202"
                fill="none"
                stroke="var(--theme-structural)"
                strokeWidth={3.5}
              />
              {TARGETS.map((t) => (
                <g key={t.key} className="ev-target" style={{ "--ev-i": t.key } as CSSProperties}>
                  <rect
                    x={468}
                    y={t.y}
                    width={144}
                    height={58}
                    fill="var(--surface-2)"
                    stroke="var(--theme-structural)"
                    strokeWidth={3}
                  />
                  <text className="ev-target-label" x={540} y={t.y + 38} textAnchor="middle">
                    {t.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <h2 className="ev-card-title">标识解析提供查询入口</h2>
          <p className="ev-card-caption">负责帮助定位对象和关联信息</p>
        </article>

        {/* R021 载体：两卡之间的左右并列边界 */}
        <div className="ev-divider" aria-hidden="true">
          <span className="ev-divider-mark">两件事</span>
        </div>

        {/* 右卡 · 协同机制：可信使用与授权、标准、流程留在这一侧 */}
        <article className="ev-card ev-card-mechanism">
          <span className="ev-card-tag">机制</span>
          <div className="ev-glyph" aria-hidden="true">
            <svg
              className="ev-glyph-svg"
              viewBox="0 0 640 240"
              preserveAspectRatio="xMidYMid meet"
            >
              <g className="ev-info">
                <rect
                  x={20}
                  y={92}
                  width={96}
                  height={56}
                  fill="var(--surface-2)"
                  stroke="var(--theme-structural)"
                  strokeWidth={3}
                />
                <text className="ev-target-label" x={68} y={128} textAnchor="middle">
                  信息
                </text>
              </g>
              <g stroke="var(--theme-structural)" strokeWidth={3}>
                <line x1={116} y1={120} x2={208} y2={120} />
                <line x1={296} y1={120} x2={328} y2={120} />
                <line x1={416} y1={120} x2={448} y2={120} />
                <line x1={536} y1={120} x2={556} y2={120} />
              </g>
              {GATES.map((gate) => (
                <g key={gate.key} className="ev-gate" style={{ "--ev-k": gate.key } as CSSProperties}>
                  <rect
                    x={gate.x}
                    y={90}
                    width={88}
                    height={60}
                    fill="var(--surface-2)"
                    stroke="var(--theme-structural)"
                    strokeWidth={3}
                  />
                  <text className="ev-gate-label" x={gate.x + 44} y={128} textAnchor="middle">
                    {gate.label}
                  </text>
                </g>
              ))}
              <circle
                className="ev-check-circle"
                cx={588}
                cy={120}
                r={26}
                pathLength={100}
                fill="var(--surface-2)"
                stroke="var(--theme-process)"
                strokeWidth={5}
              />
              <path
                className="ev-check-mark"
                d="M 576 120 L 586 131 L 602 110"
                pathLength={100}
                fill="none"
                stroke="var(--theme-process)"
                strokeWidth={6}
                strokeLinecap="square"
              />
              <text className="ev-check-label" x={588} y={192} textAnchor="middle">
                可信使用
              </text>
            </svg>
          </div>
          <h2 className="ev-card-title">协同机制决定信息能否被可信使用</h2>
          <p className="ev-card-caption">取决于各主体之间的授权、标准和流程</p>
        </article>
      </div>

      {/* 判断条：两卡对照的收束（仅第二拍出现） */}
      <aside className="ev-takeaway">
        <span className="ev-take-tag">分开看</span>
        <div className="ev-equation">
          <span className="ev-term">找得到记录</span>
          <span className="ev-neq hero-num">≠</span>
          <span className="ev-term ev-term-trust">用得可信</span>
        </div>
      </aside>
    </div>
  );
}
