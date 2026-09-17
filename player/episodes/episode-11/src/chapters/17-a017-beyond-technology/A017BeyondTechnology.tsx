import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A017BeyondTechnology.css";

/**
 * A017 · 技术之外的那一半 — Courseplay-bound base scene S-A017。
 * recipe: image-with-insight-rail · 关系机制：persistent-media-reading ——
 * 现场语境主图持续在场，技术条与协同条左右对置亮出（R027）；第 2 拍对置短条
 * 保持，下移补入锚点条与全链说明条的上下收束（R028）。
 * S065「唯一标识是关联的锚点」为 exact：在第 2 拍锚点条中逐字完整可见。
 * 结尾不预告相邻主题（护栏 C018）。
 */
const stateByStep = [
  "law-stated",
  "anchor-operation-settled",
] as const;

type A017State = (typeof stateByStep)[number];

/** 三个条件词逐字取自本章口播 beat 2，不引入 packet 外事实。 */
const CONDITIONS = ["信任", "标准", "共享机制"];

export default function A017BeyondTechnology({ step }: ChapterStepProps) {
  const state: A017State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const settled = state === "anchor-operation-settled";

  return (
    <div className={`bt-scene scene-pad${settled ? " is-anchored" : ""}`}>
      <header className="bt-head">
        <div className="bt-head-copy">
          <h1 className="bt-title">共同规律</h1>
          <p className="bt-lead">技术之外的那一半</p>
        </div>
        {/* M006 未就位：只保留素净空白版位，不放任何占位图或占位文案 */}
        <div className="bt-media" aria-hidden="true" />
      </header>

      <section className="bt-pair" aria-label="技术与协同的对置">
        <article className="bt-side bt-side--tech">
          <h2 className="bt-side-name">技术</h2>
          <p className="bt-side-role">解决的是</p>
          <p className="bt-side-claim">认出同一个对象</p>
          <svg className="bt-demo" viewBox="0 0 560 150" aria-hidden="true">
            <rect className="bt-obj" x="30" y="42" width="110" height="74" />
            <rect className="bt-obj-tag" x="52" y="64" width="52" height="16" />
            <rect className="bt-obj" x="420" y="42" width="110" height="74" />
            <rect className="bt-obj-tag" x="442" y="64" width="52" height="16" />
            <line className="bt-recognize" x1="148" y1="79" x2="412" y2="79" />
            <rect className="bt-match" x="266" y="65" width="28" height="28" />
          </svg>
        </article>

        <div className="bt-divider" aria-hidden="true">
          <span className="bt-divider-line" />
          <svg className="bt-force bt-force--a" viewBox="0 0 26 34">
            <polyline points="4,4 18,17 4,30" />
          </svg>
          <svg className="bt-force bt-force--b" viewBox="0 0 26 34">
            <polyline points="22,4 8,17 22,30" />
          </svg>
        </div>

        <article className="bt-side bt-side--coop">
          <h2 className="bt-side-name">协同</h2>
          <p className="bt-side-role">解决的是</p>
          <p className="bt-side-claim">愿不愿意把记录交出来</p>
          <svg className="bt-demo" viewBox="0 0 560 150" aria-hidden="true">
            <line className="bt-boundary" x1="280" y1="8" x2="280" y2="142" />
            <g className="bt-record">
              <rect x="70" y="34" width="120" height="82" />
              <line className="bt-rec-line bt-rec-line--a" x1="92" y1="60" x2="168" y2="60" />
              <line className="bt-rec-line bt-rec-line--b" x1="92" y1="82" x2="152" y2="82" />
              <line className="bt-rec-line bt-rec-line--c" x1="92" y1="102" x2="136" y2="102" />
            </g>
            <polyline className="bt-hand" points="302,68 330,77 302,86" />
          </svg>
        </article>
      </section>

      <section className="bt-close" aria-label="锚点与运转条件">
        <article className="bt-anchor">
          <svg className="bt-anchor-glyph" viewBox="0 0 64 64" aria-hidden="true">
            <circle pathLength={100} cx="32" cy="12" r="8" />
            <line pathLength={100} x1="32" y1="20" x2="32" y2="48" />
            <line pathLength={100} x1="18" y1="30" x2="46" y2="30" />
            <path pathLength={100} d="M10 38 C 14 54 26 60 32 60 C 38 60 50 54 54 38" />
          </svg>
          <p className="bt-anchor-text">
            <strong className="bt-anchor-key">唯一标识是关联的锚点</strong>
            <span className="bt-anchor-rest">
              ——它让全链数据具备被追踪和关联的基础
            </span>
          </p>
        </article>
        <article className="bt-operation">
          {CONDITIONS.map((cond) => (
            <span key={cond} className="bt-cond">
              {cond}
            </span>
          ))}
          <p className="bt-operation-text">决定这条链能不能真正运转起来</p>
        </article>
      </section>
    </div>
  );
}
