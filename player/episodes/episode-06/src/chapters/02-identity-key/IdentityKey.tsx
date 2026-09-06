import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./IdentityKey.css";

const states = [
  "key-defined",
  "linked-info-listed",
  "stability-reasoned",
] as const;
type IkState = (typeof states)[number];

const flags: Record<IkState, { key: boolean; info: boolean; why: boolean }> = {
  "key-defined": { key: true, info: false, why: false },
  "linked-info-listed": { key: true, info: true, why: false },
  "stability-reasoned": { key: true, info: true, why: true },
};

const CHIPS = [
  { id: "batch", label: "批次" },
  { id: "place", label: "位置" },
  { id: "state", label: "状态", swap: true },
  { id: "note", label: "说明" },
] as const;

function KeyGlyph() {
  return (
    <svg viewBox="0 0 96 64" className="ik-key-glyph" aria-hidden>
      <circle cx="20" cy="32" r="14" className="ik-kg ik-kg-bow" />
      <line x1="34" y1="32" x2="86" y2="32" className="ik-kg ik-kg-shaft" />
      <line x1="68" y1="32" x2="68" y2="46" className="ik-kg ik-kg-tooth" />
      <line x1="81" y1="32" x2="81" y2="41" className="ik-kg ik-kg-tooth" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="ik-lock-glyph" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="ik-refresh-glyph" aria-hidden>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export default function IdentityKey({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];
  const caps = {
    key: state === "key-defined",
    info: state === "linked-info-listed",
    stable: state === "stability-reasoned",
  };

  return (
    <div className="ik-scene scene-pad" data-state={state}>
      <header className="ik-header">
        <h1 className="ik-headline">
          编码是<em className="ik-hl">身份键</em>，不是
          <span className="ik-hl-no">信息容器</span>
        </h1>
        <div className="ik-header-rule rule" />
      </header>

      <div className="ik-main">
        <div className="ik-media-col">
          <figure className="ik-media">
            <div className="ik-photo card">
              <span className="ik-ph-label">image · 16:9</span>
              <span className="ik-ph-desc">
                M002 被确认零部件的特写镜头 —— 延续同一收货现场（占位，待正式素材）
              </span>
            </div>
          </figure>

          <section className="ik-anchor card" aria-label="键与信息关系图示">
            <p className="ik-anchor-kicker">编码与信息 · 关系图示</p>

            <div className="ik-key-plate">
              <KeyGlyph />
              <div className="ik-key-text">
                <p className="ik-key-name">编码 = 身份键</p>
                <p className="ik-key-sub">回答“这是谁”</p>
              </div>
              <div className="ik-key-lock">
                <LockGlyph />
                <span>键不动</span>
              </div>
            </div>

            <div className="ik-mount">
              <div className="ik-chips">
                {CHIPS.map((chip, i) => (
                  <div
                    key={chip.id}
                    className={`ik-chip${chip.swap ? " ik-chip--state" : ""}${
                      f.info ? " is-in" : ""
                    }`}
                    style={{ "--ik-d": `${i * 170}ms` } as CSSProperties}
                  >
                    <span className="ik-chip-face ik-chip-a">{chip.label}</span>
                    {chip.swap && (
                      <span className="ik-chip-face ik-chip-b">
                        <RefreshGlyph />
                        {chip.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="ik-mount-cap">
                <span className={`ik-cap ik-cap--key${caps.key ? " is-on" : ""}`}>
                  键回答：这是谁
                </span>
                <span className={`ik-cap ik-cap--info${caps.info ? " is-on" : ""}`}>
                  信息与身份关联，不写进键里
                </span>
                <span className={`ik-cap ik-cap--stable${caps.stable ? " is-on" : ""}`}>
                  信息在换，键不动
                </span>
              </p>
            </div>
          </section>
        </div>

        <div className="ik-rail">
          <section className={`ik-entry ik-entry--key card${f.key ? " is-on" : ""}`}>
            <p className="ik-tag">身份键 · 定义</p>
            <p className="ik-main-line">
              <em className="ik-term">身份键</em> = 回答“这是谁”的钥匙
            </p>
            <p className="ik-sub-line">帮系统把一个对象同其他对象区分开。</p>
          </section>

          <section className={`ik-entry ik-entry--info card${f.info ? " is-on" : ""}`}>
            <p className="ik-tag">关联信息</p>
            <p className="ik-main-line">
              <strong>批次、位置、状态、说明</strong>——可与身份关联
            </p>
            <p className="ik-sub-line">不必全部塞进编码本身。</p>
          </section>

          <section
            className={`ik-entry ik-entry--why card${f.why ? " is-on" : ""}`}
            data-tone="process"
          >
            <p className="ik-tag">为什么不塞进去</p>
            <p className="ik-sub-line">
              信息一变，编码就得跟着改——身份就不再是稳定的锚点。
            </p>
            <p className="ik-principle">
              身份键要的是<strong>稳定</strong>：信息可以挂在身份下面随时更新，
              键本身<strong>不能乱动</strong>。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
