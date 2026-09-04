import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./PrivateCodeScope.css";

/* states: outline 第 2 章 semantic states（3 narration beats 一一映射） */
const states = [
  "private-code-defined",
  "internal-scope-set",
  "internal-boundary-settled",
] as const;
type PcsState = (typeof states)[number];

const DEF_LAYERS = ["企业自行设置", "专门服务内部管理"];
const RECORD_ITEMS = ["订单记录", "批次记录", "产品记录"];

export default function PrivateCodeScope({ step }: ChapterStepProps) {
  const state: PcsState = states[step] ?? states[states.length - 1];
  const scoped = state !== "private-code-defined";
  const settled = state === "internal-boundary-settled";

  return (
    <div
      className={`pcs-scene scene-pad${scoped ? " is-scoped" : ""}${
        settled ? " is-settled" : ""
      }`}
    >
      <header className="pcs-head">
        <p className="pcs-title">
          字符的来历：<em>企业自设的“私码”</em>
        </p>
      </header>

      {/* 双卡等权槽位 + s3 收束时合拢的内部环境边界框 */}
      <div className="pcs-cards">
        <div className="pcs-frame" aria-hidden>
          <span className="pcs-corner pcs-corner-tl" style={{ "--pcs-i": "0" } as CSSProperties} />
          <span className="pcs-corner pcs-corner-tr" style={{ "--pcs-i": "1" } as CSSProperties} />
          <span className="pcs-corner pcs-corner-bl" style={{ "--pcs-i": "2" } as CSSProperties} />
          <span className="pcs-corner pcs-corner-br" style={{ "--pcs-i": "3" } as CSSProperties} />
          <span className="pcs-frame-label">本企业管理环境</span>
        </div>

        {/* 定义卡：s1 装入（企业自行设置 → 服务内部管理 → 命名“私码”） */}
        <section className="pcs-def card">
          <p className="pcs-card-tag">定义 · 编码的来历</p>
          <ul className="pcs-def-layers">
            {DEF_LAYERS.map((layer, i) => (
              <li
                key={layer}
                className="pcs-def-layer"
                style={{ "--pcs-i": String(i) } as CSSProperties}
              >
                <span className="pcs-def-idx hero-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pcs-def-text">{layer}</span>
              </li>
            ))}
          </ul>
          <div className="pcs-def-rule rule" aria-hidden />
          <div className="pcs-def-term-wrap">
            <p className="pcs-def-term-lead">这样的编码，叫</p>
            <p className="pcs-def-term">私码</p>
          </div>
        </section>

        {/* 成立范围卡：s1 只留常驻空槽，s2 面板落位装入 */}
        <div className="pcs-scope-slot">
          <div className="pcs-scope-empty" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <section className="pcs-scope-card card">
            <p className="pcs-card-tag">成立范围 · 供应商自己的系统</p>
            <p className="pcs-scope-meaning">系统里，记录着这串字符的含义</p>
            <p className="pcs-scope-label">对应的记录</p>
            <div className="pcs-scope-tiles">
              {RECORD_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className="pcs-scope-tile"
                  style={{ "--pcs-i": String(i) } as CSSProperties}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 边界注：s3 收束，全页唯一判断句载体 */}
      <footer className="pcs-boundary">
        <p className="pcs-boundary-lead">私码并不是没有价值</p>
        <span className="pcs-boundary-sep" aria-hidden />
        <p className="pcs-boundary-main">
          规则和含义，通常只在<em>本企业的管理环境</em>里才成立
        </p>
      </footer>
    </div>
  );
}
