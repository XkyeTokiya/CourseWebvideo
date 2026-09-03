import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./RouteValidation.css";

const states = [
  "first-read-set",
  "process-walked",
  "re-read-set",
  "combo-concluded",
] as const;

const NODES = [
  { num: "01", tag: "FIRST READ", name: "制作后先读一次", sub: "确认起点是好的" },
  { num: "02", tag: "PROCESS", name: "按真实顺序走完", sub: "表面处理工艺" },
  { num: "03", tag: "RE-READ", name: "工艺后重读", sub: "记录能否稳定识别" },
  { num: "04", tag: "DECIDE", name: "判断分支", sub: "码面状态 → 三条出路" },
] as const;

const DAMAGES = ["变形", "反光", "污染", "划伤"] as const;
const OUTS = ["换载体", "换打印方式", "变形修复"] as const;
const PROCESSES = ["切削", "热处理", "清洗", "喷涂"] as const;

/* SVG 路线坐标：制作点 → 工艺带 → 复读点 → 判断（不回流） */
const ROUTE_START = 70;
const ROUTE_END = 1610;
const DOT_X = [ROUTE_START, 960, 1150, ROUTE_END] as const;

function RouteSvg({ stepIdx }: { stepIdx: number }) {
  const dotX = DOT_X[stepIdx] ?? DOT_X[DOT_X.length - 1];
  const dashOffset = 1 - dotX / ROUTE_END;
  return (
    <figure className="rv-route" aria-hidden>
      <svg viewBox="0 0 1700 190" className="rv-route-svg">
        <line x1={ROUTE_START} y1="108" x2={ROUTE_END} y2="108" className="rv-route-base" />
        <line
          x1={ROUTE_START}
          y1="108"
          x2={ROUTE_END}
          y2="108"
          className="rv-route-progress"
          pathLength={1}
          style={{ strokeDashoffset: dashOffset } as CSSProperties}
        />
        {PROCESSES.map((p, i) => (
          <g key={p}>
            <rect x={244 + i * 189} y="74" width="172" height="68" rx="10" className="rv-band-cell" />
            <text x={330 + i * 189} y="116" textAnchor="middle" className="rv-band-label">
              {p}
            </text>
          </g>
        ))}
        <text x="612" y="56" textAnchor="middle" className="rv-route-note">
          表面处理工艺带 · 按真实顺序
        </text>
        <circle cx={ROUTE_START} cy="108" r="13" className="rv-route-marker" />
        <circle cx="1150" cy="108" r="13" className="rv-route-marker" />
        <path
          d="M1610 91 L1627 108 L1610 125 L1593 108 Z"
          className={`rv-route-decision${stepIdx === 3 ? " is-on" : ""}`}
        />
        <text x={ROUTE_START} y="166" textAnchor="middle" className="rv-route-cap">
          制作 · 先读
        </text>
        <text x="1150" y="166" textAnchor="middle" className="rv-route-cap">
          工艺后重读
        </text>
        <text x={ROUTE_END} y="166" textAnchor="middle" className="rv-route-cap">
          判断出路
        </text>
        <g className="rv-dot" style={{ transform: `translateX(${dotX}px)` } as CSSProperties}>
          <circle cx="0" cy="108" r="20" className="rv-dot-halo" />
          <circle cx="0" cy="108" r="11" className="rv-dot-core" />
        </g>
        <circle key={stepIdx} cx={dotX} cy="108" r="13" className="rv-ping" />
      </svg>
    </figure>
  );
}

export default function RouteValidation({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const stepIdx = states.indexOf(state);
  const takeawayOn = state === "combo-concluded";

  return (
    <div className="rv-scene scene-pad">
      <header className="rv-head">
        <div className="rv-head-main">
          <p className="rv-kicker">ROUTE VALIDATION · 真实路线</p>
          <p className="rv-title">沿真实路线验证整套组合</p>
        </div>
        <p className="rv-route-hint">制作 → 工艺 → 重读 → 判断</p>
      </header>

      <ol className="rv-band">
        {NODES.map((n, i) => {
          const revealed = i <= stepIdx;
          const cls = i === stepIdx ? "is-active" : i < stepIdx ? "is-past" : "is-upcoming";
          return (
            <li
              key={n.num}
              className={`rv-node card ${cls}`}
              style={{ "--rv-i": String(i) } as CSSProperties}
            >
              {revealed ? (
                <>
                  <div className="rv-node-top">
                    <span className="rv-node-idx hero-num">{n.num}</span>
                    <span className="rv-node-tag">{n.tag}</span>
                  </div>
                  <p className="rv-node-name">{n.name}</p>
                  <p className="rv-node-sub">{n.sub}</p>
                  {i === 3 && (
                    <div className="rv-branch">
                      <div className="rv-row">
                        <span className="rv-row-label">码面</span>
                        {DAMAGES.map((dm, di) => (
                          <span
                            key={dm}
                            className="rv-damage-chip"
                            style={{ "--rv-c": String(di) } as CSSProperties}
                          >
                            {dm}
                          </span>
                        ))}
                      </div>
                      <div className="rv-row">
                        <span className="rv-row-label">出路</span>
                        {OUTS.map((o, oi) => (
                          <span
                            key={o}
                            className="rv-out-chip"
                            style={{ "--rv-c": String(oi) } as CSSProperties}
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span className="rv-node-ghost">STEP {n.num}</span>
              )}
            </li>
          );
        })}
      </ol>

      <RouteSvg stepIdx={stepIdx} />

      <div className={`rv-takeaway${takeawayOn ? " is-on" : ""}`} aria-hidden={!takeawayOn}>
        <div className="rv-takeaway-plate card-glass">
          <span className="rv-takeaway-kicker">验证对象</span>
          <p className="rv-takeaway-hero">
            验证的是<span className="rv-chip is-combo">整套组合</span>，不是
            <span className="rv-chip is-single">一张摆着很好看的码图</span>
          </p>
        </div>
      </div>
    </div>
  );
}
