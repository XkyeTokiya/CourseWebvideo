import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ScanAndQuestions.css";

const states = [
  "scene-confirmed",
  "questions-raised",
  "start-point-framed",
  "question-dominant",
] as const;
type SqState = (typeof states)[number];

const QUESTIONS = ["属于哪个批次？", "当前状态怎样？", "说明去哪里查看？"] as const;

const flags: Record<SqState, { questions: boolean; judgment: boolean; focus: boolean }> = {
  "scene-confirmed": { questions: false, judgment: false, focus: false },
  "questions-raised": { questions: true, judgment: false, focus: false },
  "start-point-framed": { questions: true, judgment: true, focus: false },
  "question-dominant": { questions: true, judgment: true, focus: true },
};

const CODE_CELLS = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 1, 1],
  [0, 1, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
];

function CodeGlyph() {
  return (
    <svg viewBox="0 0 84 84" className="sq-code" aria-hidden>
      {CODE_CELLS.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={c * 12 + 2}
              y={r * 12 + 2}
              width={8}
              height={8}
              className="sq-code-cell"
              style={{ "--sq-d": `${(r * 7 + c) * 22}ms` } as CSSProperties}
            />
          ) : null,
        ),
      )}
      <line x1="-4" y1="42" x2="88" y2="42" className="sq-scanline" />
      <path d="M24 44 L38 58 L62 30" className="sq-scan-check" />
    </svg>
  );
}

export default function ScanAndQuestions({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];
  const weak = f.focus;

  return (
    <div className="sq-scene scene-pad">
      <header className={`sq-header${weak ? " is-weak" : ""}`}>
        <h1 className="sq-headline">
          身份已确认，<em>信息问题才开始</em>
        </h1>
        <span className="sq-fiction-note">教学情境 · 非真实企业案例</span>
      </header>

      <div className={`sq-main${weak ? " is-weak" : ""}`}>
        <figure className="sq-media">
          <div className="sq-photo-placeholder card" data-tone="image">
            <span className="sq-ph-label">image · 16:9</span>
            <span className="sq-ph-desc">
              M001 收货质检现场：金属零部件与扫码终端（占位，待正式素材）
            </span>
          </div>
        </figure>

        <div className="sq-rail">
          <section className="sq-scan card">
            <p className="sq-scan-kicker">扫码终端</p>
            <div className="sq-scan-body">
              <CodeGlyph />
              <div className="sq-scan-read">
                <p className="sq-scan-pending">读取编码中…</p>
                <p className="sq-scan-confirm">终端确认了身份：就是它</p>
              </div>
            </div>
          </section>

          <div
            className={`sq-questions${f.questions ? " is-on" : ""}`}
            aria-hidden={!f.questions}
          >
            <p className="sq-questions-cap">新的问题一个接一个</p>
            {QUESTIONS.map((q, i) => (
              <div
                key={q}
                className="sq-q-card card"
                style={{ "--sq-i": String(i) } as CSSProperties}
              >
                <span className="sq-q-num hero-num">{`0${i + 1}`}</span>
                <span className="sq-q-text">{q}</span>
              </div>
            ))}
          </div>

          <div
            className={`sq-judgment card${f.judgment ? " is-on" : ""}`}
            data-tone="process"
            aria-hidden={!f.judgment}
          >
            <span className="sq-judgment-tag">查询的起点</span>
            <p className="sq-judgment-text">
              编码只确认了“查的是谁”——读到身份，<strong>只是查询的起点</strong>。
            </p>
          </div>
        </div>
      </div>

      <div className={`sq-focus${f.focus ? " is-on" : ""}`} aria-hidden={!f.focus}>
        <div className="sq-focus-plate card-glass">
          <p className="sq-focus-kicker">本集 · 标识解析体系</p>
          <p className="sq-focus-hero">
            拿着这个编码，<em>去哪里查，又能查到什么？</em>
          </p>
          <p className="sq-focus-sub">看标识解析体系怎样把一个编码，变成可以查询的信息</p>
        </div>
      </div>
    </div>
  );
}
