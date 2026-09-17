import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009SharedAnchor.css";

/**
 * A009 · 共同指向从哪里来 —— packet A009 / recipe: common-anchor-association-groups
 *
 * 机制 anchor-centric-association：共享锚点持续居中，不同主体的记录组围绕锚点
 * 逐组落位并保持邻近。两拍：先建立标题与"共同指向"命题条（指向轴演示）；
 * 第二拍在同一步内先立共享锚点（这盒药 · 唯一标识），再让三组记录依次落位围合，
 * 虚线围合环最后封口稳定。
 * R016（对象身份使记录可以关联）由关联项围合共享锚点的邻近关系承载。
 * 护栏 C010：不把关联画成数据集中搬运 —— 记录不搬家，各组留在原位，
 * 与锚点之间只有静态虚线关联（无箭头、无流向、无汇入动画）。
 */
const stateByStep = [
  "shared-direction-stated", // step 1：标题 + "共同指向"命题条
  "anchor-with-associated-records", // step 2：同拍内先立锚点，再让记录组围合落位
] as const;

type A009State = (typeof stateByStep)[number];

const GROUPS = [
  { owner: "制药厂", record: "生产记录" },
  { owner: "经销商", record: "订单记录" },
  { owner: "药店", record: "销售记录" },
];

export default function A009SharedAnchor({ step }: ChapterStepProps) {
  const state: A009State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const assembled = state === "anchor-with-associated-records";

  return (
    <div className={`sa-scene scene-pad${assembled ? " is-assembled" : ""}`}>
      <header className="sa-head">
        <h1 className="sa-title">记录有了共同的指向</h1>
      </header>

      {/* 命题条：第一拍亮出，持续保留（指向轴只表达"指向"，不预演围合） */}
      <section className="sa-proposition">
        <span className="sa-prop-tag">真正的变化</span>
        <p className="sa-prop-text">这些阶段的记录，有了共同的指向</p>
        <svg
          className="sa-prop-axis"
          viewBox="0 0 440 64"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <line
            className="sa-axis-line"
            x1="10"
            y1="32"
            x2="368"
            y2="32"
            pathLength={100}
            stroke="var(--theme-structural)"
            strokeWidth="5"
          />
          <polyline
            className="sa-axis-arrow"
            points="354,14 392,32 354,50"
            fill="none"
            stroke="var(--theme-process)"
            strokeWidth="6"
            strokeLinecap="square"
          />
          <circle
            className="sa-axis-target"
            cx="420"
            cy="32"
            r="11"
            fill="none"
            stroke="var(--theme-process)"
            strokeWidth="6"
          />
        </svg>
      </section>

      <div className="sa-stage">
        {/* 围合环 + 静态关联虚线（R016：邻近围合，不搬运数据） */}
        <svg
          className="sa-ring"
          viewBox="0 0 1700 620"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <ellipse
            className="sa-ring-ellipse"
            cx="850"
            cy="310"
            rx="590"
            ry="200"
            fill="none"
            stroke="var(--theme-dashed-line)"
            strokeWidth="3"
            strokeDasharray="10 14"
          />
          <g className="sa-tick" style={{ "--sa-k": 0 } as CSSProperties}>
            <line
              x1="416"
              y1="310"
              x2="620"
              y2="310"
              stroke="var(--theme-structural)"
              strokeWidth="2.5"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle cx="632" cy="310" r="5.5" fill="var(--theme-process)" />
          </g>
          <g className="sa-tick" style={{ "--sa-k": 1 } as CSSProperties}>
            <line
              x1="1284"
              y1="310"
              x2="1080"
              y2="310"
              stroke="var(--theme-structural)"
              strokeWidth="2.5"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle cx="1068" cy="310" r="5.5" fill="var(--theme-process)" />
          </g>
          <g className="sa-tick" style={{ "--sa-k": 2 } as CSSProperties}>
            <line
              x1="850"
              y1="452"
              x2="850"
              y2="410"
              stroke="var(--theme-structural)"
              strokeWidth="2.5"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle cx="850" cy="402" r="5.5" fill="var(--theme-process)" />
          </g>
        </svg>

        {/* 共享锚点：先立锚点（第二拍第一个内部动作） */}
        <div className="sa-anchor">
          <div className="sa-anchor-in">
            <svg
              className="sa-anchor-box"
              viewBox="0 0 132 132"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <rect
                x="16"
                y="20"
                width="100"
                height="86"
                rx="6"
                fill="var(--surface-2)"
                stroke="var(--theme-structural)"
                strokeWidth="4"
              />
              <line x1="16" y1="42" x2="116" y2="42" stroke="var(--theme-structural)" strokeWidth="3" />
              <rect x="59" y="52" width="14" height="34" fill="var(--theme-process)" />
              <rect x="49" y="62" width="34" height="14" fill="var(--theme-process)" />
              <g className="sa-tag">
                <rect
                  x="24"
                  y="112"
                  width="84"
                  height="18"
                  rx="3"
                  fill="var(--surface-2)"
                  stroke="var(--theme-process)"
                  strokeWidth="2.5"
                />
                <rect x="34" y="117" width="4" height="8" fill="var(--theme-process)" />
                <rect x="44" y="117" width="7" height="8" fill="var(--theme-process)" />
                <rect x="57" y="117" width="3" height="8" fill="var(--theme-process)" />
                <rect x="66" y="117" width="7" height="8" fill="var(--theme-process)" />
                <rect x="79" y="117" width="4" height="8" fill="var(--theme-process)" />
                <rect x="89" y="117" width="6" height="8" fill="var(--theme-process)" />
              </g>
            </svg>
            <div className="sa-anchor-copy">
              <p className="sa-scope">标识解析 · 应用逻辑</p>
              <span className="sa-anchor-name">这盒药</span>
              <span className="sa-anchor-sub">需要被唯一识别的对象</span>
            </div>
          </div>
        </div>

        {/* 关联记录组：围绕锚点依次落位（同一步内的后续内部动作） */}
        {GROUPS.map((item, i) => (
          <div
            key={item.record}
            className={`sa-group sa-group--${
              i === 0 ? "left" : i === 1 ? "right" : "bottom"
            }`}
          >
            <article className="sa-group-in" style={{ "--sa-k": i } as CSSProperties}>
              <svg
                className="sa-doc"
                viewBox="0 0 30 38"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <path
                  d="M4 3 H20 L26 9 V35 H4 Z"
                  fill="var(--surface-2)"
                  stroke="var(--theme-structural)"
                  strokeWidth="2.5"
                />
                <path d="M20 3 V9 H26" fill="none" stroke="var(--theme-structural)" strokeWidth="2.5" />
                <line x1="9" y1="16" x2="21" y2="16" stroke="var(--theme-process)" strokeWidth="2.5" />
                <line x1="9" y1="22" x2="21" y2="22" stroke="var(--rule)" strokeWidth="2.5" />
                <line x1="9" y1="28" x2="17" y2="28" stroke="var(--rule)" strokeWidth="2.5" />
              </svg>
              <div className="sa-group-copy">
                <span className="sa-group-owner">{item.owner}</span>
                <span className="sa-group-record">{item.record}</span>
              </div>
            </article>
          </div>
        ))}

        {/* 支撑说明（U027）：围合稳定后出现 */}
        <p className="sa-support">
          <span className="dot-accent" aria-hidden="true" />
          围绕这个对象的标识，把不同主体的相关记录关联起来
        </p>
      </div>
    </div>
  );
}
