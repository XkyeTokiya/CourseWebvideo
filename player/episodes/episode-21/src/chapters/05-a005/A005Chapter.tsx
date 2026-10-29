import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005Chapter.css";

/**
 * 05-general-features · 一般特征（outline §5 · S-A005 · layered-bands-with-side-notes）
 * mechanism: equal-weight-accumulation — 四枚特征带在同一主区内依次落位并
 * 保持等权，不产生当前选中项；解释注记（侧栏）随后出现，只聚焦"价值密度低"
 * 一项的说明。本章无 protected_relations。
 *
 * step → semantic state（与 outline 一一对应）：four-features-lined →
 * low-density-explained。
 *
 * exact 义务：S031"数据量大、多样、快速、价值密度低"以四枚特征带词组
 * 逐字可见。护栏 C007：特征不绘制成分数、雷达图或统计图——比喻只用
 * "大量记录里挑出少量线索"的体量对照示意，无数值。
 */
const FEATURES = [
  { word: "数据量大", note: "量大" },
  { word: "多样", note: "形态多" },
  { word: "快速", note: "持续快" },
  { word: "价值密度低", note: "线索藏在大量记录里" },
] as const;

const stateByStep = ["four-features-lined", "low-density-explained"] as const;

/* 对比示意：上层"大量记录"密集条 + 下层拣出"有价值的线索"少量标记条 */
const SIGNAL_WIDTHS = [
  { x: 140, w: 118 },
  { x: 320, w: 96 },
  { x: 476, w: 132 },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const noteOn = step >= 1;

  const rootCls = ["gp-scene", "scene-pad", noteOn && "is-note"].filter(Boolean).join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="gp-head">
        <h1 className="gp-headline">
          一般大数据的<em>四个特征</em>
        </h1>
        <div className="gp-head-rule rule" />
      </header>

      <div className="gp-main">
        {/* 四枚特征带：等权依次落位（S031 exact 逐字可见） */}
        <div className="gp-bands">
          {FEATURES.map((f, i) => (
            <section
              key={f.word}
              className="gp-band"
              style={{ "--gp-i": i } as CSSProperties}
            >
              <span className="gp-band-no hero-num">{`0${i + 1}`}</span>
              <span className="gp-band-word">{f.word}</span>
              <span className="gp-band-note">{f.note}</span>
            </section>
          ))}
        </div>

        {/* 侧栏解释注记：只说明价值密度低，不点亮任一特征带 */}
        <aside className={`gp-side${noteOn ? " is-on" : ""}`} aria-hidden={!noteOn}>
          <p className="gp-side-ghost">解释注记 · 待落位</p>
          <div className="gp-side-card card">
            <p className="gp-side-kicker">价值密度低 · 怎么理解</p>
            <figure className="gp-contrast" aria-label="大量记录里分散着少量有价值的线索">
              <svg viewBox="0 0 640 210" className="gp-contrast-svg">
                {Array.from({ length: 18 }).map((_, i) => (
                  <rect
                    key={i}
                    x={140 + (i % 8) * 62}
                    y={22 + Math.floor(i / 8) * 40}
                    width="46"
                    height="28"
                    rx="5"
                    className="gp-record"
                    style={{ "--gp-r": i } as CSSProperties}
                  />
                ))}
                {SIGNAL_WIDTHS.map((s, i) => (
                  <rect
                    key={s.x}
                    x={s.x}
                    y={152}
                    width={s.w}
                    height="30"
                    rx="6"
                    className="gp-signal"
                    style={{ "--gp-j": i } as CSSProperties}
                  />
                ))}
                <text x="24" y="44" className="gp-contrast-cap">
                  大量记录
                </text>
                <text x="24" y="164" className="gp-contrast-cap gp-contrast-cap--signal">
                  有价值的
                  <tspan x="24" dy="20">
                    线索
                  </tspan>
                </text>
              </svg>
            </figure>
            <p className="gp-side-line">
              有价值的线索往往<strong>分散在大量记录里</strong>——
              数据多，不等于能直接得到答案，<strong>得从里面去发现</strong>。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
