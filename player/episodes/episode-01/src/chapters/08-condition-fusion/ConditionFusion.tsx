import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ConditionFusion.css";

const stateByStep = [
  "condition-only",
  "fusion-keyed",
  "goal-anchored",
] as const;

export default function ConditionFusionChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const keyed = state !== "condition-only";
  const anchored = state === "goal-anchored";

  return (
    <div className="cf-scene scene-pad">
      <div className="cf-row">
        <div className="cf-panel" data-on={true}>
          <span className="cf-panel-tag">条件</span>
          <span className="cf-panel-title">通信技术就位</span>
          <span className="cf-panel-desc">
            新一代信息通信技术提供连接与处理信息的可能——但技术本身，并不会自动产生工业互联网。
          </span>
        </div>

        <div className="cf-panel is-key" data-on={keyed}>
          <span className="cf-panel-tag">关键</span>
          <span className="cf-panel-title">深度融合</span>
          <span className="cf-panel-desc">
            信息技术要与工业知识、工业设备、工业流程深度融合。
          </span>
        </div>

        <div className="cf-panel" data-on={anchored}>
          <span className="cf-panel-tag">目标</span>
          <span className="cf-panel-title">服务工业目标</span>
          <span className="cf-panel-desc">
            面对真实的生产过程，服务生产、运维、协同和优化。
          </span>
        </div>
      </div>

      <div className="cf-bottom" data-strong={anchored}>
        <span className="cf-bottom-mark" />
        增加一条通信线路只是开始——能不能让信息进入正确的工作关系，才决定连接有没有实际意义。
      </div>
    </div>
  );
}
