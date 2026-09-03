import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./GeometryFieldLimits.css";

const states = [
  "geometry-anchored",
  "field-factors-added",
  "cause-attributed",
] as const;
type GfState = (typeof states)[number];

const FIELD_FACTORS = ["产品颜色", "零件大小", "现场照明", "机台安装位置"] as const;

const CAUSES = ["对象", "光线", "设备"] as const;

// 7x7 QR-like pattern engraved onto the curved surface
const QR_CELLS = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1],
  [0, 1, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
];

/* Shared geometry anchor: metal cylinder seen slightly from above.
   Columns are wrapped onto the visible arc (sin mapping) so edge columns
   compress hard; rows bow with the surface curvature — the engraved
   pattern visibly deforms compared with the flat reference grid. */
const COLS = 7;
const ROWS = 7;
const GRID_CX = 490;
const GRID_RX = 210;
const GRID_CY = 430;
const GRID_HY = 130;
const ARC_NORM = Math.sin((Math.PI * 0.92) / 2);
const arcAt = (u: number) => Math.sin(Math.PI * 0.92 * u) / ARC_NORM;

type DeformedCell = { x: number; y: number; w: number; h: number } | null;

const DEFORMED_CELLS: DeformedCell[] = (() => {
  const cells: DeformedCell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!QR_CELLS[r][c]) {
        cells.push(null);
        continue;
      }
      const sL = arcAt(c / COLS - 0.5);
      const sR = arcAt((c + 1) / COLS - 0.5);
      const sMid = (sL + sR) / 2;
      const bow = Math.sqrt(1 - 0.82 * sMid * sMid);
      const vT = r / ROWS - 0.5;
      const h = ((2 * GRID_HY) / ROWS) * bow;
      cells.push({
        x: GRID_CX + GRID_RX * sL + 1,
        y: GRID_CY + 2 * GRID_HY * vT * bow + 1,
        w: GRID_RX * (sR - sL) - 2,
        h: h - 2,
      });
    }
  }
  return cells;
})();

