import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./LifecycleContinuity.css";

/**
 * A004 · lifecycle-identity-continuity
 * mechanism: constant-anchor-band-unfold（本章新命名机制）
 *   身份锚点全页恒定；七阶段以相同语法整体铺开（无连线/无箭头，
 *   不做逐段 active 顺序点亮）；阅读顺序：锚点 → 阶段带 → 用途收束。
 * step 0 → stage-band-complete：锚点 + 七阶段带 + 带下记录注记
 * step 1 → cross-stage-use-stated：用途行 + continuity judgment 收束线
 */
const stateByStep = [
  "stage-band-complete",
  "cross-stage-use-stated",
] as const;

type LifecycleState = (typeof stateByStep)[number];

const STAGES = [
  { no: "01", name: "设计" },
  { no: "02", name: "生产" },
  { no: "03", name: "经销" },
  { no: "04", name: "运行" },
  { no: "05", name: "使用" },
  { no: "06", name: "维修保养" },
  { no: "07", name: "回收再处置" },
] as const;

const USES = ["分析", "改进生产", "支撑运维决策"] as const;

/** 每阶段同构的抽象记录行（宽度同语法等权，无数字无假数据） */
const ROW_WIDTHS = ["100%", "74%", "88%"] as const;

function LifecycleScene({ state }: { state: LifecycleState }) {
  return (
    <div className="lc-scene scene-pad" data-state={state}>
      <h1 className="lc-thesis">
        <em className="lc-em-id">同一台发动机</em>跨阶段的
        <em className="lc-em-flow">数据贯通</em>
        ，才能服务分析、生产改进和运维决策
      </h1>

      <section className="lc-anchor" aria-label="稳定身份锚点">
        <div className="lc-anchor-main">
          <span className="lc-anchor-kicker">身份锚点 · IDENTITY ANCHOR</span>
          <p className="lc-anchor-name">同一台发动机</p>
        </div>
        <span className="lc-anchor-div" aria-hidden="true" />
        <p className="lc-anchor-note">
          全页始终讨论同一台发动机，而不是一类发动机，
          也不是多个阶段中的不同对象。
        </p>
      </section>

      <section className="lc-band" aria-label="七阶段无连线阶段带">
        {STAGES.map((s, i) => (
          <article
            key={s.no}
            className="lc-stage card"
            style={{ "--lc-i": String(i) } as CSSProperties}
          >
            <span className="lc-stage-no hero-num">{s.no}</span>
            <h2 className="lc-stage-name">{s.name}</h2>
            <div className="lc-stage-rows" aria-hidden="true">
              {ROW_WIDTHS.map((w, j) => (
                <span
                  key={j}
                  className="lc-row"
                  style={
                    { "--lc-j": String(j), "--lc-w": w } as CSSProperties
                  }
                />
              ))}
            </div>
          </article>
        ))}
      </section>

      <p className="lc-band-note">
        <span className="lc-note-mark" aria-hidden="true" />
        <span className="lc-note-text">
          每个阶段都会产生属于这台发动机的记录。
        </span>
        <span className="lc-note-range">
          阶段带 · 从设计到回收再处置的生命周期范围
        </span>
      </p>

      <div className="lc-close">
        <div className="lc-close-rule rule" aria-hidden="true" />
        <p className="lc-use-line">
          <span className="lc-line-kicker">阶段资料的共同用途</span>
          <span className="lc-use-text">
            把同一台发动机的跨阶段数据共同理解，才能用于
          </span>
          <span className="lc-uses">
            {USES.map((u) => (
              <em key={u} className="lc-use-tag">
                {u}
              </em>
            ))}
          </span>
        </p>
        <p className="lc-judgment">
          <span className="lc-line-kicker">收束判断</span>
          <span className="lc-judgment-text">
            会变化的是<em className="lc-changes">阶段和阶段记录</em>；不变的是这些记录<em className="lc-keeps">始终属于同一台发动机</em>。
          </span>
        </p>
      </div>
    </div>
  );
}

export default function LifecycleContinuity({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <LifecycleScene state={state} />;
}
