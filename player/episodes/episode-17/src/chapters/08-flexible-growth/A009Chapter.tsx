import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 08-flexible-growth · A009 灵活扩展（3 拍，配方 lifecycle-identity-continuity）。
 * 关系机制 ordered-progression：扩展阶段按真实先后落位，不变锚点承载"已分好的路径保持不动"。
 * step → semantic state 显式映射，允许重复，末态兜底（outline S-A009）：
 * - growth-anchored：标题与不变锚点建立，阶段轨落位前两个扩展动作，树上两处新枝生长
 * - stages-extended：阶段轨补全"新枝一层一层接上"，阶段说明区呈现"留余地、用起来灵活"
 * - flexibility-bounded：收束区呈现"灵活=命名结构留余地；数据采集不会自动变准确"
 */
const stateByStep = [
  "growth-anchored",
  "stages-extended",
  "flexibility-bounded",
] as const;

type FlexibleGrowthState = (typeof stateByStep)[number];

/** 扩展阶段轨：三条阶段全部来自批准口播拍 1/2，不补分配流程（silent constraint C010） */
const STAGES = [
  {
    key: "fg-stage-1",
    index: "①",
    title: "新增行业或企业",
    sub: "在已有的上级节点下面继续分配子节点",
  },
  {
    key: "fg-stage-2",
    index: "②",
    title: "新增一块产品",
    sub: "在这家企业的节点下面添一个叶节点",
  },
  {
    key: "fg-stage-3",
    index: "③",
    title: "新枝一层一层接上",
    sub: "不必为了增加对象去改动已经分好的路径",
  },
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state: FlexibleGrowthState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fg-root" data-state={state}>
      <header className="fg-header">
        <h1 className="fg-headline">在同一上级节点下继续扩展</h1>
      </header>

      <div className="fg-main">
        <section className="fg-tree-panel">
          <p className="fg-panel-title">已分好的路径 · 保持不动</p>
          <svg className="fg-tree" viewBox="0 0 700 500" aria-hidden="true">
            {/* 不变锚点：根→行业→企业→已有产品，深色实线持续保留 */}
            <line
              className="fg-alink fg-al1"
              x1={420}
              y1={55}
              x2={350}
              y2={175}
              pathLength={1}
            />
            <line
              className="fg-alink fg-al2"
              x1={350}
              y1={175}
              x2={250}
              y2={300}
              pathLength={1}
            />
            <line
              className="fg-alink fg-al3"
              x1={250}
              y1={300}
              x2={140}
              y2={425}
              pathLength={1}
            />
            <g className="fg-an1">
              <circle className="fg-anode" cx={420} cy={55} r={30} />
              <text className="fg-alabel" x={374} y={64} textAnchor="end">
                根
              </text>
            </g>
            <g className="fg-an2">
              <circle className="fg-anode" cx={350} cy={175} r={30} />
              <text className="fg-alabel" x={304} y={184} textAnchor="end">
                行业
              </text>
            </g>
            <g className="fg-an3">
              <circle className="fg-anode" cx={250} cy={300} r={30} />
              <text className="fg-alabel" x={204} y={309} textAnchor="end">
                企业
              </text>
            </g>
            <g className="fg-an4">
              <circle className="fg-anode" cx={140} cy={425} r={26} />
              <text className="fg-alabel" x={100} y={434} textAnchor="end">
                已有产品
              </text>
            </g>
            {/* 第 1 拍两处新枝：行业下新增企业、企业下新增产品 */}
            <line
              className="fg-glink fg-gl1"
              x1={350}
              y1={175}
              x2={560}
              y2={300}
              pathLength={1}
            />
            <line
              className="fg-glink fg-gl2"
              x1={250}
              y1={300}
              x2={350}
              y2={440}
              pathLength={1}
            />
            <g className="fg-gn1">
              <circle className="fg-gnode" cx={560} cy={300} r={28} />
              <text className="fg-glabel" x={594} y={309} textAnchor="start">
                新增企业
              </text>
            </g>
            <g className="fg-gn2">
              <circle className="fg-gnode" cx={350} cy={440} r={24} />
              <text className="fg-glabel" x={384} y={449} textAnchor="start">
                新增产品
              </text>
            </g>
            {/* 第 2 拍：新枝再往下接一层 */}
            <line
              className="fg-clink"
              x1={560}
              y1={328}
              x2={560}
              y2={422}
              pathLength={1}
            />
            <g className="fg-cnodegroup">
              <circle className="fg-cnode" cx={560} cy={440} r={16} />
              <text className="fg-cdots" x={560} y={447} textAnchor="middle">
                …
              </text>
            </g>
          </svg>
        </section>

        <div className="fg-side">
          <div className="fg-track">
            <p className="fg-track-kicker">扩展动作</p>
            {STAGES.map((stage) => (
              <div className={`fg-stage ${stage.key}`} key={stage.key}>
                <span className="fg-stage-index">{stage.index}</span>
                <div className="fg-stage-text">
                  <h3 className="fg-stage-title">{stage.title}</h3>
                  <p className="fg-stage-sub">{stage.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="fg-purpose">
            <p className="fg-purpose-line">
              命名结构留了余地，<b>用起来就比较灵活</b>
            </p>
          </div>
        </div>
      </div>

      <div className="fg-close">
        <div className="fg-close-def">
          <b className="fg-close-key">灵活</b>
          <span className="fg-close-eq">=</span>
          <span className="fg-close-val">命名结构上留了余地</span>
        </div>
        <div className="fg-close-divider" aria-hidden="true" />
        <div className="fg-close-bound">
          <b className="fg-close-key2">数据采集</b>
          <span className="fg-close-warn">不会自动变准确</span>
        </div>
      </div>
    </div>
  );
}
