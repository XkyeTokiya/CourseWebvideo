import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "structure-standard",
  "check-digits-added",
  "optional-boundary",
] as const;

const STRUCTURE_CARDS = [
  { tag: "结构", text: "编码结构简洁明确" },
  { tag: "规范", text: "参考行业标准或国家命名标准，在有限长度内统一规范" },
] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad sc-root" data-state={state}>
      <header className="sc-header">
        <span className="sc-index" aria-hidden="true">
          5/5
        </span>
        <h1 className="sc-headline">第五项：科学性</h1>
      </header>

      <div className="sc-main">
        <div className="sc-cards">
          {STRUCTURE_CARDS.map((card) => (
            <section className="sc-card" key={card.tag}>
              <span className="sc-card-tag">{card.tag}</span>
              <p className="sc-card-text">{card.text}</p>
            </section>
          ))}
        </div>

        <div className="sc-connectors" aria-hidden="true">
          <span className="sc-connector" />
          <span className="sc-connector" />
        </div>

        <section className="sc-slab">
          <p className="sc-slab-title">必要时设置校验码位和安全码</p>
          <div className="sc-slab-row">
            <span className="sc-module">校验码位</span>
            <span className="sc-module">安全码</span>
            <span className="sc-slab-arrow" aria-hidden="true">
              →
            </span>
            <span className="sc-outcome">正确性 · 安全性</span>
          </div>
          <span className="sc-slab-flag">按需启用</span>
        </section>
      </div>

      <div className="sc-takeaway">
        <span className="sc-takeaway-tag">非必选项</span>
        <p className="sc-takeaway-text">用不用要看实际需要</p>
      </div>
    </div>
  );
}
