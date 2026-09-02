import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./StageGoal2035.css";

const states = [
  "stage-judgment-set",
  "goal-anchored",
  "direction-provenance-split",
  "direction-lands-on-site",
] as const;

type StageGoalState = (typeof states)[number];

const DIRECTION_CHIPS = ["智能化", "绿色化", "融合化"];

export default function StageGoal2035({ step }: ChapterStepProps) {
  const state: StageGoalState = states[step] ?? states[states.length - 1];
  const goalOn = state !== "stage-judgment-set";
  const landingOn =
    state === "direction-provenance-split" || state === "direction-lands-on-site";
  const landed = state === "direction-lands-on-site";

  return (
    <div className="sg-scene scene-pad">
      <h1 className="sg-thesis">
        长期方向最终要<em>进入工业现场</em>
      </h1>

      <div className="sg-cards">
        <section className="sg-card card" data-on="on">
          <div className="sg-card-body">
            <span className="sg-index hero-num">1</span>
            <p className="sg-card-kicker">阶段判断</p>
            <p className="sg-date">2026年6月5日</p>
            <p className="sg-card-line">国务院常务会议政策解读</p>
            <p className="sg-card-text">
              把推进新型工业化表述为<i>长期战略任务</i>
            </p>
            <p className="sg-card-em">工业发展处于由大变强的关键期</p>
          </div>
        </section>

        <section className="sg-card card" data-on={goalOn ? "on" : "waiting"}>
          <div className="sg-card-body">
            <span className="sg-index hero-num">2</span>
            <p className="sg-card-kicker">目标锚点</p>
            <p className="sg-year hero-num">2035</p>
            <p className="sg-card-line">基本实现新型工业化</p>
            <p className="sg-tag">目标年份 · 不是已经完成的状态</p>
          </div>
        </section>

        <section
          className="sg-card sg-card--landing card"
          data-on={landingOn ? "on" : "waiting"}
        >
          <div className="sg-card-body">
            <span className="sg-index hero-num">3</span>
            <p className="sg-card-kicker">方向落点 · 2026 表述</p>
            <div className="sg-chips">
              {DIRECTION_CHIPS.map((chip, i) => (
                <span
                  key={chip}
                  className="sg-chip"
                  style={{ "--sg-i": String(i) } as CSSProperties}
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className={`sg-land${landed ? " is-landed" : ""}`} aria-hidden={!landed}>
              这些方向必须落到<i>工业现场</i>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
