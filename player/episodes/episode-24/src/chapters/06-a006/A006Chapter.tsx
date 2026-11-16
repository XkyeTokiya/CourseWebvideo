import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006Chapter.css";

const states = [
  "anchor-placed",
  "correspondence-maintained",
  "context-continuous",
  "records-traceable",
  "identity-linked",
  "exchange-based",
] as const;

const RECORDS = ["生产记录", "检测结果", "零部件批次"] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const recordsOn = step >= 1;
  const continuityOn = step >= 2;
  const layer1On = step >= 3;
  const layer2On = step >= 4;
  const goalOn = step >= 5;

  return (
    <div
      className={`a6-scene scene-pad${recordsOn ? " is-records" : ""}${
        continuityOn ? " is-continuity" : ""
      }${layer1On ? " is-layer1" : ""}${layer2On ? " is-layer2" : ""}${
        goalOn ? " is-goal" : ""
      }`}
      data-state={state}
    >
      <header className="a6-head">
        <p className="a6-kicker">关联锚点 · 两层能力</p>
        <h1 className="a6-title">
          围绕<em>同一身份</em>关联记录
        </h1>
      </header>

      <section className="a6-cond card" aria-label="关联锚点与对应关系">
        <div className="a6-cond-top">
          <p className="a6-cap">条件 · 关联锚点</p>
          <div className="a6-anchor">
            <span className="a6-anchor-glyph" aria-hidden="true" />
            <span className="a6-anchor-name">同一对象身份</span>
          </div>
          <span className="a6-tie" aria-hidden="true" />
          <div className="a6-records">
            {RECORDS.map((r, i) => (
              <span
                key={r}
                className="a6-record"
                style={{ "--a6-i": String(i) } as CSSProperties}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="a6-collapsible a6-notes-wrap">
          <div className="a6-collapsible-clip">
            <p className="a6-note">各环节建立并维护与同一对象的对应关系</p>
            <p className="a6-note-sub">不必只靠名称相似或人工经验拼接</p>
          </div>
        </div>

        <div className="a6-collapsible a6-cont-wrap">
          <div className="a6-collapsible-clip">
            <p className="a6-continuity">
              业务上下文才有条件<strong>保持连续</strong>
            </p>
          </div>
        </div>
      </section>

      <div className="a6-layers">
        <div className={`a6-layer${layer1On ? " is-on" : ""}`}>
          <span className="a6-idx">01</span>
          <span className="a6-layer-ghost" aria-hidden="true">
            待落位
          </span>
          <div className="a6-layer-body">
            <span className="a6-layer-cap">第一层</span>
            <span className="a6-layer-text">
              能查到：从某个对象出发，能找到跟它相关的记录
            </span>
          </div>
        </div>

        <div className={`a6-layer${layer2On ? " is-on" : ""}`}>
          <span className="a6-idx">02</span>
          <span className="a6-layer-ghost" aria-hidden="true">
            待落位
          </span>
          <div className="a6-layer-body">
            <span className="a6-layer-cap">再往上</span>
            <span className="a6-layer-text">
              能连上：不同系统不必把名称写得一模一样，也能围绕同一个身份建立关系
            </span>
          </div>
        </div>
      </div>

      <footer className={`a6-goal${goalOn ? " is-on" : ""}`}>
        <p className="a6-goal-slot" aria-hidden="true">
          目标 · 待落位
        </p>
        <div className="a6-goal-plate card">
          <span className="a6-goal-cap">有了这两层</span>
          <span className="a6-goal-text">
            跨环节的数据交换和复用，才有了基础
          </span>
        </div>
      </footer>
    </div>
  );
}
