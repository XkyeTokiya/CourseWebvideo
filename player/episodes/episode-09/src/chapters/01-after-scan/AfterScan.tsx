import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./AfterScan.css";
import m001 from "./assets/m001.png";

const states = [
  "scene-and-first-questions",
  "all-questions-visible",
  "recognition-gap-stated",
] as const;

type AfterScanState = (typeof states)[number];

const QUESTIONS = [
  { no: "01", label: "订单", text: "它来自哪个订单？" },
  { no: "02", label: "装配与工艺", text: "经历过怎样的装配和工艺控制？" },
  { no: "03", label: "质量", text: "对应的质量记录在哪里？" },
  { no: "04", label: "仓储物流", text: "又经过了哪些仓储和物流环节？" },
];

export default function AfterScan({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const revealed = state === "scene-and-first-questions" ? 2 : QUESTIONS.length;
  const gapDominant = state === "recognition-gap-stated";

  return (
    <div className="as-scene scene-pad">
      <h1 className={`as-thesis${gapDominant ? " is-weak" : ""}`}>
        扫描认出同一台发动机，追溯问题才刚刚开始
      </h1>

      <div className={`as-main${gapDominant ? " is-weak" : ""}`}>
        <figure className="as-media">
          <div className="as-photo">
            <img src={m001} alt="M001 发动机售后服务现场占位图" />
            {state === "scene-and-first-questions" ? (
              <span className="as-scanline" aria-hidden="true" />
            ) : null}
            <span className="as-id-chip" aria-hidden="true">
              已识别 · 同一台发动机
            </span>
          </div>
          <figcaption className="as-media-cap">
            <span>M001 · 售后服务现场（占位图）</span>
            <span>教学设想，非真实企业照片</span>
          </figcaption>
        </figure>

        <div className="as-qa">
          <p className="as-qa-lead">同一台发动机 · 待查记录</p>
          <div className="as-qs">
            {QUESTIONS.map((q, i) => (
              <article
                key={q.no}
                className="as-q card"
                data-on={i < revealed ? "on" : "waiting"}
                style={{ "--as-i": String(i) } as CSSProperties}
              >
                <span className="as-index hero-num">{q.no}</span>
                <div className="as-q-body">
                  <h2>{q.label}</h2>
                  <p>{q.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={`as-gap${gapDominant ? " is-on" : ""}`} aria-hidden={!gapDominant}>
        <div className="as-gap-plate card-glass">
          <p className="as-gap-anchor">四类记录 · 待围绕同一台发动机建立关联</p>
          <p className="as-gap-hero">
            记录明明都在，<em>为什么查起来还是费劲？</em>
          </p>
          <p className="as-gap-note">
            <span className="as-gap-mark" aria-hidden="true" />
            识别对象只是起点，完整追溯还要让四类记录重新围绕同一台发动机建立关联。
          </p>
        </div>
      </div>
    </div>
  );
}
