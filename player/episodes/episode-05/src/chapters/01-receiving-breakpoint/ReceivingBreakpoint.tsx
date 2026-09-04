import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ReceivingBreakpoint.css";
import m001 from "./assets/m001.png";

/* states: outline 第 1 章 semantic states（4 narration beats 一一映射） */
const states = [
  "scene-anchored",
  "characters-read",
  "confirmation-stalled",
  "breakpoint-exposed",
] as const;
type RbState = (typeof states)[number];

const READOUT = "88.199.400/***";
const CHECK_ROWS = ["翻查到货清单", "逐一比对信息", "人工登记确认"];

function BarcodeGlyph() {
  // 条码图形：竖条组合 + 扫描线，扫码拍扫描线掠过
  const bars = [3, 7, 4, 10, 5, 8, 3, 9, 4, 6, 8, 3];
  let x = 0;
  const rects = bars.map((w, i) => {
    const rect = { x, width: w };
    x += w + 4;
    return rect;
  });
  return (
    <svg viewBox="0 0 80 64" className="rb-barcode" aria-hidden>
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x + 1}
          y={6}
          width={r.width}
          height={52}
          rx={1}
          className="rb-bar"
          style={{ "--rb-i": String(i) } as CSSProperties}
        />
      ))}
      <line x1="0" y1="10" x2="80" y2="10" className="rb-scanline" />
    </svg>
  );
}

export default function ReceivingBreakpoint({ step }: ChapterStepProps) {
  const state: RbState = states[step] ?? states[states.length - 1];
  const read = state !== "scene-anchored";
  const stalled = state === "confirmation-stalled" || state === "breakpoint-exposed";
  const closed = state === "breakpoint-exposed";

  return (
    <div className="rb-scene scene-pad">
      <header className={`rb-anchor${closed ? " is-weak" : ""}`}>
        <p className="rb-anchor-title">
          <span className="rb-anchor-badge hero-num">T0</span>
          设想现场 · 跨企业收货
        </p>
        <span className="rb-fiction-note">教学情境 · 非真实企业案例</span>
      </header>

      <div className="rb-main">
        <figure className={`rb-media${closed ? " is-closed" : ""}`}>
          <div className="rb-media-frame card">
            <img src={m001} alt="收货扫码核验现场占位图" className="rb-photo" />
            <div className="rb-media-tags">
              <span className="rb-chip">供应商发货</span>
              <span className="rb-chip-arrow" aria-hidden>
                →
              </span>
              <span className="rb-chip">制造商收货区</span>
              <span className="rb-chip is-tag">外包装均贴二维码</span>
            </div>
            <div className="rb-scrim" aria-hidden={!closed}>
              <p className="rb-scrim-kicker">二维码可扫描</p>
              <p className="rb-scrim-hero">
                对象身份，
                <em>却没有随标签一同到达</em>
              </p>
            </div>
          </div>
        </figure>

        <div className={`rb-aside${closed ? " is-weak" : ""}`}>
          <div className="rb-timeanchor">
            <div className="rb-node" data-tone={read ? "done" : "pending"}>
              <span className="rb-node-idx hero-num">1</span>
              <span className="rb-node-name">读出字符</span>
            </div>
            <div className="rb-node-line" aria-hidden />
            <div className="rb-node" data-tone={stalled ? "stalled" : "pending"}>
              <span className="rb-node-idx hero-num">2</span>
              <span className="rb-node-name">确认对象</span>
            </div>
          </div>

          <div className={`rb-scan card${read ? " is-on" : ""}${stalled ? " is-stalled" : ""}`}>
            <p className="rb-scan-tag">扫码枪 · readout</p>
            <div className="rb-scan-body">
              <BarcodeGlyph />
              <div className="rb-readout">
                <span className="rb-readout-idle" aria-hidden={!read}>
                  · · · · · ·
                </span>
                <span className="rb-readout-chars" aria-hidden={!read}>
                  {READOUT.split("").map((ch, i) => (
                    <span key={i} className="rb-char" style={{ "--rb-i": String(i) } as CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <p className="rb-verdict" aria-hidden={!stalled}>
              本企业系统 · 无法识别对象
            </p>
          </div>

          <div className={`rb-check card${stalled ? " is-stalled" : ""}`}>
            <p className="rb-check-tag">人工核对</p>
            <ol className="rb-check-rows">
              {CHECK_ROWS.map((row, i) => (
                <li key={row} className="rb-check-row" style={{ "--rb-i": String(i) } as CSSProperties}>
                  <span className="rb-check-mark" aria-hidden />
                  <span className="rb-check-text">{row}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
