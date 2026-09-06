import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FromCodeToInfo.css";

const states = [
  "chain-replayed",
  "code-transformed",
  "mainline-folded",
  "mechanism-keyed",
] as const;
type FcState = (typeof states)[number];

const flags: Record<
  FcState,
  { chain: boolean; transform: boolean; mainline: boolean; judgment: boolean }
> = {
  "chain-replayed": { chain: true, transform: false, mainline: false, judgment: false },
  "code-transformed": { chain: true, transform: true, mainline: false, judgment: false },
  "mainline-folded": { chain: true, transform: true, mainline: true, judgment: false },
  "mechanism-keyed": { chain: true, transform: true, mainline: true, judgment: true },
};

/* S058 完整链路，按序重走；首环承载身份键，末环回到业务现场 */
const CHAIN_LINKS = [
  { label: "终端读出编码", tag: "身份键", isReturn: false },
  { label: "查询入口接收请求", tag: null, isReturn: false },
  { label: "分层体系定位负责范围", tag: null, isReturn: false },
  { label: "企业侧把身份关联到信息或访问方式", tag: null, isReturn: false },
  { label: "结果返回业务现场", tag: "回到现场", isReturn: true },
] as const;

/* S060 三句主线：前两行为“查谁/去哪里查”两问两答，第三行是跨范围协作 */
const MAINLINE_ROWS = [
  { tag: "编码", text: "回答“查谁”" },
  { tag: "解析", text: "回答“去哪里查、能得到什么”" },
  { tag: "一层层节点", text: "让查询跨范围协作" },
] as const;

/* S061 会随时间变化的数据类别（不给任何数值与城市名） */
const CHANGED_CHIPS = ["节点数量", "城市布局"] as const;

/* 抽象字符格：示意“一串可识别的字符”，不指向任何真实编码 */
const TILE_BAR_W = [18, 10, 14, 18, 10, 14];

function CharTiles() {
  return (
    <svg viewBox="0 0 262 58" className="fc-tiles" aria-hidden>
      {TILE_BAR_W.map((w, i) => (
        <g key={i} className="fc-tile" style={{ "--fc-i": String(i) } as CSSProperties}>
          <rect x={i * 43 + 3} y={3} width={36} height={52} rx={5} className="fc-tile-box" />
          <rect x={i * 43 + 12} y={15} width={w} height={5} rx={2.5} className="fc-tile-bar" />
          <rect
            x={i * 43 + 12}
            y={26}
            width={w === 18 ? 12 : 18}
            height={5}
            rx={2.5}
            className="fc-tile-bar"
          />
          <rect x={i * 43 + 12} y={37} width={14} height={5} rx={2.5} className="fc-tile-bar" />
        </g>
      ))}
    </svg>
  );
}

/* 钥匙：承接“身份键/钥匙”意象，转变与收束共用同一图形语言 */
function KeyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 48" className={className} aria-hidden>
      <circle cx={19} cy={24} r={13} className="fc-key-bow" />
      <circle cx={19} cy={24} r={5.5} className="fc-key-hole" />
      <path d="M32 24 H92 M74 24 V38 M90 24 V33" className="fc-key-shaft" />
    </svg>
  );
}

export default function FromCodeToInfo({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="fc-scene scene-pad" data-state={state}>
      <header className="fc-header">
        <h1 className="fc-headline">
          编码怎样变成<em>可查询信息</em>
        </h1>
      </header>

      <hr className="fc-toprule rule" />

      <div className="fc-main">
        <figure className="fc-media">
          <div className="fc-photo card">
            <span className="fc-ph-label">image · 16:9</span>
            <span className="fc-ph-desc">
              M004 收货现场延续镜头：质检员与扫码终端（占位，待正式素材）
            </span>
          </div>
          <span className="fc-ph-echo">教学情境 · 回到开场的收货现场</span>
        </figure>

        <div className="fc-rail">
          <section
            className={`fc-chain${f.chain ? " is-on" : ""}`}
            aria-hidden={!f.chain}
          >
            <p className="fc-rail-cap">完整链路 · 按顺序重走一遍</p>
            <div className="fc-chain-track">
              <div className="fc-rail-line" />
              <div className="fc-rail-fill" />
              <ol className="fc-chain-list">
                {CHAIN_LINKS.map((c, i) => (
                  <li
                    key={c.label}
                    className={`fc-link${c.isReturn ? " is-return" : ""}`}
                    style={{ "--fc-i": String(i) } as CSSProperties}
                  >
                    <span className="fc-dot" />
                    <span className="fc-link-label">{c.label}</span>
                    {c.tag ? <span className="fc-link-tag">{c.tag}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            className={`fc-transform card${f.transform ? " is-on" : ""}`}
            aria-hidden={!f.transform}
          >
            <div className="fc-t-cell">
              <CharTiles />
              <span className="fc-t-cap">一串可识别的字符</span>
            </div>
            <svg viewBox="0 0 64 24" className="fc-t-arrow" aria-hidden>
              <line x1={4} y1={12} x2={50} y2={12} className="fc-t-arrow-line" />
              <path d="M44 4 L56 12 L44 20" className="fc-t-arrow-head" />
            </svg>
            <div className="fc-t-cell">
              <KeyGlyph className="fc-t-key" />
              <span className="fc-t-cap fc-t-cap-strong">能支撑信息查询的基础</span>
            </div>
          </section>

          <section
            className={`fc-mainline${f.mainline ? " is-on" : ""}`}
            aria-hidden={!f.mainline}
          >
            <p className="fc-rail-cap">主线收拢</p>
            <div className="fc-ml-rows">
              {MAINLINE_ROWS.map((m, i) => (
                <div
                  key={m.tag}
                  className={`fc-ml-row${i === 2 ? " is-span" : " is-qa"}`}
                  style={{ "--fc-i": String(i) } as CSSProperties}
                >
                  <span className="fc-ml-tag">{m.tag}</span>
                  <p className="fc-ml-text">{m.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section
        className={`fc-final card${f.judgment ? " is-on" : ""}`}
        data-tone="process"
        aria-hidden={!f.judgment}
      >
        <div className="fc-f-changing">
          <p className="fc-f-cap">这些数据会随时间变化</p>
          <div className="fc-f-chips">
            {CHANGED_CHIPS.map((chip, i) => (
              <span
                key={chip}
                className="fc-f-chip"
                style={{ "--fc-i": String(i) } as CSSProperties}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="fc-f-sep" />
        <div className="fc-f-stable">
          <KeyGlyph className="fc-f-key" />
          <div className="fc-f-key-text">
            <p className="fc-f-cap fc-f-cap-strong">这条稳定的机制主线</p>
            <p className="fc-f-hero">
              才是理解标识解析体系的<em>钥匙</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
