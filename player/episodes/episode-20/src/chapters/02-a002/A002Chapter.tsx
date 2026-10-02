import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 02-a002 · 界定对象与主问题页（outline §2 · S-A002 · condition-key-goal）
 * 三槽位竖向递进 + 左侧「第一步」窄轨；无媒体页，视觉演示由条件带内的
 * 记录汇聚 SVG 与主问题卡的升格承载。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - scope-defined：条件带先后对照成立（字符谁都会造 → 指向同一个对象），
 *   「第一步」标签点亮并挂出「对象 / 业务边界」两短语（A002 · step 1）
 * - question-formed：主问题卡升为中心焦点，「三能短句」与「经得起行业
 *   规范审查」两张目标卡落在问题卡下方两侧（A002 · step 2）
 * R003 由条件带两行的先后对照承载；R004 由关键卡与目标卡的相邻次序承载。
 * exact S010「能区分、能读取、能扩展」自第 2 拍起在左目标卡逐字完整可见。
 * 护栏 C003：全页不出现具体编码示例、字段值或注册结果；
 * 护栏 C004：主问题不扩展为接口、注册或工具诉求。
 */
const stateByStep = [
  "scope-defined",
  "question-formed",
] as const;

type A002State = (typeof stateByStep)[number];

export default function A002Chapter({ step }: ChapterStepProps) {
  const state: A002State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad ckg-root" data-state={state}>
      <header className="ckg-head">
        <span className="ckg-head-tick" aria-hidden="true" />
        <h1 className="ckg-headline">第一步：界定对象</h1>
        <span className="ckg-head-rule" aria-hidden="true" />
      </header>

      <div className="ckg-body">
        <aside className="ckg-rail" aria-label="第一步标记与界定范围">
          <span className="ckg-rail-num" aria-hidden="true">
            01
          </span>
          <span className="ckg-rail-tag">第一步</span>
          <span className="ckg-slab ckg-slab-object">对象</span>
          <span className="ckg-slab ckg-slab-boundary">业务边界</span>
        </aside>

        <div className="ckg-flow">
          <section className="ckg-cond" aria-label="难点条件">
            <div className="ckg-cond-rowA">
              <span className="ckg-cond-mark">难不在</span>
              <p className="ckg-cond-textA">再编一串字符 —— 字符谁都会造</p>
            </div>
            <hr className="rule ckg-cond-sep" />
            <div className="ckg-cond-rowB">
              <span className="ckg-cond-mark ckg-cond-markHard">难在于</span>
              <p className="ckg-cond-textB">
                让不同环节的记录，始终指向<b>同一个对象</b>
              </p>
              <svg
                className="ckg-cv"
                viewBox="0 0 270 96"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <g className="ckg-cv-sources">
                  <rect className="ckg-cv-src" x="16" y="12" width="12" height="12" />
                  <rect className="ckg-cv-src" x="16" y="42" width="12" height="12" />
                  <rect className="ckg-cv-src" x="16" y="72" width="12" height="12" />
                </g>
                <path
                  className="ckg-cv-path"
                  d="M 30 18 C 92 18, 124 44, 184 46"
                  pathLength="1"
                />
                <path
                  className="ckg-cv-path"
                  d="M 30 48 C 100 48, 130 48, 184 48"
                  pathLength="1"
                />
                <path
                  className="ckg-cv-path"
                  d="M 30 78 C 92 78, 124 52, 184 50"
                  pathLength="1"
                />
                <rect
                  className="ckg-cv-target"
                  x="184"
                  y="32"
                  width="76"
                  height="32"
                  rx="2"
                />
                <text className="ckg-cv-label" x="222" y="52.5" textAnchor="middle">
                  同一个对象
                </text>
              </svg>
            </div>
          </section>

          <section className="ckg-question" aria-label="本集要解决的问题">
            <p className="ckg-question-kicker">本集要解决的问题</p>
            <p className="ckg-question-line">
              一套编码规则，该怎样<em>从前缀到后缀</em>，搭出来？
            </p>
          </section>

          <div className="ckg-goals" aria-label="规则要过的目标">
            <div className="ckg-goal ckg-goal-powers">
              <span className="ckg-goal-kicker">一套规则</span>
              <p className="ckg-goal-line">能区分、能读取、能扩展</p>
            </div>
            <div className="ckg-goal ckg-goal-audit">
              <span className="ckg-goal-kicker">同时还要</span>
              <p className="ckg-goal-line">经得起行业规范审查</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
