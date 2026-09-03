import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ProcessRewritesCode.css";

const states = [
  "process-band-set",
  "change-dimensions-noted",
  "questions-raised",
  "checkpoints-set",
] as const;
type PrState = (typeof states)[number];

const PROCESSES = ["切削", "热处理", "清洗", "喷砂", "电镀", "喷涂"] as const;

const CHANGE_DIMENSIONS = ["颜色", "粗糙度", "纹理", "反光程度", "涂层"] as const;

const QUESTIONS = [
  "标识是在工艺之前做，还是工艺之后做？",
  "工艺会不会改变码面的对比度、形状或者附着状态？",
] as const;

const EXAMPLES = [
  { process: "热处理", effect: "码可能变暗", tone: "dim" },
  { process: "清洗", effect: "可能留下污渍", tone: "stain" },
] as const;

// 7x7 QR-like pattern used by the two "state change" demo glyphs
const QR_CELLS = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1],
  [0, 1, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
];

function QrCells({ dimmed }: { dimmed: boolean }) {
  return (
    <>
      {QR_CELLS.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={c * 12 + 2}
              y={r * 12 + 2}
              width={8}
              height={8}
              className={dimmed ? "pr-qr-cell is-dim" : "pr-qr-cell"}
              style={
                dimmed
                  ? ({ "--pr-d": `${(r * 7 + c) * 18}ms` } as CSSProperties)
                  : undefined
              }
            />
          ) : null,
        ),
      )}
    </>
  );
}

function DimGlyph() {
  return (
    <svg viewBox="0 0 84 84" className="pr-qr" aria-hidden>
      <QrCells dimmed />
    </svg>
  );
}

function StainGlyph() {
  return (
    <svg viewBox="0 0 84 84" className="pr-qr" aria-hidden>
      <QrCells dimmed={false} />
      <ellipse className="pr-stain is-a" cx="24" cy="26" rx="15" ry="11" />
      <ellipse className="pr-stain is-b" cx="58" cy="56" rx="17" ry="12" />
      <circle className="pr-stain is-c" cx="52" cy="20" r="7" />
    </svg>
  );
}

export default function ProcessRewritesCode({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const reached = (target: PrState) =>
    states.indexOf(state) >= states.indexOf(target);
  const dimsNoted = reached("change-dimensions-noted");
  const questionsRaised = reached("questions-raised");
  const checkpointsSet = reached("checkpoints-set");

  return (
    <div className={`pr-scene scene-pad${checkpointsSet ? " is-final" : ""}`}>
      <header className="pr-head">
        <p className="pr-kicker">约束二 · 表面处理工艺</p>
        <h1 className="pr-title">
          工艺会改写码面<em>，工艺前后都要检查</em>
        </h1>
      </header>

      <section className="pr-band-strip" aria-label="六类常见表面处理工艺">
        <p className="pr-strip-cap">六类常见表面处理工艺</p>
        <ol className="pr-band-track">
          {PROCESSES.map((p, i) => (
            <li
              key={p}
              className="pr-band card"
              style={{ "--pr-i": String(i) } as CSSProperties}
            >
              <span className="pr-band-idx hero-num">{`0${i + 1}`}</span>
              <span className="pr-band-name">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="pr-main">
        <figure className="pr-media">
          <div className="pr-photo card" data-tone="image">
            <span className="pr-ph-label">image · 4:3</span>
            <span className="pr-ph-desc">
              教材图 4-4 工艺前后码面对比原图（待补入）
            </span>
          </div>
        </figure>

        <div className="pr-notes">
          <div
            className={`pr-key pr-key1 card${dimsNoted ? " is-on" : ""}`}
            aria-hidden={!dimsNoted}
          >
            <p className="pr-key-kicker">变化维度 · 工艺可能改变</p>
            <div className="pr-dims">
              {CHANGE_DIMENSIONS.map((d, i) => (
                <span
                  key={d}
                  className="pr-dim-chip"
                  style={{ "--pr-d": String(i) } as CSSProperties}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`pr-key pr-key2 card${questionsRaised ? " is-on" : ""}`}
            aria-hidden={!questionsRaised}
          >
            <p className="pr-key-kicker">两个选型问题 · 载体是跟着产品一起走的</p>
            <div className="pr-questions">
              {QUESTIONS.map((q, i) => (
                <p
                  key={q}
                  className="pr-q-row"
                  style={{ "--pr-d": String(i) } as CSSProperties}
                >
                  <span className="pr-q-badge hero-num">{`Q${i + 1}`}</span>
                  {q}
                </p>
              ))}
            </div>
          </div>

          <div
            className={`pr-key pr-key3 card${checkpointsSet ? " is-on" : ""}`}
            aria-hidden={!checkpointsSet}
          >
            <p className="pr-key-kicker">检查点 · 状态改变即重新评估</p>
            <div className="pr-check">
              <div className="pr-examples">
                {EXAMPLES.map((e, i) => (
                  <div
                    key={e.process}
                    className="pr-example"
                    style={{ "--pr-d": String(i) } as CSSProperties}
                  >
                    {e.tone === "dim" ? <DimGlyph /> : <StainGlyph />}
                    <p className="pr-example-tag">{e.process}</p>
                    <p className="pr-example-effect">{e.effect}</p>
                  </div>
                ))}
              </div>
              <div className="pr-verdict">
                <p className="pr-verdict-line">工艺前后都是检查点</p>
                <p className="pr-verdict-sub">
                  状态变了，就重新评估<em>载体 · 打印方式 · 设备</em>这套组合
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
