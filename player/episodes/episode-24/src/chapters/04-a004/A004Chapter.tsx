import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004Chapter.css";

const states = [
  "flow-framed",
  "questions-posed",
  "code-defined",
  "non-container-clarified",
] as const;

const DOMAINS = ["产线", "工厂", "企业"] as const;
const PLATE_CELLS = [24, 12, 20, 9, 28, 14, 22] as const;
const DATA_TAGS = ["生产数据", "质量数据", "物流数据"] as const;

/* 问题一：一条记录 → 设备 / 产品 两个候选对象 */
function QuestionOne() {
  return (
    <svg viewBox="0 0 360 204" className="a4-svg" aria-hidden="true">
      <g className="a4-svg-sheet">
        <rect x="18" y="52" width="112" height="84" rx="10" />
        <line x1="36" y1="74" x2="112" y2="74" />
        <line x1="36" y1="92" x2="94" y2="92" />
        <line x1="36" y1="110" x2="104" y2="110" />
      </g>
      <text x="74" y="160" className="a4-svg-tag" textAnchor="middle">一条记录</text>

      <path
        d="M132 82 C 178 58, 200 44, 240 38"
        className="a4-svg-branch"
        pathLength={100}
        style={{ "--a4-b": "0" } as CSSProperties}
      />
      <path
        d="M132 106 C 178 128, 200 140, 240 146"
        className="a4-svg-branch"
        pathLength={100}
        style={{ "--a4-b": "1" } as CSSProperties}
      />

      <g className="a4-svg-target">
        <rect x="246" y="12" width="76" height="52" rx="9" />
        <circle cx="272" cy="38" r="7" />
        <circle cx="298" cy="38" r="7" />
        <text x="284" y="88" className="a4-svg-label" textAnchor="middle">设备</text>
      </g>
      <text x="334" y="46" className="a4-svg-q" textAnchor="middle">?</text>

      <g className="a4-svg-target">
        <rect x="246" y="120" width="76" height="52" rx="9" />
        <line x1="246" y1="140" x2="322" y2="140" />
        <line x1="284" y1="140" x2="284" y2="172" />
        <text x="284" y="196" className="a4-svg-label" textAnchor="middle">产品</text>
      </g>
      <text x="334" y="154" className="a4-svg-q" textAnchor="middle">?</text>
    </svg>
  );
}

