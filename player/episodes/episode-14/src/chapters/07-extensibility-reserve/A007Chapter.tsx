import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "evolution-cards",
  "room-reserved",
  "flexibility-lost",
] as const;

const EVOLUTION_CARDS = [
  { tag: "前瞻", text: "设计要有前瞻性" },
  { tag: "演进", text: "随标识发展和需求变化继续演进" },
] as const;

const SUPPORT_ROWS = [
  "合理规划编码容量，为未来的扩展预留空间",
  "不是提前塞入所有可能的字段",
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad ex-root" data-state={state}>
      <header className="ex-header">
        <span className="ex-index" aria-hidden="true">
          4/5
        </span>
        <h1 className="ex-headline">第四项：扩展性</h1>
      </header>

      <div className="ex-main">
        <div className="ex-cards">
          {EVOLUTION_CARDS.map((card) => (
            <section className="ex-card" key={card.tag}>
              <span className="ex-card-tag">{card.tag}</span>
              <p className="ex-card-text">{card.text}</p>
            </section>
          ))}
        </div>

        <div className="ex-capacity">
          <div className="ex-track">
            <span className="ex-track-current">
              <span className="ex-track-current-label">当前需求</span>
            </span>
            <span className="ex-track-reserve" aria-hidden="true">
              <span className="ex-reserve-keep">为未来的扩展预留空间</span>
              <span className="ex-reserve-manage">保留一份可以管理的成长余地</span>
              <span className="ex-reserve-crowd" aria-hidden="true">
                {Array.from({ length: 14 }, (_, i) => (
                  <span className="ex-crowd-block" key={i} />
                ))}
              </span>
            </span>
          </div>
          <div className="ex-support">
            {SUPPORT_ROWS.map((text) => (
              <p className="ex-support-row" key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="ex-takeaway">
        <span className="ex-takeaway-tag">塞得太满</span>
        <p className="ex-takeaway-text">反而失去调整的弹性</p>
      </div>
    </div>
  );
}
