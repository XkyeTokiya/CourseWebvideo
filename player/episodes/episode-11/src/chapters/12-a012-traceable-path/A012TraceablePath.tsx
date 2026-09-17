import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A012TraceablePath.css";

/**
 * A012 · 路径如何成立 —— packet A012 / recipe: linear-steps-to-result
 *
 * 一个持续主构图承载三拍：
 * beat 1（object-path-formed）：建立标题；同一拍内先亮「围绕同一标识的可查询记录」步，
 *   再亮「可追踪的对象路径」步——路径线自绘贯穿、环节由虚转实，顺序收敛后两步稳定保留。
 *   R019（记录可查询使路径成立）由记录步 → 路径步的单向步骤顺序承载。
 * beat 2（path-readable）：保持路径，沿线补入三个读取点——从哪里来 / 经过了哪些阶段 /
 *   现在处在哪一类业务环节；三点等权保留，不留当前选中项。
 * beat 3（locate-then-coordinate-shown）：保持路径（弱化让位），转向补入终端结果区——
 *   肘形连接线自路径末端下行（R020 pivot：定位之后才谈协同），先定位对象与记录，
 *   再组织跨主体协同；两段按先后点亮后稳定保留。
 * 护栏 C013：定位与协同只写成“可以做到”（先…再…），不出现实时 / 无延迟 / 全自动。
 */
const stateByStep = [
  "object-path-formed", // beat 1：标题 + 记录步 → 路径步，同拍顺序点亮
  "path-readable", // beat 2：保持路径，沿线补入三个读取点
  "locate-then-coordinate-shown", // beat 3：保持路径，转向补入终端结果区
] as const;

type A012State = (typeof stateByStep)[number];

const STAGES = ["生产", "仓储", "运输", "药房"] as const;

type ReadPoint = {
  k: number;
  text: string;
  x: number;
  w: number;
  from?: number;
  to?: number;
};

const READ_POINTS: ReadPoint[] = [
  { k: 0, text: "从哪里来", x: 250, w: 164 },
  { k: 1, text: "经过了哪些阶段", x: 835, w: 246, from: 640, to: 1030 },
  { k: 2, text: "现在处在哪一类业务环节", x: 1420, w: 348 },
];

