import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./QueryWalkthrough.css";

const states = [
  "query-entered",
  "path-traced",
  "semantics-noted",
] as const;
type QwState = (typeof states)[number];
type StagePhase = "past" | "active" | "upcoming";

/* 五阶段语义路径 —— 顺序只由这里的排列与空间带序承载，无编号、无箭头 */
const STAGES: { label: string; sub: string; facing?: boolean }[] = [
  { label: "提交标识", sub: "质检员提交编码" },
  { label: "公共查询入口", sub: "可以访问的查询入口", facing: true },
  { label: "找到负责范围", sub: "体系逐层判断" },
  { label: "企业侧信息或访问入口", sub: "定位到企业侧" },
  { label: "结果返回", sub: "给查询的人" },
];

const PHASES: Record<QwState, StagePhase[]> = {
  "query-entered": ["active", "upcoming", "upcoming", "upcoming", "upcoming"],
  "path-traced": ["past", "past", "past", "past", "active"],
  "semantics-noted": ["past", "past", "past", "past", "active"],
};

const flags: Record<QwState, { terminal: boolean; note: boolean }> = {
  "query-entered": { terminal: false, note: false },
  "path-traced": { terminal: true, note: false },
  "semantics-noted": { terminal: true, note: true },
};

function PartGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="qw-part" aria-hidden>
      <path
        d="M32 6 L54 19 L54 45 L32 58 L10 45 L10 19 Z"
        className="qw-part-hex"
      />
      <circle cx="32" cy="32" r="11" className="qw-part-hole" />
    </svg>
  );
}

export default function QueryWalkthrough({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];
  const phases = PHASES[state];

  return (
    <div className={`qw-scene scene-pad is-${state}`}>
      <header className="qw-header">
        <h1 className="qw-headline">
          一次查询走下来，是一条<em>语义路径</em>
        </h1>
        <div className="qw-callback">
          <PartGlyph />
          <div className="qw-callback-copy">
            <span className="qw-callback-tag">回到那个零部件</span>
            <span className="qw-callback-sub">
              质检员用扫码终端确认过的那一件
            </span>
          </div>
        </div>
      </header>

      <section className="qw-band card">
        <div className="qw-track">
          <span className="qw-track-line" />
          <span className="qw-track-fill" />
          <div className="qw-stages">
            {STAGES.map((s, i) => (
              <div
                key={s.label}
                className="qw-stage"
                data-phase={phases[i] ?? "upcoming"}
                style={{ "--qw-i": String(i) } as CSSProperties}
              >
                {s.facing ? (
                  <span className="qw-facing-tag">面向查询者</span>
                ) : null}
                <span className="qw-node">
                  <span className="qw-node-core" />
                </span>
                <span className="qw-stage-label">{s.label}</span>
                <span className="qw-stage-sub">{s.sub}</span>
              </div>
            ))}
          </div>
          <span className="qw-token">请求</span>
        </div>
      </section>

      <div className="qw-footer">
        <aside
          className={`qw-note card-glass${f.note ? " is-on" : ""}`}
          aria-hidden={!f.note}
        >
          <span className="qw-note-tag">路径的性质</span>
          <p className="qw-note-text">
            这是帮助理解协作的<em>语义路径</em>，
            <strong>不是固定的操作步骤</strong>。
          </p>
        </aside>

        <section
          className={`qw-terminal card${f.terminal ? " is-on" : ""}`}
          aria-hidden={!f.terminal}
        >
          <span className="qw-terminal-tag">
            <span className="qw-terminal-dot" />
            结果返回
          </span>
          <p className="qw-terminal-text">
            体系逐层判断负责范围，定位到企业侧的<em>信息或访问入口</em>，
            结果返回给查询的人。
          </p>
        </section>
      </div>
    </div>
  );
}
