import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./BoundaryContextGap.css";

/* states: outline 第 3 章 semantic states（4 narration beats 一一映射） */
const states = [
  "crossing-established",
  "context-gaps-listed",
  "readout-vs-identity-contrasted",
  "missing-context-pinned",
] as const;
type BcgState = (typeof states)[number];

/* 承接第 1 章扫码读出的那串教学字符（同一虚构情境，非真实编码） */
const CODE = "6E·A41·77C2";

const GAP_ROWS = [
  { text: "由谁分配", tail: "未必能判断" },
  { text: "对应哪类对象", tail: "未必能判断" },
  { text: "是否重复", tail: "未必能判断" },
  { text: "关联的记录", tail: "未必找得到" },
];

export default function BoundaryContextGap({ step }: ChapterStepProps) {
  const state: BcgState = states[step] ?? states[states.length - 1];
  const listed = state !== "crossing-established";
  const contrasted =
    state === "readout-vs-identity-contrasted" || state === "missing-context-pinned";
  const pinned = state === "missing-context-pinned";

  return (
    <div
      className={`bcg-scene scene-pad${listed ? " is-listed" : ""}${
        contrasted ? " is-contrasted" : ""
      }${pinned ? " is-pinned" : ""}`}
    >
      <header className="bcg-head">
        <p className="bcg-title">
          跨过企业边界，<em>身份语境断了</em>
        </p>

        {/* s1 开场演示：编码芯片越过企业边界虚线（动作极简，~4s 拍） */}
        <div className="bcg-crossing" aria-hidden>
          <span className="bcg-cross-side is-from">本企业</span>
          <span className="bcg-cross-boundary">
            <span className="bcg-cross-line" />
            <span className="bcg-cross-line-label">企业边界</span>
          </span>
          <span className="bcg-cross-code">{CODE}</span>
          <span className="bcg-cross-side is-down">下游企业</span>
        </div>
      </header>

      {/* 左右对照栏：左清单先立、右判据后聚，pivot 槽为空不启用 */}
      <div className="bcg-compare">
        <section className="bcg-left">
          <p className="bcg-col-tag">进入下游 · 缺失的语境</p>
          <ul className="bcg-gaps">
            {GAP_ROWS.map((row, i) => (
              <li
                key={row.text}
                className={`bcg-gap${i === 3 ? " is-records" : ""}`}
                style={{ "--bcg-i": String(i) } as CSSProperties}
              >
                <span className="bcg-gap-mark hero-num" aria-hidden>
                  ?
                </span>
                <span className="bcg-gap-text">{row.text}</span>
                <span className="bcg-gap-tail">{row.tail}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bcg-divider" aria-hidden />

        <section className="bcg-right">
          <div className="bcg-right-empty" aria-hidden />
          <div className="bcg-verdict card">
            <p className="bcg-verdict-tag">判据</p>
            <p className="bcg-verdict-phrase">
              <span style={{ "--bcg-i": "0" } as CSSProperties}>读出字符</span>
              <span className="bcg-neq" style={{ "--bcg-i": "1" } as CSSProperties}>
                ≠
              </span>
              <span style={{ "--bcg-i": "2" } as CSSProperties}>识别对象</span>
            </p>
          </div>
          {/* s4 定位句：常驻预留槽，opacity 入场不回流 */}
          <div className="bcg-pin">
            <p className="bcg-pin-not">问题不在扫码动作</p>
            <p className="bcg-pin-main">
              而在于企业之间，没有共享<em>同一套身份语境</em>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
