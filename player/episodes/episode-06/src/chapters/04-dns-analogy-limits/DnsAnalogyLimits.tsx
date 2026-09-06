import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DnsAnalogyLimits.css";

const states = [
  "dns-example-set",
  "mapping-shared",
  "object-bounds-noted",
  "result-bounds-noted",
  "differences-concluded",
] as const;
type DaState = (typeof states)[number];

const flags: Record<
  DaState,
  { industry: boolean; bounds: boolean; result: boolean; diff: boolean }
> = {
  "dns-example-set": { industry: false, bounds: false, result: false, diff: false },
  "mapping-shared": { industry: true, bounds: false, result: false, diff: false },
  "object-bounds-noted": { industry: true, bounds: true, result: false, diff: false },
  "result-bounds-noted": { industry: true, bounds: true, result: true, diff: false },
  "differences-concluded": { industry: true, bounds: true, result: true, diff: true },
};

const OBJECT_ROWS = [
  { side: "互联网", text: "解析的多是域名", tone: "web" },
  { side: "工业", text: "设备、产品、零部件，也可能是算法、工序这样的虚拟资源", tone: "industrial" },
] as const;

const RESULT_ITEMS = ["地址", "位置", "元数据"] as const;
const DIFF_ITEMS = ["协议", "治理方式", "返回内容"] as const;

/** 两侧同构的映射示意：chip →（解析）→ chip，两边结构一致以呼应“共同的是解析映射” */
function MappingRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="da-map-row">
      <span className="da-chip" style={{ "--da-i": "0" } as CSSProperties}>
        {left}
      </span>
      <span className="da-arrow" aria-hidden>
        <svg viewBox="0 0 84 18" aria-hidden>
          <line x1="2" y1="9" x2="68" y2="9" pathLength={1} className="da-arrow-line" />
          <polyline points="56,2 70,9 56,16" className="da-arrow-head" />
        </svg>
        <span className="da-arrow-label">解析</span>
      </span>
      <span className="da-chip" style={{ "--da-i": "1" } as CSSProperties}>
        {right}
      </span>
    </div>
  );
}

export default function DnsAnalogyLimits({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="da-scene scene-pad" data-state={state}>
      <header className="da-header">
        <h1 className="da-headline">
          类比 DNS，共同的是<em>解析映射</em>
        </h1>
      </header>

      <div className="da-main">
        <figure className="da-media">
          <div className="da-media-ph card">
            <span className="da-ph-tag">textbook_original · 图 1-5</span>
            <div className="da-ph-center">
              <span className="da-ph-label">教材原图占位</span>
              <span className="da-ph-desc">
                教材 DNS 类比原图（图 1-5）· 待正式素材替换
              </span>
            </div>
            <span className="da-ph-source">M003 · 教材原图</span>
          </div>
        </figure>

        <div className="da-rail">
          <p className="da-cap da-cap-mapping">映射 · 提交 → 拿回</p>

          <section className="da-strip da-strip-dns card">
            <h2 className="da-name">域名解析系统（DNS）</h2>
            <MappingRow left="好记的域名" right="访问网络所需的结果" />
          </section>

          <section
            className={`da-strip da-strip-later da-strip-industry card${f.industry ? " is-on" : ""}`}
            aria-hidden={!f.industry}
          >
            <p className="da-line">
              工业互联网的标识解析——<strong>映射关系两边共同</strong>
            </p>
            <MappingRow left="提交标识" right="获得结果" />
          </section>

          <p
            className={`da-cap da-cap-bounds${f.bounds ? " is-on" : ""}`}
            aria-hidden={!f.bounds}
          >
            边界 · 类比到哪里为止
          </p>

          <section
            className={`da-strip da-strip-later da-note da-strip-object${f.bounds ? " is-on" : ""}`}
            aria-hidden={!f.bounds}
          >
            <p className="da-tag">对象边界</p>
            {OBJECT_ROWS.map((row, i) => (
              <div
                key={row.side}
                className="da-bound-row"
                data-tone={row.tone}
                style={{ "--da-i": String(i) } as CSSProperties}
              >
                <span className="da-side">{row.side}</span>
                <span className="da-side-text">{row.text}</span>
              </div>
            ))}
          </section>

          <section
            className={`da-strip da-strip-later da-note da-strip-result${f.result ? " is-on" : ""}`}
            aria-hidden={!f.result}
          >
            <p className="da-tag">结果边界</p>
            <div className="da-chip-row">
              <span className="da-lead">查回来的结果，可能是</span>
              {RESULT_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className="da-chip da-chip-sm"
                  style={{ "--da-i": String(i) } as CSSProperties}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section
            className={`da-strip da-strip-later da-note da-strip-diff${f.diff ? " is-on" : ""}`}
            aria-hidden={!f.diff}
          >
            <p className="da-tag">差异边界</p>
            <div className="da-chip-row">
              {DIFF_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className="da-chip da-chip-sm"
                  style={{ "--da-i": String(i) } as CSSProperties}
                >
                  {item}
                </span>
              ))}
              <span className="da-diff-stamp">并不相同</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
