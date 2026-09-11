import { useState } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003SmartControlGoal.css";

/**
 * A003 · 管控目标 —— condition-key-goal
 * mechanism: cumulative-assembly —— 固定结构内逐层组装（方法锚 → 方向 → 目标 → 监控要求），
 *            已组装层持续保留；step 1 权重转移到 goal 组，聚焦模具这一关键对象（弱化/退让，非新构图）。
 * states:    approach-assembled → mold-in-focus
 */
const states = ["approach-assembled", "mold-in-focus"] as const;

type A003State = (typeof states)[number];

const DIRECTIONS = ["自动化", "数字化", "网络化", "智能化"];
const GOALS = ["提高效率", "降低成本", "提升质量"];

/** 口播报到点（秒），挂到元素的 animation-delay 上（step 0 内逐层组装） */
const vd = (seconds: number) => ({ "--cg-d": `${seconds}s` }) as CSSProperties;

export default function A003SmartControlGoal({ step }: ChapterStepProps) {
  const state: A003State = states[step] ?? states[states.length - 1];
  const focus = state === "mold-in-focus";
  // 仅从 step 0 进入时播放逐层装配动画；中途跳入直接落在稳定态
  const [fresh] = useState(step === 0);

  const sceneCls = ["cg-scene", "scene-pad", focus ? "has-focus" : "", fresh ? "is-fresh" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sceneCls}>
      <h1 className="cg-title">智能化生产管控要管什么</h1>

      <div className="cg-main">
        <aside className="cg-rail">
          {/* 承接口播第一句：要让模具离开企业后仍然看得见、管得住 */}
          <div className="cg-problem" style={vd(1)}>
            <span className="cg-problem-tag">要做到</span>
            <p>
              模具离开企业后
              <br />
              <b>仍然看得见、管得住</b>
            </p>
          </div>

          {/* 方法锚 —— R005 起点：智能化生产管控 → 面向生产过程的四个方向 */}
          <section className="cg-method" style={vd(4.6)}>
            <span className="cg-method-lead">换一种做法</span>
            <h2 className="cg-method-name" style={vd(7.4)}>
              智能化
              <br />
              生产管控
            </h2>
            <hr className="rule cg-method-rule" />
            <div className="cg-join">
              <span className="cg-join-chip" style={vd(9.6)}>信息技术</span>
              <span className="cg-join-x" style={vd(10.4)}>×</span>
              <span className="cg-join-chip" style={vd(11.2)}>制造技术</span>
            </div>
          </section>
        </aside>

        <div className="cg-bands">
          {/* condition · U006/S010 —— R005 由首组方向标签承载 */}
          <section className="cg-band">
            <span className="cg-band-tag">方向</span>
            <div className="cg-band-body">
              <p className="cg-band-lead" style={vd(12.8)}>生产过程的发展方向</p>
              <div className="cg-tags">
                {DIRECTIONS.map((d, i) => (
                  <span key={d} className="cg-tag" style={vd(13.4 + i * 1.3)}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* key · U007/S011（三个目标）+ S012（实时监控和优化） */}
          <section className="cg-band">
            <span className="cg-band-tag">目标</span>
            <div className="cg-band-body">
              <div className="cg-goals">
                {GOALS.map((g, i) => (
                  <span key={g} className="cg-goal" style={vd(19.4 + i * 1.1)}>
                    {g}
                  </span>
                ))}
              </div>
              <div className="cg-monitor" style={vd(22.8)}>
                <span className="cg-monitor-leds" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <p>
                  对生产过程 · <b>实时监控和优化</b>
                </p>
              </div>
            </div>
          </section>

          {/* goal · U008/S013 —— R006：管控目标聚焦模具这一关键对象，本页落点（step 1 到位） */}
          <section className="cg-landing">
            <span className="cg-landing-tag">落点</span>
            <span className="cg-corner cg-c-tl" aria-hidden="true" />
            <span className="cg-corner cg-c-tr" aria-hidden="true" />
            <span className="cg-corner cg-c-bl" aria-hidden="true" />
            <span className="cg-corner cg-c-br" aria-hidden="true" />
            <div className="cg-landing-body">
              <p className="cg-landing-lead">重点 · 关键对象</p>
              <p className="cg-landing-hero">这副模具</p>
              <div className="cg-focus-chips">
                <span className="cg-focus-chip">始终可见</span>
                <span className="cg-focus-chip">可管理</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
