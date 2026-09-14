import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010CapabilityBoundary.css";

const states = [
  "non-auto-stated",
  "capability-defined",
  "duties-bounded",
] as const;

type CbState = (typeof states)[number];

const QUESTIONS = ["接口怎么建", "数据怎么管", "访问怎么控制", "流程怎么组织"];
const DUTIES = ["数据管理", "系统集成", "访问控制", "项目实施"];

export default function A010CapabilityBoundary({ step }: ChapterStepProps) {
  const state: CbState = states[step] ?? states[states.length - 1];
  const capabilityOn = state !== "non-auto-stated";
  const dutiesOn = state === "duties-bounded";

  return (
    <div className="cb-scene scene-pad">
      <h1 className="cb-title">基础能力，不是自动结果</h1>

      <div
        className={`cb-condition${capabilityOn ? " is-on" : ""}`}
        aria-hidden={!capabilityOn}
      >
        <p className="cb-condition-lead">基础能力</p>
        <p className="cb-condition-text">
          用<b>统一可识别的身份</b>和<b>解析关系</b>建立信息连接，
          <b>服务于全生命周期管理和产业链协同</b>
        </p>
      </div>

      <div className="cb-rows">
        <p className="cb-rows-kicker">两项“不自动”</p>
        <div className="cb-row">
          <i aria-hidden />
          <p>数据<b>不会自己变完整</b></p>
        </div>
        <div className="cb-row">
          <i aria-hidden />
          <p>企业内部系统<b>也不会自动互通</b></p>
        </div>
      </div>

      <div
        className={`cb-duties${dutiesOn ? " is-on" : ""}`}
        aria-hidden={!dutiesOn}
      >
        <p className="cb-duties-lead">接口、数据、访问控制与流程组织，各有专业责任范围</p>
        <div className="cb-columns">
          <ul className="cb-col">
            {QUESTIONS.map((item, i) => (
              <li key={item} style={{ "--cb-i": String(i) } as CSSProperties}>
                {item}
              </li>
            ))}
          </ul>
          <ul className="cb-col cb-col-duty">
            {DUTIES.map((item, i) => (
              <li key={item} style={{ "--cb-i": String(i) } as CSSProperties}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
