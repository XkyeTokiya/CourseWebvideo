import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007Chapter.css";
import m002 from "./assets/m002.png";

const states = [
  "exception-located",
  "context-reconnected",
  "scope-limited",
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const reconnectedOn = step >= 1;
  const boundaryOn = step >= 2;

  return (
    <div
      className={`a7-scene scene-pad${reconnectedOn ? " is-reconnected" : ""}${
        boundaryOn ? " is-boundary" : ""
      }`}
      data-state={state}
    >
      <header className="a7-head">
        <p className="a7-kicker">例 · 质量异常回查</p>
        <h1 className="a7-title">一次质量异常的关联回查</h1>
      </header>

      <div className="a7-main">
        <figure className="a7-media">
          <div className="a7-photo-wrap">
            <div className="a7-photo card">
              <img src={m002} alt="质量与生产协同核查现场（占位图，原图待提供）" />
              <span className="a7-photo-tag">现场图 · 原图待提供</span>
            </div>
          </div>
          <figcaption className="a7-media-cap">现场语境 · 质量与生产协同核对</figcaption>
        </figure>

        <div className="a7-rail">
          <article className="a7-step is-on">
            <span className="a7-node" aria-hidden="true" />
            <div className="a7-step-clip">
              <div className="a7-step-body">
                <p className="a7-step-cap">01 · 定位对象</p>
                <p className="a7-step-text">
                  发现一处质量异常，先定位到具体是哪台设备、哪件产品
                </p>
              </div>
            </div>
          </article>

          <article className={`a7-step${reconnectedOn ? " is-on" : ""}`}>
            <span className="a7-node" aria-hidden="true" />
            <div className="a7-step-clip">
              <div className="a7-step-body">
                <p className="a7-step-cap">02 · 关联记录</p>
                <p className="a7-step-text">
                  顺着对象身份，关联对应的生产记录和批次信息，整个业务上下文接起来
                </p>
              </div>
            </div>
          </article>

          <article className={`a7-step a7-step--boundary${boundaryOn ? " is-on" : ""}`}>
            <span className="a7-node" aria-hidden="true" />
            <div className="a7-step-clip">
              <div className="a7-step-body">
                <p className="a7-step-cap">03 · 边界</p>
                <p className="a7-boundary-text">
                  例子只说明对象之间的关系怎么被保留下来，不是说系统已经自动完成了原因分析、责任判断或者处置决策
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
