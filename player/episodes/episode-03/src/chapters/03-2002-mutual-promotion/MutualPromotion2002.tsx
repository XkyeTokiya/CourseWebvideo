import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./MutualPromotion2002.css";
import m002 from "./assets/m002.png";

const states = [
  "anchor-and-frame-set",
  "two-directions-filled",
  "joint-elements-stated",
] as const;

type MutualPromotion2002State = (typeof states)[number];

const JOINT_ELEMENTS = ["信息技术", "工业技术", "资源利用", "人的能力"];

export default function MutualPromotion2002({ step }: ChapterStepProps) {
  const state: MutualPromotion2002State = states[step] ?? states[states.length - 1];
  const pairOn = state !== "anchor-and-frame-set";
  const jointOn = state === "joint-elements-stated";

  return (
    <div className="mp-scene scene-pad">
      <h1 className="mp-thesis">
        信息化与工业化，从一开始就不是<em>单向替代</em>
      </h1>

      <div className="mp-main">
        <div className="mp-anchor">
          <p className="mp-anchor-kicker">回看相关历史论述 · 历史起点</p>
          <p className="mp-year hero-num">2002</p>
          <p className="mp-anchor-note">新型工业化形成明确的历史起点</p>
        </div>

        <figure className="mp-media">
          <div className="mp-photo">
            <img src={m002} alt="工业生产历史语境占位图" />
          </div>
          <figcaption className="mp-media-cap">
            <span>工业生产实景 · 占位图</span>
            <span>建立历史语境 · 不替代史实证据</span>
          </figcaption>
        </figure>
      </div>

      <div className="mp-relations">
        <p className="mp-relations-lead">新型工业化体现为一条双向关系：</p>
        <div className="mp-pair">
          <p
            className="mp-dir"
            data-on={pairOn ? "on" : "waiting"}
            style={{ "--mp-i": "0" } as CSSProperties}
          >
            信息化<i>带动</i>工业化
          </p>
          <p
            className="mp-dir"
            data-on={pairOn ? "on" : "waiting"}
            style={{ "--mp-i": "1" } as CSSProperties}
          >
            工业化<i>促进</i>信息化
          </p>
        </div>

        <div className={`mp-joint${jointOn ? " is-on" : ""}`} aria-hidden={!jointOn}>
          <div className="mp-joint-band">
            {JOINT_ELEMENTS.map((el, i) => (
              <span
                key={el}
                className="mp-joint-chip"
                style={{ "--mp-i": String(i) } as CSSProperties}
              >
                {el}
              </span>
            ))}
          </div>
          <p className="mp-joint-line">
            不是彼此分开的几件事，而要
            <em>共同进入工业发展的过程</em>
          </p>
        </div>
      </div>
    </div>
  );
}
