import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "chain-established",
  "enterprise-positioned",
  "position-assigned",
] as const;

type A003State = (typeof stateByStep)[number];

/** 分配链条：上下层级职责行，自上而下阅读顺序承载分配方向（R003 载体，不画跨级箭头） */
const LEVELS = [
  { index: "01", name: "治理层", action: "分配一级前缀的使用权" },
  { index: "02", name: "各国管理机构", action: "接手一级前缀，再往下分配子前缀" },
  { index: "03", name: "子前缀", action: "由管理机构再往下分配" },
] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state: A003State = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad ge-root" data-state={state}>
      <header className="ge-header">
        <h1 className="ge-headline">一级前缀是谁分配的</h1>
        <span className="ge-header-bar" aria-hidden="true" />
      </header>

      <div className="ge-condition">
        <span className="ge-condition-mark" aria-hidden="true" />
        <p className="ge-condition-lead">前缀是这套体系的起点</p>
        <span className="ge-condition-sep" aria-hidden="true" />
        <p className="ge-condition-sub">一级前缀的使用权不是随便写的</p>
      </div>

      <div className="ge-main">
        <div className="ge-rows">
          <span className="ge-rail" aria-hidden="true" />
          {LEVELS.map((level) => (
            <section className="ge-row" key={level.index}>
              <div className="ge-row-head">
                <span className="ge-row-index">{level.index}</span>
                <h2 className="ge-row-name">{level.name}</h2>
              </div>
              <p className="ge-row-action">{level.action}</p>
            </section>
          ))}
        </div>

        <div className="ge-columns">
          <section className="ge-duty">
            <p className="ge-col-head">职责落点</p>
            <div className="ge-landing">
              <p className="ge-landing-name">企业或组织</p>
              <p className="ge-landing-text">拿到属于自己的前缀之后，才在它下面继续区分对象</p>
              <div className="ge-landing-scheme" aria-hidden="true">
                <span className="ge-scheme-bar">前缀</span>
                <span className="ge-scheme-tick" />
                <span className="ge-scheme-tick" />
                <span className="ge-scheme-tick" />
                <span className="ge-scheme-object" />
                <span className="ge-scheme-object" />
                <span className="ge-scheme-object" />
              </div>
              <span className="ge-scheme-tag">示意</span>
            </div>
          </section>

          <section className="ge-boundary">
            <p className="ge-col-head">边界</p>
            <div className="ge-judgment">
              <p className="ge-judgment-not">
                前缀不是企业<span className="ge-not-pick">自己挑</span>的字符串
              </p>
              <p className="ge-judgment-but">
                而是分级管理体系里<span className="ge-assigned">被安排到的位置</span>
              </p>
            </div>
            <div className="ge-ladder" aria-hidden="true">
              <span className="ge-ladder-step ge-ladder-step-1" />
              <span className="ge-ladder-step ge-ladder-step-2" />
              <span className="ge-ladder-step ge-ladder-step-3" />
              <span className="ge-ladder-step ge-ladder-step-4" />
              <span className="ge-ladder-marker">位置</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
