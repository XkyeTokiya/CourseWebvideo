import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ConnectionSharedAwareness.css";
import m003 from "./assets/m003.png";

const states = [
  "connected-objects-shown",
  "shared-perception-stated",
] as const;

type ConnectionState = (typeof states)[number];

export default function ConnectionSharedAwareness({ step }: ChapterStepProps) {
  const state: ConnectionState = states[step] ?? states[states.length - 1];
  const whyOn = state === "shared-perception-stated";

  return (
    <div className="cs-scene scene-pad">
      <h1 className="cs-thesis">
        连接的价值不是线多，而是要素能被<em>共同感知和组织</em>
      </h1>

      <div className="cs-main">
        <figure className="cs-media">
          <div className="cs-photo">
            <img src={m003} alt="人、机器、产品与工业现场共同工作占位图" />
          </div>
          <figcaption className="cs-media-cap">
            <span>工业现场 · 占位图</span>
            <span>人、机器、产品共同工作</span>
          </figcaption>
        </figure>

        <div className="cs-rail">
          <p className="cs-rail-lead">连接 · 阅读项</p>

          <article className="cs-item" data-on="on" style={{ "--cs-i": "0" } as CSSProperties}>
            <span className="cs-item-index hero-num">01</span>
            <div className="cs-item-body">
              <h2>连接谁</h2>
              <p>
                人、机器、产品、业务系统以及产业链相关环节，能够连接起来
              </p>
            </div>
          </article>

          <article
            className={`cs-item${whyOn ? " is-focus" : ""}`}
            data-on={whyOn ? "on" : "waiting"}
            style={{ "--cs-i": "1" } as CSSProperties}
          >
            <span className="cs-item-index hero-num">02</span>
            <div className="cs-item-body">
              <h2>为何连接</h2>
              <p>
                不只是让对象出现在同一张连接关系图里，
                <i>让分散的工业要素能够被共同感知和组织</i>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