/* 问题二：两套系统的记录 → 是否同一对象 */
function QuestionTwo() {
  return (
    <svg viewBox="0 0 360 230" className="a4-svg" aria-hidden="true">
      <g className="a4-svg-sheet">
        <rect x="14" y="10" width="106" height="64" rx="9" />
        <line x1="30" y1="30" x2="104" y2="30" />
        <line x1="30" y1="46" x2="88" y2="46" />
        <line x1="30" y1="62" x2="98" y2="62" />
      </g>
      <text x="67" y="92" className="a4-svg-tag" textAnchor="middle">系统 1</text>

      <g className="a4-svg-sheet">
        <rect x="14" y="128" width="106" height="64" rx="9" />
        <line x1="30" y1="148" x2="104" y2="148" />
        <line x1="30" y1="164" x2="88" y2="164" />
        <line x1="30" y1="180" x2="98" y2="180" />
      </g>
      <text x="67" y="210" className="a4-svg-tag" textAnchor="middle">系统 2</text>

      <path
        d="M120 42 C 168 56, 190 70, 214 84"
        className="a4-svg-branch"
        pathLength={100}
        style={{ "--a4-b": "0" } as CSSProperties}
      />
      <path
        d="M120 160 C 168 146, 190 130, 214 116"
        className="a4-svg-branch"
        pathLength={100}
        style={{ "--a4-b": "1" } as CSSProperties}
      />

      <g className="a4-svg-node">
        <circle cx="258" cy="100" r="42" />
        <text x="258" y="94" textAnchor="middle">同一</text>
        <text x="258" y="118" textAnchor="middle">对象?</text>
      </g>
      <circle
        cx="258"
        cy="100"
        r="52"
        className="a4-svg-node-ring"
        pathLength={100}
      />
      <text x="316" y="46" className="a4-svg-q" textAnchor="middle">?</text>
    </svg>
  );
}

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const questionsOn = step >= 1;
  const codeOn = step >= 2;
  const containerOn = step >= 3;

  return (
    <div
      className={`a4-scene scene-pad${questionsOn ? " is-questions" : ""}${
        codeOn ? " is-code" : ""
      }${containerOn ? " is-container" : ""}`}
      data-state={state}
    >
      <header className="a4-head">
        <p className="a4-kicker">对象身份 · 记录归属</p>
        <h1 className="a4-title">
          先确认：记录在说<em>谁</em>
        </h1>
      </header>

      <section className="a4-flow" aria-label="数据流动范围">
        <p className="a4-flow-cap">流动范围</p>
        <div className="a4-flow-track">
          {DOMAINS.map((d, i) => (
            <Fragment key={d}>
              {i > 0 && (
                <span className="a4-link" style={{ "--a4-l": String(i - 1), "--a4-w": i === 1 ? "64px" : "108px" } as CSSProperties} aria-hidden="true">
                  <i className="a4-link-line" />
                  <i className="a4-link-tick" />
                  <i className="a4-link-tick a4-link-tick-r" />
                </span>
              )}
              <span className="a4-domain" style={{ "--a4-d": String(i) } as CSSProperties}>
                {d}
              </span>
            </Fragment>
          ))}
        </div>
        <p className="a4-flow-chip">接收方 · 先确认两件事</p>
      </section>

      <div className="a4-main">
        <div className="a4-questions">
          <p
            className={`a4-ghost a4-q-ghost${questionsOn ? " is-off" : ""}`}
            aria-hidden="true"
          >
            两个确认 · 待落位
          </p>
          <article
            className="a4-qcard card"
            style={{ "--a4-q": "0" } as CSSProperties}
          >
            <QuestionOne />
            <p className="a4-qtext">一条记录说的，是哪台设备、哪件产品？</p>
          </article>
          <article
            className="a4-qcard card"
            style={{ "--a4-q": "1" } as CSSProperties}
          >
            <QuestionTwo />
            <p className="a4-qtext">不同系统里的记录，是不是属于同一个对象？</p>
          </article>
        </div>

        <aside className="a4-side">
          <p
            className={`a4-ghost a4-side-ghost${codeOn ? " is-off" : ""}`}
            aria-hidden="true"
          >
            标识编码 · 待落位
          </p>
          <section className="a4-side-card card">
            <p className="a4-side-cap">标识编码</p>

            <div className="a4-plate" aria-hidden="true">
              <span className="a4-screw a4-screw-tl" />
              <span className="a4-screw a4-screw-tr" />
              <span className="a4-screw a4-screw-bl" />
              <span className="a4-screw a4-screw-br" />
              <div className="a4-cells">
                {PLATE_CELLS.map((w, i) => (
                  <i
                    key={i}
                    style={{ width: `${w}px`, "--a4-c": String(i) } as CSSProperties}
                  />
                ))}
              </div>
              <span className="a4-plate-cap">身份符号</span>
              <span className="a4-seal">身份固定</span>
            </div>

            <p className="a4-def">
              给一个物理对象或者虚拟对象一个能区分的身份符号，先把对象身份固定下来。
            </p>

            <div
              className={`a4-boundary${containerOn ? " is-on" : ""}`}
              aria-hidden={!containerOn}
            >
              <div className="a4-boundary-clip">
                <span className="rule a4-boundary-rule" />
                <p className="a4-boundary-text">
                  标识不是容器：一串代码承载的是对象身份，不是生产、质量、物流的业务数据
                </p>
                <div className="a4-outside" aria-hidden="true">
                  {DATA_TAGS.map((t, i) => (
                    <span
                      key={t}
                      className="a4-data"
                      style={{ "--a4-x": String(i) } as CSSProperties}
                    >
                      {t}
                    </span>
                  ))}
                  <span className="a4-noin">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M4 4 L16 16" />
                      <path d="M16 4 L4 16" />
                    </svg>
                    不装进代码
                  </span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
