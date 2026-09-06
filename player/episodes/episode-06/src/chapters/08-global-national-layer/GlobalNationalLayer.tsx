import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./GlobalNationalLayer.css";

const states = [
  "global-band-set",
  "national-band-set",
  "coordination-noted",
] as const;
type GnState = (typeof states)[number];

const flags: Record<GnState, { national: boolean; note: boolean }> = {
  "global-band-set": { national: false, note: false },
  "national-band-set": { national: true, note: false },
  "coordination-noted": { national: true, note: true },
};

/** 全球层带徽记：线框地球 —— 经线 + 纬线，指“全球服务范围” */
function GlobeMark() {
  return (
    <svg viewBox="0 0 76 76" className="gn-mark gn-mark-globe" aria-hidden>
      <circle cx="38" cy="38" r="30" className="gn-mark-line" />
      <ellipse cx="38" cy="38" rx="13" ry="30" className="gn-mark-line" />
      <line x1="8" y1="38" x2="68" y2="38" className="gn-mark-line" />
      <path d="M14 22 A 34 34 0 0 1 62 22" className="gn-mark-arc" />
      <path d="M14 54 A 34 34 0 0 0 62 54" className="gn-mark-line gn-mark-soft" />
    </svg>
  );
}

/** 国家层带徽记：虚线疆域 + 区域内节点，指“有边界的国家服务范围” */
function RegionMark() {
  return (
    <svg viewBox="0 0 76 76" className="gn-mark gn-mark-region" aria-hidden>
      <path
        d="M14 20 L44 12 L64 30 L56 52 L34 64 L14 50 L10 34 Z"
        className="gn-mark-region-line"
      />
      <circle cx="38" cy="38" r="6" className="gn-mark-node" />
      <line x1="38" y1="44" x2="38" y2="58" className="gn-mark-line gn-mark-soft" />
    </svg>
  );
}

/** 上行标注：三道向上的箭头折线，演“再往体系上方看” */
function UpChevrons() {
  return (
    <svg viewBox="0 0 44 64" className="gn-chevrons" aria-hidden>
      {[0, 1, 2].map((i) => (
        <polyline
          key={i}
          points={`10,${50 - i * 17} 22,${38 - i * 17} 34,${50 - i * 17}`}
          className="gn-chevron"
          style={{ "--gn-i": String(i) } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/** 侧栏“向哪找”图形：一个起点分出两条去向，各自落在一个问号圈上 */
function FinderGlyph() {
  return (
    <svg viewBox="0 0 170 118" className="gn-finder" aria-hidden>
      <circle cx="16" cy="59" r="7" className="gn-mark-node" />
      <path d="M22 56 C 62 40, 92 30, 128 24" className="gn-finder-path" />
      <path d="M22 62 C 62 78, 92 88, 128 94" className="gn-finder-path" />
      <circle cx="143" cy="22" r="15" className="gn-finder-ring" />
      <circle cx="143" cy="96" r="15" className="gn-finder-ring" />
      <text x="143" y="30" className="gn-finder-q">?</text>
      <text x="143" y="104" className="gn-finder-q">?</text>
    </svg>
  );
}

export default function GlobalNationalLayer({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div
      className={`gn-scene scene-pad${f.national ? " is-national" : ""}${
        f.note ? " is-note" : ""
      }`}
    >
      <header className="gn-header">
        <h1 className="gn-headline">
          更大范围的协同——<em>国际根与国家顶级</em>
        </h1>
      </header>

      <div className="gn-main">
        <div className="gn-stack">
          <div className="gn-upnote">
            <UpChevrons />
            <p className="gn-upnote-text">再往体系上方看</p>
            <span className="rule gn-upnote-rule" />
          </div>

          {/* 全球层带（上层）—— 进章即落位 */}
          <section className="gn-band gn-band-global" aria-label="全球层带">
            <div className="gn-band-core" aria-hidden={false}>
              <div className="gn-band-mark" style={{ "--gn-i": "0" } as CSSProperties}>
                <GlobeMark />
              </div>
              <div className="gn-band-body" style={{ "--gn-i": "1" } as CSSProperties}>
                <h2 className="gn-band-name">国际根节点</h2>
                <p className="gn-band-duty">
                  面向全球提供<em>根区数据管理</em>和<em>根解析服务</em>
                </p>
              </div>
              <div className="gn-band-scope" style={{ "--gn-i": "2" } as CSSProperties}>
                <span className="gn-scope-tag">服务范围 · 全球</span>
                <div className="gn-scope-field">
                  <span className="gn-scope-fill" />
                </div>
              </div>
            </div>
          </section>

          {/* 国家层带（下层）—— 拍 2 落位，未落位时为骨架占位 */}
          <section className="gn-band gn-band-national" aria-label="国家层带">
            <span className="gn-band-ghost-tag" aria-hidden={f.national}>
              层带 · 待落位
            </span>
            <div className="gn-band-core" aria-hidden={!f.national}>
              <div className="gn-band-mark" style={{ "--gn-i": "0" } as CSSProperties}>
                <RegionMark />
              </div>
              <div className="gn-band-body" style={{ "--gn-i": "1" } as CSSProperties}>
                <h2 className="gn-band-name">国家顶级节点</h2>
                <p className="gn-band-duty">
                  与全球根节点<em>互联</em>，支持跨二级节点以及
                  <em>异构标识解析体系</em>之间的互联
                </p>
              </div>
              <div className="gn-band-scope" style={{ "--gn-i": "2" } as CSSProperties}>
                <span className="gn-scope-tag">服务范围 · 国家</span>
                <div className="gn-scope-field gn-scope-field-national">
                  <span className="gn-scope-fill" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 侧栏协同注记 —— 拍 3 落位，未落位时为骨架占位 */}
        <aside className="gn-note" aria-label="协同注记">
          <span className="gn-note-ghost-tag" aria-hidden={f.note}>
            协同注记 · 待落位
          </span>
          <div className="gn-note-core" aria-hidden={!f.note}>
            <p className="gn-note-tag" style={{ "--gn-i": "0" } as CSSProperties}>
              它们解决的是
            </p>
            <p className="gn-note-hero" style={{ "--gn-i": "1" } as CSSProperties}>
              更大范围的<em>协同</em>
            </p>
            <span className="rule gn-note-rule" style={{ "--gn-i": "2" } as CSSProperties} />
            <div className="gn-note-ask" style={{ "--gn-i": "3" } as CSSProperties}>
              <p className="gn-note-q">
                该向哪个<em>体系</em>、哪个<em>服务范围</em>
                继续寻找？
              </p>
              <FinderGlyph />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
