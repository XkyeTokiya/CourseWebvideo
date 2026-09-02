import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ProblemScene.css";
import m001 from "./assets/m001.png";

const states = ["scenario-established", "question-raised"] as const;

type ProblemSceneState = (typeof states)[number];

const CONTEXT_LINES = [
  {
    no: "01",
    label: "技术底座已就位",
    body: "设备接入网络 · 车间有生产系统 · 计划、质量、供应链各自装上软件",
    tone: "base",
  },
  {
    no: "02",
    label: "可节奏一变，摩擦就露出来",
    body: "现场数据人工汇总 · 异常靠电话协调 · 系统间信息彼此等候",
    tone: "friction",
  },
] as const;

export default function ProblemScene({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const questionRaised = state === "question-raised";
  const revealed = questionRaised ? 2 : 1;

  return (
    <div className="ps-scene scene-pad">
      <header className={`ps-anchor${questionRaised ? " is-weak" : ""}`}>
        <p className="ps-anchor-time">
          <span className="ps-anchor-t0 hero-num">T0</span>
          设想一家工厂
        </p>
        <span className="ps-fiction-badge">设想情境</span>
      </header>

      <div className={`ps-main${questionRaised ? " is-weak" : ""}`}>
        <figure className="ps-media">
          <div className="ps-photo">
            <img src={m001} alt="M001 无品牌工厂设想现场占位图" />
          </div>
        </figure>

        <div className="ps-lines">
          {CONTEXT_LINES.map((line, i) => (
            <article
              key={line.no}
              className="ps-line card"
              data-tone={line.tone}
              data-on={i < revealed ? "on" : "waiting"}
              style={{ "--ps-i": String(i) } as CSSProperties}
            >
              <span className="ps-idx hero-num">{line.no}</span>
              <div className="ps-line-body">
                <h2>{line.label}</h2>
                <p>{line.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className={`ps-q${questionRaised ? " is-on" : ""}`}
        aria-hidden={!questionRaised}
      >
        <div className="ps-q-plate card-glass">
          <p className="ps-q-kicker">技术部署了不少</p>
          <p className="ps-q-hero">
            为什么业务改善<em>没有同步发生？</em>
          </p>
        </div>
      </div>
    </div>
  );
}
