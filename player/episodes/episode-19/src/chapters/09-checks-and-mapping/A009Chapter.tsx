import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 09-checks-and-mapping · A009（分栏核对页 · split-compare-with-thesis）
 * step → semantic state 显式映射，末态兜底（outline S-A009）：
 * - four-constraints-set：左栏核对区四项约束行依次落位
 * - criterion-applied：四项保持，评判条落位，四个对号逐笔画上
 * - reality-shown：转入右栏实践区，现实卡落位
 * - practice-stated：现实卡保持，做法卡落位
 * - constraint-background-noted：转入底部方向区，背景行落位（R028 context）
 * - direction-stated：背景行保持，方向行落位（R029 conclusion）
 * - misuse-boundary-stated：方向行保持，边界行落位
 *
 * 视觉主体：一页"核对记录单"——左栏四项约束行带对号框，右栏是
 * 现实与做法两联记录，底部方向区按"背景 → 方向 → 边界"逐层批注。
 */
const stateByStep = [
  "four-constraints-set",
  "criterion-applied",
  "reality-shown",
  "practice-stated",
  "constraint-background-noted",
  "direction-stated",
  "misuse-boundary-stated",
] as const;

type A009State = (typeof stateByStep)[number];

const CHECKS = ["对象", "主要业务", "跨组织复用", "内部系统延续"] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state: A009State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad cm-root" data-state={state}>
      <header className="cm-header">
        <h1 className="cm-headline">四项核对与兼容映射</h1>
        <p className="cm-lead">比的不是哪一套体系更先进，而是四项约束</p>
      </header>

      <div className="cm-main">
        <section className="cm-checks" aria-label="左栏四项核对">
          <p className="cm-checks-title">横向比较的四项约束</p>
          <ul className="cm-check-list">
            {CHECKS.map((label) => (
              <li className="cm-check-row" key={label}>
                <svg className="cm-check-mark" viewBox="0 0 40 40" aria-hidden="true">
                  <rect className="cm-check-box" x="3" y="3" width="34" height="34" />
                  <path className="cm-check-stroke" d="M10 21 L18 29 L31 12" />
                </svg>
                <span className="cm-check-label">{label}</span>
              </li>
            ))}
          </ul>
          <p className="cm-criterion">
            <span className="cm-criterion-key">四项都对得上</span>
            <span className="cm-criterion-note">这个候选才值得继续评估</span>
          </p>
        </section>

        <section className="cm-practice" aria-label="右栏实践区">
          <article className="cm-reality">
            <span className="cm-card-tag">现实</span>
            <p className="cm-reality-body">
              一件零部件很可能同时参与贸易、物流、制造和售后
            </p>
          </article>
          <article className="cm-approach">
            <span className="cm-card-tag">做法</span>
            <p className="cm-approach-body">
              <span className="cm-approach-key">
                不是让某一套编码把全部语义都背下来
              </span>
              <span className="cm-approach-note">
                把主身份、业务编码和映射关系分清楚，把映射和数据关联的责任安排好
              </span>
            </p>
          </article>
        </section>
      </div>

      <div className="cm-direction" aria-label="底部方向区">
        <p className="cm-direction-row cm-direction-background">
          <span className="cm-direction-tag cm-tag-warn">背景</span>
          <span className="cm-direction-text">
            多套体系之间兼容性不足，信息互联共享不容易实现，单靠任何一套，也还覆盖不了制造业的各个领域
          </span>
        </p>
        <p className="cm-direction-row cm-direction-thesis">
          <span className="cm-direction-tag cm-tag-key">方向</span>
          <span className="cm-direction-text">
            工业制造需要能兼容多套体系的编码方案——方向性判断，不是现成的新编码
          </span>
        </p>
        <p className="cm-direction-row cm-direction-boundary">
          <span className="cm-direction-tag cm-tag-note">边界</span>
          <span className="cm-direction-text">
            各家的示例不能拼成一种统一格式，GTIN 的结构也不能直接套到别的体系上
          </span>
        </p>
      </div>
    </div>
  );
}
