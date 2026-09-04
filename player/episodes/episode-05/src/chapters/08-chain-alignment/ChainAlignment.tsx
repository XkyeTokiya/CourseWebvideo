import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ChainAlignment.css";

/* states: outline 第 8 章 semantic states（4 narration beats 一一映射） */
const states = [
  "internal-vs-chain-opened",
  "parties-aligned",
  "confirm-then-link-settled",
  "number-boundary-noted",
] as const;
type ChaState = (typeof states)[number];

/* 四类参与主体：并列等权，不设当前选中项（S035） */
const PARTIES = ["供应商", "制造商", "物流服务商", "使用方"];

/* 编号边界卡两条成立条件（S038 / R020） */
const BOUNDARY_ROWS = [
  "跨企业共用的身份，大家都能识别",
  "并能和各自系统里的记录对应起来",
];

export default function ChainAlignment({ step }: ChapterStepProps) {
  const state: ChaState = states[step] ?? states[states.length - 1];
  const parties = state !== "internal-vs-chain-opened";
  const sequenced =
    state === "confirm-then-link-settled" || state === "number-boundary-noted";
  const closed = state === "number-boundary-noted";

  return (
    <div className="cha-scene scene-pad">
      <h1 className="cha-title">
        产业链先对齐：<em>说的是哪个对象</em>
      </h1>

      <div className="cha-main">
        {/* 有序层带：带序即真实次序，先前带保持、后方带按序就位 */}
        <div className={`cha-flow${sequenced ? " is-seq" : ""}`}>
          {/* 带一 · 参与主体（并列四方，等权落位） */}
          <section className={`cha-band cha-band--parties${parties ? " is-set" : ""}`}>
            <span className="cha-mark">谁</span>
            <div className="cha-band-body">
              <div className="cha-band-head">
                <h2 className="cha-band-name">产业链上的参与方</h2>
              </div>
              <ul className="cha-parties">
                {PARTIES.map((party, i) => (
                  <li
                    key={party}
                    className="cha-party"
                    style={{ "--cha-i": String(i) } as CSSProperties}
                  >
                    {party}
                  </li>
                ))}
              </ul>
              <p className="cha-band-point">
                都要能识别<em>同一个身份</em>
              </p>
            </div>
          </section>

          <div className="cha-joint cha-joint--confirm" aria-hidden>
            <span className="cha-joint-line">
              <span className="cha-joint-fill" />
            </span>
          </div>

          {/* 带二 · 先确认（R018：共同身份规则 → 先确认 → 同一个对象） */}
          <section className={`cha-band cha-band--confirm${sequenced ? " is-set" : ""}`}>
            <span className="cha-mark cha-mark--step">先</span>
            <div className="cha-band-body">
              <h2 className="cha-band-name">确认对象</h2>
              <p className="cha-band-text">
                按共同的身份规则，确认“说的是哪个对象”
              </p>
            </div>
          </section>

          <div className="cha-joint cha-joint--link" aria-hidden>
            <span className="cha-joint-line">
              <span className="cha-joint-fill" />
            </span>
          </div>

          {/* 带三 · 后关联（R019：确认对象先于数据关联） */}
          <section className={`cha-band cha-band--link${sequenced ? " is-set" : ""}`}>
            <span className="cha-mark cha-mark--step">后</span>
            <div className="cha-band-body">
              <h2 className="cha-band-name">关联数据</h2>
              <p className="cha-band-text">
                确认之后，<em>才谈得上</em>关联它在生产、流通、使用中的数据
              </p>
            </div>
          </section>
        </div>

        {/* 侧栏：内部对照注（s1 先落）+ 编号边界卡（s4 收束入位） */}
        <aside className="cha-side">
          <div className={`cha-internal card${closed ? " is-weak" : ""}`}>
            <p className="cha-note-tag">企业内部</p>
            <p className="cha-internal-text">
              熟悉情况的员工和内部系统，能够看懂私码
            </p>
            <p className="cha-internal-pair">
              <span className="cha-pair-chip">私码</span>
              <span className="cha-pair-arrow" aria-hidden>
                →
              </span>
              <span className="cha-pair-chip cha-pair-chip--ok">内部看得懂</span>
            </p>
          </div>

          <div className={`cha-boundary${closed ? " is-on" : ""}`}>
            <div className="cha-boundary-card card">
              <p className="cha-note-tag">编号边界</p>
              <p className="cha-boundary-main">
                内部业务编号<em>不必全部改成一样</em>
              </p>
              <ul className="cha-boundary-rows">
                {BOUNDARY_ROWS.map((row, i) => (
                  <li
                    key={row}
                    className="cha-boundary-row"
                    style={{ "--cha-i": String(i) } as CSSProperties}
                  >
                    <span className="cha-row-mark" aria-hidden />
                    <span className="cha-row-text">{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
