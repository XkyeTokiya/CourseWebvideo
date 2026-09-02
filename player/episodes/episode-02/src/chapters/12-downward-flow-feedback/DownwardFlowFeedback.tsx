import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DownwardFlowFeedback.css";

const stateByStep = [
  "judgment-directed-down",
  "action-landed",
  "new-info-formed",
  "re-observed",
] as const;

type State = (typeof stateByStep)[number];

const STEPS = [
  {
    no: "01",
    name: "判断下行",
    desc: "数字空间中的判断转化为四类行动。",
    chips: ["调度", "协同", "服务", "控制"],
  },
  {
    no: "02",
    name: "行动落地",
    desc: "行动真正作用于生产过程，并改变设备或业务运行状态。",
  },
  {
    no: "03",
    name: "形成新信息",
    desc: "行动后的新状态产生新的生产与业务信息。",
  },
  {
    no: "04",
    name: "再次上行",
    desc: "新信息进入下一次观察和比较，成为修正判断的真实结果。",
  },
] as const;

export default function DownwardFlowFeedbackChapter({ step }: ChapterStepProps) {
  /* accent 帧：全集主机制判断，独立全屏强调 */
  if (step >= 4) {
    return (
      <div className="df-accent scene-pad">
        <span className="df-accent-kicker">全集主机制</span>
        <div className="df-accent-chips">
          <span className="df-accent-chip df-chip-up">信息上行</span>
          <span className="df-accent-chip df-chip-down">决策下行</span>
          <span className="df-accent-chip df-chip-up">结果再次反馈</span>
        </div>
        <p className="df-accent-line">
          正是持续优化所需要的<em>往复过程</em>。
        </p>
      </div>
    );
  }

  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);

  return (
    <div className="df-scene scene-pad">
      <header className="df-title">
        <span className="df-title-mark" />
        <h1 className="df-title-text">
          判断作用于生产，新状态再次形成信息，<em>持续优化才有依据</em>
        </h1>
      </header>

      <div className="df-phases" aria-hidden="true">
        <span className="df-phase df-phase-down">决策下行</span>
        <span className="df-phase df-phase-up">再次上行</span>
      </div>

      <div className="df-track">
        {STEPS.map((s, i) => {
          const lit = idx >= i;
          const active = idx === i;
          const past = lit && !active;
          return (
            <div className="df-step-slot" key={s.no}>
              {i > 0 && <span className="df-chevron" data-on={lit} aria-hidden="true" />}
              <article
                className={`card df-step${lit ? " is-lit" : " is-ghost"}${
                  active ? " is-active" : ""
                }${past ? " is-past" : ""}${i === 3 ? " df-terminal" : ""}`}
                style={{ "--df-i": i } as CSSProperties}
              >
                <span className="df-slot">步骤 · {s.no}</span>
                <div className="df-step-body">
                  <header className="df-step-head">
                    <span className="hero-num df-step-no">{s.no}</span>
                    <span className="df-step-name">{s.name}</span>
                  </header>
                  <p className="df-step-desc">{s.desc}</p>
                  {i === 0 && (
                    <div className="df-chips">
                      {s.chips.map((chip, j) => (
                        <span key={chip} className="df-chip" style={{ "--df-j": j } as CSSProperties}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
