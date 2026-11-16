import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010Chapter.css";

const stateByStep = [
  "multiple-definitions",
  "expression-unified",
  "permission-separated",
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const unified = state !== "multiple-definitions";
  const separated = state === "permission-separated";

  return (
    <div className="ue-scene scene-pad">
      <header className="ue-head">
        <h1 className="ue-headline">找得到、读得懂的前提</h1>
        <div className="ue-head-rule" />
      </header>

      <div className="ue-cards">
        <section className="ue-card card is-on" aria-label="说法差异">
          <p className="ue-tag">差异</p>
          <p className="ue-claim">
            同一件对象在企业内部、行业内部、跨企业、跨行业各有各的说法
          </p>
          <div className="ue-voices" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </section>

        <section
          className={`ue-card card${unified ? " is-on" : " is-pending"}`}
          aria-hidden={!unified}
          aria-label="统一表达与标识寻址"
        >
          <p className="ue-tag">方法</p>
          <p className="ue-claim">
            共享要先对目标对象做统一表达，再通过标识去寻址
          </p>
          <div className="ue-flow" aria-hidden="true">
            <span className="ue-flow-node">统一表达</span>
            <svg className="ue-flow-arrow" viewBox="0 0 96 16">
              <line x1="2" y1="8" x2="74" y2="8" />
              <path d="M72 2 L86 8 L72 14 Z" />
            </svg>
            <span className="ue-flow-node">标识寻址</span>
          </div>
          <p className="ue-sub">慢慢形成一套数据理解体系。</p>
        </section>
      </div>

      <aside
        className={`ue-takeaway card${separated ? " is-on" : ""}`}
        aria-hidden={!separated}
      >
        <p className="ue-t1">
          标识能帮我们定位对象、弄清信息去向；但标识不等于自动授权
        </p>
        <p className="ue-t2">找到不等于能用 —— 能不能用，按约定来。</p>
      </aside>
    </div>
  );
}
