import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./LoopbackSummary.css";
import m004 from "./assets/m004.png";

/* states: outline 第 10 章 base-scene semantic states（step 0/1/2；step ≥3 = accent 全屏强调页持续到集尾）
   映射：step < ACCENT_STEP 取 baseStates[step] */
const ACCENT_STEP = 3;
const baseStates = [
  "private-path-recalled",
  "shared-path-contrasted",
  "division-stated",
] as const;
type LosState = (typeof baseStates)[number];

const LAST_STATE = baseStates[baseStates.length - 1];
const READOUT = "88.199.400/***"; // 呼应第 1 章同一收货现场读出的字符（教材示例码，后段以 * 略写）
const CHAIN = ["按共同规则识别", "零部件进入另一家企业", "仍是同一个数字身份"];
const MEDIA_TAGS = ["供应商发货", "制造商收货区"];

/* 小条码：竖条组合 + 扫描线，私码路径落位拍扫一遍即停 */
function MiniBarcode() {
  const bars = [5, 3, 9, 4, 7, 3, 10, 5, 8, 3, 6, 4];
  let x = 0;
  const rects = bars.map((w) => {
    const rect = { x, width: w };
    x += w + 4;
    return rect;
  });
  return (
    <svg viewBox="0 0 84 56" className="los-barcode" aria-hidden>
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={4}
          width={r.width}
          height={48}
          rx={1}
          className="los-bar"
          style={{ "--los-i": String(i) } as CSSProperties}
        />
      ))}
      <line x1="0" y1="8" x2="84" y2="8" className="los-scanline" />
    </svg>
  );
}

/* S-A010 base-scene：回扣收货图 + 总结轨两路径对照 + 分工行 */
function LoopbackScene({ state }: { state: LosState }) {
  const sharedIn = state !== "private-path-recalled";
  const divisionIn = state === "division-stated";

  return (
    <div
      className={`los-scene scene-pad${sharedIn ? " is-shared" : ""}${
        divisionIn ? " is-divided" : ""
      }`}
    >
      <header className="los-headline">
        <h2 className="los-title">
          从<em className="los-title-mark" data-tone="private">私码断点</em>
          到<em className="los-title-mark" data-tone="shared">身份锚点</em>
        </h2>
        <p className="los-head-note">本期总结 · 回到开头的收货现场</p>
      </header>

      <div className="los-main">
        <figure className="los-media">
          <div className="los-media-frame card">
            <img
              src={m004}
              alt="回扣收货区：完成核验后的现场（占位图）"
              className="los-photo"
            />
            <div className="los-media-tags">
              <span className="los-chip" style={{ "--los-i": "0" } as CSSProperties}>
                {MEDIA_TAGS[0]}
              </span>
              <span className="los-chip-arrow" style={{ "--los-i": "1" } as CSSProperties} aria-hidden>
                →
              </span>
              <span className="los-chip" style={{ "--los-i": "2" } as CSSProperties}>
                {MEDIA_TAGS[1]}
              </span>
              <span className="los-chip is-tag" style={{ "--los-i": "3" } as CSSProperties}>
                核验完成
              </span>
            </div>
            <span className="los-fiction">教学情境 · 非真实企业案例</span>
          </div>
        </figure>

        <div className="los-rail">
          <article className="los-path card" data-tone="private" style={{ "--los-i": "0" } as CSSProperties}>
            <header className="los-path-head">
              <span className="los-path-num hero-num">01</span>
              <h3 className="los-path-name">私码路径</h3>
            </header>
            <div className="los-private-demo">
              <MiniBarcode />
              <div className="los-read">
                <span className="los-read-code">{READOUT}</span>
                <span className="los-read-sub">读出陌生字符</span>
              </div>
              <span className="los-demo-arrow" aria-hidden>
                →
              </span>
              <p className="los-verdict">业务确认 · 停在人工核对</p>
            </div>
          </article>

          <article className="los-path card" data-tone="shared" style={{ "--los-i": "1" } as CSSProperties}>
            <header className="los-path-head">
              <span className="los-path-num hero-num">02</span>
              <h3 className="los-path-name">共同标识路径</h3>
              <span className="los-scan-tag">扫码即确认</span>
            </header>
            <div className="los-chain">
              {CHAIN.map((node, i) => (
                <span key={node} className="los-chain-item" style={{ "--los-i": String(i) } as CSSProperties}>
                  <span
                    className="los-chain-node"
                    data-last={i === CHAIN.length - 1 ? "true" : undefined}
                  >
                    {node}
                  </span>
                  {i < CHAIN.length - 1 && <span className="los-chain-link" aria-hidden />}
                </span>
              ))}
            </div>
          </article>

          <div className="los-division">
            <div className="los-division-half" data-tone="private" style={{ "--los-i": "0" } as CSSProperties}>
              <span className="los-division-dot" aria-hidden />
              <span className="los-division-who">私码</span>
              <span className="los-division-what">企业内部管理</span>
            </div>
            <span className="los-division-mid">分工不同</span>
            <div className="los-division-half" data-tone="shared" style={{ "--los-i": "1" } as CSSProperties}>
              <span className="los-division-dot" aria-hidden />
              <span className="los-division-who">工业互联网标识</span>
              <span className="los-division-what">跨企业协同</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* K-A010-01 accent：低成本全屏强调页——规律句为主体，价值句收束 */
function AccentStatement() {
  return (
    <div className="los-accent scene-pad">
      <p className="los-accent-kicker">共同的规律</p>
      <p className="los-accent-hero">
        跨企业协同，
        <br />
        先要说清<span className="los-accent-mark">“同一个对象”</span>
      </p>
      <div className="los-accent-rule" aria-hidden />
      <div className="los-accent-close">
        <p className="los-accent-lead">工业互联网标识的价值，从这里开始</p>
        <p className="los-accent-value">
          它为跨主体协同提供<em>对象身份锚点</em>
        </p>
      </div>
    </div>
  );
}

export default function LoopbackSummary({ step }: ChapterStepProps) {
  if (step >= ACCENT_STEP) {
    return <AccentStatement />;
  }
  const state: LosState = baseStates[step] ?? LAST_STATE;
  return <LoopbackScene state={state} />;
}
