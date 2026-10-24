import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 02-identity-gap · 身份问题页（outline §2 · S-A002 · central-question）
 * 单一持续断点场景：前提栏与缺口栏两栏对照，缺口卡内是另一半的开口圆环
 * （SVG 空缺弧 + 虚线），缺口在 step 2 经承接箭头把视觉中心交给问句区；
 * 两栏对照保持，不轮播。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - gap-framed：标题与两栏对照落位，缺口环就位（step 1，
 *   R003 由左右两栏的对照排列承载）
 * - question-dominant：承接箭头自缺口落笔，问句升为视觉中心
 *   （step 2，R004 由缺口栏到问句区的承接箭头承载）
 * 护栏 C003：问题只落在身份解释上，不写成注册或解析需求。
 */
const stateByStep = ["gap-framed", "question-dominant"] as const;

type A002State = (typeof stateByStep)[number];

/** 环节记录的两栏对照事实（G005 / G006） */
const STAGES = ["生产线", "仓库", "装车", "使用现场"] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state: A002State = stateByStep[step] ?? stateByStep[1];
  const questionPhase = state === "question-dominant";

  return (
    <div className="xq-root" data-state={state}>
      <header className="xq-head">
        <h1 className="xq-headline">身份断点</h1>
        <span className="xq-head-rule" aria-hidden="true" />
      </header>

      <div className="xq-main">
        <section className="xq-col xq-premise">
          <p className="xq-col-kicker">环节各有各的</p>
          <p className="xq-col-word">记录</p>
          <ul className="xq-stamps">
            {STAGES.map((label, index) => (
              <li
                key={label}
                className="xq-stamp"
                style={{ "--xq-i": index } as React.CSSProperties}
              >
                {label}
                <i aria-hidden="true">〜</i>
              </li>
            ))}
          </ul>
        </section>

        <section className="xq-col xq-gap">
          <p className="xq-col-kicker">物品却缺一个能串起它们的</p>
          <p className="xq-col-word">身份</p>
          <svg
            className="xq-gap-ring"
            viewBox="0 0 120 120"
            aria-label="身份缺口：一个缺少分段的圆环"
          >
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke="var(--theme-dashed-line)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="180 96"
              transform="rotate(-30 60 60)"
            />
            <circle cx="60" cy="60" r="26" fill="var(--theme-warning-surface)" />
            <text x="60" y="74" textAnchor="middle" className="xq-ring-q">
              ？
            </text>
          </svg>
        </section>
      </div>

      <div className="xq-lead-row" aria-hidden="true">
        <span className={`xq-lead-line${questionPhase ? " is-on" : ""}`} />
      </div>

      <div className={`xq-question${questionPhase ? " is-on" : ""}`}>
        <p className="xq-question-text">
          要给物联网中的物品一个<strong>解释得清楚、衔接得起来</strong>的身份——
        </p>
        <p className="xq-question-main">该从哪里下手？</p>
      </div>
    </div>
  );
}
