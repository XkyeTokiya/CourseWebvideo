import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 04-a004system-boundary · 编码体系的边界页（outline §4 · S-A004 ·
 * split-compare-with-pivot，anchor-with-exclusions）
 * 单一持续边界场景：左锚体系声明持续，载体排除与平台排除在中右并列，
 * 只呈现"不是什么"，不展开载体或平台接口说明。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - boundary-drawn：step 1 内依次建立左锚与两个排除标记，完成后三区
 *   并列稳定保留（R007/R008 由左锚与两排除标记的并列承载）
 * 护栏：不把编码体系扩展成任何特定载体、平台或接口的说明；
 * 排除句不携带注册或解析流程的任何接口或结果说明。
 */
const stateByStep = ["boundary-drawn"] as const;

type A004State = (typeof stateByStep)[number];

export default function A004Chapter({ step }: ChapterStepProps) {
  const state: A004State = stateByStep[step] ?? stateByStep[0];

  return (
    <div className="nt-root" data-state={state}>
      <div className="nt-anchor">
        <p className="nt-anchor-kicker">先说清楚一件事</p>
        <p className="nt-anchor-word">
          <em>Ecode</em> 是一套
        </p>
        <p className="nt-anchor-word-strong">编码体系</p>
        <span className="nt-anchor-foot">仅此而已——先记住这个边界</span>
      </div>

      <section className="nt-panel nt-panel-1">
        <p className="nt-not">不等于</p>
        <p className="nt-panel-word">哪一种标签载体</p>
        <svg className="nt-icon" viewBox="0 0 200 150" aria-hidden="true">
          {/* 标签形状 + 划线 */}
          <path
            d="M26 52 L92 26 L164 62 L158 108 L74 120 Z"
            fill="var(--theme-warning-surface)"
            stroke="var(--theme-dashed-line)"
            strokeWidth="6"
          />
          <circle cx="104" cy="52" r="11" fill="var(--theme-cool-surface)" />
          <line
            x1="18"
            y1="140"
            x2="188"
            y2="16"
            stroke="var(--theme-warning)"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>
      </section>

      <section className="nt-panel nt-panel-2">
        <p className="nt-not">不等于</p>
        <p className="nt-panel-word">注册平台 / 解析平台</p>
        <svg className="nt-icon" viewBox="0 0 200 150" aria-hidden="true">
          {/* 平台机柜形状 + 划线 */}
          <rect
            x="36"
            y="24"
            width="128"
            height="102"
            rx="8"
            fill="var(--theme-cool-surface)"
            stroke="var(--theme-dashed-line)"
            strokeWidth="6"
          />
          <circle cx="100" cy="112" r="8" fill="var(--theme-grid-line)" />
          <rect x="62" y="44" width="76" height="10" rx="4" fill="var(--theme-dashed-line)" />
          <rect x="62" y="64" width="76" height="10" rx="4" fill="var(--theme-dashed-line)" />
          <line
            x1="18"
            y1="140"
            x2="188"
            y2="16"
            stroke="var(--theme-warning)"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>
      </section>
    </div>
  );
}
