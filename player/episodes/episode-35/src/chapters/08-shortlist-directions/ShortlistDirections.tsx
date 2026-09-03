import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ShortlistDirections.css";

const states = [
  "positioning-set",
  "direction-one-set",
  "direction-two-set",
  "takeaway-concluded",
] as const;

const DIRECTIONS = [
  {
    id: "D1",
    num: "01",
    tone: "process",
    glyph: "label",
    cond: ["表面平整", "环境干净", "用一次就完"],
    verdict: "纸标签 / 直接打印",
    note: "都可以进候选",
  },
  {
    id: "D2",
    num: "02",
    tone: "warning",
    glyph: "shield",
    cond: ["经历高温", "上涂层", "强磨损"],
    verdict: "工艺后表面 × 读取方式",
    note: "放在一起验证",
  },
  {
    id: "D3",
    num: "03",
    tone: "cool",
    glyph: "wave",
    cond: ["需要重复使用", "一次识别多个标签"],
    verdict: "RFID 进候选",
    note: "有这些需求才进候选",
  },
] as const;

function LabelGlyph() {
  const lines = [
    { y: 34, w: 62 },
    { y: 50, w: 46 },
    { y: 66, w: 55 },
  ];
  const dots = [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [1, 2],
  ];
  return (
    <svg viewBox="0 0 180 120" className="sd-glyph" aria-hidden>
      <rect x="18" y="12" width="144" height="96" rx="10" className="sd-g-label" />
      {dots.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          x={34 + c * 12}
          y={26 + r * 12}
          width="8"
          height="8"
          rx="1.5"
          className="sd-g-dot"
        />
      ))}
      {lines.map((l, i) => (
        <rect
          key={l.y}
          x="78"
          y={l.y}
          width={l.w}
          height="8"
          rx="3"
          className="sd-g-line"
          style={{ "--sd-g": String(i) } as CSSProperties}
        />
      ))}
      <rect x="70" y="20" width="7" height="80" rx="3" className="sd-g-printbar" />
    </svg>
  );
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 180 120" className="sd-glyph" aria-hidden>
      <path
        d="M90 14 C104 34 116 44 116 62 C116 80 104 92 90 92 C76 92 64 80 64 62 C64 44 76 34 90 14 Z"
        className="sd-g-flame"
      />
      <circle cx="90" cy="64" r="11" className="sd-g-flame-core" />
      <path
        d="M90 32 L124 44 L124 72 C124 92 110 102 90 110 C70 102 56 92 56 72 L56 44 Z"
        className="sd-g-shield"
      />
    </svg>
  );
}

function WaveGlyph() {
  const arcs = [
    { r: 16, d: "M 82 46 A 16 16 0 0 1 82 74" },
    { r: 30, d: "M 89 34 A 30 30 0 0 1 89 86" },
    { r: 44, d: "M 96 22 A 44 44 0 0 1 96 98" },
  ];
  return (
    <svg viewBox="0 0 180 120" className="sd-glyph" aria-hidden>
      <rect x="18" y="42" width="48" height="36" rx="6" className="sd-g-tag" />
      <circle cx="42" cy="60" r="5" className="sd-g-dot" />
      {arcs.map((a, i) => (
        <path
          key={a.r}
          d={a.d}
          className="sd-g-arc"
          style={{ "--sd-g": String(i) } as CSSProperties}
        />
      ))}
    </svg>
  );
}

function SdGlyph({ kind }: { kind: "label" | "shield" | "wave" }) {
  if (kind === "label") return <LabelGlyph />;
  if (kind === "shield") return <ShieldGlyph />;
  return <WaveGlyph />;
}

export default function ShortlistDirections({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const idx = states.indexOf(state);
  const takeawayOn = state === "takeaway-concluded";

  return (
    <div className="sd-scene scene-pad">
      <header className="sd-head">
        <div className="sd-head-main">
          <p className="sd-kicker">SHORTLIST · 初选方向</p>
          <p className="sd-title">初选输出可验证的候选组合</p>
        </div>
        <p className="sd-positioning">提出可拿去验证的组合 · 不是排定名次</p>
      </header>

      <ol className="sd-cards">
        {DIRECTIONS.map((d, i) => {
          const landed = idx >= i + 1;
          return (
            <li
              key={d.id}
              className={`sd-card card${landed ? " is-landed" : " is-upcoming"}`}
              data-tone={d.tone}
              style={{ "--sd-i": String(i) } as CSSProperties}
            >
              {landed ? (
                <>
                  <div className="sd-card-top">
                    <span className="sd-card-idx hero-num">{d.num}</span>
                    <span className="sd-card-id">{d.id}</span>
                  </div>
                  <div className="sd-card-cond">
                    {d.cond.map((c, ci) => (
                      <span
                        key={c}
                        className="sd-chip"
                        style={{ "--sd-c": String(ci) } as CSSProperties}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <SdGlyph kind={d.glyph} />
                  <p className="sd-card-verdict">
                    <span className="sd-verdict-arrow" aria-hidden>
                      →
                    </span>
                    <span className="sd-verdict-text">{d.verdict}</span>
                  </p>
                  <p className="sd-card-note">{d.note}</p>
                </>
              ) : (
                <div className="sd-slot">
                  <span className="sd-slot-id">{d.id}</span>
                  <span className="sd-slot-label">候选方向 · 待落位</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className={`sd-takeaway${takeawayOn ? " is-on" : ""}`} aria-hidden={!takeawayOn}>
        <div className="sd-takeaway-plate card-glass">
          <span className="sd-stamp">
            <span className="sd-stamp-word">方向</span>
            <span className="sd-stamp-neq">≠</span>
            <span className="sd-stamp-word is-struck">
              结论<i className="sd-strike" />
            </span>
          </span>
          <div className="sd-takeaway-text">
            <p className="sd-takeaway-kicker">初选边界</p>
            <p className="sd-takeaway-hero">
              这些只是方向，<em>不是采购结论</em>。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
