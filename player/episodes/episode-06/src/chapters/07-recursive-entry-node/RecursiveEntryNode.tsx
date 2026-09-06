import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./RecursiveEntryNode.css";

const states = [
  "node-named",
  "entry-duty-set",
  "cache-explained",
] as const;
type RnState = (typeof states)[number];

const flags: Record<RnState, { node: boolean; entry: boolean; cache: boolean }> = {
  "node-named": { node: true, entry: false, cache: false },
  "entry-duty-set": { node: true, entry: true, cache: false },
  "cache-explained": { node: true, entry: true, cache: true },
};

/* 卡一图示：解析路径止于节点 —— 节点守在路径入口处（无箭头） */
function PathGateGlyph() {
  return (
    <svg viewBox="0 0 320 118" className="rn-glyph" aria-hidden>
      <line x1="8" y1="58" x2="210" y2="58" className="rn-glyph-path" />
      <text x="109" y="96" textAnchor="middle" className="rn-glyph-cap rn-cap-path">
        解析路径
      </text>
      <rect x="230" y="26" width="64" height="64" rx="12" className="rn-glyph-node" />
      <rect x="250" y="46" width="24" height="24" rx="4" className="rn-glyph-core" />
    </svg>
  );
}

/* 卡二图示：查询者与公共入口的相对位置（无连线、无方向箭头） */
function EntryDutyGlyph() {
  return (
    <svg viewBox="0 0 380 212" className="rn-glyph" aria-hidden>
      <line x1="22" y1="166" x2="358" y2="166" className="rn-glyph-ground" />
      <g className="rn-person">
        <circle cx="88" cy="62" r="27" className="rn-person-head" />
        <path
          d="M42 166 C42 114 62 100 88 100 C114 100 134 114 134 166"
          className="rn-person-body"
        />
      </g>
      <g className="rn-door">
        <path d="M256 166 V82 A46 46 0 0 1 348 82 V166" className="rn-door-arch" />
      </g>
      <text x="88" y="198" textAnchor="middle" className="rn-glyph-cap rn-cap-person">
        查询者
      </text>
      <text x="302" y="198" textAnchor="middle" className="rn-glyph-cap rn-cap-door">
        查询与访问入口
      </text>
    </svg>
  );
}

/* 卡三图示：结果先记入堆叠，同样的请求直接取用（概念层，不画命中判断分支） */
function CacheStackGlyph() {
  return (
    <svg viewBox="0 0 380 216" className="rn-glyph" aria-hidden>
      <line x1="26" y1="172" x2="222" y2="172" className="rn-glyph-ground" />
      <rect x="46" y="136" width="150" height="32" rx="6" className="rn-slab" />
      <rect x="54" y="98" width="150" height="32" rx="6" className="rn-slab" />
      <g className="rn-slab-drop">
        <rect x="62" y="60" width="150" height="32" rx="6" className="rn-slab" />
        <text x="137" y="81" textAnchor="middle" className="rn-slab-cap">结果</text>
      </g>
      <text x="124" y="200" textAnchor="middle" className="rn-glyph-cap rn-cap-record">
        查过的结果 · 先记下来
      </text>
      <rect x="256" y="98" width="108" height="74" rx="12" className="rn-take-zone" />
      <text x="310" y="88" textAnchor="middle" className="rn-glyph-cap rn-cap-request">
        同样的请求
      </text>
      <g className="rn-slab-take">
        <rect x="278" y="122" width="64" height="28" rx="6" className="rn-slab" />
        <text x="310" y="141" textAnchor="middle" className="rn-slab-cap">结果</text>
      </g>
      <text x="310" y="202" textAnchor="middle" className="rn-glyph-cap rn-cap-reuse">
        直接取用
      </text>
    </svg>
  );
}

export default function RecursiveEntryNode({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="rn-scene scene-pad" data-state={state}>
      <header className="rn-header">
        <h1 className="rn-headline">
          递归解析节点，<em>查询侧入口</em>
        </h1>
      </header>

      <div className="rn-cards">
        <section className={`rn-cell${f.node ? " is-on" : ""}`} data-card="node">
          <div className="rn-slot">
            <span className="rn-slot-tag">卡位 01</span>
          </div>
          <article className="rn-card card">
            <p className="rn-card-kicker">
              <span className="rn-kicker-num hero-num">01</span>节点名
            </p>
            <div className="rn-viz">
              <PathGateGlyph />
            </div>
            <div className="rn-card-text">
              <p className="rn-name">递归解析节点</p>
              <p className="rn-name-sub">守在解析路径的入口处</p>
            </div>
          </article>
        </section>

        <section className={`rn-cell${f.entry ? " is-on" : ""}`} data-card="entry">
          <div className="rn-slot">
            <span className="rn-slot-tag">卡位 02</span>
          </div>
          <article className="rn-card card">
            <p className="rn-card-kicker">
              <span className="rn-kicker-num hero-num">02</span>入口职责
            </p>
            <div className="rn-viz">
              <EntryDutyGlyph />
            </div>
            <div className="rn-card-text">
              {["面向查询者的公共查询和访问入口", "接收问题，协助沿体系寻找答案"].map(
                (line, i) => (
                  <p
                    key={line}
                    className="rn-line"
                    style={{ "--rn-i": String(i) } as CSSProperties}
                  >
                    <span className="rn-line-mark" />
                    {line}
                  </p>
                ),
              )}
            </div>
          </article>
        </section>

        <section className={`rn-cell${f.cache ? " is-on" : ""}`} data-card="cache">
          <div className="rn-slot">
            <span className="rn-slot-tag">卡位 03</span>
          </div>
          <article className="rn-card card">
            <p className="rn-card-kicker">
              <span className="rn-kicker-num hero-num">03</span>缓存
            </p>
            <div className="rn-viz">
              <CacheStackGlyph />
            </div>
            <div className="rn-card-text">
              <p className="rn-cache-line">
                查过的结果先记下来，同样的请求不用从头找
              </p>
              <span className="rn-perf-chip">用于提升服务性能</span>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
