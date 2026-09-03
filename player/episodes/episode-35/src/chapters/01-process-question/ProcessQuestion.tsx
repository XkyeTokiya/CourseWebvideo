import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ProcessQuestion.css";

const states = ["process-chain-established", "question-dominant"] as const;
type PqState = (typeof states)[number];

const PROCESSES = ["切削", "热处理", "清洗", "喷涂"] as const;

function QrGlyph({ damaged }: { damaged: boolean }) {
  // 7x7 QR-like finder pattern; damaged state distorts cells
  const cells = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1],
    [0, 1, 0, 1, 1, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];
  return (
    <svg viewBox="0 0 84 84" className="pq-qr" aria-hidden>
      {cells.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={c * 12 + 2}
              y={r * 12 + 2}
              width={8}
              height={8}
              className={damaged ? "pq-qr-cell is-damaged" : "pq-qr-cell"}
              style={
                {
                  "--pq-d": damaged ? `${(r * 7 + c) * 28}ms` : "0ms",
                } as CSSProperties
              }
            />
          ) : null,
        ),
      )}
      <line x1="0" y1="42" x2="84" y2="42" className="pq-qr-scanline" />
    </svg>
  );
}

export default function ProcessQuestion({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const questionDominant = state === "question-dominant";

  return (
    <div className="pq-scene scene-pad">
      <header className={`pq-anchor${questionDominant ? " is-weak" : ""}`}>
        <p className="pq-anchor-title">
          <span className="pq-anchor-badge hero-num">T0</span>
          设想现场 · 汽车零部件车间
        </p>
        <span className="pq-fiction-note">通用制造情境</span>
      </header>

      <div className={`pq-main${questionDominant ? " is-weak" : ""}`}>
        <figure className="pq-media">
          <div className="pq-photo-placeholder card" data-tone="image">
            <span className="pq-ph-label">image · 16:9</span>
            <span className="pq-ph-desc">M001 表面处理工位实景（待补入）</span>
          </div>
        </figure>

        <div className="pq-chain">
          <p className="pq-chain-caption">从毛坯到成品，一串工序</p>
          <ol className="pq-chain-track">
            {PROCESSES.map((p, i) => (
              <li
                key={p}
                className="pq-chain-node card"
                style={{ "--pq-i": String(i) } as CSSProperties}
              >
                <span className="pq-node-idx hero-num">{`0${i + 1}`}</span>
                <span className="pq-node-name">{p}</span>
              </li>
            ))}
          </ol>

          <div
            className={`pq-contrast${questionDominant ? " is-on" : ""}`}
            aria-hidden={!questionDominant}
          >
            <div className="pq-contrast-cell card" data-tone="ok">
              <QrGlyph damaged={false} />
              <p className="pq-contrast-tag">工艺前</p>
              <p className="pq-contrast-verdict is-good">头一回扫，很顺</p>
            </div>
            <div className="pq-contrast-cell card" data-tone="risk">
              <QrGlyph damaged />
              <p className="pq-contrast-tag">工艺后</p>
              <p className="pq-contrast-verdict is-bad">可能读不出</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`pq-question${questionDominant ? " is-on" : ""}`} aria-hidden={!questionDominant}>
        <div className="pq-question-plate card-glass">
          <p className="pq-question-kicker">标识载体选型要回答</p>
          <p className="pq-question-hero">
            怎样让这个码<em>一直读得出来？</em>
          </p>
          <p className="pq-question-sub">表面会怎样变化 · 现场用什么设备读 · 成本可接受</p>
        </div>
      </div>
    </div>
  );
}
