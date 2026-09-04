import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DigitalIdentity.css";
import m002 from "./assets/m002.png";

/* states: outline 第 5 章 semantic states（4 narration beats 一一映射） */
const states = [
  "need-stated",
  "objects-mapped",
  "analogy-in-place",
  "digital-identity-settled",
] as const;
type DgiState = (typeof states)[number];

const SCOPE_ITEMS = ["产品", "装备", "制造设备"];

/* 映射链：阅读顺序即映射方向，不画箭头 */
const CHAIN = [
  { title: "物理实体", sub: "车间现场的对象" },
  { title: "数字实体", sub: "数字世界中的对应" },
  { title: "标识编码", sub: "用一串编码来代表" },
];

export default function DigitalIdentity({ step }: ChapterStepProps) {
  const state: DgiState = states[step] ?? states[states.length - 1];
  const mapped =
    state === "objects-mapped" ||
    state === "analogy-in-place" ||
    state === "digital-identity-settled";
  const analogy = state === "analogy-in-place" || state === "digital-identity-settled";
  const settled = state === "digital-identity-settled";

  return (
    <div className="dgi-scene scene-pad" data-state={state}>
      <header className="dgi-head">
        <h1 className="dgi-title">
          工业互联网标识：对象的数字
          <em className="dgi-title-em">“身份证”</em>
        </h1>
      </header>

      <div className="dgi-main">
        {/* 持续主体：车间实景，阅读焦点随拍迁移（取景框移动） */}
        <figure className="dgi-media">
          <div className="dgi-media-frame">
            <img
              src={m002}
              alt="车间现场：产品、装备与制造设备共存"
              className="dgi-photo"
            />
            <span className="dgi-focus" aria-hidden>
              <i className="dgi-focus-c dgi-focus-c--tl" />
              <i className="dgi-focus-c dgi-focus-c--tr" />
              <i className="dgi-focus-c dgi-focus-c--bl" />
              <i className="dgi-focus-c dgi-focus-c--br" />
            </span>
            {/* 收束拍：判断句 scrim 蒙在实景上（常驻槽 opacity 淡入，不条件挂载） */}
            <div
              className={`dgi-scrim${settled ? " is-on" : ""}`}
              aria-hidden={!settled}
            >
              <p className="dgi-scrim-main">
                系统处理的，是对应物理实体的数字身份
              </p>
              <p className="dgi-scrim-sub">
                货架上的实物 · 对应可供系统识别的对象身份
              </p>
            </div>
          </div>
        </figure>

        <div className="dgi-rails">
          {/* 轨一：共同身份需求 + 对象范围 */}
          <section className="dgi-rail dgi-rail--need is-on">
            <p className="dgi-rail-tag">共同身份需求</p>
            <ol className="dgi-nodes">
              <li
                className="dgi-node is-on"
                style={{ "--dgi-i": "0" } as CSSProperties}
              >
                <p className="dgi-node-title">大家都能认的共同身份</p>
                <p className="dgi-node-sub">工业互联网标识 · 解决对象身份问题</p>
              </li>
              <li
                className={`dgi-node${mapped ? " is-on" : ""}`}
                style={{ "--dgi-i": "1" } as CSSProperties}
              >
                <p className="dgi-node-title">对象范围</p>
                <ul className="dgi-scope">
                  {SCOPE_ITEMS.map((item, i) => (
                    <li
                      key={item}
                      className="dgi-scope-chip"
                      style={{ "--dgi-i": String(i) } as CSSProperties}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            </ol>
          </section>

          {/* 轨二：映射链 → 身份证类比 → 数字身份收束 */}
          <section
            className={`dgi-rail dgi-rail--map${mapped ? " is-on" : ""}${
              settled ? " is-settled" : ""
            }`}
          >
            <p className="dgi-rail-tag">映射链</p>
            <ol className="dgi-nodes dgi-chain">
              {CHAIN.map((node, i) => (
                <li
                  key={node.title}
                  className={`dgi-node dgi-chain-node${mapped ? " is-on" : ""}`}
                  style={{ "--dgi-i": String(i) } as CSSProperties}
                >
                  <p className="dgi-node-title">{node.title}</p>
                  <p className="dgi-node-sub">{node.sub}</p>
                </li>
              ))}
              <li
                className={`dgi-node dgi-chain-node dgi-node--analogy${
                  analogy ? " is-on" : ""
                }`}
                style={{ "--dgi-i": "3" } as CSSProperties}
              >
                <p className="dgi-node-title">
                  <span className="dgi-idcard" aria-hidden />
                  数字世界的“身份证”
                </p>
                <p className="dgi-node-sub">物理实体在数字世界里的身份</p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
