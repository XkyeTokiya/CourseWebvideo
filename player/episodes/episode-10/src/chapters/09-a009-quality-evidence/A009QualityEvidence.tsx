import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009QualityEvidence.css";

const states = [
  "evidence-cards-up",
  "yield-figure-shown",
  "boundary-framed",
] as const;

type A009State = (typeof states)[number];

const SENSES = ["温度", "震动", "噪音"];
const CHAIN = ["采集状态", "分析异常", "调整工艺"];

export default function A009QualityEvidence({ step }: ChapterStepProps) {
  const state: A009State = states[step] ?? states[states.length - 1];
  const bandOn = state !== "evidence-cards-up";
  const boundaryOn = state === "boundary-framed";
  const focusChain = state === "boundary-framed";

  return (
    <div className={`qe-scene scene-pad${focusChain ? " is-focused" : ""}`}>
      <h1 className="qe-title">异常预警与案例成效数字</h1>

      <div className="qe-main">
        <div className="qe-cards">
          <article className="qe-card card">
            <span className="qe-card-tag">案例证据 · 01</span>
            <h2>实时采集，结合人工智能分析</h2>
            <div className="qe-sense-row">
              {SENSES.map((sense, i) => (
                <span
                  key={sense}
                  className="qe-sense"
                  style={{ "--qe-i": String(i) } as CSSProperties}
                >
                  {sense}
                </span>
              ))}
            </div>
            <div className="qe-link">
              <span className="qe-link-line" aria-hidden="true" />
              <p className="qe-link-tip">支持异常预警和预测性维护</p>
            </div>
            <p className="qe-optimize">工艺参数还能动态优化 · 比如调整注塑机的温度或压力</p>
          </article>

          <article className="qe-card card qe-card-chain">
            <span className="qe-card-tag">教学重点 · 02</span>
            <div className="qe-chain">
              {CHAIN.map((node, i) => (
                <span
                  key={node}
                  className="qe-chain-step"
                  style={{ "--qe-i": String(i) } as CSSProperties}
                >
                  <b className="hero-num">{String(i + 1).padStart(2, "0")}</b>
                  {node}
                </span>
              ))}
            </div>
            <p className="qe-chain-note">这条业务链，而不是模型内部长什么样</p>
          </article>
        </div>

        <div className={`qe-band${bandOn ? " is-on" : ""}`} aria-hidden={!bandOn}>
          <span className="qe-figure hero-num">
            5%<i>+</i>
          </span>
          <p className="qe-band-line">工艺参数动态优化后，良品率提高 5% 以上</p>
        </div>

        <p className={`qe-boundary${boundaryOn ? " is-on" : ""}`} aria-hidden={!boundaryOn}>
          上述数字为教材所述案例结果
        </p>
      </div>
    </div>
  );
}
