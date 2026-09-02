import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./PhysicalDigitalPivot.css";

const stateByStep = [
  "physical-side-up",
  "digital-side-up",
  "pivot-criterion-set",
] as const;

type State = (typeof stateByStep)[number];

const OBJECTS = ["设备资产", "生产系统", "管理系统", "供应链环节"] as const;
const CAPABILITIES = ["描述", "分析", "决策"] as const;

export default function PhysicalDigitalPivotChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const rightOn = idx >= 1;
  const pivotOn = idx >= 2;

  return (
    <div className={`pd-scene scene-pad${pivotOn ? " is-settled" : ""}`}>
      <header className="pd-title">
        <span className="pd-title-mark" />
        <h1 className="pd-title-text">
          IT 与 OT 融合，先理解为信息管理能力与现场运行能力<em>不再各自孤立</em>
        </h1>
      </header>

      <div className="pd-main">
        <section className={`card pd-col${idx >= 0 ? " is-on" : " is-ghost"}`}>
          <span className="pd-slot">对照栏 · 左</span>
          <div className="pd-col-body">
            <header className="pd-col-head">
              <span className="pd-col-mark" />
              <span className="pd-col-name">生产现场</span>
            </header>
            <div className="pd-rows">
              {OBJECTS.map((o, i) => (
                <div key={o} className="pd-row" style={{ "--pd-i": i } as CSSProperties}>
                  <span className="pd-row-dot" />
                  <span className="pd-row-text">{o}</span>
                </div>
              ))}
            </div>
            <footer className="pd-col-foot">
              <span className="pd-foot-label">持续提供</span>
              <span className="pd-foot-tag">运行状态</span>
              <span className="pd-foot-tag">业务活动</span>
            </footer>
          </div>
        </section>

        <div className={`pd-pivot${pivotOn ? " is-on" : " is-ghost"}`}>
          <span className="pd-slot">共同工作判据</span>
          <div className="pd-pivot-body">
            <span className="pd-pivot-kicker">IT · OT</span>
            <span className="pd-pivot-text">
              是否
              <br />
              共同工作
            </span>
          </div>
        </div>

        <section className={`card pd-col${rightOn ? " is-on" : " is-ghost"}`}>
          <span className="pd-slot">对照栏 · 右</span>
          <div className="pd-col-body">
            <header className="pd-col-head">
              <span className="pd-col-mark" />
              <span className="pd-col-name">数字空间</span>
            </header>
            <p className="pd-col-intro" data-on={rightOn}>
              把进入的信息组织起来
            </p>
            <div className="pd-rows">
              {CAPABILITIES.map((c, i) => (
                <div key={c} className="pd-row" style={{ "--pd-i": i } as CSSProperties}>
                  <span className="pd-row-dot" />
                  <span className="pd-row-text">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
