import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A011Chapter.css";

const stateByStep = [
  "master-value-stated",
  "metadata-dict-values",
  "clean-boundary-justified",
] as const;

/** S063–S065：三条价值带 */
const VALUES = [
  {
    id: "01",
    name: "主数据管理",
    points: ["一致性", "准确性", "可靠性"],
    line: "让不同业务系统围绕同一个核心对象协同工作",
  },
  {
    id: "02",
    name: "元数据管理",
    points: ["理解含义", "定位数据", "看清上下游"],
    line: "弄清数据的含义，看清数据从哪来、又要去哪里",
  },
  {
    id: "03",
    name: "数据字典",
    points: ["数据库的设计", "数据库的维护"],
    line: "给设计和维护提供具体依据",
  },
] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const secondOn = step >= 1;
  const closedOn = step >= 2;

  const rootCls = [
    "val-scene",
    "scene-pad",
    secondOn && "is-second",
    closedOn && "is-closed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="val-head">
        <h1 className="val-headline">
          边界清楚之后的<em>管理价值</em>
        </h1>
        <div className="val-head-rule rule" />
      </header>

      <div className="val-bands">
        {VALUES.map((value, index) => {
          const pending = index > 0 && !secondOn;
          return (
            <article
              key={value.id}
              className={[
                "val-band",
                `val-band--${index + 1}`,
                pending && "is-pending",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ "--val-i": index } as CSSProperties}
            >
              <div className="val-band-head">
                <span className="val-band-idx">{value.id}</span>
                <p className="val-band-name">{value.name}</p>
              </div>

              <div className="val-band-core">
                <ul className="val-points">
                  {value.points.map((point) => (
                    <li key={point} className="val-point">
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="val-line">{value.line}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="val-takeaway">
        <span className="val-takeaway-reserve" aria-hidden="true" />
        <p className="val-takeaway-plate">
          边界清楚了，后续工作
          <em>才不会从一口含混的口径出发</em>
        </p>
      </div>
    </div>
  );
}
