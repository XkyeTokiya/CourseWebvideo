import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007TwoCodeSystems.css";

/**
 * A007 · 两套体系的关系 —— packet A007 / recipe: split-compare-with-pivot
 *
 * 三拍持续对照场景（结构指纹 left | pivot | right）：
 *   0  trace-code-defined     建立标题与左栏（药品追溯码的定位）；判据条与右栏留虚位
 *   1  two-systems-related    中部判据条坐实亮出「不是同一套」，右栏补入相通的识别逻辑
 *   2  two-systems-related    保持两栏与判据条的稳定画面，作向下一页示例的口播过渡（构图不变）
 *
 * R012 由左右两栏的并列边界承载（同构等高的两张实体卡，对照不轮播、不轮流高亮）；
 * R013 由中部判据条位于两栏之间的位置承载（分隔两套体系，同时是相通逻辑的收束点，
 *       底部键点向两侧栏边搭接）。
 * 护栏 C007：不展开追溯码标准条款或监管要求；
 * 护栏 C008：不出现任何具体编码样例 —— 包装标签只留空白版面，无条码、无编码字符串。
 */
const stateByStep = [
  "trace-code-defined",
  "two-systems-related",
  "two-systems-related",
] as const;

type A007State = (typeof stateByStep)[number];

/* 左栏演示：三个销售包装单元在 viewBox 内的盒位 */
const UNIT_X = [18, 235, 452];

export default function A007TwoCodeSystems({ step }: ChapterStepProps) {
  const state: A007State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const related = state === "two-systems-related";

  return (
    <div className={`tc-scene scene-pad${related ? " is-related" : ""}`}>
      {/* ── headline slot · S025：两套编码体系的区别 ── */}
      <header className="tc-head">
        <h1 className="tc-title">两套编码体系的区别</h1>
        <hr className="tc-head-rule rule" />
      </header>

      <div className="tc-compare">
        {/* ── left slot · U019：药品追溯码（第 1 拍建立，之后持续保留） ── */}
        <section className="tc-col tc-col--drug">
          <p className="tc-col-tag">药品监管体系</p>
          <h2 className="tc-cap">药品追溯码</h2>
          <div className="tc-demo" aria-hidden="true">
            <svg
              className="tc-demo-svg"
              viewBox="0 0 680 330"
              preserveAspectRatio="xMidYMid meet"
            >
              <line className="tc-shelf" x1="14" y1="280" x2="666" y2="280" />
              {UNIT_X.map((x, i) => (
                <g key={x} className={`tc-unit tc-unit-${i}`}>
                  <rect className="tc-box" x={x} y="90" width="210" height="190" />
                  <rect className="tc-box-tag" x={x + 20} y="118" width="86" height="44" />
                </g>
              ))}
              <text className="tc-demo-cap" x="340" y="320" textAnchor="middle">
                销售包装单元
              </text>
            </svg>
          </div>
          <p className="tc-claim">
            药品追溯码用于<em>唯一标识</em>销售包装单元
          </p>
        </section>

        {/* ── pivot slot · U020：中部判据条（第 2 拍坐实亮判） ── */}
        <aside className="tc-pivot">
          {/* 竖排判据（S027 逐字一行连续）：右起「与工业互联网标识」→ 换行 →「不是同一套编码体系」 */}
          <p className="tc-pivot-line">
            与工业互联网标识
            <br />
            <em>不是同一套</em>编码体系
          </p>
          <svg className="tc-bond" viewBox="0 0 118 52" aria-hidden="true">
            <line className="tc-bond-line" x1="0" y1="26" x2="46" y2="26" />
            <line className="tc-bond-line" x1="72" y1="26" x2="118" y2="26" />
            <circle className="tc-bond-node" cx="59" cy="26" r="9" />
          </svg>
        </aside>

        {/* ── right slot · U021：相通的识别逻辑（第 2 拍补入） ── */}
        <section className="tc-col tc-col--shared">
          <p className="tc-col-tag">工业互联网</p>
          <h2 className="tc-cap">工业互联网标识</h2>
          <div className="tc-logic">
            <p className="tc-logic-cap">相通的识别逻辑</p>
            <div className="tc-logic-flow">
              <article className="tc-logic-bar tc-logic-bar--a">
                <span className="tc-logic-no hero-num">01</span>
                <p className="tc-logic-text">先认出具体对象</p>
              </article>
              <svg className="tc-logic-link" viewBox="0 0 36 34" aria-hidden="true">
                <line className="tc-logic-link-line" x1="18" y1="2" x2="18" y2="18" />
                <polyline className="tc-logic-link-arrow" points="8,15 18,30 28,15" />
              </svg>
              <article className="tc-logic-bar tc-logic-bar--b">
                <span className="tc-logic-no hero-num">02</span>
                <div className="tc-logic-body">
                  <p className="tc-logic-text">再关联相关信息</p>
                  <p className="tc-logic-note">可被查询 · 可被关联</p>
                </div>
              </article>
            </div>
          </div>
          <p className="tc-claim tc-claim--shared">
            <em>两者都</em>先识别对象，再关联信息
          </p>
        </section>
      </div>
    </div>
  );
}
