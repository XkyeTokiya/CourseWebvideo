import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./LookupChanged.css";

/* A008 · split-compare-with-thesis —— S-A008 左右两栏前后对照 + bottom thesis 收束条
   mechanism: compare-and-reweight —— 两栏空间持续，视觉权重随口播从左栏移向右栏；
   两栏间不加中转状态、断桥或回流箭头；R017/R018 用句内先后与栏内第二层结果
   表达，不跨栏画线。可见标题：none（outline §8 省略授权）——页面不渲染标题区，
   V019 判断语义由 bottom thesis 收束条唯一承载，不设第二处判断。
   semantic states（outline §8 beat 表）：
   step0 before-column-set      两栏对照框架 + 左栏改造前内容（V017），右栏虚线预留
   step1 after-column-complete  左栏保持并弱化、权重移右；右栏补齐身份锚点与两层结果
                                （R017 关联回到记录；R018 服务后续质量，不伪装成统计成效）
   step2 thesis-stated          两栏保持；bottom thesis 收束条出现（R019） */

const stateByStep = [
  "before-column-set",
  "after-column-complete",
  "thesis-stated",
] as const;

type LookupState = (typeof stateByStep)[number];

/* 左栏分散查找演示：三大业务系统各自持有记录，探查环依次扫过（分散），
   再快速复核一遍（反复确认）——均复用本集已建立的系统词汇，不新增事实 */
const SYSTEM_PLATES = [
  { abbr: "ERP", x: "3%", y: "8%", rot: -2 },
  { abbr: "MES", x: "46%", y: "42%", rot: 1.6 },
  { abbr: "WMS", x: "9%", y: "74%", rot: -1.2 },
] as const;

export default function LookupChanged({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const afterComplete = state !== "before-column-set";
  const thesisOn = state === "thesis-stated";

  return (
    <div className="lk-scene scene-pad" data-state={state}>
      <div className="lk-cols">
        <section
          className={`lk-col lk-col-before${afterComplete ? " is-weak" : ""}`}
        >
          <header className="lk-col-head">
            <span className="lk-col-tag">改造前</span>
            <h2 className="lk-col-label">按系统分散查找</h2>
          </header>
          <div className="lk-col-rule rule" />
          <p className="lk-col-body">
            数据本来就存在，但需要在各业务系统中分别寻找和反复确认。
          </p>
          <div className="lk-scatter" aria-hidden="true">
            {SYSTEM_PLATES.map((p, i) => (
              <span
                key={p.abbr}
                className="lk-plate"
                style={
                  {
                    "--lk-x": p.x,
                    "--lk-y": p.y,
                    "--lk-rot": `${p.rot}deg`,
                    "--lk-i": String(i),
                  } as CSSProperties
                }
              >
                {p.abbr}
              </span>
            ))}
          </div>
        </section>

        <section className="lk-col lk-col-after">
          {afterComplete ? (
            <>
              <header className="lk-col-head">
                <span className="lk-col-tag">改造后</span>
                <h2 className="lk-col-label">围绕同一发动机追溯</h2>
              </header>
              <div className="lk-col-rule rule" />
              <div className="lk-anchor">
                <span className="lk-anchor-chip">发动机身份</span>
                <p className="lk-anchor-name">同一台发动机</p>
              </div>
              <div className="lk-results">
                <article className="lk-result lk-result-1">
                  <span className="lk-result-index hero-num">01</span>
                  <p className="lk-result-text">
                    售后问题带着发动机身份回到生产和质量记录
                  </p>
                </article>
                <article className="lk-result lk-result-2">
                  <span className="lk-result-index hero-num">02</span>
                  <p className="lk-result-text">生产侧改进服务后续产品质量</p>
                </article>
              </div>
            </>
          ) : (
            <div className="lk-reserved" aria-hidden="true" />
          )}
        </section>
      </div>

      <div
        className={`lk-thesis${thesisOn ? " is-on" : ""}`}
        aria-hidden={!thesisOn}
      >
        <span className="lk-thesis-mark" aria-hidden="true" />
        <p className="lk-thesis-text">
          统一标识<em className="lk-lim">只负责</em>串联记录关系，数据能否产生价值仍取决于<strong className="lk-val">治理、分析和业务协同</strong>。
        </p>
      </div>
    </div>
  );
}
