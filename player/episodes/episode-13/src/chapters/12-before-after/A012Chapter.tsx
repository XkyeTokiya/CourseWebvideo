import "./A012Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m004Image from "./assets/M004.png";

/** outline Step 映射：narration step → semantic state（S-A012，4 拍一一对应） */
const stateByStep = [
  "before-p2p-interfaces",
  "before-cost-growing",
  "after-common-rules",
  "after-division-preserved",
] as const;

export default function A012Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad ba-root" data-state={state}>
      {/* headline：S056 论点标题（可见标题：保留） */}
      <header className="ba-head">
        <h1 className="ba-headline">
          从<span className="ba-hl-from">逐一适配</span>到
          <span className="ba-hl-to">共同规则</span>
        </h1>
      </header>

      {/* scene-image：M004 产线数据采集语境，全宽图像带，持续在场 */}
      <figure className="ba-media">
        <img
          className="ba-media-img"
          src={m004Image}
          alt="产线数据采集情境图（M004 占位）"
        />
        <figcaption className="ba-media-caption">
          产线数据采集 · M004 · 素材待提供
        </figcaption>
      </figure>

      <div className="ba-stage">
        {/* rail-before：U029 没有统一规范 —— 逐套点对点接口 */}
        <section className="ba-zone ba-zone-before">
          <div className="ba-zone-tag">
            <span className="ba-tag-mark ba-tag-mark-before" aria-hidden="true" />
            <span className="ba-zone-title">没有统一规范时</span>
          </div>
          <p className="ba-before-sub">每两套系统之间，都可能要单独开发一条接口</p>

          <svg className="ba-svg ba-mesh" viewBox="0 0 560 300" aria-hidden="true">
            {/* 拍 1 落位的三条接口 */}
            <line className="ba-line ba-line-1" x1="73" y1="43" x2="487" y2="43" pathLength={1} />
            <line className="ba-line ba-line-2" x1="73" y1="257" x2="487" y2="257" pathLength={1} />
            <line className="ba-line ba-line-5" x1="73" y1="43" x2="487" y2="257" pathLength={1} />
            {/* 拍 2 补齐：网状纠缠完成 */}
            <line className="ba-line ba-line-3" x1="73" y1="43" x2="73" y2="257" pathLength={1} />
            <line className="ba-line ba-line-4" x1="487" y1="43" x2="487" y2="257" pathLength={1} />
            <line className="ba-line ba-line-6" x1="487" y1="43" x2="73" y2="257" pathLength={1} />

            <rect
              className="ba-tangle"
              x="264"
              y="134"
              width="32"
              height="32"
              transform="rotate(45 280 150)"
            />

            <circle className="ba-dot ba-dot-1" cx="280" cy="43" r="8" />
            <circle className="ba-dot ba-dot-2" cx="280" cy="257" r="8" />
            <circle className="ba-dot ba-dot-5" cx="280" cy="150" r="9" />
            <circle className="ba-dot ba-dot-3" cx="73" cy="150" r="8" />
            <circle className="ba-dot ba-dot-4" cx="487" cy="150" r="8" />

            <g className="ba-node">
              <rect x="14" y="16" width="118" height="54" rx="6" />
              <text x="73" y="51">系统 A</text>
            </g>
            <g className="ba-node">
              <rect x="428" y="16" width="118" height="54" rx="6" />
              <text x="487" y="51">系统 B</text>
            </g>
            <g className="ba-node">
              <rect x="14" y="230" width="118" height="54" rx="6" />
              <text x="73" y="265">系统 C</text>
            </g>
            <g className="ba-node">
              <rect x="428" y="230" width="118" height="54" rx="6" />
              <text x="487" y="265">系统 D</text>
            </g>
          </svg>

          <div className="ba-cost">
            <div className="ba-cost-head">
              <span className="ba-cost-title">定制与维护工作量</span>
              <span className="ba-cost-note">系统越多，增长越快</span>
            </div>
            <div className="ba-cost-row">
              <span className="ba-cost-label">2 套</span>
              <span className="ba-cost-track">
                <span className="ba-cost-bar ba-cost-bar-1" />
              </span>
            </div>
            <div className="ba-cost-row">
              <span className="ba-cost-label">3 套</span>
              <span className="ba-cost-track">
                <span className="ba-cost-bar ba-cost-bar-2" />
              </span>
            </div>
            <div className="ba-cost-row">
              <span className="ba-cost-label">4 套</span>
              <span className="ba-cost-track">
                <span className="ba-cost-bar ba-cost-bar-3" />
              </span>
            </div>
          </div>
        </section>

        {/* R014 转向轴：两对照区之间的持续中轴，拍 3 激活 */}
        <div className="ba-axis" aria-hidden="true">
          <span className="ba-axis-line" />
          <span className="ba-axis-tag">转向</span>
          <svg className="ba-axis-arrow" viewBox="0 0 72 56">
            <polygon points="6,20 40,20 40,6 66,28 40,50 40,36 6,36" />
          </svg>
        </div>

        {/* rail-after：U030 共同规则 —— 统一标识 / 数据规范 / 连接器 */}
        <section className="ba-zone ba-zone-after">
          <div className="ba-zone-tag">
            <span className="ba-tag-mark ba-tag-mark-after" aria-hidden="true" />
            <span className="ba-zone-title">有了共同规则后</span>
          </div>

          <div className="ba-afterbody">
            {/* 拍 1–2：rail-after 空置占位 */}
            <div className="ba-ghost" aria-hidden="true">
              <span className="ba-ghost-dash" />
              <span className="ba-ghost-dash" />
              <span className="ba-ghost-dash" />
            </div>

            <div className="ba-flowwrap">
              <svg className="ba-svg ba-flow" viewBox="0 0 560 300" aria-hidden="true">
                {/* 规则汇入连接器 */}
                <line className="ba-chipline ba-chipline-1" x1="239" y1="52" x2="272" y2="104" pathLength={1} />
                <line className="ba-chipline ba-chipline-2" x1="379" y1="52" x2="288" y2="104" pathLength={1} />
                {/* 各套系统 → 连接器 */}
                <line className="ba-flowin ba-flowin-1" x1="132" y1="37" x2="214" y2="132" pathLength={1} />
                <line className="ba-flowin ba-flowin-2" x1="132" y1="115" x2="214" y2="144" pathLength={1} />
                <line className="ba-flowin ba-flowin-3" x1="132" y1="193" x2="214" y2="156" pathLength={1} />
                <line className="ba-flowin ba-flowin-4" x1="132" y1="271" x2="214" y2="168" pathLength={1} />
                {/* 连接器 → 业务模块（拍 4 点亮 + 流动） */}
                <line className="ba-flowout ba-flowout-1" x1="346" y1="138" x2="428" y2="43" />
                <line className="ba-flowout ba-flowout-2" x1="346" y1="150" x2="428" y2="150" />
                <line className="ba-flowout ba-flowout-3" x1="346" y1="162" x2="428" y2="257" />
                <line className="ba-flowdash" x1="346" y1="138" x2="428" y2="43" />
                <line className="ba-flowdash" x1="346" y1="150" x2="428" y2="150" />
                <line className="ba-flowdash" x1="346" y1="162" x2="428" y2="257" />

                <g className="ba-module ba-module-1">
                  <rect x="428" y="16" width="118" height="54" rx="6" />
                  <text className="ba-module-name" x="487" y="41">生产</text>
                  <text className="ba-module-sub" x="487" y="63">业务模块</text>
                </g>
                <g className="ba-module ba-module-2">
                  <rect x="428" y="123" width="118" height="54" rx="6" />
                  <text className="ba-module-name" x="487" y="148">质量</text>
                  <text className="ba-module-sub" x="487" y="170">业务模块</text>
                </g>
                <g className="ba-module ba-module-3">
                  <rect x="428" y="230" width="118" height="54" rx="6" />
                  <text className="ba-module-name" x="487" y="255">物流</text>
                  <text className="ba-module-sub" x="487" y="277">业务模块</text>
                </g>

                <g className="ba-hub">
                  <rect x="214" y="106" width="132" height="88" rx="10" />
                  <text x="280" y="160">连接器</text>
                </g>

                <g className="ba-anode ba-anode-1">
                  <rect x="14" y="14" width="118" height="46" rx="6" />
                  <text x="73" y="45">系统 A</text>
                </g>
                <g className="ba-anode ba-anode-2">
                  <rect x="14" y="92" width="118" height="46" rx="6" />
                  <text x="73" y="123">系统 B</text>
                </g>
                <g className="ba-anode ba-anode-3">
                  <rect x="14" y="170" width="118" height="46" rx="6" />
                  <text x="73" y="201">系统 C</text>
                </g>
                <g className="ba-anode ba-anode-4">
                  <rect x="14" y="248" width="118" height="46" rx="6" />
                  <text x="73" y="279">系统 D</text>
                </g>

                <g className="ba-chip ba-chip-1">
                  <rect x="180" y="12" width="118" height="40" rx="6" />
                  <text x="239" y="39">统一标识</text>
                </g>
                <g className="ba-chip ba-chip-2">
                  <rect x="320" y="12" width="118" height="40" rx="6" />
                  <text x="379" y="39">数据规范</text>
                </g>
              </svg>

              <p className="ba-banner">
                各套系统按<span className="ba-banner-hl">共同规则</span>完成数据的转换和交换
              </p>

              <div className="ba-after-notes">
                <p className="ba-note ba-note-1">
                  <span className="ba-note-mark" aria-hidden="true" />
                  生产、质量、物流仍由各自的业务模块负责
                </p>
                <p className="ba-note ba-note-2">
                  <span className="ba-note-mark" aria-hidden="true" />
                  连接器提供跨系统协作的通道
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
