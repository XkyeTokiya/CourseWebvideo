import "./PartsSingleItem.css";
import m003Url from "./assets/m003-parts.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/* S-A030 · issue-cards-with-image
 * step → semantic state（与 outline step 表逐字一致，允许重复） */
const stateByStep = [
  "granularity-card",
  "flow-verifiable-card",
  "management-boundary-takeaway",
] as const;

type PartsState = (typeof stateByStep)[number];

export default function PartsSingleItem({ step }: ChapterStepProps) {
  const state: PartsState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene ps-scene state-${state}`}>
      <div className="scene-pad ps-pad">
        <h1 className="ps-headline serif-cn">配件流转细化到单件</h1>

        <div className="ps-main">
          <div className="ps-cards">
            {/* U017 · 粒度卡（S031）：管理粒度从一批货推进到一件货 */}
            <article className="ps-issue ps-issue-gran card">
              <span className="ps-issue-tag mono">粒度卡</span>
              <h2 className="ps-issue-title serif-cn">管理粒度</h2>
              <p className="ps-issue-sub">从「一批货」推进到「一件货」</p>

              <div className="ps-gran" aria-hidden="true">
                <div className="ps-gran-side">
                  <div className="ps-batch">
                    {Array.from({ length: 12 }, (_, i) => (
                      <i
                        className={`ps-batch-cell${i === 7 ? " ps-batch-pick" : ""}`}
                        key={i}
                      />
                    ))}
                  </div>
                  <span className="ps-gran-label mono">一批货</span>
                </div>

                <span className="ps-gran-link">
                  <em className="ps-gran-link-label mono">唯一身份</em>
                  <i className="ps-gran-link-line" />
                  <i className="ps-gran-link-head" />
                </span>

                <div className="ps-gran-side">
                  <span className="ps-single">
                    <i className="ps-single-code" />
                    <i className="ps-single-scan" />
                  </span>
                  <span className="ps-gran-label mono">一件货</span>
                </div>
              </div>
            </article>

            {/* R012 · 粒度卡 → 流转卡（enables，由两卡间的支撑排列承载） */}
            <div className="ps-support" aria-hidden="true">
              <span className="ps-support-label mono">细化支撑</span>
              <span className="ps-support-arrow">
                <i className="ps-support-line" />
                <i className="ps-support-head" />
              </span>
            </div>

            {/* U018 · 流转卡（S032）：单件流转过程可核验，用于避免串货 */}
            <div className="ps-flowcell">
              <div className="ps-slot-empty" aria-hidden="true">
                <span className="mono">流转卡 · 待补</span>
              </div>
              <article className="ps-issue ps-issue-flow card">
                <span className="ps-issue-tag mono">流转卡</span>
                <h2 className="ps-issue-title serif-cn">
                  单件流转<em>可核验</em>
                </h2>
                <p className="ps-issue-sub">用于避免串货</p>

                <div className="ps-flow" aria-hidden="true">
                  <span className="ps-flow-track">
                    <i className="ps-flow-line" />
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span className="ps-stop" key={i}>
                        <i className="ps-stop-mark" />
                        <i className="ps-stop-tick" />
                      </span>
                    ))}
                  </span>
                  <span className="ps-flow-caption">
                    <span className="ps-flow-end">
                      <em className="mono">每一步</em>有据可查
                    </span>
                    <span className="ps-flow-note serif-cn">
                      串货，多一道<em>实在约束</em>
                    </span>
                  </span>
                </div>
              </article>
            </div>
          </div>

          {/* M003 · 配件仓储单件流转语境（编号占位卡，待替换正式素材） */}
          <figure className="ps-media card">
            <img
              src={m003Url}
              alt="配件仓储单件流转语境占位图（M003，待替换正式素材）"
            />
            <figcaption className="ps-media-caption mono">
              M003 · 配件仓储单件流转语境（占位，待替换）
            </figcaption>
          </figure>
        </div>

        {/* U019 · takeaway（S033）：避免串货是管理目标，依赖各环节正确采集 */}
        <footer className="ps-takeaway card">
          <div className="ps-take-judge">
            <span className="ps-take-lead mono">管理目标 · 边界</span>
            <p className="ps-take-hero serif-cn">
              避免串货<em>是管理目标</em>
            </p>
            <p className="ps-take-sub">靠每个环节正确采集、保住身份记录来实现</p>
          </div>

          <div className="ps-take-demo" aria-hidden="true">
            <span className="ps-collect">
              <span className="ps-collect-cells">
                {[0, 1, 2].map((i) => (
                  <span className="ps-collect-cell" key={i}>
                    <i className="ps-collect-dot" />
                    <i className="ps-collect-tick" />
                  </span>
                ))}
              </span>
              <em className="ps-collect-label mono">每个环节</em>
            </span>
            <span className="ps-take-link">
              <em className="ps-take-link-label mono">实现</em>
              <i className="ps-take-link-line" />
              <i className="ps-take-link-head" />
            </span>
            <span className="ps-record">
              <i className="ps-record-stripes" />
              保住身份记录
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
