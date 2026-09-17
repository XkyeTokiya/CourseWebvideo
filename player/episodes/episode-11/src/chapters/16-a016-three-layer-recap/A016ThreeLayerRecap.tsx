import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A016ThreeLayerRecap.css";

/**
 * A016 · 三层关系复述 — Courseplay-bound base scene S-A016。
 * recipe: image-with-reading-notes · 关系机制：persistent-media-reading ——
 * M005 主图区持续在场，阅读顺序沿注释条推进：身份条先亮、入口条后亮（R025）；
 * 要点区补入与药品追溯码的区分说明；注释区按序点亮五个观察阶段复述条；
 * 最终五条记录线向同一对象汇聚，收束判断亮出跨主体协同的基础（R026）。
 * 注释条为 screen_guidance（S058–S061，reference）与本章 beats 的三源重组；
 * 收束处不加下一期主题（护栏 C017）。
 */
const stateByStep = [
  "identity-entry-recapped",
  "code-distinction-recapped",
  "stages-recapped",
  "coordination-basis-settled",
] as const;

type A016State = (typeof stateByStep)[number];

/** 五个观察阶段 = 本章口播 beat 3 的罗列顺序，不增删、不改写。 */
const STAGES = ["原料进厂", "生产加工", "仓储物流", "终端销售", "市场消费"];

