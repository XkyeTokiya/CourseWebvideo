import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./IdentityVsNumber.css";

/* states: outline 第 6 章 semantic states（4 narration beats 一一映射） */
const states = [
  "impression-shown",
  "managed-logic-framed",
  "qualified-requirements-set",
  "consequence-settled",
] as const;
type IvnState = (typeof states)[number];

/* 随手印象：抽象字符块（示意，非真实编码数据） */
const TILES = [
  { ch: "X", rot: "-7deg", dy: "10px" },
  { ch: "7", rot: "5deg", dy: "-8px" },
  { ch: "K", rot: "-3deg", dy: "16px" },
  { ch: "2", rot: "9deg", dy: "-4px" },
  { ch: "A", rot: "-10deg", dy: "6px" },
  { ch: "9", rot: "4deg", dy: "-14px" },
  { ch: "M", rot: "-5deg", dy: "12px" },
  { ch: "3", rot: "7deg", dy: "-6px" },
];

const REF_RULES = ["统筹", "分配", "校验"];
const REQUIREMENTS = ["有人负责管理", "分配规则明确", "避免对象之间撞名、重号"];

export default function IdentityVsNumber({ step }: ChapterStepProps) {
  const state: IvnState = states[step] ?? states[states.length - 1];
  const framed = state !== "impression-shown";
  const qualified =
    state === "qualified-requirements-set" || state === "consequence-settled";
  const settled = state === "consequence-settled";

  const rootClass = `ivn-scene scene-pad${framed ? " is-framed" : ""}${
    qualified ? " is-qualified" : ""
  }${settled ? " is-settled" : ""}`;

  return (
    <div className={rootClass}>
      <h1 className="ivn-title">
        身份不是编号：编码背后是<em>管理逻辑</em>
      </h1>

      <div className="ivn-main">
        {/* 左栏：编号印象 + 管理逻辑参照（R013） */}
        <section className={`ivn-col ivn-left card${settled ? " is-weak" : ""}`}>
          <p className="ivn-col-tag">
            <span className="ivn-col-idx hero-num">A</span>
            如果只说「编号」
          </p>

          <div className={`ivn-impression${qualified ? " is-crossed" : ""}`}>
            <div className="ivn-tiles" aria-hidden>
              {TILES.map((t, i) => (
                <span
                  key={i}
                  className="ivn-tile"
                  style={
                    {
                      "--ivn-i": String(i),
                      "--ivn-rot": t.rot,
                      "--ivn-dy": t.dy,
                    } as CSSProperties
                  }
                >
                  {t.ch}
                </span>
              ))}
            </div>
            <p className="ivn-impression-note">听上去，只是一串随手写下的字符</p>
            <span className="ivn-strike" aria-hidden />
          </div>

          <div className="ivn-managed" aria-hidden={!framed}>
            <p className="ivn-managed-line">
              标识编码不一样，背后带着<em>管理逻辑</em>
            </p>
            <div className="ivn-ref">
              <p className="ivn-ref-tag">
                生活参照 · 居民身份证<span className="ivn-ref-only">仅作类比</span>
              </p>
              <div className="ivn-ref-rules">
                {REF_RULES.map((rule, i) => (
                  <span
                    key={rule}
                    className="ivn-ref-rule"
                    style={{ "--ivn-i": String(i) } as CSSProperties}
                  >
                    {rule}
                  </span>
                ))}
              </div>
              <p className="ivn-ref-note">这些规则撑着，才能稳定地把人区分开</p>
            </div>
          </div>
        </section>

        <div className="ivn-divider" aria-hidden>
          <span className="ivn-divider-mark">对照</span>
        </div>

        {/* 右栏：合格要求（R014）+ 反例后果风险项（R015） */}
        <section className="ivn-col ivn-right card">
          <div className="ivn-empty" aria-hidden>
            <i className="ivn-c ivn-c1" style={{ "--ivn-i": "0" } as CSSProperties} />
            <i className="ivn-c ivn-c2" style={{ "--ivn-i": "1" } as CSSProperties} />
            <i className="ivn-c ivn-c3" style={{ "--ivn-i": "2" } as CSSProperties} />
            <i className="ivn-c ivn-c4" style={{ "--ivn-i": "3" } as CSSProperties} />
            <span className="ivn-empty-mark">· · ·</span>
          </div>

          <div className="ivn-right-body">
            <p className="ivn-col-tag">
              <span className="ivn-col-idx hero-num">B</span>
              合格的身份编码
              <span className="ivn-col-sub">不能随手编写</span>
            </p>
            <div className="ivn-support">
              <p className="ivn-beam">对象的稳定区分</p>
              <ul className="ivn-reqs">
                {REQUIREMENTS.map((req, i) => (
                  <li
                    key={req}
                    className="ivn-req"
                    style={{ "--ivn-i": String(i) } as CSSProperties}
                  >
                    <span className="ivn-req-idx hero-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ivn-req-text">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ivn-risk">
            <p className="ivn-risk-tag">否则 · 无序分配</p>
            <div className="ivn-risk-row" style={{ "--ivn-i": "0" } as CSSProperties}>
              <span className="ivn-risk-text">相同字符，分给不同对象</span>
            </div>
            <div className="ivn-risk-row" style={{ "--ivn-i": "1" } as CSSProperties}>
              <span className="ivn-risk-text">同一对象，留下对不上的名字</span>
            </div>
            <p className="ivn-risk-close">跨企业识别，失去可靠起点</p>
          </div>
        </section>
      </div>
    </div>
  );
}
