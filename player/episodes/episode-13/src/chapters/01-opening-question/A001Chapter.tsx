import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m001Image from "./assets/M001.png";

const stateByStep = [
  "factory-scene-set",
  "boundary-blocked",
  "question-raised",
] as const;

const LANES = [
  { no: "01", label: "生产计划", system: "软件系统 A" },
  { no: "02", label: "设计文档", system: "软件系统 B" },
  { no: "03", label: "客户信息", system: "软件系统 C" },
  { no: "04", label: "物料采购", system: "软件系统 D" },
] as const;

const CONFLICTS = ["名称对不上", "格式不一致", "接口不兼容"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad aq-root" data-state={state}>
      <header className="aq-header">
        <span className="aq-heading-mark" aria-hidden="true" />
        <h1 className="aq-headline">数据已经存在，为什么共享不了</h1>
      </header>

      <div className="aq-main">
        <div className="aq-diagram">
          <div className="aq-lanes">
            {LANES.map((lane) => (
              <div className="aq-lane" key={lane.no}>
                <div className="aq-system-card">
                  <span className="aq-system-no">{lane.no}</span>
                  <span className="aq-system-text">
                    <span className="aq-system-label">{lane.label}</span>
                    <span className="aq-system-note">{lane.system}</span>
                  </span>
                </div>
                <div className="aq-track" aria-hidden="true">
                  <span className="aq-rail" />
                  <span className="aq-dot" />
                  <span className="aq-dot" />
                  <span className="aq-dot" />
                </div>
              </div>
            ))}
          </div>
          <div className="aq-boundary" aria-hidden="true">
            <span className="aq-boundary-tag">系统交界处</span>
            {CONFLICTS.map((text) => (
              <span className="aq-conflict" key={text}>
                {text}
              </span>
            ))}
          </div>
        </div>

        <figure className="aq-media">
          <img className="aq-media-img" src={m001Image} alt="工厂情境占位图" />
          <figcaption className="aq-media-caption">
            工厂情境 · M001 · 素材待提供
          </figcaption>
        </figure>
      </div>

      <div className="aq-question">
        <span className="aq-question-ghost" aria-hidden="true">
          ？
        </span>
        <p className="aq-question-text">数据明明已经存在，为什么还是共享不了？</p>
        <p className="aq-question-answer">
          <span className="aq-answer-arrow" aria-hidden="true">
            →
          </span>
          工业软件连接器，要解决的正是这个问题
        </p>
      </div>
    </div>
  );
}
