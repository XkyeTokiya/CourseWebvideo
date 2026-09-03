import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./CandidateCompare.css";

const states = ["left-column-set", "both-columns-set", "thesis-concluded"] as const;
type CcState = (typeof states)[number];

const DIMENSIONS = ["对象价值", "使用次数", "读写方式", "现场维护负担"] as const;

const BURDENS = [
  {
    tag: "便宜的标签",
    miss: "清洗后读不出",
    cost: "补印 · 重贴 · 人工核对",
    tone: "warn",
  },
  {
    tag: "成本高的方案",
    miss: "没有合适设备",
    cost: "同样落不了地",
    tone: "bad",
  },
] as const;

// 一维码条纹宽度序列（定性演示，无任何数字含义上屏）
const BAR_WIDTHS = [10, 4, 16, 4, 10, 8, 4, 16, 6, 4, 12, 8, 4, 10, 6, 4, 14, 4, 8, 6] as const;

function BarcodeGlyph() {
  let cursor = 6;
  const bars = BAR_WIDTHS.map((w, i) => {
    const bar = { x: cursor, w, i };
    cursor += w + 5;
    return bar;
  });
  const total = cursor + 4;
  return (
    <svg viewBox={`0 0 ${total} 120`} className="cc-barcode" aria-hidden>
      {bars.map(({ x, w, i }) => (
        <rect
          key={i}
          x={x}
          y={8}
          width={w}
          height={92}
          className="cc-bar"
          style={{ "--cc-b": String(i) } as CSSProperties}
        />
      ))}
      <line x1={0} y1={110} x2={total} y2={110} className="cc-bar-base" />
    </svg>
  );
}

function RfGlyph() {
  return (
    <svg viewBox="0 0 268 120" className="cc-rf" aria-hidden>
      <rect x={14} y={30} width={120} height={60} rx={10} className="cc-rf-tag" />
      <rect x={34} y={48} width={26} height={24} rx={4} className="cc-rf-chip" />
      <path
        d="M158 24 A 62 62 0 0 1 158 96"
        className="cc-wave"
        style={{ "--cc-w": "0ms" } as CSSProperties}
      />
      <path
        d="M186 10 A 84 84 0 0 1 186 110"
        className="cc-wave"
        style={{ "--cc-w": "360ms" } as CSSProperties}
      />
      <path
        d="M214 -4 A 108 108 0 0 1 214 124"
        className="cc-wave"
        style={{ "--cc-w": "720ms" } as CSSProperties}
      />
    </svg>
  );
}

export default function CandidateCompare({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const stateIndex = states.indexOf(state);
  const rightSet = stateIndex >= 1;
  const thesisOn = stateIndex >= 2;

  return (
    <div className={`cc-scene scene-pad${thesisOn ? " is-thesis" : ""}`}>
      <header className="cc-head">
        <h1 className="cc-head-title">
          候选定性比较，<em>成本只是维度之一</em>
        </h1>
        <p className="cc-head-note">定性对照 · 不换算成数字</p>
      </header>

      <div className="cc-columns">
        <section className="cc-col card">
          <header className="cc-col-head">
            <span className="cc-col-badge hero-num">A</span>
            <h2 className="cc-col-name">一维码 / 二维码</h2>
          </header>
          <figure className="cc-figure">
            <BarcodeGlyph />
          </figure>
          <hr className="rule" />
          <ul className="cc-traits">
            <li className="cc-trait" style={{ "--cc-t": "0ms" } as CSSProperties}>
              <span className="cc-trait-mark" />
              成本低
            </li>
            <li className="cc-trait" style={{ "--cc-t": "320ms" } as CSSProperties}>
              <span className="cc-trait-mark" />
              偏一次性使用
            </li>
          </ul>
        </section>

        {rightSet ? (
          <section className="cc-col card">
            <header className="cc-col-head">
              <span className="cc-col-badge hero-num">B</span>
              <h2 className="cc-col-name">RFID</h2>
            </header>
            <figure className="cc-figure">
              <RfGlyph />
            </figure>
            <hr className="rule" />
            <ul className="cc-traits">
              <li
                className="cc-trait is-warn"
                style={{ "--cc-t": "0ms" } as CSSProperties}
              >
                <span className="cc-trait-mark" />
                使用成本相对较高
              </li>
              <li
                className="cc-trait"
                style={{ "--cc-t": "320ms" } as CSSProperties}
              >
                <span className="cc-trait-mark" />
                存储容量 · 多标签识别
                <span className="cc-diff-tag">差异点</span>
              </li>
            </ul>
          </section>
        ) : (
          <section className="cc-col-ghost">
            <p className="cc-ghost-tag">待对照的候选</p>
          </section>
        )}
      </div>

      {thesisOn && (
        <section className="cc-thesis card-glass">
          <div className="cc-thesis-head">
            <p className="cc-thesis-kicker">成本判断</p>
            <p className="cc-thesis-line">
              成本要跟四个维度<em>放在一起看</em>
            </p>
          </div>
          <ul className="cc-dims">
            {DIMENSIONS.map((d, i) => (
              <li
                key={d}
                className="cc-dim"
                style={{ "--cc-i": String(i) } as CSSProperties}
              >
                <span className="cc-dim-idx hero-num">{`0${i + 1}`}</span>
                {d}
              </li>
            ))}
          </ul>
          <ul className="cc-burdens">
            {BURDENS.map((b, i) => (
              <li
                key={b.tag}
                className="cc-burden"
                style={{ "--cc-i": String(i) } as CSSProperties}
              >
                <span className="cc-burden-tag">{b.tag}</span>
                <span className="cc-burden-miss">{b.miss}</span>
                <span className="cc-burden-arrow">→</span>
                <span className={`cc-burden-cost is-${b.tone}`}>{b.cost}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
