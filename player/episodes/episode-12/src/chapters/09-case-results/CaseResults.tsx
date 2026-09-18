import "./CaseResults.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A009 · 案例结果页（S-A041 · evidence-cards-with-provenance-boundary）
 * 关系机制 evidence-with-scope：四张证据卡（U023）按口播次序等权累积，
 * 来源边界带（U024）自首拍与数字同屏、包住卡组（R015 · scope 并置），
 * 末拍 inference-boundary（U025）收束外推边界。
 */
const stateByStep = [
  "first-evidence-card",
  "second-evidence-card",
  "third-evidence-card",
  "results-scope-bounded",
] as const;

type CaseResultsState = (typeof stateByStep)[number];

export default function CaseResults({ step }: ChapterStepProps) {
  const state: CaseResultsState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene cr-scene state-${state}`}>
      <div className="scene-pad cr-pad">
        <header className="cr-head">
          <h1 className="cr-headline serif-cn">案例结果与适用范围</h1>
          <span className="cr-head-note mono">该案例 · 四项结果</span>
          <hr className="rule cr-head-rule" />
        </header>

        {/* provenance-band（U024）：来源边界带自首拍与数字同屏，包住证据卡组（R015） */}
        <section className="cr-scope" aria-label="结果归属该案例">
          <span className="cr-scope-tab mono">结果归属 · 本案例</span>
          <span className="cr-scope-mark mono" aria-hidden="true">
            案例范围
          </span>

          <div className="cr-grid">
            {/* 证据卡 1（U023 · S042 exact） */}
            <article className="cr-ev card cr-ev-1">
              <div className="cr-slot mono" aria-hidden="true">
                待补
              </div>
              <div className="cr-face">
                <span className="cr-ev-tag mono">结果 01</span>
                <h3 className="cr-ev-title serif-cn">零部件本体的永久标识</h3>
                <div className="cr-ev-demo cr-demo-misjudge">
                  <span className="cr-drop" aria-hidden="true">
                    <i className="cr-drop-line" />
                    <i className="cr-drop-stem" />
                    <i className="cr-drop-head" />
                  </span>
                  <span className="cr-hero hero-num">
                    5000<i className="cr-hero-unit">万</i>
                  </span>
                </div>
                <p className="cr-ev-exact">预计降低服务误判额 5000 万</p>
              </div>
            </article>

            {/* 证据卡 2（U023 · S043 exact） */}
            <article className="cr-ev card cr-ev-2">
              <div className="cr-slot mono" aria-hidden="true">
                待补
              </div>
              <div className="cr-face">
                <span className="cr-ev-tag mono">结果 02</span>
                <h3 className="cr-ev-title serif-cn">订单一致性</h3>
                <div className="cr-ev-demo">
                  <svg className="cr-ring" viewBox="0 0 72 72" aria-hidden="true">
                    <circle className="cr-ring-track" cx="36" cy="36" r="30" />
                    <circle className="cr-ring-fill" cx="36" cy="36" r="30" />
                  </svg>
                  <span className="cr-hero hero-num">
                    100<i className="cr-hero-unit">%</i>
                  </span>
                </div>
                <p className="cr-ev-exact">订单一致性提升至 100%</p>
              </div>
            </article>

            {/* 证据卡 3（U023 · S044 exact） */}
            <article className="cr-ev card cr-ev-3">
              <div className="cr-slot mono" aria-hidden="true">
                待补
              </div>
              <div className="cr-face">
                <span className="cr-ev-tag mono">结果 03</span>
                <h3 className="cr-ev-title serif-cn">配件物流管理</h3>
                <div className="cr-ev-demo cr-demo-units">
                  <div className="cr-units" aria-hidden="true">
                    <i className="cr-unit" />
                    <i className="cr-unit" />
                    <i className="cr-unit" />
                    <i className="cr-unit" />
                    <i className="cr-unit" />
                    <i className="cr-unit" />
                  </div>
                  <div className="cr-loss-row">
                    <span className="cr-loss-chip serif-cn">
                      丢失<b aria-hidden="true">↓</b>
                    </span>
                    <span className="cr-loss-chip serif-cn">
                      物料损耗<b aria-hidden="true">↓</b>
                    </span>
                  </div>
                </div>
                <p className="cr-ev-exact">配件物流管理细化到单件</p>
              </div>
            </article>

            {/* 证据卡 4（U023 · S045） */}
            <article className="cr-ev card cr-ev-4">
              <div className="cr-slot mono" aria-hidden="true">
                待补
              </div>
              <div className="cr-face">
                <span className="cr-ev-tag mono">结果 04</span>
                <h3 className="cr-ev-title serif-cn">服务与满意度</h3>
                <ul className="cr-svc">
                  <li className="cr-svc-row">服务准确性提高</li>
                  <li className="cr-svc-row">客户等待减少</li>
                  <li className="cr-svc-row">满意度显著提升</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* inference-boundary（U025）：适用范围与数字同屏的外推边界，R015 并置成立 */}
        <footer className="cr-boundary" aria-label="适用范围边界">
          <span className="cr-boundary-label mono">适用范围</span>
          <p className="cr-boundary-text serif-cn">
            四项结果<em>只在案例范围内</em>成立
          </p>
        </footer>
      </div>
    </div>
  );
}
