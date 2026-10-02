import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 11-four-step-verdict · A011（四步轨道页 · linear-steps-with-takeaway）
 * step → semantic state 显式映射，末态兜底（outline S-A011）：
 * - four-steps-mapped：标题区与四步轨道建立，四步按真实先后依次落位
 *   （先→再→然后→再确认），落位后保留已过步骤：第 4 步 active，前 3 步 past
 * - verdict-stated：四步轨道保持，收束判断区落位（R032 conclusion）
 *
 * 视觉主体：一条"选型检查轨"——四步沿水平轨道按真实先后顺序落位，
 * 全片唯一一次使用 active / past 区分（ordered-progression），判断区是轨道的收束批注。
 * 轨道采用行式结构（次序行 / 轨道行 / 名称行 / 序号行），保证节点严格落在轨道线上。
 */
const stateByStep = ["four-steps-mapped", "verdict-stated"] as const;

type A011State = (typeof stateByStep)[number];

const STEPS = [
  { order: "先", name: "确认对象" },
  { order: "再", name: "确认主要业务场景" },
  { order: "然后", name: "检查跨企业边界和内部细分" },
  { order: "再确认", name: "已有体系之间怎么映射" },
] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state: A011State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fv-root" data-state={state}>
      <header className="fv-header">
        <h1 className="fv-headline">五类体系怎么选，收成四步</h1>
      </header>

      <div className="fv-track" aria-label="选型四步轨道">
        <div className="fv-row fv-track-orders">
          {STEPS.map((s) => (
            <span className="fv-cell fv-order" key={s.name}>
              {s.order}
            </span>
          ))}
        </div>

        <div className="fv-row fv-track-rail">
          <svg className="fv-rail-svg" viewBox="0 0 1660 12" preserveAspectRatio="none" aria-hidden="true">
            <line className="fv-rail-line" x1="6" y1="6" x2="1654" y2="6" />
          </svg>
          {STEPS.map((s) => (
            <span className="fv-cell" key={s.name}>
              <span className="fv-dot" aria-hidden="true" />
            </span>
          ))}
        </div>

        <div className="fv-row fv-track-names">
          {STEPS.map((s) => (
            <span className="fv-cell fv-name" key={s.name}>
              {s.name}
            </span>
          ))}
        </div>

        <div className="fv-row fv-track-indexes">
          {STEPS.map((s, index) => (
            <span className="fv-cell fv-index" key={s.name}>
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      <div className="fv-verdict">
        <p className="fv-verdict-text">
          <span className="fv-verdict-lead">这四步走完，答案就清楚了</span>
          <span className="fv-verdict-key">
            选的从来不是一套万能编码，而是在明确的对象和业务边界里选出合适的体系，再把它们之间的关系安排好
          </span>
        </p>
      </div>
    </div>
  );
}
