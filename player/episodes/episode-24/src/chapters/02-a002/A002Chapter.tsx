import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002Chapter.css";

const states = [
  "definition-stated",
  "forms-laid",
  "form-limit-marked",
  "distance-flagged",
] as const;

const LOG_LINES = [
  { w: 72, x: 0 },
  { w: 46, x: 34 },
  { w: 88, x: 12 },
  { w: 38, x: 48 },
  { w: 64, x: 6 },
] as const;

const LIMIT_CHIPS = ["准确理解", "关联", "使用"] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const formsOn = step >= 1;
  const limitOn = step >= 2;
  const gapOn = step >= 3;

  return (
    <div
      className={`a2-scene scene-pad${formsOn ? " is-forms" : ""}${
        limitOn ? " is-limit" : ""
      }${gapOn ? " is-gap" : ""}`}
      data-state={state}
    >
      <header className="a2-head">
        <p className="a2-kicker">先定义，再看形态</p>
        <h1 className="a2-title">
          数据要素<em>是什么</em>
        </h1>
      </header>

      <div className="a2-main">
        <section className="a2-def card" aria-label="数据要素定义">
          <p className="a2-tag">定义</p>
          <p className="a2-def-text">
            参与社会生产经营活动、能给所有者或使用者带来经济效益的<strong>数据资源</strong>
          </p>
          <span className="rule a2-def-rule" />
        </section>

        <div className="a2-forms">
          <p
            className={`a2-ghost a2-forms-ghost${formsOn ? " is-off" : ""}`}
            aria-hidden="true"
          >
            两族形态 · 待落位
          </p>

          <article
            className="a2-form card"
            style={{ "--a2-f": "0" } as CSSProperties}
          >
            <p className="a2-form-line"><strong>结构化数据</strong>：表格，字段整整齐齐</p>
            <div className="a2-spec a2-spec-table" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} className="a2-cell" style={{ "--a2-i": String(i) } as CSSProperties}>
                  <b />
                </i>
              ))}
            </div>
          </article>

          <article
            className="a2-form card"
            style={{ "--a2-f": "1" } as CSSProperties}
          >
            <p className="a2-form-line"><strong>半结构化和非结构化数据</strong>：日志、文档，没那么规整</p>
            <div className="a2-spec a2-spec-log" aria-hidden="true">
              {LOG_LINES.map((l, i) => (
                <i
                  key={i}
                  className="a2-log-line"
                  style={
                    {
                      "--a2-i": String(i),
                      width: `${l.w}%`,
                      marginLeft: `${l.x}px`,
                    } as CSSProperties
                  }
                >
                  <b />
                </i>
              ))}
            </div>
          </article>
        </div>

        <div className="a2-limits">
          <div className="a2-limit-slot">
            <p
              className={`a2-ghost a2-limit-ghost${limitOn ? " is-off" : ""}`}
              aria-hidden="true"
            >
              形态边界 · 待落位
            </p>
            <section className="a2-limit a2-limit-org">
              <p className="a2-limit-cap">形态 · 组织方式</p>
              <p className="a2-limit-line">
                用什么形态放着，<strong>只说明它怎么被组织</strong>
              </p>
              <p className="a2-limit-sub">并不保证</p>
              <div className="a2-limit-chips">
                {LIMIT_CHIPS.map((c, i) => (
                  <span
                    key={c}
                    className="a2-chip"
                    style={{ "--a2-c": String(i) } as CSSProperties}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="a2-limit-slot">
            <p
              className={`a2-ghost a2-limit-ghost${gapOn ? " is-off" : ""}`}
              aria-hidden="true"
            >
              距离 · 待落位
            </p>
            <section className="a2-limit a2-limit-gap">
              <p className="a2-limit-cap">采集 · 要素</p>
              <div className="a2-gap-row" aria-hidden="true">
                <span className="a2-gap-plate">被采集下来</span>
                <span className="a2-dim">
                  <i className="a2-dim-seg" />
                  <em className="a2-dim-label">还隔着一段距离</em>
                </span>
                <span className="a2-gap-plate">能持续利用的要素</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
