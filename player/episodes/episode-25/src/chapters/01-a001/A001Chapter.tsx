import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001Chapter.css";
import m001 from "./assets/m001.png";

const states = [
  "scene-and-questions",
  "coding-limit-exposed",
  "model-named",
] as const;

const QUESTIONS = ["是哪台机器？", "它在哪里？", "经历过什么？"] as const;

function CheckGlyph() {
  return (
    <svg viewBox="0 0 30 24" className="a1-glyph a1-glyph-box" aria-hidden="true">
      <path d="M4 13 L11.5 21 L26 4" className="a1-glyph-check" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="a1-glyph a1-glyph-box" aria-hidden="true">
      <line x1="5" y1="5" x2="19" y2="19" className="a1-glyph-cross" />
      <line x1="19" y1="5" x2="5" y2="19" className="a1-glyph-cross" />
    </svg>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const limit = state !== "scene-and-questions";
  const named = state === "model-named";

  return (
    <div className="a1-scene scene-pad" data-state={state}>
      <header className="a1-head">
        <h1 className="a1-title">
          标识数据模型<span className="a1-title-colon">：</span>
          <em>从数字对象到属性与事件</em>
        </h1>
        <div className="rule a1-head-rule" />
      </header>

      <div className={`a1-main${named ? " is-dim" : ""}`}>
        <figure className="a1-media">
          <div className="a1-shot card">
            <img src={m001} alt="车间里的一台发动机现场（占位图，原图待提供）" />
            <span className="a1-photo-tag">现场图 · 原图待提供</span>
          </div>
          <figcaption className="a1-media-cap">
            <strong>车间里的一台发动机</strong>
            <span> —— 能摸到、能看到</span>
          </figcaption>
        </figure>

        <section className="a1-ask" aria-label="信息系统需要说明的三件事">
          <p className="a1-ask-kicker">到了信息系统中 · 需要说明</p>
          <div className="a1-track">
            <span className="a1-track-line" aria-hidden="true" />
            {QUESTIONS.map((question, index) => (
              <div
                key={question}
                className="a1-q"
                style={{ "--a1-i": index } as CSSProperties}
              >
                <span className="a1-q-node" aria-hidden="true">
                  <span className="a1-q-dot" />
                </span>
                <span className="a1-q-text">{question}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="a1-close">
        <div className={`a1-limit${limit ? " is-on" : ""}`}>
          <div className="a1-panel a1-panel-can card">
            <p className="a1-panel-tag">编码可以</p>
            <p className="a1-panel-line">
              区分对象
              <CheckGlyph />
            </p>
          </div>
          <div className="a1-panel a1-panel-cannot card">
            <p className="a1-panel-tag">单靠编码不能</p>
            <p className="a1-panel-line">
              说明位置与经历
              <CrossGlyph />
            </p>
          </div>
        </div>

        <div className={`a1-name${named ? " is-on" : ""}`}>
          <div className="a1-name-rule" />
          <div className="a1-name-row">
            <p className="a1-name-pre">要把对象讲清楚，还需要一套组织数据的方式</p>
            <p className="a1-name-stamp">标识数据模型</p>
          </div>
        </div>
      </section>
    </div>
  );
}
