import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ObjectConstraint.css";

const states = ["object-factors-listed", "engraving-exemplified", "feasibility-checked"] as const;

const FACTORS = ["形态", "材质", "曲率", "可用面积", "机台空间"] as const;

const CHECKS = [
  { label: "曲面", ask: "会不会让图形变形" },
  { label: "设备", ask: "视野够不够" },
  { label: "后续工位", ask: "能不能靠近这个面" },
] as const;

/* 7x7 刻印点阵（0/1），齿轮端面二维码示意 */
const ENGRAVE_CELLS = [
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 0, 0, 1],
  [0, 0, 1, 0, 1, 1, 0],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1],
] as const;

const TEETH = 12;
const GEAR_CX = 600;
const GEAR_CY = 150;

function GearDemo({
  engraved,
  checked,
}: {
  engraved: boolean;
  checked: boolean;
}) {
  const svgClass = `oc-schematic-svg${engraved ? " is-engraved" : ""}${
    checked ? " is-checked is-warped" : ""
  }`;
  return (
    <svg viewBox="0 0 860 260" className={svgClass} aria-hidden>
      {/* 设备视野框 + 后续工位接近（step3 检查演示） */}
      <rect x={470} y={26} width={262} height={228} className="oc-vision" />
      <text x={474} y={18} className="oc-svg-tag">
        设备视野
      </text>
      <g className="oc-approach">
        <line x1={70} y1={208} x2={400} y2={208} className="oc-approach-line" />
        <path d="M400 198 L424 208 L400 218 Z" className="oc-approach-head" />
        <text x={70} y={190} className="oc-svg-tag">
          后续工位
        </text>
      </g>

      {/* 激光头与光束（step2 刻码演示） */}
      <g className="oc-laser">
        <path d="M580 4 h40 l-8 24 h-24 z" className="oc-nozzle" />
        <line x1={600} y1={30} x2={600} y2={114} className="oc-beam" />
        <circle cx={600} cy={118} r={5} className="oc-spark" />
      </g>

      {/* 齿轮（step1 组装落位） */}
      <g className="oc-gear">
        {Array.from({ length: TEETH }, (_, i) => (
          <g
            key={i}
            transform={`rotate(${(360 / TEETH) * i} ${GEAR_CX} ${GEAR_CY})`}
          >
            <rect
              x={GEAR_CX - 11}
              y={GEAR_CY - 98}
              width={22}
              height={20}
              rx={3}
              className="oc-tooth"
              style={{ "--oc-i": String(i) } as CSSProperties}
            />
          </g>
        ))}
        <circle cx={GEAR_CX} cy={GEAR_CY} r={78} className="oc-face" />
      </g>

      {/* 端面刻印点阵（step2 逐点点入，step3 曲面形变） */}
      <g className="oc-engrave">
        {ENGRAVE_CELLS.flatMap((row, r) =>
          row.map((v, c) =>
            v ? (
              <rect
                key={`${r}-${c}`}
                x={GEAR_CX - 28 + c * 8}
                y={GEAR_CY - 28 + r * 8}
                width={6.6}
                height={6.6}
                className="oc-engrave-cell"
                style={
                  {
                    "--oc-d": `${(r * 7 + c) * 30}ms`,
                    "--oc-wx": `${(-((r - 3) ** 2) * ((c - 3) / 3) * 1.2).toFixed(1)}px`,
                  } as CSSProperties
                }
              />
            ) : null,
          ),
        )}
        <path d="M562 196 Q600 208 638 196" className="oc-curve" />
      </g>
    </svg>
  );
}

export default function ObjectConstraint({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const engraved = state !== "object-factors-listed";
  const checked = state === "feasibility-checked";

  return (
    <div className="oc-scene scene-pad">
      <header className="oc-anchor">
        <p className="oc-anchor-title">对象允许什么，码才能做什么</p>
        <span className="oc-anchor-note">约束 · 先从对象看起</span>
      </header>

      <div className="oc-main">
        <figure className="oc-media">
          <div className="oc-photo-placeholder card" data-tone="image">
            <span className="oc-ph-label">image · 16:9</span>
            <span className="oc-ph-desc">M002 曲面齿形金属零部件实景（待补入）</span>
          </div>
          <div className="oc-schematic card">
            <p className="oc-schematic-caption">示意 · 齿面刻码与检查</p>
            <GearDemo engraved={engraved} checked={checked} />
          </div>
        </figure>

        <aside className="oc-rail">
          <article className="oc-insight card is-on">
            <p className="oc-insight-kicker">对象差异</p>
            <p className="oc-insight-title">行业不同，对象就不一样</p>
            <ul className="oc-factors">
              {FACTORS.map((f, i) => (
                <li
                  key={f}
                  className="oc-factor"
                  style={{ "--oc-i": String(i) } as CSSProperties}
                >
                  {f}
                </li>
              ))}
            </ul>
          </article>

          <article className={`oc-insight card${engraved ? " is-on" : ""}`} aria-hidden={!engraved}>
            <p className="oc-insight-kicker">齿轮示例</p>
            <p className="oc-insight-title">
              激光直接刻在零件表面，<em>载体与零件合为一体</em>
            </p>
          </article>

          <article className={`oc-insight card${checked ? " is-on" : ""}`} aria-hidden={!checked}>
            <p className="oc-insight-kicker">可行性检查</p>
            <ul className="oc-checks">
              {CHECKS.map((c, i) => (
                <li
                  key={c.label}
                  className="oc-check"
                  style={{ "--oc-i": String(i) } as CSSProperties}
                >
                  <span className="oc-check-idx hero-num">{`0${i + 1}`}</span>
                  <span className="oc-check-label">{c.label}</span>
                  <span className="oc-check-ask">{c.ask}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className={`oc-verdict card-glass${checked ? " is-on" : ""}`} aria-hidden={!checked}>
            <p className="oc-verdict-kicker">判断</p>
            <p className="oc-verdict-hero">
              先摸清<em>对象允许什么</em>，再谈码做成什么样
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
