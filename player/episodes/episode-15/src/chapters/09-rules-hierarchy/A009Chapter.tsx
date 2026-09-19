import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "source-question-opened",
  "standard-card-set",
  "guide-card-set",
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad rlh-root" data-state={state}>
      <header className="rlh-header">
        <span className="rlh-heading-mark" aria-hidden="true" />
        <h1 className="rlh-headline">规则依据的两个层次</h1>
      </header>

      <div className="rlh-question">
        <p className="rlh-question-line">这套编码规则从哪来？</p>
        <p className="rlh-question-strong">
          不是<em>凭空</em>定的
        </p>
      </div>

      {/* R009 载体：通用层卡在前、行业层卡错步下沉，不展示文件封面或版本标识 */}
      <div className="rlh-cards">
        <div className="rlh-slot rlh-slot-general">
          <div className="rlh-ghost" aria-hidden="true">
            <span>？</span>
          </div>
          <article className="rlh-card">
            <span className="rlh-card-kicker">通用层</span>
            <h2 className="rlh-card-title">通行标准</h2>
            <p className="rlh-card-body">参照国际通行的标识编码系列标准编写</p>
            <div className="rlh-align">
              <div className="rlh-align-row">
                <span className="rlh-align-label">上层做法</span>
                <i className="rlh-align-rail rlh-align-rail-top" />
              </div>
              <div className="rlh-align-match">
                <i className="rlh-align-link" />
                <span className="rlh-align-word">对得上</span>
              </div>
              <div className="rlh-align-row">
                <span className="rlh-align-label">通行标准</span>
                <i className="rlh-align-rail rlh-align-rail-std" />
              </div>
            </div>
          </article>
        </div>

        <div className="rlh-slot rlh-slot-industry">
          <div className="rlh-ghost" aria-hidden="true">
            <span>？</span>
          </div>
          <article className="rlh-card">
            <span className="rlh-card-kicker">行业层</span>
            <h2 className="rlh-card-title">行业编码导则</h2>
            <p className="rlh-card-body">不同行业形成各自的编码导则</p>
            <div className="rlh-land">
              <div className="rlh-land-rule">通用规则</div>
              <div className="rlh-land-zone">
                <i className="rlh-land-drop" />
                <div className="rlh-land-tray">行业对象</div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="rlh-takeaway">
        <span className="rlh-takeaway-tag">两层分工</span>
        <p className="rlh-takeaway-main">把通用规则落到具体的行业对象上</p>
      </div>
    </div>
  );
}
