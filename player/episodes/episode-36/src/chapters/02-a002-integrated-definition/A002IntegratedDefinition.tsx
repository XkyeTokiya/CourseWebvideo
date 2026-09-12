import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002IntegratedDefinition.css";

const STATES = ["definition-stated", "dimensions-equal"] as const;

const DIMENSIONS = [
  { no: "01", name: "大小", desc: "载体和附着物，先确定谁大谁小" },
  { no: "02", name: "布局", desc: "版面怎么排，可用的版面空间有多大" },
  { no: "03", name: "功能", desc: "要实现什么功能" },
  { no: "04", name: "美观", desc: "整体好不好看" },
] as const;

export default function A002IntegratedDefinition({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const cardsIn = state === "dimensions-equal";

  return (
    <div className="a2-root scene-pad">
      <header className="a2-head">
        <h1 className="a2-title">载体与附着物的一体化设计</h1>
      </header>

      <section className="a2-def">
        <p className="a2-def-text">
          把<em>载体本身</em>和<em>附着物</em>，放进
          <strong>同一个设计对象</strong>里。
        </p>
        <svg className="a2-merge" viewBox="0 0 460 150" aria-hidden>
          <rect
            className="a2-merge-enclosure"
            x="10"
            y="12"
            width="440"
            height="126"
            rx="20"
            pathLength="1"
          />
          <rect className="a2-merge-carrier" x="52" y="40" width="120" height="70" rx="10" />
          <rect className="a2-merge-attached" x="252" y="40" width="120" height="70" rx="10" />
          <text className="a2-merge-label" x="112" y="83" textAnchor="middle">
            载体
          </text>
          <text className="a2-merge-label" x="312" y="83" textAnchor="middle">
            附着物
          </text>
        </svg>
      </section>

      <div className="a2-cards">
        {DIMENSIONS.map((d, i) => (
          <article
            key={d.no}
            className={`a2-card card${cardsIn ? " is-in" : ""}`}
            style={{ "--a2-i": String(i) } as CSSProperties}
          >
            <p className="a2-card-kicker">
              <span className="hero-num">{d.no}</span>
            </p>
            <p className="a2-card-name">{d.name}</p>
            <span className="a2-card-rule rule" />
            <p className="a2-card-desc">{d.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
