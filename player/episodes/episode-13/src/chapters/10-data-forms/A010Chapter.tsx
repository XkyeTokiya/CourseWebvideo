import "./A010Chapter.css";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A010 · 数据形态 —— parallel-cards-self-contained / parallel-then-transform
 * 三张形态卡等权落位（各带一幅小图示：规整表格 / 带标签层次的日志 / 图纸图片文档）
 * → 映射带：三卡汇入「解析 → 转换 → 映射」轨道，汇入「统一的数据规范」
 * → takeaway 收束。三卡并列等权，完成后不留当前选中项。
 */
const stateByStep = [
  "structured-card-shown",
  "semi-structured-added",
  "three-forms-equal",
  "mapping-to-standard",
] as const;

type FormState = (typeof stateByStep)[number];

/** 日志行：level = 层次缩进，tag = 行首标签块 */
const LOG_LINES = [
  { level: 0, tag: true },
  { level: 1, tag: false },
  { level: 1, tag: true },
  { level: 2, tag: false },
  { level: 0, tag: false },
] as const;

const FLOW_WORDS = ["解析", "转换", "映射"] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state: FormState = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad df-root" data-state={state}>
      <header className="df-head">
        <h1 className="df-headline">三种数据形态</h1>
        <hr className="rule df-head-rule" />
        <p className="df-head-note">连接器面对的数据也不只有一种形态</p>
      </header>

      <div className="df-cards">
        <article className="df-card df-card-1">
          <h2 className="df-card-title">
            <span className="df-card-term">结构化数据<span className="df-card-colon">：</span></span>
            <span className="df-card-desc">表格中规整的记录</span>
          </h2>
          <div className="df-card-fig df-table" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={`df-cell ${i < 3 ? "df-cell-head" : "df-cell-body"}`}
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </div>
        </article>

        <article className="df-card df-card-2">
          <h2 className="df-card-title">
            <span className="df-card-term">半结构化数据<span className="df-card-colon">：</span></span>
            <span className="df-card-desc">带有标签和层次的日志</span>
          </h2>
          <div className="df-card-fig df-log" aria-hidden="true">
            {LOG_LINES.map((line, i) => (
              <span
                key={i}
                className={`df-log-line df-log-l${line.level}`}
                style={{ "--i": i } as CSSProperties}
              >
                {line.tag ? <span className="df-log-tag" /> : null}
                <span className="df-log-bar" />
              </span>
            ))}
          </div>
        </article>

        <article className="df-card df-card-3">
          <h2 className="df-card-title">
            <span className="df-card-term">非结构化数据<span className="df-card-colon">：</span></span>
            <span className="df-card-desc">图纸、图片和文档</span>
          </h2>
          <div className="df-card-fig df-shapes" aria-hidden="true">
            <span className="df-shape df-shape-sheet" style={{ "--i": 0 } as CSSProperties}>
              <i />
              <i />
              <i />
            </span>
            <span className="df-shape df-shape-photo" style={{ "--i": 1 } as CSSProperties}>
              <i className="df-photo-sun" />
              <i className="df-photo-hill" />
            </span>
            <span className="df-shape df-shape-doc" style={{ "--i": 2 } as CSSProperties}>
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        </article>
      </div>

      <section className="df-mapping" aria-label="解析、转换和映射，使其符合统一的数据规范">
        <svg className="df-mapping-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} className="df-map-drop" style={{ "--i": 0 } as CSSProperties} d="M15.8 0 V 26" />
          <path pathLength={1} className="df-map-drop" style={{ "--i": 1 } as CSSProperties} d="M50 0 V 56" />
          <path pathLength={1} className="df-map-drop" style={{ "--i": 2 } as CSSProperties} d="M84.2 0 V 26" />
          <path pathLength={1} className="df-map-drop" style={{ "--i": 3 } as CSSProperties} d="M15.8 26 L 47.6 56" />
          <path pathLength={1} className="df-map-drop" style={{ "--i": 4 } as CSSProperties} d="M84.2 26 L 52.4 56" />
          <path pathLength={1} className="df-map-rail" style={{ "--i": 5 } as CSSProperties} d="M50 56 H 80" />
        </svg>
        <span className="df-merge-node" aria-hidden="true" />
        <div className="df-flow">
          {FLOW_WORDS.map((word, i) => (
            <span key={word} className="df-flow-item" style={{ "--i": i } as CSSProperties}>
              {i > 0 ? (
                <span className="df-flow-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
              <span className="df-flow-chip">{word}</span>
            </span>
          ))}
        </div>
        <div className="df-standard">
          <span className="df-standard-text">统一的数据规范</span>
        </div>
      </section>

      <div className="df-takeaway">
        <span className="df-take-mark" aria-hidden="true" />
        <p className="df-take-text">不同形态的数据，都要转换到统一的数据规范</p>
        <span className="df-take-mark" aria-hidden="true" />
      </div>
    </div>
  );
}
