import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./WhatResolutionDoes.css";

const states = [
  "anchor-raised",
  "objects-results-linked",
  "reading-clarified",
] as const;
type WrState = (typeof states)[number];

const OBJECTS = ["设备", "服务", "产品"] as const;
const RESULTS = ["地址", "位置", "元数据"] as const;

const flags: Record<WrState, { groups: boolean; boundary: boolean }> = {
  "anchor-raised": { groups: false, boundary: false },
  "objects-results-linked": { groups: true, boundary: false },
  "reading-clarified": { groups: true, boundary: true },
};

/* 拍 3 对照示意：右侧“定位查询”用的自绘瞄准环（同心圆 + 刻度） */
function Crosshair() {
  return (
    <svg viewBox="0 0 72 72" className="wr-crosshair" aria-hidden="true">
      <circle cx="36" cy="36" r="29" className="wr-ch-outer" />
      <circle cx="36" cy="36" r="15" className="wr-ch-inner" />
      <circle cx="36" cy="36" r="4.5" className="wr-ch-dot" />
      <line x1="36" y1="1" x2="36" y2="11" className="wr-ch-tick" />
      <line x1="36" y1="61" x2="36" y2="71" className="wr-ch-tick" />
      <line x1="1" y1="36" x2="11" y2="36" className="wr-ch-tick" />
      <line x1="61" y1="36" x2="71" y2="36" className="wr-ch-tick" />
    </svg>
  );
}

/* 抽象字符块：三段短笔画，代表“标识符里被拆开/被使用的一串字符”，非具体编码 */
function CharCell({ index }: { index: number }) {
  return (
    <span className="wr-cell" style={{ "--wr-i": index } as CSSProperties}>
      <i />
      <i />
    </span>
  );
}

export default function WhatResolutionDoes({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="wr-scene scene-pad">
      <header className="wr-header">
        <h1 className="wr-headline">
          解析：<em>从身份键</em>到相关信息
        </h1>
      </header>

      <div className="wr-main">
        <section className="wr-anchor card" aria-label="共享锚点：标识解析体系">
          <p className="wr-anchor-cap">从身份键到这些信息</p>
          <p className="wr-anchor-q">中间靠什么？</p>
          <div className="rule wr-anchor-rule" />
          <p className="wr-anchor-name">
            <span className="wr-anchor-pre">靠</span>
            标识解析体系
          </p>
        </section>

        <div
          className={`wr-associations${f.groups ? " is-on" : " is-weak"}`}
          aria-hidden={!f.groups}
        >
          <section className="wr-group wr-group-objects">
            <p className="wr-group-cap">解析对象</p>
            <div className="wr-chips">
              {OBJECTS.map((o, i) => (
                <span
                  key={o}
                  className="wr-chip"
                  style={{ "--wr-i": i } as CSSProperties}
                >
                  <span className="wr-chip-text">{o}</span>
                </span>
              ))}
            </div>
            <p className="wr-group-foot">等实体的标识符</p>
          </section>

          <p className="wr-link-word">解析成</p>

          <section className="wr-group wr-group-results">
            <p className="wr-group-cap">可能结果</p>
            <div className="wr-chips">
              {RESULTS.map((r, i) => (
                <span
                  key={r}
                  className="wr-chip"
                  style={{ "--wr-i": i } as CSSProperties}
                >
                  <span className="wr-chip-text">{r}</span>
                </span>
              ))}
            </div>
            <p className="wr-group-foot">等相关信息（例如）</p>
          </section>
        </div>
      </div>

      <aside
        className={`wr-boundary card${f.boundary ? " is-on" : ""}`}
        aria-hidden={!f.boundary}
      >
        <div className="wr-boundary-text">
          <p className="wr-boundary-cap">关键区分</p>
          <p className="wr-boundary-judgment">
            “解析”<strong className="wr-no">不是</strong>把字符拆开读含义，
            <strong className="wr-yes">而是</strong>系统根据这个标识，完成定位和查询。
          </p>
        </div>

        <div className="wr-panel wr-panel-wrong" style={{ "--wr-p": "650ms" } as CSSProperties}>
          <p className="wr-panel-tag">不是 · 把字符拆开读含义</p>
          <div className="wr-cells-zone">
            <div className="wr-cells">
              <CharCell index={0} />
              <CharCell index={1} />
              <CharCell index={2} />
            </div>
            <span className="wr-strike wr-strike-a" />
            <span className="wr-strike wr-strike-b" />
          </div>
        </div>

        <div className="wr-panel wr-panel-right" style={{ "--wr-p": "2100ms" } as CSSProperties}>
          <p className="wr-panel-tag">而是 · 系统根据这个标识</p>
          <div className="wr-locate">
            <span className="wr-cells-frame">
              <CharCell index={0} />
              <CharCell index={1} />
              <CharCell index={2} />
            </span>
            <Crosshair />
            <span className="wr-plates">
              <span className="wr-plate" style={{ "--wr-i": 0 } as CSSProperties}>
                定位
              </span>
              <span className="wr-plate" style={{ "--wr-i": 1 } as CSSProperties}>
                查询
              </span>
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