function CylinderAnchor() {
  return (
    <svg viewBox="0 0 900 710" className="gf-svg" aria-hidden>
      <defs>
        <clipPath id="gf-cyl-clip">
          <path d="M210,210 L770,210 L770,610 A280,58 0 0 1 210,610 Z" />
        </clipPath>
        <marker
          id="gf-arrow"
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="4.5"
          orient="auto"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" className="gf-arrow-tip" />
        </marker>
        <marker
          id="gf-arrow-warn"
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="4.5"
          orient="auto"
        >
          <path d="M0,0 L8,4.5 L0,9 Z" className="gf-arrow-tip is-warn" />
        </marker>
      </defs>

      {/* 平面展开参照 */}
      <g className="gf-ghost">
        <rect x="60" y="40" width="150" height="150" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v${i}`}
            x1={60 + i * (150 / 7)}
            y1="40"
            x2={60 + i * (150 / 7)}
            y2="190"
          />
        ))}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`h${i}`}
            x1="60"
            y1={40 + i * (150 / 7)}
            x2="210"
            y2={40 + i * (150 / 7)}
          />
        ))}
      </g>
      <text x="60" y="216" className="gf-note gf-note-ghost">
        平面参照
      </text>
      <path
        d="M226,118 C300,140 310,240 296,330"
        className="gf-ghost-arrow"
        markerEnd="url(#gf-arrow)"
      />

      {/* 灯光方向 */}
      <g className="gf-lamp">
        <line x1="762" y1="72" x2="750" y2="56" />
        <line x1="802" y1="72" x2="814" y2="56" />
        <line x1="782" y1="58" x2="782" y2="40" />
        <circle cx="782" cy="92" r="16" />
      </g>
      <text x="812" y="100" className="gf-note gf-note-lamp">
        灯光
      </text>
      <line
        x1="766"
        y1="116"
        x2="652"
        y2="296"
        className="gf-beam"
        markerEnd="url(#gf-arrow-warn)"
      />

      {/* 圆柱体 + 刻在其上的码 */}
      <path d="M210,210 L770,210 L770,610 A280,58 0 0 1 210,610 Z" className="gf-cyl-body" />
      <ellipse cx="490" cy="210" rx="280" ry="58" className="gf-cyl-top" />
      <g className="gf-cells">
        {DEFORMED_CELLS.map((cell, i) =>
          cell ? (
            <rect
              key={i}
              x={cell.x}
              y={cell.y}
              width={cell.w}
              height={cell.h}
              className="gf-cell"
              style={{ "--gf-d": String(i) } as CSSProperties}
            />
          ) : null,
        )}
      </g>

      {/* 反光光柱（clip 到柱面，连续扫描） */}
      <g className="gf-band" clipPath="url(#gf-cyl-clip)">
        <rect x="520" y="150" width="130" height="530" rx="40" className="gf-band-soft" />
        <rect x="552" y="150" width="66" height="530" rx="33" className="gf-band-core" />
      </g>

      {/* SVG 内标注 */}
      <text x="24" y="438" className="gf-note gf-note-deform">
        图形容易变形
      </text>
      <line
        x1="168"
        y1="430"
        x2="258"
        y2="430"
        className="gf-leader gf-leader-deform"
        markerEnd="url(#gf-arrow-warn)"
      />
      <text x="884" y="388" textAnchor="end" className="gf-note gf-note-band">
        反光光柱
      </text>
      <line
        x1="796"
        y1="382"
        x2="668"
        y2="410"
        className="gf-leader gf-leader-band"
        markerEnd="url(#gf-arrow-warn)"
      />
      <text
        x="490"
        y="696"
        textAnchor="middle"
        className="gf-note gf-note-code"
      >
        刻在圆柱曲面上的码
      </text>
    </svg>
  );
}

export default function GeometryFieldLimits({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const reached = (target: GfState) =>
    states.indexOf(state) >= states.indexOf(target);
  const anchored = reached("geometry-anchored");
  const factorsAdded = reached("field-factors-added");
  const concluded = reached("cause-attributed");

  return (
    <div className={`gf-scene scene-pad${concluded ? " is-concluded" : ""}`}>
      <header className="gf-head">
        <p className="gf-kicker">约束三 · 现场环境与几何形态</p>
        <h1 className="gf-title">几何与现场条件共同设卡</h1>
      </header>

      <div className="gf-main">
        <div className="gf-anchor">
          <CylinderAnchor />
        </div>

        <div className="gf-col">
          <section
            className={`gf-group gf-group1 card${anchored ? " is-on" : ""}`}
            aria-hidden={!anchored}
          >
            <p className="gf-gkicker">几何设卡 · 曲面与反光</p>
            <div className="gf-g1-rows">
              <p className="gf-g1-row" style={{ "--gf-d": "0" } as CSSProperties}>
                <span className="gf-g1-term">曲面刻码</span>
                <span className="gf-g1-arrow">→</span>
                <span className="gf-g1-desc">图形容易变形</span>
              </p>
              <p className="gf-g1-row" style={{ "--gf-d": "1" } as CSSProperties}>
                <span className="gf-g1-term">圆柱面 + 灯光</span>
                <span className="gf-g1-arrow">→</span>
                <span className="gf-g1-desc">可能反出一道光柱</span>
              </p>
            </div>
          </section>

          <section
            className={`gf-group gf-group2 card${factorsAdded ? " is-on" : ""}`}
            aria-hidden={!factorsAdded}
          >
            <p className="gf-gkicker">现场四因素</p>
            <div className="gf-factors">
              {FIELD_FACTORS.map((f, i) => (
                <span
                  key={f}
                  className="gf-factor"
                  style={{ "--gf-d": String(i) } as CSSProperties}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="gf-g2-foot">叠加在一起，都会让读码变难</p>
          </section>

          <section
            className={`gf-group gf-group3 card-glass${concluded ? " is-on" : ""}`}
            aria-hidden={!concluded}
          >
            <p className="gf-gkicker is-warn">边界注 · 归因</p>
            <p className="gf-attrib-hero">很多时候读不出来，并不是码做错了</p>
            <p className="gf-attrib-row">
              {CAUSES.map((cause, i) => (
                <span key={cause} className="gf-cause-wrap">
                  {i > 0 && <span className="gf-cause-x hero-num">×</span>}
                  <span
                    className="gf-cause"
                    style={{ "--gf-d": String(i) } as CSSProperties}
                  >
                    {cause}
                  </span>
                </span>
              ))}
              <span className="gf-attrib-verb">一起造成的</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
