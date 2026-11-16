import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002Chapter.css";

const stateByStep = ["four-lines-stated", "matching-rule-set"] as const;

/** S007–S010：四条角色台词，exact，逐字保留 */
const LINES = [
  { no: "一", text: "确认核心业务对象是谁", who: "对象" },
  { no: "二", text: "记录围绕这个对象发生了什么", who: "过程" },
  { no: "三", text: "说明这些数据本身的意思、来源与关联", who: "含义" },
  { no: "四", text: "规定数据库里的字段应该怎么定义", who: "结构" },
] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const ruleOn = step >= 1;

  return (
    <div className={`qk-scene scene-pad${ruleOn ? " is-rule" : ""}`} data-state={state}>
      <header className="qk-head">
        <h1 className="qk-headline">
          四个概念，<em>四个角色台词</em>
        </h1>
        <div className="qk-head-rule rule" />
      </header>

      <div className="qk-body">
        <div className="qk-bands">
          <span className="qk-rail" aria-hidden="true" />

          {LINES.map((line, index) => (
            <article
              key={line.no}
              className="qk-band"
              style={{ "--qk-i": index } as CSSProperties}
            >
              <span className="qk-band-tick" aria-hidden="true" />
              <span className="qk-band-no">{line.no}</span>
              <p className="qk-band-text">{line.text}</p>
              <span className="qk-band-role">{line.who}</span>
            </article>
          ))}
        </div>

        <aside className="qk-side">
          <p className="qk-side-kicker">对位规则</p>
          <p className="qk-side-hero">
            哪句话对得上，就该从哪个概念去理解这条数据
          </p>
          <div className="qk-side-rule rule" />
          <p className="qk-side-note">
            四句台词共用这条规则
            <br />
            不固定在某一句话上
          </p>
        </aside>
      </div>
    </div>
  );
}
