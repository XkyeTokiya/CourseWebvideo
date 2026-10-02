import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 01-opening-title · A001（开场问题页 · central-question）
 * step → semantic state 显式映射，末态兜底（outline S-A001）：
 * - title-established：主标题落位视觉中心，候选名单与选型问句
 *   在同一主区域上下分层、以弱化预览形式同屏，不抢焦点。
 */
const stateByStep = ["title-established"] as const;

type OpeningTitleState = (typeof stateByStep)[number];

/** 候选名单：指导 G001（E001）；标题页弱化预览，不展开结构（C001） */
const CANDIDATES = ["VAA", "Handle", "OID", "Ecode", "GS1"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state: OpeningTitleState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad ot-root" data-state={state}>
      <div className="ot-stage">
        <h1 className="ot-headline">
          <span className="ot-headline-main">GS1 与五类编码体系</span>
          <span className="ot-headline-ask">
            怎么选<span className="ot-ask-tick" aria-hidden="true" />
          </span>
        </h1>

        <div className="ot-candidates" aria-label="候选编码体系名单">
          {CANDIDATES.map((name, index) => (
            <div className="ot-candidate" key={name}>
              <span className="ot-candidate-no" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="ot-candidate-name">{name}</span>
              <span className="ot-candidate-role">候选</span>
            </div>
          ))}
        </div>

        <div className="ot-question">
          <span className="ot-question-mark" aria-hidden="true">
            问
          </span>
          <span className="ot-question-text">选型先看对象与业务边界</span>
        </div>
      </div>
    </div>
  );
}
