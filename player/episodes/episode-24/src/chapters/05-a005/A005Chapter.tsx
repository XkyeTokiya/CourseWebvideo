import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005Chapter.css";

const states = [
  "resolution-entered",
  "division-stated",
  "service-grounded",
  "sharing-base",
] as const;

const SUPPORTS = ["准确定位对象", "查找相关信息", "获取与交换"] as const;

function TagGlyph() {
  return (
    <svg viewBox="0 0 110 52" className="a5-glyph" aria-hidden="true">
      <rect x="6" y="10" width="66" height="32" rx="8" className="a5-glyph-tag" />
      <circle cx="22" cy="26" r="5.5" className="a5-glyph-hole" />
      <line x1="36" y1="21" x2="64" y2="21" />
      <line x1="36" y1="31" x2="56" y2="31" />
      <path d="M80 26 H 100" className="a5-glyph-path" />
    </svg>
  );
}

function RouteGlyph() {
  return (
    <svg viewBox="0 0 110 52" className="a5-glyph" aria-hidden="true">
      <path d="M4 26 H 64" className="a5-glyph-path" />
      <path d="M66 20 L 76 26 L 66 32" className="a5-glyph-arrow" />
      <circle cx="92" cy="26" r="15" className="a5-glyph-ring" />
      <circle cx="92" cy="26" r="5.5" className="a5-glyph-dot" />
    </svg>
  );
}

function ShareGlyph() {
  return (
    <svg viewBox="0 0 34 34" className="a5-res-svg" aria-hidden="true">
      <circle cx="8" cy="17" r="5.5" />
      <circle cx="26" cy="17" r="5.5" />
      <path d="M14 17 H 20" />
    </svg>
  );
}

function NormGlyph() {
  return (
    <svg viewBox="0 0 34 34" className="a5-res-svg" aria-hidden="true">
      <path d="M5 9 H 29 M5 17 H 29 M5 25 H 22" />
    </svg>
  );
}

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const divisionOn = step >= 1;
  const baseOn = step >= 2;
  const resultOn = step >= 3;

  return (
    <div
      className={`a5-scene scene-pad${divisionOn ? " is-division" : ""}${
        baseOn ? " is-base" : ""
      }${resultOn ? " is-result" : ""}`}
      data-state={state}
    >
      <header className="a5-head">
        <p className="a5-kicker">解析 · 从身份到信息</p>
        <h1 className="a5-title">
          标识与解析的<em>分工</em>
        </h1>
      </header>

      <section className="a5-handoff" aria-label="顺着身份找到信息">
        <div className="a5-hand-item">
          <span className="a5-mini-plate" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <p className="a5-hand-cap">身份已固定</p>
        </div>

        <svg className="a5-route" viewBox="0 0 420 90" aria-hidden="true">
          <path d="M12 45 H 320" className="a5-route-path" />
          <path d="M306 33 L 330 45 L 306 57" className="a5-route-head" />
          <circle cx="12" cy="45" r="5" className="a5-route-start" />
          <circle cx="372" cy="45" r="26" className="a5-route-ring" pathLength={100} />
          <circle
            cx="372"
            cy="45"
            r="13"
            className="a5-route-ring a5-route-ring-in"
            pathLength={100}
          />
          <circle cx="372" cy="45" r="4" className="a5-route-dot" />
          <circle cx="12" cy="45" r="4.5" className="a5-runner" />
        </svg>

        <div className="a5-hand-item">
          <span className="a5-info" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <p className="a5-hand-cap">相关信息</p>
        </div>

        <p className="a5-hand-note">
          光有身份还不够 —— 顺着身份找到信息，这一步交给<strong>解析</strong>
        </p>
      </section>

      <section className="a5-division">
        <p
          className={`a5-ghost a5-div-ghost${divisionOn ? " is-off" : ""}`}
          aria-hidden="true"
        >
          标识与解析 · 待落位
        </p>

        <article className="a5-role card" style={{ "--a5-r": "0" } as CSSProperties}>
          <div className="a5-role-head">
            <TagGlyph />
            <span className="a5-role-name">标识</span>
          </div>
          <p className="a5-role-answer">
            回答：<strong>对象是谁</strong>
          </p>
        </article>

        <div className="a5-joint" aria-hidden="true">
          <span className="a5-joint-line" />
          <span className="a5-joint-chip">一组分工</span>
        </div>

        <article className="a5-role card" style={{ "--a5-r": "1" } as CSSProperties}>
          <div className="a5-role-head">
            <RouteGlyph />
            <span className="a5-role-name">解析</span>
          </div>
          <p className="a5-role-answer a5-role-answer-long">
            解析提供查询对象网络位置或者相关信息的入口，回答到哪里去找
          </p>
        </article>
      </section>

      <section className="a5-base">
        <p
          className={`a5-ghost a5-base-ghost${baseOn ? " is-off" : ""}`}
          aria-hidden="true"
        >
          服务基础 · 待落位
        </p>
        <div className="a5-base-inner">
          <div className="a5-base-band">
            <span className="a5-base-name">标识注册 + 解析服务</span>
            <div className="a5-supports">
              {SUPPORTS.map((s, i) => (
                <span
                  key={s}
                  className="a5-support"
                  style={{ "--a5-s": String(i) } as CSSProperties}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <p className="a5-gov">
            <span className="a5-gov-cap">边界</span>不替代各系统的数据治理
          </p>
        </div>
      </section>

      <footer className="a5-result">
        <p
          className={`a5-ghost a5-result-ghost${resultOn ? " is-off" : ""}`}
          aria-hidden="true"
        >
          互通共享基础 · 待落位
        </p>
        <div className="a5-result-plate card">
          <p className="a5-result-cap">跨系统的能力 · 建立在这一层上</p>
          <div className="a5-result-row">
            <span className="a5-res">
              <ShareGlyph />
              跨系统互通共享
            </span>
            <span className="a5-res-sep" aria-hidden="true" />
            <span className="a5-res">
              <NormGlyph />
              对数据的规范化理解
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
