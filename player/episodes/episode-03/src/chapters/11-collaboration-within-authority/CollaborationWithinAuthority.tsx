import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./CollaborationWithinAuthority.css";
import m004 from "./assets/m004.png";

const states = [
  "actors-shown",
  "sharing-condition-stated",
  "coordination-items-stated",
] as const;

type CollaborationState = (typeof states)[number];

const ACTOR_CHIPS = ["研发", "采购", "生产", "物流", "服务"];

export default function CollaborationWithinAuthority({ step }: ChapterStepProps) {
  const state: CollaborationState = states[step] ?? states[states.length - 1];
  const actorsFocus = state === "actors-shown";
  const conditionFocus = state === "sharing-condition-stated";
  const itemsFocus = state === "coordination-items-stated";

  return (
    <div className="ca-scene scene-pad">
      <h1 className="ca-thesis">
        信息共享不是<em>无条件开放</em>
      </h1>

      <div className="ca-main">
        <figure className="ca-media">
          <div className="ca-photo">
            <img src={m004} alt="多主体围绕生产安排协作占位图" />
          </div>
          <figcaption className="ca-media-cap">
            <span>多主体协作 · 占位图</span>
            <span>真实场景 · 不指向具体企业</span>
          </figcaption>
        </figure>

        <div className="ca-rail">
          <p className="ca-rail-lead">协同 · 阅读项</p>

          <article
            className={`ca-item${actorsFocus ? " is-focus" : ""}`}
            data-on="on"
            style={{ "--ca-i": "0" } as CSSProperties}
          >
            <span className="ca-item-index hero-num">01</span>
            <div className="ca-item-body">
              <h2>谁协作</h2>
              <div className="ca-actors">
                {ACTOR_CHIPS.map((chip) => (
                  <span key={chip} className="ca-actor-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <p>共同参与制造活动</p>
            </div>
          </article>

          <article
            className={`ca-item${conditionFocus ? " is-focus" : ""}`}
            data-on={conditionFocus || itemsFocus ? "on" : "waiting"}
            style={{ "--ca-i": "1" } as CSSProperties}
          >
            <span className="ca-item-index hero-num">02</span>
            <div className="ca-item-body">
              <h2>什么条件</h2>
              <p>
                信息流动必须在<i>授权范围内</i>进行，不是无条件开放
              </p>
            </div>
          </article>

          <article
            className={`ca-item${itemsFocus ? " is-focus" : ""}`}
            data-on={itemsFocus ? "on" : "waiting"}
            style={{ "--ca-i": "2" } as CSSProperties}
          >
            <span className="ca-item-index hero-num">03</span>
            <div className="ca-item-body">
              <h2>协同什么</h2>
              <p>
                围绕订单、产能、质量和服务
                <i>协调安排</i>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
