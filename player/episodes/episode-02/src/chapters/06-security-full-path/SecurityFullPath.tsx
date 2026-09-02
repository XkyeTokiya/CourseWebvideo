import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SecurityFullPath.css";

const stateByStep = [
  "protection-scope-up",
  "side-notes-complete",
  "not-end-gate-closed",
] as const;

type State = (typeof stateByStep)[number];

const BANDS = ["设备", "网络", "应用", "数据"] as const;

/* 性质项按叙述顺序排位：可靠性→保密性→完整性→可用性 */
const SIDE_NOTES = [
  {
    name: "持续工作",
    delay: 0,
    items: [
      { order: 0, term: "可靠性", desc: "让信息和服务能够持续工作。" },
      { order: 3, term: "可用性", desc: "保证需要时能够正常使用。" },
    ],
  },
  {
    name: "可信使用",
    delay: 1,
    items: [
      { order: 1, term: "保密性", desc: "防止不该看到的内容被暴露。" },
      { order: 2, term: "完整性", desc: "保证信息没有被不当改变。" },
    ],
  },
] as const;

export default function SecurityFullPathChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const notesOn = idx >= 1;
  const closed = idx >= 2;

  return (
    <div className={`sf-scene scene-pad${closed ? " is-closed" : ""}`}>
      <header className="sf-title">
        <span className="sf-title-mark" />
        <h1 className="sf-title-text">
          安全<em>从连接开始持续在场</em>，保障整条路径可信运行
        </h1>
      </header>

      <div className="sf-main">
        <div className="sf-bands-col">
          <div className="sf-boundary">
            <span className="sf-boundary-label">保障边界 · 从连接开始，到行动运行全程</span>
          </div>
          <div className="sf-bands">
            {BANDS.map((b, i) => (
              <div
                key={b}
                className="sf-band"
                style={{ "--sf-i": i } as CSSProperties}
              >
                <span className="sf-band-no">{i + 1}</span>
                <span className="sf-band-name">{b}</span>
                <span className="sf-band-mark" />
              </div>
            ))}
          </div>
        </div>

        <div className="sf-side">
          {SIDE_NOTES.map((card) => (
            <article
              key={card.name}
              className={`card sf-side-card${notesOn ? " is-on" : " is-ghost"}`}
              style={{ "--sf-d": card.delay } as CSSProperties}
            >
              <span className="sf-slot">性质卡 · {card.name}</span>
              <div className="sf-side-body">
                <span className="sf-side-name">{card.name}</span>
                {card.items.map((item) => (
                  <div
                    key={item.term}
                    className="sf-prop"
                    data-on={notesOn}
                    style={{ transitionDelay: `${item.order * 520 + 240}ms` }}
                  >
                    <span className="sf-prop-term">{item.term}</span>
                    <span className="sf-prop-desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="sf-takeaway" data-on={closed}>
        <span className="sf-takeaway-slot">takeaway · 收束槽</span>
        <div className="sf-takeaway-body">
          <span className="sf-takeaway-mark" />
          <div className="sf-takeaway-text">
            <span className="sf-takeaway-main">安全不是流程末端的一道门</span>
            <span className="sf-takeaway-sub">而是让整条信息路径能够可信运行的条件</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
