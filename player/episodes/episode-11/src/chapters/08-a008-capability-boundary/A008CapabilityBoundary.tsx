import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008CapabilityBoundary.css";

/**
 * A008 · 能力的边界 —— packet A008 / recipe: layered-bands-with-side-notes
 *
 * 机制 cumulative-assembly：在固定带层内逐层补齐能力边界，最后收束到底部边界判断。
 * 三拍：先立标题与带一（装不进编码 + 钥匙开锁、不装东西的比喻演示）；保持带一，
 * 在带二层补入三张系统短卡（生产 / 订单 / 销售 不被替代）；最后底部边界判断条收束。
 * R014（边界一 与 边界二 对照）由两条边界说明的上下并列承载；
 * R015（系统不被替代 → 原有分工不变）由侧栏短卡与文字带的邻接承载。
 * 护栏 C009：不把标识画成中心数据库或自动同步程序。
 */
const stateByStep = [
  "key-not-warehouse-shown", // step 1：标题 + 带一 + 钥匙比喻演示
  "systems-not-replaced", // step 2：保持带一，侧栏短卡补入三套系统不被替代
  "business-unchanged-settled", // step 3：保持既有内容，底部边界判断收束
] as const;

type A008State = (typeof stateByStep)[number];

const SYSTEMS = [
  { owner: "制药厂", system: "生产系统" },
  { owner: "经销商", system: "订单系统" },
  { owner: "药店", system: "销售系统" },
];

export default function A008CapabilityBoundary({ step }: ChapterStepProps) {
  const state: A008State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const systemsOn = state !== "key-not-warehouse-shown";
  const settled = state === "business-unchanged-settled";

  return (
    <div
      className={`cb-scene scene-pad${systemsOn ? " is-systems" : ""}${
        settled ? " is-settled" : ""
      }`}
    >
      <header className="cb-head">
        <h1 className="cb-title">标识不承担什么</h1>
        <hr className="cb-rule rule" />
      </header>

      <div className="cb-body">
        {/* 带一 · 边界一：装不进编码 + 钥匙比喻（第一拍建立，持续保留） */}
        <section className="cb-band cb-band-first">
          <span className="cb-band-tag">边界一</span>
          <p className="cb-band-text">
            不是把所有业务数据都<em className="cb-em">装进编码</em>
          </p>
          <div className="cb-metaphor" aria-hidden="true">
            <svg
              className="cb-metaphor-svg"
              viewBox="0 0 640 240"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 锁 + 钥匙：编码能开锁 */}
              <circle
                cx="200"
                cy="120"
                r="46"
                fill="var(--surface-2)"
                stroke="var(--theme-structural)"
                strokeWidth="4"
              />
              <circle
                cx="200"
                cy="120"
                r="18"
                fill="var(--surface-3)"
                stroke="var(--theme-structural)"
                strokeWidth="2"
              />
              <g className="cb-key">
                <circle
                  cx="120"
                  cy="120"
                  r="24"
                  fill="var(--surface-2)"
                  stroke="var(--theme-process)"
                  strokeWidth="11"
                />
                <rect x="140" y="113" width="62" height="14" rx="3" fill="var(--theme-process)" />
                <rect x="176" y="127" width="9" height="16" fill="var(--theme-process)" />
                <rect x="162" y="127" width="7" height="11" fill="var(--theme-process)" />
              </g>
              <text className="cb-svg-label cb-svg-label--open" x="200" y="224" textAnchor="middle">
                开锁
              </text>

              {/* 分隔：编码 ≠ 仓库 */}
              <line
                x1="304"
                y1="22"
                x2="304"
                y2="208"
                stroke="var(--theme-dashed-line)"
                strokeWidth="2"
                strokeDasharray="7 9"
              />
              <text className="cb-svg-neq" x="304" y="138" textAnchor="middle">
                ≠
              </text>

              {/* 仓库：业务数据留在各自仓库，装不进编码 */}
              <polyline
                points="356,84 472,32 588,84"
                fill="none"
                stroke="var(--theme-dashed-line)"
                strokeWidth="3"
                strokeDasharray="8 10"
              />
              <rect
                x="366"
                y="84"
                width="208"
                height="98"
                fill="var(--surface-3)"
                stroke="var(--theme-dashed-line)"
                strokeWidth="3"
                strokeDasharray="8 10"
              />
              <line
                x1="366"
                y1="133"
                x2="574"
                y2="133"
                stroke="var(--theme-dashed-line)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              <rect x="392" y="106" width="26" height="24" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="2.5" />
              <rect x="426" y="106" width="26" height="24" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="2.5" />
              <rect x="409" y="146" width="26" height="24" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="2.5" />
              <g className="cb-hop">
                <rect x="540" y="146" width="26" height="24" fill="var(--surface-2)" stroke="var(--theme-structural)" strokeWidth="2.5" />
              </g>
              <g className="cb-hit">
                <line x1="294" y1="150" x2="314" y2="170" stroke="var(--theme-danger)" strokeWidth="6" strokeLinecap="square" />
                <line x1="314" y1="150" x2="294" y2="170" stroke="var(--theme-danger)" strokeWidth="6" strokeLinecap="square" />
              </g>
              <text className="cb-svg-label" x="470" y="224" textAnchor="middle">
                仓库
              </text>
            </svg>
          </div>
        </section>

        {/* 带二 · 边界二：不替代业务系统（第二拍补入，与带一上下并列） */}
        <section className="cb-band cb-band-second">
          <span className="cb-band-tag cb-band-tag--warm">边界二</span>
          <p className="cb-band-text cb-band-text--second">替代不了任何一套业务系统</p>

          {/* 侧栏短卡（U023）：与文字带邻接，三套系统各自保留 */}
          <div className="cb-notes">
            {SYSTEMS.map((item, i) => (
              <article
                key={item.system}
                className="cb-note"
                style={{ "--cb-k": i } as CSSProperties}
              >
                <div className="cb-note-top">
                  <span className="cb-note-owner">{item.owner}</span>
                  <span className="cb-note-badge">不替代</span>
                </div>
                <span className="cb-note-system">{item.system}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* 底部边界判断（U024）：第三拍收束 */}
      <aside className="cb-boundary">
        <span className="cb-boundary-tag">边界判断</span>
        <div className="cb-boundary-body">
          <p className="cb-boundary-text">
            各个主体原来怎么干活，<em className="cb-still">还是怎么干活</em>
          </p>
          <p className="cb-boundary-sub">各主体原有的业务方式不变</p>
        </div>
      </aside>
    </div>
  );
}
