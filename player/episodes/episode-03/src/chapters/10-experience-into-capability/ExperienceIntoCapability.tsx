import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ExperienceIntoCapability.css";

const states = [
  "experience-collected",
  "capability-formed-reused",
  "reuse-extended-stated",
] as const;

type ExperienceState = (typeof states)[number];

const EXPERIENCE_ITEMS = ["数据处理方法", "工业模型", "应用经验"];

export default function ExperienceIntoCapability({ step }: ChapterStepProps) {
  const state: ExperienceState = states[step] ?? states[states.length - 1];
  const formedOn = state !== "experience-collected";
  const extendedOn = state === "reuse-extended-stated";

  return (
    <div className="ec-scene scene-pad">
      <h1 className="ec-thesis">
        局部改进要能扩展，才会进入<em>组织能力</em>
      </h1>

      <div className="ec-track">
        <section className="ec-step" data-on="on" style={{ "--ec-i": "0" } as CSSProperties}>
          <div className="ec-step-body">
            <span className="ec-step-index hero-num">1</span>
            <p className="ec-step-kicker">整理经验</p>
            <div className="ec-step-main">
              <p className="ec-step-lead">不停留在某个人、某台设备或某个软件里</p>
              <div className="ec-items">
                {EXPERIENCE_ITEMS.map((item) => (
                  <span key={item} className="ec-item-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p className="ec-step-foot">经过整理</p>
          </div>
        </section>

        <section
          className="ec-step"
          data-on={formedOn ? "on" : "waiting"}
          style={{ "--ec-i": "0" } as CSSProperties}
        >
          <div className="ec-step-body">
            <span className="ec-step-index hero-num">2</span>
            <p className="ec-step-kicker">沉淀能力</p>
            <div className="ec-step-main">
              <p className="ec-step-text">
                把零散做法<i>组织为可复用能力</i>
              </p>
            </div>
            <p className="ec-step-foot">在不同设备、产线或工厂中复用</p>
          </div>
        </section>

        <section
          className={`ec-step ec-step--last${extendedOn ? " is-extended" : ""}`}
          data-on={formedOn ? "on" : "waiting"}
          style={{ "--ec-i": "1" } as CSSProperties}
        >
          <div className="ec-step-body">
            <span className="ec-step-index hero-num">3</span>
            <p className="ec-step-kicker">扩大复用</p>
            <div className="ec-step-main">
              <p className={`ec-extend${extendedOn ? " is-on" : ""}`} aria-hidden={!extendedOn}>
                局部位置形成的改进，变成
                <i>更大范围可以借鉴的做法</i>
              </p>
            </div>
            <p className="ec-step-foot">应用到不同设备、产线或工厂</p>
          </div>
        </section>
      </div>

      <div className={`ec-take${extendedOn ? " is-on" : ""}`} aria-hidden={!extendedOn}>
        <p className="ec-take-kicker">沉淀 → 复用</p>
        <p className="ec-take-hero">
          复用扩大的是<em>组织可调用的能力</em>
        </p>
      </div>
    </div>
  );
}
