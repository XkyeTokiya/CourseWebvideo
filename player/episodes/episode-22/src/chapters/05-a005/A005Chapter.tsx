import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005Chapter.css";

const stateByStep = [
  "identity-vs-event",
  "third-role-separated",
  "role-over-location",
] as const;

/** S027–S029：同一台设备上的三类数据角色 */
const ROLES = [
  {
    id: "01",
    name: "设备身份",
    answer: "这台设备到底是谁",
    detail: "唯一编码与基础属性",
    verdict: "主数据",
    tone: "main",
  },
  {
    id: "02",
    name: "维修工单",
    answer: "这台设备发生了什么",
    detail: "围绕这台设备产生",
    verdict: "业务数据",
    tone: "biz",
  },
  {
    id: "03",
    name: "振动信号",
    answer: "那又是另一回事了",
    detail: null,
    verdict: "工业大数据",
    tone: "big",
  },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const thirdOn = step >= 1;
  const basisOn = step >= 2;

  const rootCls = [
    "rl-scene",
    "scene-pad",
    thirdOn && "is-third",
    basisOn && "is-basis",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="rl-head">
        <h1 className="rl-headline">
          同一台设备上的<em>数据角色</em>
        </h1>
        <div className="rl-head-rule rule" />
      </header>

      <div className="rl-cards">
        {ROLES.map((role, index) => {
          const pending = index === 2 && !thirdOn;
          return (
            <article
              key={role.name}
              className={[
                "rl-card",
                `rl-card--${role.tone}`,
                pending && "is-pending",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ "--rl-i": index } as CSSProperties}
            >
              {pending && (
                <span className="rl-card-hold" aria-hidden="true">
                  {role.id}
                </span>
              )}

              <div className="rl-card-top">
                <span className="rl-card-id">{role.id}</span>
                <span className="rl-card-verdict">{role.verdict}</span>
              </div>

              <div className="rl-card-core">
                <p className="rl-card-name">{role.name}</p>

                <div className="rl-card-sep" aria-hidden="true" />

                <p className={index === 2 ? "rl-card-q rl-card-apart" : "rl-card-q"}>
                  {role.answer}
                </p>
                {role.detail && <p className="rl-card-detail">{role.detail}</p>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="rl-basis">
        <span className="rl-basis-reserve" aria-hidden="true" />
        <div className="rl-basis-plate">
          <p className="rl-basis-kicker">分类依据</p>
          <p className="rl-basis-hero">
            三类数据可能都跑在同一个系统里
            <br />
            依据不是<em>存在哪里</em>，而是<em>扮演的角色</em>
          </p>
        </div>
      </div>

      <p className="rl-takeaway">
        同处一个系统，<em>并不等于</em>同一类数据
      </p>
    </div>
  );
}
