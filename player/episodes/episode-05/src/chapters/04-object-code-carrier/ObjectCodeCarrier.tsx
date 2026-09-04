import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ObjectCodeCarrier.css";

/* states: outline 第 4 章 semantic states（4 narration beats 一一映射） */
const states = [
  "object-band-set",
  "code-carrier-stacked",
  "swappable-noted",
  "same-object-confirmed",
] as const;
type OccState = (typeof states)[number];

const OBJECT_ITEMS = ["零部件", "设备", "产品"];
const QR_CELLS: Array<[number, number]> = [
  [13, 1],
  [18, 2],
  [13, 6],
  [27, 9],
  [9, 13],
  [18, 13],
  [27, 14],
  [1, 18],
  [6, 18],
  [13, 18],
  [22, 18],
  [9, 27],
  [14, 23],
  [23, 27],
];
const BAR_WIDTHS = [3, 2, 5, 2, 3, 6, 2, 4, 2, 3];

/* 身份编码：IC 芯片图形（数字身份的图形化，非真实芯片） */
function CodeChipGlyph() {
  const pins = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 84 64" className="occ-chip" aria-hidden>
      <rect x="20" y="6" width="44" height="52" rx="6" className="occ-chip-body" />
      <rect x="32" y="20" width="20" height="24" rx="3" className="occ-chip-core" />
      {pins.map((i) => (
        <rect
          key={i}
          x={i % 2 === 0 ? 6 : 64}
          y={14 + Math.floor(i / 2) * 14}
          width="12"
          height="5"
          rx="2"
          className="occ-chip-pin"
          style={{ "--occ-i": String(i) } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/* 二维码图形（示意网格，非真实码值） */
function QrGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="1" y="1" width="10" height="10" className="occ-qr-finder" />
      <rect x="4" y="4" width="4" height="4" className="occ-qr-dot" />
      <rect x="21" y="1" width="10" height="10" className="occ-qr-finder" />
      <rect x="24" y="4" width="4" height="4" className="occ-qr-dot" />
      <rect x="1" y="21" width="10" height="10" className="occ-qr-finder" />
      <rect x="4" y="24" width="4" height="4" className="occ-qr-dot" />
      {QR_CELLS.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="4"
          height="4"
          className="occ-qr-cell"
          style={{ "--occ-i": String(i) } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/* 条形码图形（示意条组，非真实码值） */
function BarcodeGlyph() {
  let x = 0;
  const bars = BAR_WIDTHS.map((w, i) => {
    const rect = { x, w, i };
    x += w + 2;
    return rect;
  });
  return (
    <svg viewBox="0 0 54 40" className="occ-barcode" aria-hidden>
      {bars.map(({ x, w, i }) => (
        <rect
          key={i}
          x={x}
          y="4"
          width={w}
          height="32"
          className="occ-bar"
          style={{ "--occ-i": String(i) } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/* 标签图形（吊牌形状，非真实标签） */
function TagGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path
        d="M14 4 H40 a4 4 0 0 1 4 4 V36 a4 4 0 0 1 -4 4 H14 L2 28 V16 Z"
        className="occ-tag-body"
      />
      <circle cx="12" cy="22" r="3.4" className="occ-tag-hole" />
      <rect x="20" y="14" width="16" height="4" rx="2" className="occ-tag-line" />
      <rect x="20" y="24" width="11" height="4" rx="2" className="occ-tag-line" />
    </svg>
  );
}

const CARRIERS = [
  { name: "二维码", glyph: <QrGlyph className="occ-glyph-qr" /> },
  { name: "条形码", glyph: <BarcodeGlyph /> },
  { name: "标签", glyph: <TagGlyph className="occ-glyph-tag" /> },
];

export default function ObjectCodeCarrier({ step }: ChapterStepProps) {
  const state: OccState = states[step] ?? states[states.length - 1];
  const stacked =
    state === "code-carrier-stacked" ||
    state === "swappable-noted" ||
    state === "same-object-confirmed";
  const noted = state === "swappable-noted" || state === "same-object-confirmed";
  const confirmed = state === "same-object-confirmed";

  return (
    <div className="occ-scene scene-pad" data-state={state}>
      <header className="occ-head">
        <h1 className="occ-title">
          <span className="occ-t occ-t--object">对象</span>
          <span className="occ-title-sep">、</span>
          <span className="occ-t occ-t--code">编码</span>
          <span className="occ-title-sep">、</span>
          <span className="occ-t occ-t--carrier">载体</span>
          <span className="occ-title-rest">：三个概念分开</span>
        </h1>
      </header>

      <div className="occ-main">
        {/* 三条有序层带：自上而下累计组装 */}
        <div className="occ-stack">
          <section className="occ-band occ-band--object is-placed">
            <span className="occ-band-idx hero-num">01</span>
            <div className="occ-band-body">
              <div className="occ-band-name">
                <h2 className="occ-band-title">对象</h2>
                <p className="occ-band-def">需要被识别的主体</p>
              </div>
              <ul className="occ-objects">
                {OBJECT_ITEMS.map((item, i) => (
                  <li
                    key={item}
                    className="occ-object-chip"
                    style={{ "--occ-i": String(i) } as CSSProperties}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={`occ-band occ-band--code${stacked ? " is-placed" : ""}`}>
            <span className="occ-band-idx hero-num">02</span>
            <div className="occ-band-body">
              <div className="occ-band-name">
                <h2 className="occ-band-title">身份编码</h2>
                <p className="occ-band-def">赋给对象的数字身份</p>
              </div>
              <div className="occ-chip-figure">
                <CodeChipGlyph />
                <span className="occ-chip-tag">数字身份</span>
              </div>
            </div>
          </section>

          <section className={`occ-band occ-band--carrier${stacked ? " is-placed" : ""}`}>
            <span className="occ-band-idx hero-num">03</span>
            <div className="occ-band-body">
              <div className="occ-band-name">
                <h2 className="occ-band-title">标识载体</h2>
                <p className="occ-band-def">把编码带到现场</p>
              </div>
              <ul className="occ-carriers">
                {CARRIERS.map((carrier, i) => (
                  <li
                    key={carrier.name}
                    className="occ-carrier-tile"
                    style={{ "--occ-i": String(i) } as CSSProperties}
                  >
                    {carrier.glyph}
                    <span className="occ-carrier-name">{carrier.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* 侧栏替换说明卡：s3 换样式/换载体，s4 补打/同一对象 */}
        <aside
          className={`occ-side${noted ? " is-on" : ""}${confirmed ? " is-confirmed" : ""}`}
        >
          <p className="occ-side-kicker">替换说明</p>

          <div className="occ-swap" aria-hidden>
            <span className={`occ-swap-tile occ-swap-tile--qr${noted ? " is-swapped" : ""}`}>
              <QrGlyph className="occ-glyph-qr" />
              <span className="occ-swap-tile-name">二维码</span>
            </span>
            <span className="occ-swap-core">同一编码</span>
            <span className={`occ-swap-tile occ-swap-tile--tag${noted ? " is-swapped" : ""}`}>
              <TagGlyph className="occ-glyph-tag" />
              <span className="occ-swap-tile-name">标签</span>
            </span>
          </div>

          <ul className="occ-notes">
            <li className="occ-note" style={{ "--occ-i": "0" } as CSSProperties}>
              标签样式换了，编码背后的规则不会跟着变
            </li>
            <li className="occ-note" style={{ "--occ-i": "1" } as CSSProperties}>
              同一个身份编码，也能换一种载体带到现场
            </li>
            <li className="occ-note occ-note--late" style={{ "--occ-i": "2" } as CSSProperties}>
              标签旧了、破了，可以补一张新的
            </li>
          </ul>

          <p className="occ-stamp">
            <span className="occ-stamp-pre">新标签 · 承载同一编码</span>
            <span className="occ-stamp-main">系统识别的仍是原对象</span>
          </p>
        </aside>
      </div>
    </div>
  );
}
