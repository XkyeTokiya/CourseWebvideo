import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./UpwardFlowOpenLoop.css";
import m003 from "./assets/m003.png";

const stateByStep = [
  "sources-shown",
  "upstream-shown",
  "observing-shown",
  "not-yet-closed",
] as const;

type State = (typeof stateByStep)[number];

const RAIL = [
  {
    no: "1",
    name: "信息来源",
    desc: "设备、生产系统、管理系统和供应链持续产生状态与业务信息。",
  },
  {
    no: "2",
    name: "上行路径",
    desc: "网络负责传递，平台承接处理和模型能力。",
  },
  {
    no: "3",
    name: "数字空间",
    desc: "系统由此能够观察生产、分析变化。",
  },
  {
    no: "4",
    name: "尚未闭环",
    desc: "只停在报表或提示的结果，还没有作用于生产现场。",
  },
] as const;

export default function UpwardFlowOpenLoopChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);

  return (
    <div className="uf-scene scene-pad">
      <header className="uf-title">
        <span className="uf-title-mark" />
        <h1 className="uf-title-text">
          数字空间已经能够观察和分析，但结果停在报表或提示上<em>仍不算闭环</em>
        </h1>
      </header>

      <div className="uf-main">
        <div className="uf-rail">
          {RAIL.map((r, i) => {
            const on = idx >= i;
            const last = i === 3;
            return (
              <article
                key={r.no}
                className={`uf-item${on ? " is-on" : " is-ghost"}${last && on ? " is-gap" : ""}`}
                style={{ "--uf-i": i } as CSSProperties}
              >
                <span className="uf-slot">阅读项 · {r.no}</span>
                <div className="uf-item-body">
                  <span className="hero-num uf-badge">{r.no}</span>
                  <div className="uf-item-text">
                    <span className="uf-item-name">{r.name}</span>
                    <p className="uf-item-desc">{r.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <figure className="card uf-media">
          <div className="uf-photo">
            <img src={m003} alt="隔着观察窗集中查看生产状态的现场，产线仍按原有方式运行" />
          </div>
          <figcaption className="uf-cap">
            <span className="uf-cap-desc">工业现场被集中观察 · 现场动作尚未改变</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