export default function A012TraceablePath({ step }: ChapterStepProps) {
  const state: A012State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const readable = state !== "object-path-formed";
  const terminal = state === "locate-then-coordinate-shown";

  return (
    <div
      className={`tp-scene scene-pad${readable ? " is-readable" : ""}${
        terminal ? " is-terminal" : ""
      }`}
    >
      <header className="tp-head">
        <span className="tp-mark" aria-hidden="true" />
        <h1 className="tp-title">从环节到对象路径</h1>
      </header>

      <div className="tp-demo" aria-hidden="true">
        <svg
          className="tp-path-svg"
          viewBox="0 0 1660 540"
          preserveAspectRatio="xMidYMid meet"
        >
          <text className="tp-caption" x="60" y="44">
            围绕<tspan className="tp-caption-key">同一标识</tspan>
            ，各阶段记录可查询、可关联
          </text>

          {/* 前提：一串互不相认的环节（虚线框 + 断开的连接残段） */}
          {[0, 1, 2].map((g) => (
            <g key={`gap-${g}`}>
              <line
                className="tp-gap"
                x1={378 + g * 390}
                y1={352}
                x2={424 + g * 390}
                y2={352}
              />
              <line
                className="tp-gap"
                x1={466 + g * 390}
                y1={352}
                x2={512 + g * 390}
                y2={352}
              />
            </g>
          ))}

          {/* R019 第二步：对象路径自绘贯穿（同拍后亮） */}
          <path className="tp-path" d="M 116 352 H 1572" pathLength={100} />
          <polyline className="tp-path-arrow" points="1550,334 1578,352 1550,370" />
          <text className="tp-path-label" x="1600" y="44">
            可以追踪的对象路径
          </text>

          {/* R019 第一步：围绕同一标识的可查询记录（同拍先亮） */}
          {STAGES.map((name, k) => {
            const cx = 250 + k * 390;
            return (
              <g key={`rec-${name}`}>
                <line className="tp-link" x1={cx} y1={190} x2={cx} y2={300} />
                <g className="tp-record" style={{ "--tp-k": String(k) } as CSSProperties}>
                  <rect
                    className="tp-record-box"
                    x={cx - 148}
                    y={64}
                    width={296}
                    height={126}
                  />
                  <text className="tp-record-title" x={cx} y={110} textAnchor="middle">
                    {name}记录
                  </text>
                  <rect className="tp-record-chip" x={cx - 66} y={130} width={132} height={34} />
                  <text className="tp-record-chip-text" x={cx} y={153} textAnchor="middle">
                    同一标识
                  </text>
                </g>
              </g>
            );
          })}

          {/* 环节节点：路径成立后由虚转实 */}
          {STAGES.map((name, k) => {
            const cx = 250 + k * 390;
            return (
              <g key={`stage-${name}`} className="tp-stage" style={{ "--tp-k": String(k) } as CSSProperties}>
                <rect className="tp-stage-box" x={cx - 112} y={300} width={224} height={104} />
                <text className="tp-stage-name" x={cx} y={364} textAnchor="middle">
                  {name}
                </text>
              </g>
            );
          })}

          {/* beat 2：对象标记落位 */}
          <line className="tp-parcel-line" x1={1420} y1={276} x2={1420} y2={300} />
          <g className="tp-parcel">
            <rect className="tp-parcel-box" x={1396} y={226} width={48} height={48} />
            <rect className="tp-parcel-band" x={1396} y={244} width={48} height={12} />
            <line className="tp-parcel-tape" x1={1420} y1={226} x2={1420} y2={274} />
          </g>
          <text className="tp-parcel-label" x={1462} y={260}>
            一盒药
          </text>

          {/* beat 2：路径沿线的三个读取点 */}
          {READ_POINTS.map((p) => (
            <g key={`read-${p.k}`} className="tp-read" style={{ "--tp-k": String(p.k) } as CSSProperties}>
              {p.from !== undefined && p.to !== undefined ? (
                <path
                  className="tp-bracket"
                  d={`M ${p.from} 440 L ${p.from} 424 L ${p.to} 424 L ${p.to} 440`}
                />
              ) : (
                <line className="tp-read-pointer" x1={p.x} y1={408} x2={p.x} y2={442} />
              )}
              <rect className="tp-read-tag" x={p.x - p.w / 2} y={448} width={p.w} height={44} />
              <text className="tp-read-text" x={p.x} y={479} textAnchor="middle">
                {p.text}
              </text>
            </g>
          ))}

          {/* beat 3：定位框在对象上收拢 */}
          <path
            className="tp-locate-mark"
            d="M 1384 232 L 1384 214 L 1402 214 M 1438 214 L 1456 214 L 1456 232 M 1456 268 L 1456 286 L 1438 286 M 1402 286 L 1384 286 L 1384 268"
            pathLength={100}
          />
        </svg>
      </div>

      {/* R020 转向排布 + 终端结果区：先定位，再协同 */}
      <section className="tp-result" aria-label="出了问题时的两步处理">
        <svg
          className="tp-elbow"
          viewBox="0 0 1660 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="tp-elbow-turn" d="M 1420 2 L 1420 28 L 74 28 L 74 50" pathLength={100} />
          <polyline className="tp-elbow-arrow" points="60,36 74,54 88,36" />
        </svg>

        <div className="tp-band">
          <div className="tp-band-head">
            <h2>真的出了问题</h2>
            <p>处理可以分两步走</p>
          </div>

          <article className="tp-card tp-locate">
            <span className="tp-tag">先定位</span>
            <p className="tp-card-text">定位到具体的对象和相关记录</p>
            <svg className="tp-mini" viewBox="0 0 132 72" aria-hidden="true">
              <path
                className="tp-corners"
                d="M 4 22 L 4 4 L 22 4 M 110 4 L 128 4 L 128 22 M 128 50 L 128 68 L 110 68 M 22 68 L 4 68 L 4 50"
              />
              <circle className="tp-obj" cx="38" cy="36" r="8" />
              <rect className="tp-rec-line" x="60" y="22" width="56" height="9" />
              <rect className="tp-rec-line" x="60" y="41" width="56" height="9" />
            </svg>
          </article>

          <svg className="tp-band-arrow" viewBox="0 0 52 32" aria-hidden="true">
            <line x1="4" y1="16" x2="34" y2="16" />
            <polyline points="26,6 40,16 26,26" />
          </svg>

          <article className="tp-card tp-coordinate">
            <span className="tp-tag tp-tag--go">再协同</span>
            <p className="tp-card-text">组织跨主体的协同处理</p>
            <svg className="tp-mini" viewBox="0 0 132 72" aria-hidden="true">
              <circle className="tp-subject" cx="16" cy="12" r="7" />
              <circle className="tp-subject" cx="16" cy="36" r="7" />
              <circle className="tp-subject" cx="16" cy="60" r="7" />
              <line
                className="tp-net"
                x1="24"
                y1="14"
                x2="96"
                y2="34"
                pathLength={100}
                style={{ "--tp-k": "0" } as CSSProperties}
              />
              <line
                className="tp-net"
                x1="24"
                y1="36"
                x2="96"
                y2="38"
                pathLength={100}
                style={{ "--tp-k": "1" } as CSSProperties}
              />
              <line
                className="tp-net"
                x1="24"
                y1="58"
                x2="96"
                y2="42"
                pathLength={100}
                style={{ "--tp-k": "2" } as CSSProperties}
              />
              <rect className="tp-joint" x="96" y="24" width="28" height="28" />
            </svg>
          </article>
        </div>
      </section>
    </div>
  );
}
