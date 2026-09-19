import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m002Image from "./assets/M002.png";

const stateByStep = [
  "field-conditions",
  "field-failure",
  "usability-judgment",
] as const;

const INSIGHT_ROWS = ["符合行业的普遍认识", "考虑标识对象的行业属性"] as const;

const FIELD_ROWS = [
  "结合企业的信息化建设水平",
  "结合实际应用现状，保证可稳定采集和使用",
] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad pf-root" data-state={state}>
      <header className="pf-header">
        <span className="pf-index" aria-hidden="true">
          3/5
        </span>
        <h1 className="pf-headline">第三项：实用性</h1>
      </header>

      <div className="pf-main">
        <figure className="pf-media">
          <img className="pf-media-img" src={m002Image} alt="行业现场情境占位图" />
          <figcaption className="pf-media-caption">
            情境图 · M002 · 占位图，正式素材待替换
          </figcaption>
        </figure>

        <div className="pf-rail">
          <div className="pf-tier">
            <span className="pf-tier-tag">行业条件</span>
            {INSIGHT_ROWS.map((text) => (
              <p className="pf-row" key={text}>
                {text}
              </p>
            ))}
          </div>
          <div className="pf-tier">
            <span className="pf-tier-tag pf-tier-tag-field">企业现场</span>
            {FIELD_ROWS.map((text) => (
              <p className="pf-row" key={text}>
                {text}
              </p>
            ))}
          </div>
          <p className="pf-usage">
            一个理论上很完整、现场却没法稳定采集和使用的编码，不会因为结构漂亮就算成功
          </p>
        </div>
      </div>

      <div className="pf-scrim">
        <p className="pf-scrim-text">
          规则最终是<span className="pf-scrim-em">给人用、给系统用的</span>
          <br />
          ——现场用不起来，设计得再精致也没有意义
        </p>
      </div>
    </div>
  );
}