export default function A016ThreeLayerRecap({ step }: ChapterStepProps) {
  const state: A016State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const distinct =
    state === "code-distinction-recapped" ||
    state === "stages-recapped" ||
    state === "coordination-basis-settled";
  const staged =
    state === "stages-recapped" || state === "coordination-basis-settled";
  const settled = state === "coordination-basis-settled";

  return (
    <div
      className={`tl-scene scene-pad${distinct ? " is-distinct" : ""}${
        staged ? " is-staged" : ""
      }${settled ? " is-settled" : ""}`}
    >
      <header className="tl-head">
        <p className="tl-kicker">工业互联网标识解析</p>
        <h1 className="tl-title">身份、入口与阶段</h1>
      </header>

      <div className="tl-body">
        {/* M005 未就位：只保留素净空白版位，不放任何占位图或占位文案 */}
        <div className="tl-media" aria-hidden="true" />

        <section className="tl-notes" aria-label="读图注释">
          {/* 01 · 身份条（reading-order 槽位，先于入口条 · R025） */}
          <article className="tl-note tl-note--identity">
            <span className="tl-note-no hero-num">01</span>
            <div className="tl-note-copy">
              <h2>唯一身份</h2>
              <p>为物理实体和数字对象建立唯一身份</p>
            </div>
            <svg className="tl-id-demo" viewBox="0 0 200 84" aria-hidden="true">
              <rect className="tl-id-solid" x="14" y="32" width="36" height="36" />
              <rect className="tl-id-dashed" x="108" y="32" width="36" height="36" />
              <rect className="tl-id-chip tl-id-chip--a" x="38" y="18" width="30" height="18" />
              <circle className="tl-id-dot tl-id-dot--a" cx="48" cy="27" r="3" />
              <rect className="tl-id-chip tl-id-chip--b" x="132" y="18" width="30" height="18" />
              <circle className="tl-id-dot tl-id-dot--b" cx="142" cy="27" r="3" />
            </svg>
          </article>

          {/* 02 · 入口条（key-points 槽位） */}
          <article className="tl-note tl-note--entry">
            <span className="tl-note-no hero-num">02</span>
            <div className="tl-note-copy">
              <h2>查询入口</h2>
              <p>提供查询与关联信息的入口</p>
            </div>
            <svg className="tl-entry-demo" viewBox="0 0 200 84" aria-hidden="true">
              <line className="tl-entry-line" x1="8" y1="42" x2="124" y2="42" pathLength={100} />
              <polyline className="tl-entry-head" points="124,30 140,42 124,54" />
              <circle className="tl-entry-node" cx="152" cy="42" r="11" />
              <g className="tl-entry-fan tl-entry-fan--a">
                <line x1="163" y1="36" x2="186" y2="21" />
                <rect x="183" y="14" width="8" height="8" />
              </g>
              <g className="tl-entry-fan tl-entry-fan--b">
                <line x1="164" y1="42" x2="188" y2="42" />
                <rect x="188" y="38" width="8" height="8" />
              </g>
              <g className="tl-entry-fan tl-entry-fan--c">
                <line x1="163" y1="48" x2="186" y2="63" />
                <rect x="183" y="62" width="8" height="8" />
              </g>
            </svg>
          </article>

          {/* 要点区 · 与药品追溯码区分开（第 2 拍补入） */}
          <article className="tl-keypoint">
            <div className="tl-key-copy">
              <h2>与药品追溯码区分开</h2>
              <p className="tl-key-chips">
                <span>体系不同</span>
                <span>识别逻辑相通</span>
              </p>
              <p className="tl-key-bridge">
                <span>先识别对象</span>
                <svg viewBox="0 0 34 16" aria-hidden="true">
                  <polyline points="3,3 19,8 3,13" />
                </svg>
                <span>再关联信息</span>
              </p>
            </div>
            <svg className="tl-code-demo" viewBox="0 0 210 96" aria-hidden="true">
              <g className="tl-code-glyph tl-code-glyph--a">
                <line x1="28" y1="32" x2="28" y2="64" strokeWidth="4" />
                <line x1="40" y1="24" x2="40" y2="72" strokeWidth="8" />
                <line x1="52" y1="32" x2="52" y2="64" strokeWidth="4" />
                <line x1="63" y1="24" x2="63" y2="72" strokeWidth="8" />
              </g>
              <line className="tl-code-divider" x1="105" y1="24" x2="105" y2="72" />
              <g className="tl-code-glyph tl-code-glyph--b">
                <circle cx="152" cy="30" r="6" />
                <line x1="152" y1="38" x2="138" y2="58" strokeWidth="3.5" />
                <line x1="152" y1="38" x2="166" y2="58" strokeWidth="3.5" />
                <circle className="tl-code-tick" cx="138" cy="62" r="4" />
                <circle className="tl-code-tick" cx="166" cy="62" r="4" />
              </g>
            </svg>
          </article>

          {/* 注释区 · 五个观察阶段复述条（第 3 拍按序补入） */}
          <section className="tl-stages" aria-label="五个观察阶段">
            <p className="tl-stages-kicker">五个观察阶段</p>
            <div className="tl-stage-band">
              <span className="tl-rail-line" aria-hidden="true" />
              <ol className="tl-stage-rail">
                {STAGES.map((name, i) => (
                  <li
                    key={name}
                    className="tl-stage"
                    style={{ "--tl-i": String(i) } as CSSProperties}
                  >
                    <span className="tl-stage-node" aria-hidden="true" />
                    <span className="tl-stage-name">{name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 收束判断（第 4 拍亮出；不加下一期主题 · C017） */}
          <article className="tl-takeaway">
            <svg className="tl-converge" viewBox="0 0 190 96" aria-hidden="true">
              <rect className="tl-converge-tick tl-converge-tick--1" x="7" y="4" width="14" height="8" />
              <rect className="tl-converge-tick tl-converge-tick--2" x="45" y="4" width="14" height="8" />
              <rect className="tl-converge-tick tl-converge-tick--3" x="83" y="4" width="14" height="8" />
              <rect className="tl-converge-tick tl-converge-tick--4" x="121" y="4" width="14" height="8" />
              <rect className="tl-converge-tick tl-converge-tick--5" x="159" y="4" width="14" height="8" />
              <path className="tl-converge-line tl-converge-line--a" d="M14 14 L86 62" pathLength={100} />
              <path className="tl-converge-line tl-converge-line--b" d="M52 14 L89 62" pathLength={100} />
              <path className="tl-converge-line tl-converge-line--c" d="M90 14 L90 62" pathLength={100} />
              <path className="tl-converge-line tl-converge-line--d" d="M128 14 L93 62" pathLength={100} />
              <path className="tl-converge-line tl-converge-line--e" d="M166 14 L96 62" pathLength={100} />
              <circle className="tl-converge-node" cx="91" cy="72" r="10" />
            </svg>
            <div className="tl-takeaway-copy">
              <p className="tl-take-line">
                这些阶段的记录
                <span className="tl-take-strong">围绕同一个对象被查询和关联</span>
              </p>
              <p className="tl-take-line tl-take-line--basis">
                跨主体的<span className="tl-take-mark">协同</span>就有了基础
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
