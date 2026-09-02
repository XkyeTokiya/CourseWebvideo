import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./BroaderGoalDomain.css";

const states = ["goal-band-set", "task-band-complete"] as const;

type BroaderGoalState = (typeof states)[number];

const TASK_CHIPS = ["产业结构", "科技创新", "绿色发展", "制度", "人才"];

export default function BroaderGoalDomain({ step }: ChapterStepProps) {
  const state: BroaderGoalState = states[step] ?? states[states.length - 1];
  const tasksOn = state === "task-band-complete";

  return (
    <div className="bd-scene scene-pad">
      <h1 className="bd-thesis">新型工业化不只处理工业互联网覆盖的问题</h1>

      <div className="bd-main">
        <div className="bd-bands">
          <section className="bd-band bd-band--goal" data-on="on">
            <div className="bd-band-body">
              <p className="bd-band-kicker">整体目标</p>
              <p className="bd-band-text">
                新型工业化是<em>更广泛的国家工业发展目标</em>
              </p>
            </div>
          </section>

          <section
            className="bd-band"
            data-on={tasksOn ? "on" : "waiting"}
          >
            <div className="bd-band-body">
              <p className="bd-band-kicker">涵盖任务</p>
              <p className="bd-band-text">
                产业结构、科技创新、绿色发展、制度和人才等任务
              </p>
            </div>
          </section>

          <p className={`bd-boundary${tasksOn ? " is-on" : ""}`} aria-hidden={!tasksOn}>
            工业互联网只是这一目标域中的<i>支撑域</i>
          </p>
        </div>

        <div className="bd-rail">
          <p className="bd-rail-lead">涵盖任务 · 五类</p>
          {TASK_CHIPS.map((chip, i) => (
            <article
              key={chip}
              className="bd-task"
              data-on={tasksOn ? "on" : "waiting"}
              style={{ "--bd-i": String(i) } as CSSProperties}
            >
              <span className="bd-task-index hero-num">0{i + 1}</span>
              <span className="bd-task-name">{chip}</span>
            </article>
          ))}
        </div>
      </div>

      <div className={`bd-take${tasksOn ? " is-on" : ""}`} aria-hidden={!tasksOn}>
        <p className="bd-take-kicker">包含关系</p>
        <p className="bd-take-hero">
          更广的目标域，涵盖<em>五类任务</em>
        </p>
      </div>
    </div>
  );
}
