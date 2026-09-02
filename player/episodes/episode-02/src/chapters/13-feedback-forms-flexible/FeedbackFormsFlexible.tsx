import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FeedbackFormsFlexible.css";

const stateByStep = [
  "thesis-and-scheduling-up",
  "four-forms-equal",
  "mutual-feedback-settled",
] as const;

type State = (typeof stateByStep)[number];

const FORMS = [
  {
    no: "01",
    name: "调度安排",
    desc: "用人员、设备或任务安排把判断落实到生产。",
  },
  {
    no: "02",
    name: "跨环节协同",
    desc: "让不同岗位或业务环节围绕同一判断配合。",
  },
  {
    no: "03",
    name: "服务响应",
    desc: "把判断转化为面向产品、客户或运行的服务行动。",
  },
  {
    no: "04",
    name: "现场控制",
    desc: "可以直接作用于设备，但只是多种回落形式之一。",
  },
] as const;

export default function FeedbackFormsFlexibleChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const settled = idx >= 2;

  return (
    <div className={`ff-scene scene-pad${settled ? " is-settled" : ""}`}>
      <header className="ff-title">
        <span className="ff-title-mark" />
        <h1 className="ff-title-text">
          数据回到生产，<em>并不等于每个场景都必须全自动控制</em>
        </h1>
      </header>

      <div className="ff-grid">
        {FORMS.map((f, i) => {
          /* 本章偏离口播切分（Checkpoint 已授权）：step1=卡①②、step2=卡③④ */
          const on = idx >= Math.floor(i / 2);
          return (
            <article
              key={f.no}
              className={`card ff-card${on ? " is-on" : " is-ghost"}`}
              style={{ "--ff-i": i, "--ff-p": i % 2 } as CSSProperties}
            >
              <span className="ff-slot">回落形式 · {f.no}</span>
              <div className="ff-card-body">
                <header className="ff-card-head">
                  <span className="ff-drop" aria-hidden="true" />
                  <span className="hero-num ff-card-no">{f.no}</span>
                  <span className="ff-card-name">{f.name}</span>
                </header>
                <p className="ff-card-desc">{f.desc}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className={`ff-judgment${settled ? " is-on" : ""}`}>
        <span className="ff-judgment-slot">共同判断</span>
        <div className="ff-judgment-body">
          <span className="ff-judgment-mark" />
          <span className="ff-judgment-text">
            关键是判断作用于生产，变化能够回到信息系统
          </span>
          <span className="ff-judgment-tag">IT · OT 相互反馈</span>
        </div>
      </div>
    </div>
  );
}
