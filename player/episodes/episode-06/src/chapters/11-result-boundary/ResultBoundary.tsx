import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ResultBoundary.css";

const states = [
  "result-cards-shown",
  "boundary-concluded",
] as const;
type RbState = (typeof states)[number];

const flags: Record<RbState, { cards: boolean; boundary: boolean }> = {
  "result-cards-shown": { cards: true, boundary: false },
  "boundary-concluded": { cards: true, boundary: true },
};

const INFO_CHIPS = ["地址", "位置", "元数据"] as const;
const CONTROLLED_SLABS = ["生产数据", "质量数据", "商业数据"] as const;

/* 入口卡演示：一条“继续访问”的箭头穿过槽口进入某项服务（抽象示意，非权限界面） */
function EntryGlyph() {
  return (
    <svg viewBox="0 0 460 150" className="rb-entry" aria-hidden>
      <rect x="306" y="28" width="142" height="94" className="rb-entry-slab" />
      <text x="398" y="108" className="rb-entry-slab-text">某项服务</text>
      <rect x="306" y="57" width="28" height="36" className="rb-entry-slot" />
      <g className="rb-entry-flow">
        <circle cx="26" cy="75" r="9" className="rb-entry-dot" />
        <line x1="44" y1="75" x2="330" y2="75" className="rb-entry-arrow" />
        <path d="M312 61 L336 75 L312 89" className="rb-entry-head" />
        <text x="56" y="45" className="rb-entry-cap">继续访问</text>
      </g>
    </svg>
  );
}

/* 边界演示：解析结果停在边界之前，受控数据逐层叠在边界之后（层叠挡板，非权限 UI） */
function BoundaryGlyph() {
  return (
    <svg viewBox="0 0 620 216" className="rb-bd" aria-hidden>
      <text x="356" y="24" className="rb-bd-behind-cap">受控数据</text>
      {CONTROLLED_SLABS.map((label, i) => (
        <g
          key={label}
          className="rb-bd-slab"
          style={{ "--rb-bi": String(i) } as CSSProperties}
        >
          <rect x={356 + i * 18} y={42 + i * 58} width="216" height="44" />
          <text x={356 + i * 18 + 108} y={42 + i * 58 + 30}>{label}</text>
        </g>
      ))}
      <line x1="312" y1="34" x2="312" y2="200" className="rb-bd-line" />
      <text x="312" y="24" className="rb-bd-line-cap">边界</text>
      <g className="rb-bd-front">
        <rect x="30" y="96" width="200" height="52" className="rb-bd-front-chip" />
        <text x="130" y="130" className="rb-bd-front-text">解析结果</text>
        <line x1="238" y1="122" x2="270" y2="122" className="rb-bd-front-arrow" />
        <path d="M258 108 L286 122 L258 136" className="rb-bd-front-head" />
      </g>
    </svg>
  );
}

export default function ResultBoundary({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className={`rb-scene scene-pad${f.boundary ? " is-concluded" : ""}`}>
      <header className="rb-header">
        <h1 className="rb-headline">
          查得回结果，<em>守得住边界</em>
        </h1>
      </header>

      <div className={`rb-main${f.cards ? " is-on" : ""}`}>
        <div className="rb-band">
          <div className="rule rb-band-rule" aria-hidden />
          <p className="rb-band-cap">解析结果的可能类型 · 例如</p>
        </div>

        <div className="rb-cards">
          <section className="rb-card card" data-kind="info">
            <header className="rb-card-head">
              <span className="rb-card-type">信息</span>
              <span className="rb-card-eg">例如</span>
            </header>
            <div className="rb-chips">
              {INFO_CHIPS.map((chip, i) => (
                <div
                  key={chip}
                  className="rb-chip"
                  style={{ "--rb-ci": String(i) } as CSSProperties}
                >
                  <span className="hero-num rb-chip-idx">{`0${i + 1}`}</span>
                  <span className="rb-chip-word">{chip}</span>
                </div>
              ))}
            </div>
            <p className="rb-card-sub">……等相关信息</p>
          </section>

          <section className="rb-card card" data-kind="entry">
            <header className="rb-card-head">
              <span className="rb-card-type">入口</span>
              <span className="rb-card-eg">例如</span>
            </header>
            <p className="rb-card-line">继续访问某项服务的入口</p>
            <EntryGlyph />
          </section>
        </div>

        <div className="rb-boundary" aria-hidden={!f.boundary}>
          <div className="rb-boundary-text">
            <p className="rb-boundary-kicker">推断边界</p>
            <p className="rb-boundary-mech">企业定义自己的数据访问方式</p>
            <p className="rb-boundary-judge">
              解析成功，<em>不等于</em>扫码后就能无条件拿到对象的全部生产、质量或商业数据。
            </p>
          </div>
          <div className="rb-boundary-visual">
            <BoundaryGlyph />
          </div>
        </div>
      </div>
    </div>
  );
}
