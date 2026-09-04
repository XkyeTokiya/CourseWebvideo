import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./AnchorVsResolve.css";

/* states: outline 第 9 章 semantic states（3 narration beats 一一映射） */
const states = [
  "thesis-declared",
  "anchor-and-analogy-set",
  "anchor-vs-resolve-split",
] as const;
type AvrState = (typeof states)[number];

/* 门牌号图形：生活类比示意（非真实门牌，S043）。
   板号是类比道具；房内问号表达“不知道房子里放着什么”。 */
function DoorplateGlyph() {
  return (
    <svg viewBox="0 0 132 104" className="avr-house" aria-hidden>
      <path
        d="M12 46 L66 8 L120 46"
        pathLength={1}
        className="avr-house-stroke avr-house-roof"
      />
      <path
        d="M24 46 L108 46 L108 92 L24 92 Z"
        pathLength={1}
        className="avr-house-stroke avr-house-body"
      />
      <rect x="56" y="62" width="22" height="30" className="avr-house-door" />
      <rect x="86" y="54" width="18" height="12" rx="2" className="avr-house-plate" />
      <text x="95" y="63" textAnchor="middle" className="avr-house-plate-num">
        107
      </text>
      <text x="39" y="73" className="avr-house-mark">
        ?
      </text>
      <text x="40" y="87" className="avr-house-mark avr-house-mark--b">
        ?
      </text>
    </svg>
  );
}

export default function AnchorVsResolve({ step }: ChapterStepProps) {
  const state: AvrState = states[step] ?? states[states.length - 1];
  const anchored = state !== "thesis-declared";
  const split = state === "anchor-vs-resolve-split";

  return (
    <div className="avr-scene scene-pad">
      <h1 className="avr-title">
        标识是<em>身份锚点</em>，解析负责查询
      </h1>

      <div className="avr-main">
        {/* 左栏：标识 · 身份锚点（s2 落地，门牌号类比注后置支撑，R021） */}
        <section className={`avr-col avr-col--anchor card${anchored ? " is-set" : ""}`}>
          <span className="avr-pending" aria-hidden>
            · · ·
          </span>
          <p className="avr-col-tag">身份锚点 · anchor</p>
          <p className="avr-exact">
            标识：<span className="avr-exact-key">查的是谁</span>
          </p>
          <p className="avr-col-note">提供的是一个身份锚点，只回答这一个问题</p>
          <div className="avr-analogy">
            <DoorplateGlyph />
            <div className="avr-analogy-body">
              <p className="avr-analogy-tag">类比 · 门牌号</p>
              <p className="avr-analogy-text">
                知道一座房子的门牌号，<em>不等于</em>知道房子里放着什么
              </p>
            </div>
          </div>
        </section>

        {/* 右栏：解析 · 查询职责（s3 落地后保持职责声明状态，不展开，R022） */}
        <section className={`avr-col avr-col--resolve${split ? " is-set" : ""}`}>
          <span className="avr-pending" aria-hidden>
            · · ·
          </span>
          <p className="avr-col-tag">解析职责 · resolve</p>
          <p className="avr-exact">
            解析：<span className="avr-exact-key">到哪里查、返回什么</span>
          </p>
          <p className="avr-col-note">
            凭标识去哪里查、能查到什么，属于标识解析体系的职责
          </p>
        </section>
      </div>

      {/* 底部论点条：常驻预留槽，s1 先落分界声明作全页收束（R023，两侧不画连接线） */}
      <section className="avr-thesis">
        <span className="avr-thesis-kicker">分界</span>
        <p className="avr-thesis-line">
          有了共同可识别的标识
          <span className="avr-neq hero-num">≠</span>
          数据已经自动共享
        </p>
      </section>
    </div>
  );
}
