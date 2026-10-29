import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009Chapter.css";

/**
 * 09-value-directions · 价值方向（outline §9 · S-A009 · parallel-cards-with-takeaway）
 * mechanism: equal-weight-accumulation — 问题行先立，四张方向卡依次落位
 * 保持等权；环节推进条随后落位"治理/交易/分析推动数据走向价值"；末行
 * 判断最后出现"数据在手≠结论自动出现"。R012（价值方向与形成环节相互
 * 支撑）由四向卡与环节条的上下支撑排布承载。
 *
 * step → semantic state：four-directions-lined → enablers-driving →
 * effort-required。
 *
 * exact 义务：S050–S054 四个方向短语 + 环节句（治理/交易/分析…
 * 走向价值）逐字渲染。护栏 C011：价值方向不换算成金额、比例、企业名称
 * 或行业排名——演示只用"环节 → 方向"的支撑箭头，无数值。
 */
const stateByStep = ["four-directions-lined", "enablers-driving", "effort-required"] as const;

/** 四方向卡（exact S050-S053 短语逐字） */
const DIRECTIONS = [
  { no: "01", text: "促进产品创新" },
  { no: "02", text: "提升经营水平" },
  { no: "03", text: "提高生产运作效率" },
  { no: "04", text: "拓展新型商业模式" },
] as const;

/** 环节推进三项（exact S054 前段逐字） */
const ENABLERS = ["数据治理", "数据交易", "数据分析"] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const enablersOn = step >= 1;
  const effortOn = step >= 2;

  const rootCls = ["vd-scene", "scene-pad", enablersOn && "is-enablers", effortOn && "is-effort"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="vd-head">
        <h1 className="vd-headline">
          价值落在<em>哪些方向</em>？
        </h1>
        <div className="vd-head-rule rule" />
      </header>

      {/* 四张方向卡：等权依次落位 */}
      <div className="vd-cards">
        {DIRECTIONS.map((d, i) => (
          <section
            key={d.no}
            className="vd-card card"
            style={{ "--vd-i": i } as CSSProperties}
          >
            <span className="vd-card-no hero-num">{d.no}</span>
            <p className="vd-card-text">{d.text}</p>
          </section>
        ))}
      </div>

      {/* 环节推进条：三环节 → 一步步走向价值（S054 exact） */}
      <div className={`vd-enabler${enablersOn ? " is-on" : ""}`} aria-hidden={!enablersOn}>
        <p className="vd-enabler-ghost">环节支撑 · 待落位</p>
        <div className="vd-enabler-plate card">
          <div className="vd-enabler-chips">
            {ENABLERS.map((e, i) => (
              <span
                key={e}
                className="vd-enabler-chip"
                style={{ "--vd-j": i } as CSSProperties}
              >
                {e}
              </span>
            ))}
          </div>
          <span className="vd-enabler-arrow" aria-hidden="true">
            <svg viewBox="0 0 48 20" width="48" height="20">
              <path d="M2 10 H38" className="vd-arrow-line" />
              <path d="M34 3 L46 10 L34 17" className="vd-arrow-line" />
            </svg>
          </span>
          <p className="vd-enabler-line">正是推动数据<strong>一步步走向价值</strong>的过程</p>
        </div>
      </div>

      {/* 末行判断（拍 3，S055 reference） */}
      <div className={`vd-effort${effortOn ? " is-on" : ""}`} aria-hidden={!effortOn}>
        <p className="vd-effort-ghost">末行判断 · 待收束</p>
        <div className="vd-effort-plate card-glass">
          <span className="vd-effort-kicker">要记住</span>
          <p className="vd-effort-hero">
            数据在手 <span className="vd-neq">≠</span> 结论自动出现，
            价值要靠<strong>这些环节</strong>走出来
          </p>
        </div>
      </div>
    </div>
  );
}
