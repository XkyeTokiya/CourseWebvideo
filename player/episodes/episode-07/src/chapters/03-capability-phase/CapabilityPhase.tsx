import type { ChapterStepProps } from "../../../src/runtime/types";
import "./CapabilityPhase.css";

// A003 · S-A003(单持续 base-scene)。
// narration step → semantic state(见 outline 视觉步组):
// anchor-established / direction-shown / continuity-drawn。
const stateByStep = [
  "anchor-established",
  "direction-shown",
  "continuity-drawn",
] as const;

type SceneState = (typeof stateByStep)[number];

// 连续性收束织入卡行:起步建设(origin 节点,step 3 现身)
// → 线段 → 两张方向卡。两卡为线上的阶段,链条即“一条线”。
function CapabilityPhaseScene({ state }: { state: SceneState }) {
  return (
    <div className="scene cp" data-state={state}>
      <div className="scene-pad cp-pad">
        <header className="cp-head">
          <h1 className="cp-headline">2021—2023：能力增强</h1>
          <hr className="rule" />
        </header>

        <section className="cp-band card">
          <div className="cp-band-text">
            <p className="cp-doc">《工业互联网创新发展行动计划（2021—2023 年）》</p>
            <p className="cp-doc-no">通知文号：工信部信管〔2020〕197 号</p>
          </div>
          <span className="cp-stamp">已核验</span>
        </section>

        <section className="cp-flow">
          <div className="cp-origin">
            <span className="cp-dot" aria-hidden />
            <span className="cp-origin-label">起步建设</span>
          </div>
          <span className="cp-seg" aria-hidden />
          <article className="cp-card">
            <div className="cp-ghost" aria-hidden />
            <div className="cp-body card">
              <p className="cp-tag">阶段方向</p>
              <div className="cp-word-slot">
                <p className="cp-word">能力增强</p>
              </div>
              <hr className="rule" />
              <p className="cp-sub">标识解析服务能力继续扩展</p>
            </div>
          </article>
          <span className="cp-seg" aria-hidden />
          <article className="cp-card">
            <div className="cp-ghost" aria-hidden />
            <div className="cp-body card">
              <p className="cp-tag">阶段方向</p>
              <div className="cp-word-slot">
                <p className="cp-word">行业推广</p>
              </div>
              <hr className="rule" />
              <p className="cp-sub">工业互联网向更多行业渗透</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export function CapabilityPhase({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <CapabilityPhaseScene state={state} />;
}
