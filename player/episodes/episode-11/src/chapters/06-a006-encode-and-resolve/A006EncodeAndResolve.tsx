import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006EncodeAndResolve.css";

/**
 * A006 · 编码与解析各做什么 —— packet A006 / recipe: linear-steps-with-takeaway
 *
 * 两拍：先建立基础问题条（唯一身份），再在同一拍内先点亮赋码条、后点亮解析条，
 * 顺序收敛（不轮流高亮），两步与结论条最终稳定保留。
 * R011 由赋码条 → 解析条的单向阅读顺序承载（纵向堆叠 + 向下连接件）。
 * 护栏 C006：不出现具体编码体系名称或节点层级架构。
 */
const stateByStep = [
  "basic-problem-stated", // step 1：标题 + 「最基础的一件事是唯一身份」问题条
  "encode-resolve-shown", // step 2：同拍内先点亮赋码条，再点亮解析条；与结论条一并稳定保留
] as const;

type A006State = (typeof stateByStep)[number];

export default function A006EncodeAndResolve({ step }: ChapterStepProps) {
  const state: A006State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const resolved = state === "encode-resolve-shown";

  return (
    <div className={`er-scene scene-pad${resolved ? " is-resolved" : ""}`}>
      <header className="er-head">
        <p className="er-kicker">工业互联网语境中的标识解析</p>
        <h1 className="er-title">编码与解析，各做什么</h1>
        <hr className="er-rule rule" />
      </header>

      {/* 基础问题条：第一拍的视觉中心，第二拍弱化保留 */}
      <section className="er-question" aria-label="最基础的一件事">
        <p className="er-question-label">最基础的一件事</p>
        <p className="er-question-text">
          让每一个对象，有自己<em className="er-key">唯一的身份</em>。
        </p>
      </section>

      <div className="er-steps">
        {/* 赋码条 */}
        <article className="er-bar er-bar-encode">
          <span className="er-bar-tag">赋码</span>
          <p className="er-bar-text">为物理实体和数字对象，赋予全球唯一编码</p>
          <div className="er-demo" aria-hidden="true">
            <svg className="er-demo-svg" viewBox="0 0 300 110" preserveAspectRatio="xMidYMid meet">
              <rect x="16" y="42" width="56" height="56" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
              <line x1="16" y1="70" x2="72" y2="70" stroke="var(--theme-structural)" strokeWidth="2" />
              <rect x="124" y="42" width="56" height="56" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
              <rect x="134" y="54" width="36" height="6" fill="var(--rule)" />
              <rect x="134" y="67" width="36" height="6" fill="var(--rule)" />
              <rect x="134" y="80" width="36" height="6" fill="var(--rule)" />
              <g className="er-chip" style={{ "--er-k": 0 } as CSSProperties}>
                <rect x="44" y="22" width="46" height="20" rx="3" fill="var(--surface-2)" stroke="var(--theme-process)" strokeWidth="2.5" />
                <rect x="52" y="30" width="14" height="4" fill="var(--theme-process)" />
                <rect x="70" y="30" width="14" height="4" fill="var(--theme-process)" />
              </g>
              <g className="er-chip" style={{ "--er-k": 1 } as CSSProperties}>
                <rect x="152" y="22" width="46" height="20" rx="3" fill="var(--surface-2)" stroke="var(--theme-process)" strokeWidth="2.5" />
                <rect x="160" y="30" width="14" height="4" fill="var(--theme-process)" />
                <rect x="178" y="30" width="14" height="4" fill="var(--theme-process)" />
              </g>
            </svg>
          </div>
        </article>

        {/* R011：赋码 → 解析 单向阅读顺序 */}
        <div className="er-joint" aria-hidden="true">
          <svg viewBox="0 0 40 44" preserveAspectRatio="xMidYMid meet">
            <line x1="20" y1="2" x2="20" y2="26" stroke="var(--theme-structural)" strokeWidth="3" strokeDasharray="5 6" />
            <polyline points="8,22 20,38 32,22" fill="none" stroke="var(--theme-process)" strokeWidth="4" strokeLinecap="square" />
          </svg>
        </div>

        {/* 解析条 */}
        <article className="er-bar er-bar-resolve">
          <span className="er-bar-tag">解析</span>
          <p className="er-bar-text">通过解析，找到编码对应的位置和相关信息</p>
          <div className="er-demo" aria-hidden="true">
            <svg className="er-demo-svg" viewBox="0 0 300 110" preserveAspectRatio="xMidYMid meet">
              <rect x="10" y="35" width="40" height="40" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3" />
              <rect x="18" y="47" width="24" height="5" fill="var(--rule)" />
              <rect x="18" y="58" width="24" height="5" fill="var(--rule)" />
              <g className="er-query">
                <line x1="58" y1="55" x2="142" y2="55" stroke="var(--theme-process)" strokeWidth="3" pathLength={100} />
                <polyline points="136,45 152,55 136,65" fill="none" stroke="var(--theme-process)" strokeWidth="3" strokeLinecap="square" />
              </g>
              <g className="er-record">
                <rect x="162" y="12" width="126" height="86" rx="8" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="3" />
                <text className="er-demo-text" x="176" y="46">位置</text>
                <rect x="222" y="33" width="52" height="9" fill="var(--rule)" />
                <text className="er-demo-text" x="176" y="81">信息</text>
                <rect x="222" y="68" width="52" height="9" fill="var(--rule)" />
              </g>
            </svg>
          </div>
        </article>

        {/* 结论条：赋码 + 解析 汇成一句，最终稳定保留 */}
        <aside className="er-takeaway">
          <span className="er-takeaway-mark" aria-hidden="true" />
          <p>赋码建立唯一身份，解析落到位置与信息</p>
        </aside>
      </div>
    </div>
  );
}
