import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DirectionSupportRecap.css";
import m006 from "./assets/m006.png";

const states = [
  "recap-history-set",
  "policy-references-set",
  "support-and-boundary-complete",
] as const;

type DirectionSupportRecapState = (typeof states)[number];

export default function DirectionSupportRecap({ step }: ChapterStepProps) {
  const state: DirectionSupportRecapState =
    states[step] ?? states[states.length - 1];
  const policyOn = states.indexOf(state) >= 1;
  const runOn = state === "run-boundary-complete";

  return (
    <div className="dr-scene scene-pad">
      <h1 className="dr-thesis">工业互联网是关键支撑，但不等于新型工业化</h1>

      <div className="dr-main">
        <div className="dr-rail">
          <p className="dr-rail-lead">本期总结</p>

          <article
            className="dr-band"
            data-on="on"
            style={{ "--dr-i": "0" } as CSSProperties}
          >
            <span className="dr-band-index hero-num">1</span>
            <div className="dr-band-body">
              <p className="dr-band-label">历史</p>
              <p className="dr-band-text">
                2002 年的历史起点，信息化与工业化相互促进的思路明确建立
              </p>
            </div>
          </article>

          <article
            className="dr-band"
            data-on={policyOn ? "on" : "waiting"}
            style={{ "--dr-i": "1" } as CSSProperties}
          >
            <span className="dr-band-index hero-num">2</span>
            <div className="dr-band-body">
              <p className="dr-band-label">政策</p>
              <p className="dr-band-text">
                2024 年中央《决定》与 2026 年国务院常务会议政策解读，分别给出方向和发展阶段判断，并明确了 2035 年目标
              </p>
            </div>
          </article>

          <article
            className="dr-band"
            data-on={runOn ? "on" : "waiting"}
            style={{ "--dr-i": "2" } as CSSProperties}
          >
            <span className="dr-band-index hero-num">3</span>
            <div className="dr-band-body">
              <p className="dr-band-label">运行</p>
              <p className="dr-band-text">
                连接工业要素、贯通数据、复用能力、支持授权范围内的协同，把方向转成可运行、可反馈、可持续优化的能力
              </p>
            </div>
          </article>

          <article
            className={`dr-band dr-band--edge${runOn ? " is-on" : ""}`}
            data-on={runOn ? "on" : "waiting"}
            style={{ "--dr-i": "3" } as CSSProperties}
          >
            <span className="dr-band-index hero-num">4</span>
            <div className="dr-band-body">
              <p className="dr-band-label">边界</p>
              <p className="dr-band-text">
                关键支撑 <span className="dr-neq hero-num">≠</span> 新型工业化
              </p>
            </div>
          </article>
        </div>

        <figure className="dr-media">
          <div className="dr-photo">
            <img src={m006} alt="现代工业现场整体运行占位图" />
          </div>
          <figcaption className="dr-media-cap">
            <span>现代工业现场 · 占位图</span>
            <span>全期收束</span>
          </figcaption>
        </figure>
      </div>

      <div className={`dr-final${runOn ? " is-on" : ""}`} aria-hidden={!runOn}>
        <p className="dr-final-kicker">最终判断</p>
        <p className="dr-final-hero">
          它是关键支撑，但<em>不等于</em>新型工业化
        </p>
      </div>
    </div>
  );
}
