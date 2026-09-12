import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005MaterialPosition.css";

const STATES = [
  "two-threads-raised",
  "surfaces-compared",
  "contact-drives-choice",
  "order-locked",
] as const;

const FORMS = ["平整表面", "弧面", "包装边缘"] as const;

export default function A005MaterialPosition({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const formsIn = state !== "two-threads-raised";
  const contactIn =
    state === "contact-drives-choice" || state === "order-locked";
  const orderIn = state === "order-locked";

  return (
    <div className="a5-root scene-pad">
      <header className="a5-head">
        <h1 className="a5-title">材质和张贴位置，随附着物一起决定</h1>
      </header>

      <div className="a5-body">
        <figure className="a5-image card">
          <svg className={`a5-forms-scene${formsIn ? " is-lit" : ""}`} viewBox="0 0 760 400" aria-hidden>
            <g className="a5-vignette">
              <rect className="a5-surface" x="24" y="150" width="212" height="104" rx="10" />
              <rect className="a5-labelchip" x="86" y="128" width="88" height="44" rx="8" />
            </g>
            <g className="a5-vignette">
              <path className="a5-arc" d="M 268 220 Q 372 128 476 220" />
              <rect className="a5-labelchip a5-labelchip-arc" x="330" y="140" width="84" height="40" rx="8" />
            </g>
            <g className="a5-vignette">
              <path className="a5-fold" d="M 524 96 L 640 96 L 736 208 L 620 208 Z" />
              <path className="a5-labelchip-edge" d="M 576 128 L 636 128 L 668 168 L 608 168 Z" />
            </g>
          </svg>
          <figcaption className="a5-ph">M002 · 平面、弧面与包装边缘现场图（待补入）</figcaption>
        </figure>

        <div className="a5-rail">
          <article className="a5-item card">
            <p className="a5-item-kicker">
              <span className="hero-num">01</span>牵动两件事
            </p>
            <p className="a5-item-line">
              这层关系，牵动<strong>用什么材质</strong>、<strong>贴在什么位置</strong>。
            </p>
            <div className={`a5-forms${formsIn ? " is-in" : ""}`}>
              {FORMS.map((f, i) => (
                <span
                  key={f}
                  className="a5-form"
                  style={{ "--a5-i": String(i) } as CSSProperties}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className={`a5-forms-note${formsIn ? " is-in" : ""}`}>
              同一个标识内容，要考虑的东西不一样。
            </p>
          </article>

          <article className={`a5-item card${contactIn ? " is-in" : ""}`}>
            <p className="a5-item-kicker">
              <span className="hero-num">02</span>接触方式
            </p>
            <p className="a5-item-line">接触方式变了，合适的材质和位置也跟着变。</p>
          </article>

          <article className={`a5-item card${orderIn ? " is-in" : ""}`}>
            <p className="a5-item-kicker">
              <span className="hero-num">03</span>决定顺序
            </p>
            <p className="a5-item-line">材质和位置，跟着附着物一起定下来。</p>
            <p className="a5-contrast">
              <span className="a5-contrast-wrong">先定好材质，再去找地方贴</span>
              <span className="a5-contrast-verdict">这个顺序，是反的</span>
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
