import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./CentralQuestion.css";

const stateByStep = [
  "premise-one-raised",
  "question-dominant",
] as const;

type State = (typeof stateByStep)[number];

const PREMISES = [
  {
    no: "01",
    name: "前提一",
    text: "四个体系共同参与，信息必须先被理解并转化为行动。",
  },
  {
    no: "02",
    name: "前提二",
    text: "行动还要产生新的生产信息，重新进入后续判断。",
  },
] as const;

const SYSTEMS = ["网络", "平台", "数据", "安全"] as const;

export default function CentralQuestionChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const full = idx >= 1;

  return (
    <div className={`cq-scene scene-pad${full ? " is-complete" : ""}`}>
      <div className="cq-center">
        <div className="cq-systems">
          {SYSTEMS.map((s, i) => (
            <span key={s} className="cq-system" style={{ "--cq-i": i } as CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <p className="cq-q">
          <span className="cq-q-line">
            怎样让<em className="cq-em cq-em-action">信息变成行动</em>，
          </span>
          <span className="cq-q-line" data-on={full}>
            再让<em className="cq-em cq-em-return">新信息回流</em>？
          </span>
        </p>
      </div>

      <div className="cq-note" data-on={full}>
        <span className="cq-note-rule" />
        <span className="cq-note-text">理解这件事，可以沿着一次真实的生产变化来观察。</span>
      </div>

      <div className="cq-premises">
        {PREMISES.map((p, i) => {
          const on = idx >= i;
          return (
            <article
              key={p.no}
              className={`card cq-tag${on ? " is-on" : " is-ghost"}`}
              style={{ "--cq-i": i } as CSSProperties}
            >
              <span className="cq-slot">前提 · {p.no}</span>
              <div className="cq-tag-body">
                <header className="cq-tag-head">
                  <span className="hero-num cq-tag-no">{p.no}</span>
                  <span className="cq-tag-name">{p.name}</span>
                </header>
                <p className="cq-tag-text">{p.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
