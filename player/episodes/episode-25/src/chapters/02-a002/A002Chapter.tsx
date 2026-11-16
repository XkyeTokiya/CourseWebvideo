import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002Chapter.css";
import m002 from "./assets/m002.png";

const states = [
  "description-established",
  "inequality-exposed",
  "coding-insufficient",
] as const;

const GAPS = ["在哪里", "经历过什么"] as const;

function NotEqualGlyph() {
  return (
    <svg viewBox="0 0 44 44" className="a2-neq-glyph" aria-hidden="true">
      <line x1="8" y1="15" x2="36" y2="15" className="a2-neq-bar" />
      <line x1="8" y1="27" x2="36" y2="27" className="a2-neq-bar" />
      <line x1="31" y1="4" x2="13" y2="40" className="a2-neq-slash" />
    </svg>
  );
}

function SolidGlyph() {
  return (
    <svg viewBox="0 0 40 40" className="a2-plate-glyph" aria-hidden="true">
      <rect x="5" y="9" width="30" height="22" rx="2" className="a2-glyph-solid" />
      <line x1="5" y1="19" x2="35" y2="19" className="a2-glyph-split" />
    </svg>
  );
}

function DescribedGlyph() {
  return (
    <svg viewBox="0 0 40 40" className="a2-plate-glyph" aria-hidden="true">
      <rect x="5" y="9" width="30" height="22" rx="2" className="a2-glyph-outline" />
      <line x1="11" y1="17" x2="29" y2="17" className="a2-glyph-line" />
      <line x1="11" y1="23" x2="23" y2="23" className="a2-glyph-line" />
    </svg>
  );
}

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const contrasted = state !== "description-established";
  const boundary = state === "coding-insufficient";

  return (
    <div className="a2-scene scene-pad" data-state={state}>
      <header className="a2-head">
        <h1 className="a2-title">
          一个对象，<em>两种存在</em>
        </h1>
        <div className="rule a2-head-rule" />
      </header>

      <div className="a2-main">
        <div className="a2-media-col">
          <figure className="a2-media">
            <div className="a2-shot card">
              <img src={m002} alt="现场对象与系统记录终端并置语境（占位图，原图待提供）" />
              <span className="a2-photo-tag">现场图 · 原图待提供</span>
            </div>
            <figcaption className="a2-media-cap">现场对象与系统里的记录，并置在一处看</figcaption>
          </figure>

          <section className="a2-anchor card" aria-label="同一对象的两种存在">
            <p className="a2-anchor-kicker">同一个受管对象 · 两种存在</p>
            <div className="a2-plates">
              <div className="a2-plate a2-plate-real">
                <SolidGlyph />
                <span className="a2-plate-body">
                  <span className="a2-plate-tag">实体</span>
                  <span className="a2-plate-name">车间里的实体</span>
                </span>
              </div>

              <div className={`a2-neq${contrasted ? " is-on" : ""}`}>
                <NotEqualGlyph />
                <span className="a2-neq-note">不能画等号</span>
              </div>

              <div className="a2-plate a2-plate-digital">
                <DescribedGlyph />
                <span className="a2-plate-body">
                  <span className="a2-plate-tag">数字描述</span>
                  <span className="a2-plate-name">系统中对它的描述</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="a2-rails">
          <div className="a2-step a2-step--1">
            <section className="a2-rail card">
              <p className="a2-tag">数字描述</p>
              <p className="a2-main-line">
                对于需要管理的对象，可以建立<strong>可查询、可共享</strong>的数字描述
              </p>

              <div className={`a2-judge${contrasted ? " is-on" : ""}`}>
                <div className="a2-judge-rule" />
                <p className="a2-judge-line">
                  车间里的实体与系统中对它的描述，<strong>不能画等号</strong>
                </p>
              </div>

              <p className={`a2-virtual${contrasted ? " is-on" : ""}`}>
                <span className="a2-virtual-mark" aria-hidden="true" />
                虚拟对象也可以建立数字描述
              </p>
            </section>
          </div>

          <div className={`a2-step a2-step--2${boundary ? " is-on" : ""}`}>
            <section className="a2-rail a2-rail-boundary card">
              <p className="a2-tag a2-tag-warning">编码的边界</p>
              <p className="a2-boundary-line">只有编码，还不足以说明</p>
              <div className="a2-cover">
                <span className="a2-cover-code">编码</span>
                <span className="a2-cover-bridge" aria-hidden="true" />
                <span className="a2-gaps">
                  {GAPS.map((gap, index) => (
                    <span
                      key={gap}
                      className="a2-gap"
                      style={{ "--a2-i": index } as CSSProperties}
                    >
                      {gap}
                    </span>
                  ))}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
