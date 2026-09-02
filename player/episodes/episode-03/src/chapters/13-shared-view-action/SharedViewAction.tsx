import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SharedViewAction.css";
import m005 from "./assets/m005.png";

const states = [
  "common-view-formed",
  "judgment-and-action-set",
  "scenario-boundary-stated",
  "daily-operation-lesson",
] as const;

type SharedViewState = (typeof states)[number];

const VIEW_CHIPS = ["质量", "设备状态", "能耗", "订单信息"];

export default function SharedViewAction({ step }: ChapterStepProps) {
  const state: SharedViewState = states[step] ?? states[states.length - 1];
  const judgeActionOn = state !== "common-view-formed";
  const boundaryOn =
    state === "scenario-boundary-stated" || state === "daily-operation-lesson";
  const lessonOn = state === "daily-operation-lesson";

  return (
    <div className="sv-scene scene-pad">
      <h1 className="sv-thesis">共同判断，才能围绕变化协同行动</h1>

      <div className="sv-main">
        <div className="sv-cards">
          <article
            className="sv-card sv-card--view"
            data-on="on"
            style={{ "--sv-i": "0" } as CSSProperties}
          >
            <div className="sv-card-body">
              <p className="sv-card-kicker">共同视图</p>
              <div className="sv-chips">
                {VIEW_CHIPS.map((chip) => (
                  <span key={chip} className="sv-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <p className="sv-card-text">在授权条件下形成共同视图</p>
            </div>
          </article>

          <article
            className="sv-card"
            data-on={judgeActionOn ? "on" : "waiting"}
            style={{ "--sv-i": "1" } as CSSProperties}
          >
            <div className="sv-card-body">
              <p className="sv-card-kicker">共同判断</p>
              <p className="sv-card-text">相关人员围绕同一变化形成判断</p>
            </div>
          </article>

          <article
            className="sv-card"
            data-on={judgeActionOn ? "on" : "waiting"}
            style={{ "--sv-i": "2" } as CSSProperties}
          >
            <div className="sv-card-body">
              <p className="sv-card-kicker">协同行动</p>
              <p className="sv-card-text">
                生产、维护和供应环节，据此协调安排
              </p>
            </div>
          </article>

          <article
            className={`sv-card sv-card--boundary${boundaryOn ? " is-on" : ""}`}
            data-on={boundaryOn ? "on" : "waiting"}
            style={{ "--sv-i": "3" } as CSSProperties}
          >
            <div className="sv-card-body">
              <p className="sv-card-kicker">情境边界</p>
              <p className="sv-card-text">
                不对应某一家真实企业，也不承诺具体收益
              </p>
            </div>
          </article>
        </div>

        <figure className="sv-media">
          <div className="sv-photo">
            <img src={m005} alt="现场协作情境占位图" />
          </div>
          <figcaption className="sv-media-cap">
            <span>现场协作 · 占位图</span>
            <span>不同于开场的共同观察</span>
          </figcaption>
        </figure>
      </div>

      <div className={`sv-take${lessonOn ? " is-on" : ""}`} aria-hidden={!lessonOn}>
        <p className="sv-take-kicker">回扣开头 · 这个设想帮助我们看清</p>
        <p className="sv-take-hero">
          工业体系的能力，要在日常运行中被<em>观察、判断和持续调整</em>
        </p>
      </div>
    </div>
  );
}
