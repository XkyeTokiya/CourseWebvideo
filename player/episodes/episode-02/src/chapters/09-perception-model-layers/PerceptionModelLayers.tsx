import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./PerceptionModelLayers.css";

const stateByStep = [
  "perception-band-up",
  "model-band-up",
] as const;

type State = (typeof stateByStep)[number];

const BANDS = [
  {
    layer: "第一层",
    name: "感知控制",
    desc: "连接物理对象和生产过程，获取现场信息，也承接行动回到现场。",
    note: "来自物理过程",
  },
  {
    layer: "第二层",
    name: "数字模型",
    desc: "把分散信息组织为可以描述、可以分析的数字对象。",
    note: "形成数字对象",
  },
] as const;

export default function PerceptionModelLayersChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const closed = idx >= 1;

  return (
    <div className={`pm-scene scene-pad${closed ? " is-closed" : ""}`}>
      <header className="pm-title">
        <span className="pm-title-mark" />
        <h1 className="pm-title-text">
          感知控制<em>接住现场</em>，数字模型把分散信息组织成可分析对象
        </h1>
      </header>

      <div className="pm-boundary">
        <span className="pm-boundary-label">三个相互衔接的层次 · 本页先建立前两层</span>
        <span className="pm-layer-cells" aria-hidden="true">
          <span className={`pm-cell${idx >= 0 ? " is-on" : ""}`}>1</span>
          <span className={`pm-cell${closed ? " is-on" : ""}`}>2</span>
          <span className="pm-cell pm-cell-todo">3</span>
        </span>
      </div>

      <div className="pm-bands">
        {BANDS.map((b, i) => {
          const on = idx >= i;
          return (
            <section
              key={b.name}
              className={`card pm-band${on ? " is-on" : " is-ghost"}`}
              style={{ "--pm-i": i } as CSSProperties}
            >
              <span className="pm-slot">文字带 · 第{i + 1}层</span>
              <div className="pm-band-body">
                <div className="pm-band-main">
                  <span className="pm-band-layer">{b.layer}</span>
                  <span className="pm-band-name">{b.name}</span>
                  <p className="pm-band-desc">{b.desc}</p>
                </div>
                <aside className="pm-note">
                  <span className="pm-note-mark" />
                  <span className="pm-note-text">{b.note}</span>
                </aside>
              </div>
            </section>
          );
        })}
      </div>

      <aside className="pm-takeaway" data-on={closed}>
        <span className="pm-takeaway-slot">takeaway · 收束槽</span>
        <div className="pm-takeaway-body">
          <span className="pm-takeaway-mark" />
          <span className="pm-takeaway-text">先接住现场，再形成可分析对象</span>
        </div>
      </aside>
    </div>
  );
}
