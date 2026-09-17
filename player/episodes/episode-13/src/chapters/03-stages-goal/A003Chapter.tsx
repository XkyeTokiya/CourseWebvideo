import { Fragment } from "react";
import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "pipeline-to-goals",
  "meaning-clarified",
] as const;

const STAGES = [
  { no: "01", name: "采集" },
  { no: "02", name: "整合" },
  { no: "03", name: "分析" },
  { no: "04", name: "应用" },
] as const;

const GOALS = [
  "提高效率",
  "降低成本",
  "改善质量",
  "为新的业务模式提供条件",
] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad sg-root" data-state={state}>
      <header className="sg-head">
        <h1 className="sg-headline">数据共享的环节与目标</h1>
        <hr className="rule sg-head-rule" />
      </header>

      <section className="sg-condition" aria-label="数据共享贯穿的环节">
        {STAGES.map((stage, i) => (
          <Fragment key={stage.no}>
            <div className="sg-stage">
              <span className="sg-stage-no">{stage.no}</span>
              <span className="sg-stage-name">{stage.name}</span>
            </div>
            {i < STAGES.length - 1 ? (
              <span className="sg-link" data-link={i + 1} aria-hidden="true" />
            ) : null}
          </Fragment>
        ))}
      </section>

      <section className="sg-key">
        <div className="sg-key-ghost" aria-hidden="true">
          <span className="sg-key-ghost-arrow">→</span>
          <span className="sg-key-ghost-label">环节服务于目标</span>
        </div>

        <div className="sg-key-body">
          <div className="sg-not">
            <span className="sg-key-tag sg-tag-not">不是</span>
            <p className="sg-not-text">把数据从一套系统搬到另一套系统</p>
            <div className="sg-move" aria-hidden="true">
              <span className="sg-move-box">一套系统</span>
              <span className="sg-move-track">
                <span className="sg-move-chip" />
              </span>
              <span className="sg-move-box">另一套系统</span>
              <span className="sg-move-strike" />
            </div>
          </div>

          <div className="sg-key-divider" aria-hidden="true" />

          <div className="sg-but">
            <span className="sg-key-tag sg-tag-but">而是</span>
            <p className="sg-but-lead">让生产、研发和供应链等环节，</p>
            <p className="sg-but-text">
              拿到能<mark className="sg-lit">识别</mark>、
              <mark className="sg-lit">理解</mark>并
              <mark className="sg-lit">直接使用</mark>的数据
            </p>
          </div>
        </div>
      </section>

      <section className="sg-goal" aria-label="共享的目标">
        {GOALS.map((goal) => (
          <div className="sg-goal-cell" key={goal}>
            {goal}
          </div>
        ))}
      </section>
    </div>
  );
}
