import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./OfficialDefinition.css";

const BANDS = [
  {
    no: "01",
    tag: "融合形成新承载",
    text: "新一代信息通信技术与制造业深度融合——形成新的基础设施、应用方式与产业协作关系。",
  },
  {
    no: "02",
    tag: "人、机、物全面互联",
    text: "人的判断、机器的状态、数据所表达的信息，在工业过程中彼此关联。",
  },
  {
    no: "03",
    tag: "覆盖更大范围",
    text: "制造与服务活动，延伸到产业链和价值链。",
  },
] as const;

const stateByStep = ["definition-assembled", "scope-extended"] as const;

export default function OfficialDefinitionChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const bandCount = state === "definition-assembled" ? 1 : 3;
  const sideOn = state === "scope-extended";

  return (
    <div className="od-scene scene-pad">
      <div className="od-body">
        <div className="od-bands">
          {BANDS.map((b, i) => (
            <div
              className="od-band"
              key={b.no}
              data-on={i < bandCount}
              style={{ "--od-i": String(i) } as CSSProperties}
            >
              <span className="od-band-no hero-num">{b.no}</span>
              <div className="od-band-body">
                <span className="od-band-tag">{b.tag}</span>
                <span className="od-band-text">{b.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="od-side" data-on={sideOn}>
          <span className="od-side-title">“人、机、物”</span>
          <span className="od-side-desc">
            不是几个孤立的名词——而是说人的判断、机器的状态和数据所表达的信息，能够在工业过程中彼此关联。
          </span>
        </div>
      </div>

      <div className="od-bottom" data-on={sideOn}>
        <span className="od-bottom-mark" />
        把制造与服务活动延伸到产业链和价值链更大的范围。
      </div>
    </div>
  );
}
