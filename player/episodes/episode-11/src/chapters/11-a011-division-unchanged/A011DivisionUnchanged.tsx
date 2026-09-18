import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A011DivisionUnchanged.css";

/**
 * A011 · 分工没有改变 —— packet A011 / recipe: image-with-insight-rail
 *
 * 机制 persistent-media-reading：主图区持续，阅读焦点沿图侧洞察短条下移，判断随短条推进。
 * 两拍：先立标题、M003 空白版位与三站照常作业演示，短条一亮出"各阶段仍由相应主体完成业务"；
 * 保持主图与短条一，阅读焦点下移点亮短条二"标识让阶段记录指向同一个对象"，
 * 记录标签升起并汇聚指向同一对象，最后转折短条收束"分工不变，指向改变"。
 * R018（分工不变 → 指向改变，pivot）由图侧短条的上下顺序与主图的左右分栏承载。
 * 护栏 C012：不把标识写成代替主体完成业务 —— 短条二与演示只表达"记录指向"，业务始终由主体完成。
 * M003（photorealistic_ai）未就位：仅保留素净空白版位，无占位图、无占位卡、无"图片"字样。
 */
const stateByStep = [
  "owners-unchanged", // step 1：标题 + 主图版位 + 三站照常作业 + 短条一
  "records-repointed", // step 2：保持主图与短条一，焦点下移，记录指向同一对象，转折收束
] as const;

type A011State = (typeof stateByStep)[number];

const STATIONS = [0, 1, 2]; // 抽象阶段站位：不指名具体主体，避免引入本 packet 外事实
const FIGS = [0, 1, 2];

