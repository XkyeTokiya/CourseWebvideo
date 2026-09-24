import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "compatible-forms-shown",
  "identity-invariant",
  "stages-traversed",
  "anchor-judged",
] as const;

const STAGES = [
  { name: "生产", note: "记录企业内部的对象信息" },
  { name: "销售", note: "沿服务机构代码的层级找到所属企业" },
  { name: "维护", note: "仍然围绕同一个标识" },
  { name: "回收", note: "围绕同一个标识关联记录" },
] as const;

function BatteryGlyph() {
  return (
    <svg className="lia-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="14" width="33" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <rect x="41" y="21" width="4.5" height="8" rx="1.4" fill="currentColor" />
      <path
        d="M24 18.5 17 27.5h4.8L20 34l7.6-9.6h-4.8L24 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad lia-root" data-state={state}>
      <header className="lia-header">
        <span className="lia-heading-mark" aria-hidden="true" />
        <h1 className="lia-headline">共同的身份锚点</h1>
      </header>

      <div className="lia-main">
        {/* R008 载体：固定身份铭牌骑跨盒沿，阶段带收纳在盒内，无连线 */}
        <div className="lia-box">
          <div className="lia-plate">
            <span className="lia-focus" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="lia-plate-tile" aria-hidden="true">
              <span className="lia-plate-flip" />
              <BatteryGlyph />
            </span>
            <div className="lia-plate-copy">
              <p className="lia-plate-title">同一个标识对象</p>
              <p className="lia-plate-sub lia-plate-sub-1">不同场景里，采用彼此相容的表达</p>
              <p className="lia-plate-sub lia-plate-sub-2">形式之间，可以相互映射转化</p>
              <p className="lia-plate-formula">
                <span className="lia-formula-bar" aria-hidden="true" />
                场景换 · 表达换 · 身份不变
              </p>
            </div>
          </div>

          <div className="lia-stages">
            {STAGES.map((stage) => (
              <section className="lia-stage" key={stage.name}>
                <span className="lia-stage-punch" aria-hidden="true" />
                <div className="lia-stage-body">
                  <h2 className="lia-stage-name">{stage.name}</h2>
                  <p className="lia-stage-note">{stage.note}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="lia-judgment">
        <div className="lia-slips" aria-hidden="true">
          <span className="lia-slip lia-slip-1" />
          <span className="lia-slip lia-slip-2" />
          <span className="lia-slip lia-slip-3" />
          <span className="lia-slip-anchor">
            <BatteryGlyph />
          </span>
        </div>
        <div className="lia-judgment-copy">
          <p className="lia-judgment-main">
            不塞业务数据，只提供<em>共同的身份锚点</em>
          </p>
          <p className="lia-judgment-sub">分散在各环节的记录，共享同一个身份锚点</p>
        </div>
      </div>
    </div>
  );
}
