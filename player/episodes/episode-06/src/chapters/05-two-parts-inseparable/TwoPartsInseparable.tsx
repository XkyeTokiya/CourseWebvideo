import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./TwoPartsInseparable.css";

const states = [
  "duties-placed",
  "interdependence-concluded",
] as const;
type TpState = (typeof states)[number];

const flags: Record<TpState, { thesis: boolean }> = {
  "duties-placed": { thesis: false },
  "interdependence-concluded": { thesis: true },
};

/* 左栏示意：抽象编码块内的格点（非真实编码数据） */
const CODE_CELLS = [
  [1, 0, 1, 1, 0, 1],
  [0, 1, 1, 0, 1, 0],
  [1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0],
];

/* 左栏图示：编码 → 赋予 → 对象获得身份（不与右栏连线） */
function CodeGrantDgm() {
  return (
    <svg viewBox="0 0 640 250" className="tp-dgm" aria-hidden>
      <rect x="24" y="58" width="180" height="110" rx="10" className="tp-code-box" />
      {CODE_CELLS.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={38 + c * 26}
              y={72 + r * 20}
              width="14"
              height="14"
              rx="2"
              className="tp-code-cell"
              style={{ "--d": `${(r * 6 + c) * 40}ms` } as CSSProperties}
            />
          ) : null,
        ),
      )}
      <text x="114" y="202" textAnchor="middle" className="tp-dgm-label">
        编码
      </text>

      <line x1="222" y1="113" x2="352" y2="113" className="tp-grant-arrow" />
      <polygon points="352,101 376,113 352,125" className="tp-grant-head" />
      <text x="287" y="90" textAnchor="middle" className="tp-dgm-cap">
        赋予
      </text>

      <rect x="396" y="64" width="170" height="98" rx="6" className="tp-part-body" />
      <circle cx="444" cy="113" r="14" className="tp-part-hole" />
      <circle cx="518" cy="113" r="14" className="tp-part-hole" />
      <line x1="481" y1="162" x2="481" y2="178" className="tp-id-tie" />
      <g className="tp-id-tag">
        <rect x="424" y="178" width="114" height="46" rx="9" className="tp-id-tag-rect" />
        <text x="481" y="209" textAnchor="middle" className="tp-id-tag-text">
          身份
        </text>
      </g>
    </svg>
  );
}

/* 右栏图示：身份 → 查询 → 唯一定位 / 信息查询（不与左栏连线） */
function ResolveDgm() {
  return (
    <svg viewBox="0 0 640 250" className="tp-dgm" aria-hidden>
      <g className="tp-id-chip">
        <rect x="24" y="92" width="116" height="56" rx="10" className="tp-chip-rect" />
        <text x="82" y="129" textAnchor="middle" className="tp-chip-text">
          身份
        </text>
      </g>

      <line x1="156" y1="120" x2="262" y2="120" className="tp-look-arrow" />
      <polygon points="262,108 286,120 262,132" className="tp-look-head" />
      <text x="209" y="97" textAnchor="middle" className="tp-dgm-cap tp-look-cap">
        查询
      </text>

      <rect x="296" y="48" width="316" height="150" rx="12" className="tp-look-frame" />
      <g className="tp-look-scope">
        <circle cx="592" cy="60" r="22" className="tp-scope-glass" />
        <line x1="607" y1="75" x2="624" y2="92" className="tp-scope-handle" />
      </g>

      <g className="tp-look-row tp-row-1">
        <circle cx="330" cy="86" r="8" className="tp-row-pin-head" />
        <line x1="330" y1="94" x2="330" y2="108" className="tp-row-pin-stem" />
        <text x="356" y="100" className="tp-row-text">唯一定位</text>
      </g>
      <g className="tp-look-row tp-row-2">
        <rect x="318" y="134" width="26" height="5" rx="2.5" className="tp-row-line" />
        <rect x="318" y="144" width="18" height="5" rx="2.5" className="tp-row-line" />
        <text x="356" y="152" className="tp-row-text">信息查询</text>
      </g>
    </svg>
  );
}

/* 底部失败对照小图：编码断口 / 检索无果 */
function FailNoCode() {
  return (
    <svg viewBox="0 0 76 76" className="tp-fail-icon" aria-hidden>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={8 + c * 16}
            y={14 + r * 16}
            width="12"
            height="12"
            rx="2"
            className="tp-fail-cell"
          />
        )),
      )}
      {[0, 1, 2].map((r) => (
        <rect
          key={r}
          x="56"
          y={14 + r * 16}
          width="12"
          height="12"
          rx="2"
          className="tp-fail-miss"
        />
      ))}
    </svg>
  );
}

function FailNoResolve() {
  return (
    <svg viewBox="0 0 76 76" className="tp-fail-icon" aria-hidden>
      <circle cx="34" cy="34" r="22" className="tp-fail-scope" />
      <line x1="49" y1="49" x2="64" y2="64" className="tp-fail-handle" />
      <text x="34" y="44" textAnchor="middle" className="tp-fail-q">
        ？
      </text>
    </svg>
  );
}

export default function TwoPartsInseparable({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className={`tp-scene scene-pad${f.thesis ? " is-concluded" : ""}`}>
      <h1 className="tp-headline">
        标识编码与解析系统，<em>缺一不可</em>
      </h1>

      <p className="tp-parts-cap">两个相互配合的部分</p>

      <div className="tp-cols">
        <section className="tp-col tp-col--code card">
          <header className="tp-col-head">
            <span className="tp-part-no">部分 · 01</span>
            <h2 className="tp-term">标识编码</h2>
          </header>
          <p className="tp-duty">
            为机器、产品、零部件以及虚拟资源<strong>赋予身份</strong>
          </p>
          <CodeGrantDgm />
        </section>

        <section className="tp-col tp-col--res card">
          <header className="tp-col-head">
            <span className="tp-part-no">部分 · 02</span>
            <h2 className="tp-term">解析系统</h2>
          </header>
          <p className="tp-duty">
            利用身份完成<strong>唯一定位</strong>和<strong>信息查询</strong>
          </p>
          <ResolveDgm />
        </section>
      </div>

      <footer className="tp-thesis card" aria-hidden={!f.thesis}>
        <div className="tp-thesis-head">
          <p className="tp-thesis-tag">两种失败</p>
          <p className="tp-thesis-hero">缺一不可</p>
        </div>
        <span className="tp-thesis-sep" />
        <div className="tp-fails">
          <div
            className="tp-fail"
            data-tone="danger"
            style={{ "--tp-i": "0" } as CSSProperties}
          >
            <FailNoCode />
            <div className="tp-fail-copy">
              <p className="tp-fail-tag">没有稳定编码</p>
              <p className="tp-fail-result">不知道查谁</p>
            </div>
          </div>
          <div
            className="tp-fail"
            data-tone="warn"
            style={{ "--tp-i": "1" } as CSSProperties}
          >
            <FailNoResolve />
            <div className="tp-fail-copy">
              <p className="tp-fail-tag">只有编码、没有解析系统</p>
              <p className="tp-fail-result">找不到关联的信息</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