export default function A011DivisionUnchanged({ step }: ChapterStepProps) {
  const state: A011State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const repointed = state === "records-repointed";

  return (
    <div className={`du-scene scene-pad${repointed ? " is-repointed" : ""}`}>
      <header className="du-head">
        <h1 className="du-title">阶段的主人没有变</h1>
        <hr className="du-rule rule" />
      </header>

      <div className="du-main">
        {/* 主图列：M003 空白版位（持续保留）+ 作业演示带 */}
        <div className="du-stage-col">
          <div className="du-media" aria-hidden="true" />

          <div className="du-demo" aria-hidden="true">
            <svg
              className="du-demo-svg"
              viewBox="0 0 1160 270"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 三个阶段站位：各自的主体照常完成本阶段业务（第一拍建立，持续保留） */}
              {STATIONS.map((i) => {
                const x = 80 + i * 260;
                return (
                  <g key={i} className="du-station" style={{ "--du-i": i } as CSSProperties}>
                    <rect
                      x={x}
                      y={80}
                      width={180}
                      height={160}
                      fill="var(--surface-2)"
                      stroke="var(--theme-structural)"
                      strokeWidth={3}
                    />
                    <circle
                      cx={x + 90}
                      cy={134}
                      r={14}
                      fill="var(--surface-3)"
                      stroke="var(--theme-structural)"
                      strokeWidth={3}
                    />
                    <path
                      d={`M ${x + 60} 196 Q ${x + 90} 158 ${x + 120} 196`}
                      fill="none"
                      stroke="var(--theme-structural)"
                      strokeWidth={5}
                      strokeLinecap="square"
                    />
                    <rect
                      x={x + 46}
                      y={206}
                      width={40}
                      height={26}
                      fill="var(--theme-cool-surface)"
                      stroke="var(--theme-structural)"
                      strokeWidth={2}
                    />
                    <rect
                      x={x + 96}
                      y={212}
                      width={36}
                      height={22}
                      fill="var(--theme-cool-surface)"
                      stroke="var(--theme-structural)"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}

              {/* 阶段记录标签：第二拍从各站升起 */}
              {STATIONS.map((i) => {
                const x = 80 + i * 260 + 56;
                return (
                  <g key={`chip-${i}`} className="du-chip" style={{ "--du-i": i } as CSSProperties}>
                    <rect
                      x={x}
                      y={36}
                      width={68}
                      height={30}
                      fill="var(--surface-2)"
                      stroke="var(--theme-dashed-line)"
                      strokeWidth={2.5}
                      strokeDasharray="5 4"
                    />
                    <line x1={x + 12} y1={45} x2={x + 56} y2={45} stroke="var(--theme-structural)" strokeWidth={2.5} />
                    <line x1={x + 12} y1={53} x2={x + 44} y2={53} stroke="var(--theme-structural)" strokeWidth={2.5} />
                  </g>
                );
              })}

              {/* 记录引线：从三张标签汇聚指向同一个对象（第二拍自绘） */}
              <path
                className="du-lead"
                style={{ "--du-i": 0 } as CSSProperties}
                d="M 170 36 C 170 6 950 8 958 58"
                pathLength={100}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
              />
              <path
                className="du-lead"
                style={{ "--du-i": 1 } as CSSProperties}
                d="M 430 36 C 430 2 996 2 996 58"
                pathLength={100}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
              />
              <path
                className="du-lead"
                style={{ "--du-i": 2 } as CSSProperties}
                d="M 690 36 C 690 8 1042 14 1034 58"
                pathLength={100}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
              />
              <polyline
                className="du-lead-arrow"
                style={{ "--du-i": 0 } as CSSProperties}
                points="949,46 958,60 967,46"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3.5}
              />
              <polyline
                className="du-lead-arrow"
                style={{ "--du-i": 1 } as CSSProperties}
                points="987,46 996,60 1005,46"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3.5}
              />
              <polyline
                className="du-lead-arrow"
                style={{ "--du-i": 2 } as CSSProperties}
                points="1025,46 1034,60 1043,46"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3.5}
              />

              {/* 同一个对象：标识在对象上，记录都指向它（第二拍落定） */}
              <g className="du-object">
                <rect x={920} y={64} width={152} height={112} fill="var(--theme-structural)" />
                <rect x={958} y={90} width={76} height={10} fill="var(--surface-2)" />
                <rect x={958} y={110} width={76} height={10} fill="var(--surface-2)" />
                <rect x={958} y={130} width={48} height={10} fill="var(--accent)" />
              </g>
              <text className="du-object-label" x={996} y={212} textAnchor="middle">
                同一对象
              </text>
            </svg>
          </div>
        </div>

        {/* 图侧洞察短条：上下顺序承载 R018（分工 → 指向 的转折） */}
        <aside className="du-rail" aria-label="洞察短条">
          <div className="du-rail-inner">
            <span className="du-track" aria-hidden="true" />
            <span className="du-track-dot" aria-hidden="true" />

            <article className="du-bar du-bar-owner">
              <svg className="du-bar-glyph-svg" viewBox="0 0 96 88" aria-hidden="true">
                <line x1={6} y1={76} x2={90} y2={76} stroke="var(--theme-structural)" strokeWidth={3} />
                {FIGS.map((i) => {
                  const cx = 22 + i * 26;
                  return (
                    <g key={i} className="du-fig" style={{ "--du-i": i } as CSSProperties}>
                      <circle
                        cx={cx}
                        cy={36}
                        r={8}
                        fill="var(--surface-3)"
                        stroke="var(--theme-structural)"
                        strokeWidth={3}
                      />
                      <path
                        d={`M ${cx - 13} 64 Q ${cx} 46 ${cx + 13} 64`}
                        fill="none"
                        stroke="var(--theme-structural)"
                        strokeWidth={4.5}
                        strokeLinecap="square"
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="du-bar-body">
                <span className="du-bar-tag">分工</span>
                <h2>各阶段仍由相应主体完成业务</h2>
              </div>
            </article>

            <article className="du-bar du-bar-point">
              <svg className="du-bar-glyph-svg" viewBox="0 0 96 88" aria-hidden="true">
                <rect
                  x={8}
                  y={12}
                  width={30}
                  height={20}
                  fill="var(--surface-2)"
                  stroke="var(--theme-dashed-line)"
                  strokeWidth={2.5}
                  strokeDasharray="4 3"
                />
                <rect
                  x={8}
                  y={56}
                  width={30}
                  height={20}
                  fill="var(--surface-2)"
                  stroke="var(--theme-dashed-line)"
                  strokeWidth={2.5}
                  strokeDasharray="4 3"
                />
                <path d="M 38 22 C 58 22 62 42 76 42" fill="none" stroke="var(--theme-structural)" strokeWidth={2.5} />
                <path d="M 38 66 C 58 66 62 46 76 46" fill="none" stroke="var(--theme-structural)" strokeWidth={2.5} />
                <circle cx={84} cy={44} r={7.5} fill="var(--accent)" />
              </svg>
              <div className="du-bar-body">
                <span className="du-bar-tag">指向</span>
                <h2>标识让阶段记录指向同一个对象</h2>
              </div>
            </article>

            <article className="du-bar du-bar-pivot">
              <svg className="du-bar-glyph-svg" viewBox="0 0 96 88" aria-hidden="true">
                <circle cx={12} cy={22} r={6} fill="var(--accent)" />
                <path
                  d="M 12 22 H 56 Q 70 22 70 36 V 56"
                  fill="none"
                  stroke="var(--surface-2)"
                  strokeWidth={6}
                />
                <polyline
                  points="58,48 70,64 82,48"
                  fill="none"
                  stroke="var(--surface-2)"
                  strokeWidth={6}
                />
              </svg>
              <div className="du-bar-body">
                <h2>
                  分工不变，<em>指向改变</em>
                </h2>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
