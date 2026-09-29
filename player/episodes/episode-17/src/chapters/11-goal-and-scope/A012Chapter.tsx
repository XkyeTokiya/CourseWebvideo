import "./A012Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 11-goal-and-scope · A012 目标与收束（5 拍，配方 scope-responsibility-ledger）。
 * 关系机制 compare-and-reweight：职责行按"目标／现状"分行对照（R019 由分行对照承载，
 * 分隔标签"不等于"），边界栏收拢机制分工范围（R020：体系内／另一层），四个动作作为
 * 收束行序列落位；末拍收束判断补进边界栏。
 * 注意：本页 screen guidance 的 S042/G031/G032 与口播错位（实为 A011 内容），
 * 上屏文案以 outline 槽位文本（headline＝"全球唯一：目标与边界"）与批准口播 beats 重组；
 * 前提条件区按本页口播拍 1 重新推导为"还有一层也需要区分"。
 * C013：不把标识写成能自动返回对象详情，不补接口、协议、部署与权限细节。
 * step → semantic state 显式映射，允许重复，末态兜底（outline S-A012）：
 * - goal-framed：标题区与前提条件区建立，职责行落位"目标：全球唯一＋完整路径说明"
 * - registration-bounded：保持目标行，对照行落位"不等于注册办妥／能查详情"
 * - resolution-scoped：保持对照行，边界栏落位"解析管理属体系一部分；接口与部署是另一层内容"
 * - actions-summarized：保持三区，收束行序列落位四个动作
 * - context-preserved：保持收束行，边界栏补全"范围更小、上级语境一直保留"的收束判断
 */
const stateByStep = [
  "goal-framed",
  "registration-bounded",
  "resolution-scoped",
  "actions-summarized",
  "context-preserved",
] as const;

type GoalAndScopeState = (typeof stateByStep)[number];

/** 口播拍 3 的机制分工范围（逐字来自 beat 3"从命名、分配、编码到解析管理"） */
const LAYERS = ["命名", "分配", "编码", "解析管理"] as const;

/** 口播拍 4 的四个动作（逐字来自 beat 4，末卡副行补"从根到叶的顺序"） */
const ACTIONS = [
  { num: "01", text: "选根分支", sub: undefined },
  { num: "02", text: "走到国家或者领域节点", sub: undefined },
  { num: "03", text: "进入企业和产品节点", sub: undefined },
  { num: "04", text: "写成点分编码", sub: "从根到叶的顺序" },
] as const;

export default function A012Chapter({ step }: ChapterStepProps) {
  const state: GoalAndScopeState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad gs-root" data-state={state}>
      <header className="gs-header">
        <h1 className="gs-headline">全球唯一：目标与边界</h1>
        <div className="gs-premise">
          <span className="gs-premise-tag">前提</span>
          <span className="gs-premise-text">还有一层也需要区分</span>
        </div>
      </header>

      <div className="gs-main">
        <div className="gs-rows">
          <section className="gs-row gs-row-goal">
            <span className="gs-row-label gs-label-goal">目标</span>
            <div className="gs-row-body">
              <p className="gs-row-hero">全球唯一</p>
              <p className="gs-row-text">命名和分配体系要努力达到的目标</p>
              <p className="gs-row-sub">
                从根到叶的完整路径，说明目标怎样落到层级结构上
              </p>
            </div>
            <svg className="gs-tree" viewBox="0 0 170 212" aria-hidden="true">
              <line className="gs-tedge" x1={85} y1={30} x2={45} y2={110} />
              <line className="gs-tedge" x1={85} y1={30} x2={125} y2={110} />
              <line className="gs-tedge" x1={45} y1={110} x2={45} y2={185} />
              <line
                className="gs-tpath gs-tp1"
                pathLength={1}
                x1={85}
                y1={30}
                x2={45}
                y2={110}
              />
              <line
                className="gs-tpath gs-tp2"
                pathLength={1}
                x1={45}
                y1={110}
                x2={45}
                y2={185}
              />
              <circle className="gs-tnode" cx={85} cy={30} r={17} />
              <circle className="gs-tnode gs-tmid" cx={45} cy={110} r={12} />
              <circle className="gs-tnode gs-tmid" cx={125} cy={110} r={12} />
              <circle className="gs-tnode gs-tleaf" cx={45} cy={185} r={15} />
              <text className="gs-tlabel" x={112} y={37}>
                根
              </text>
              <text className="gs-tlabel" x={70} y={192}>
                叶
              </text>
            </svg>
          </section>

          <div className="gs-row-divider">
            <span className="gs-divider-tag">不等于</span>
          </div>

          <section className="gs-row gs-row-status">
            <span className="gs-row-label gs-label-status">现状</span>
            <div className="gs-row-body">
              <p className="gs-clause">
                <span className="gs-neq">≠</span>每家企业的注册都已经办妥
              </p>
              <p className="gs-clause">
                <span className="gs-neq">≠</span>系统已经能够查出这个对象的详情
              </p>
            </div>
          </section>
        </div>

        <aside className="gs-boundary">
          <div className="gs-boundary-top">
            <p className="gs-boundary-head">机制上的分工</p>
            <div className="gs-layers">
              {LAYERS.map((layer, index) => (
                <span className="gs-layer-item" key={layer}>
                  {index > 0 && (
                    <span className="gs-layer-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                  <span
                    className={
                      layer === "解析管理" ? "gs-layer gs-layer-end" : "gs-layer"
                    }
                  >
                    {layer}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="gs-scope">
            <p className="gs-scope-item">
              <span className="gs-scope-tag gs-tag-in">体系内</span>
              解析管理是 OID 体系的一部分
            </p>
            <p className="gs-scope-item">
              <span className="gs-scope-tag gs-tag-out">另一层</span>
              具体的接口和运行部署是另一层内容
            </p>
          </div>

          <div className="gs-judgment">
            <div className="gs-funnel" aria-hidden="true">
              <span className="gs-funnel-bar" />
              <span className="gs-funnel-bar" />
              <span className="gs-funnel-bar" />
              <span className="gs-funnel-bar" />
              <span className="gs-funnel-base" />
            </div>
            <p className="gs-judgment-line">每走一步，对象的范围都更小一点</p>
            <p className="gs-judgment-line gs-judgment-keep">
              上级的语境一直保留在路径里
            </p>
          </div>
        </aside>
      </div>

      <footer className="gs-actions">
        <p className="gs-actions-head">
          把整套机制收一下，就是<em>四个动作</em>
        </p>
        <div className="gs-chain">
          {ACTIONS.map((action, index) => (
            <span className="gs-chain-item" key={action.num}>
              {index > 0 && (
                <span className="gs-chain-arrow" aria-hidden="true">
                  →
                </span>
              )}
              <span className="gs-action">
                <span className="gs-action-num">{action.num}</span>
                <span className="gs-action-text">{action.text}</span>
                {action.sub && (
                  <span className="gs-action-sub">{action.sub}</span>
                )}
              </span>
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
