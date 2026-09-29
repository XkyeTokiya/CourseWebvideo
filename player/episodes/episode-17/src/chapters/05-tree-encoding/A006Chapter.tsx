import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 05-tree-encoding · A006 树状编码(4 拍,配方 parallel-cards-with-takeaway)
 * 关系机制 cumulative-assembly:两卡并列落位后按"来源→收窄"方向推进,收束区归并叶节点与属性边界。
 * step → semantic state 显式映射,允许重复,末态兜底(outline S-A006):
 * - structure-framed:标题与两张要点卡位建立,"层级点号分隔"卡先落位
 * - path-assembled:"根到叶路径组合"卡落位,路径自绘,带出叶节点=对象位置
 * - scope-narrowed:两卡层级按"前面定来源→后面收窄"方向点亮收窄排列
 * - attribute-boundary-set:收束区呈现"叶节点即对象位置;业务属性不进编码"
 */
const stateByStep = [
  "structure-framed",
  "path-assembled",
  "scope-narrowed",
  "attribute-boundary-set",
] as const;

type TreeEncodingState = (typeof stateByStep)[number];

/** 路径节点类别名:全部来自批准口播第 3 拍(树/分支→行业/企业/具体对象),不补机构与注册信息 */
const PATH_NODES = ["根", "分支", "行业", "企业", "对象"] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state: TreeEncodingState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad te-root" data-state={state}>
      <header className="te-header">
        <h1 className="te-headline">树状结构与点号分隔</h1>
      </header>

      <div className="te-cards">
        <section className="te-card">
          <h2 className="te-card-title">层级 · 点号分隔</h2>
          <p className="te-card-sub">上层节点包含下层节点</p>
          <div className="te-card-body">
            <div className="te-nest">
              <div className="te-nest-outer">
                <span className="te-nest-tag">上层节点</span>
                <div className="te-nest-inner">
                  <span className="te-nest-tag">下层节点</span>
                </div>
              </div>
            </div>
            <div className="te-dotline">
              <span>上层</span>
              <i className="te-dotsep">·</i>
              <span>下层</span>
            </div>
            <p className="te-dotnote">层级之间用点号分隔</p>
          </div>
        </section>

        <section className="te-card">
          <div className="te-c2">
            <h2 className="te-card-title">根到叶 · 路径组合</h2>
            <p className="te-card-sub">编码 = 根到叶全部路径上的节点顺序组合</p>
            <div className="te-card-body">
              <svg className="te-path" viewBox="0 0 660 140" aria-hidden="true">
                {PATH_NODES.slice(0, -1).map((name, i) => (
                  <line
                    key={`link-${name}`}
                    className={`te-link te-l${i + 1}`}
                    x1={60 + i * 135 + 27}
                    y1={60}
                    x2={60 + (i + 1) * 135 - 27}
                    y2={60}
                    pathLength={1}
                  />
                ))}
                {PATH_NODES.map((name, i) => (
                  <g className={`te-nodegroup te-n${i + 1}`} key={name}>
                    <circle
                      className={`te-node${
                        i === PATH_NODES.length - 1 ? " te-node-leaf" : ""
                      }`}
                      cx={60 + i * 135}
                      cy={60}
                      r={24}
                    />
                    <text
                      className="te-node-label"
                      x={60 + i * 135}
                      y={124}
                      textAnchor="middle"
                    >
                      {name}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="te-brackets">
                <div className="te-bracket te-bracket-src">
                  <span>前面的数字 · 定来源</span>
                </div>
                <div className="te-bracket te-bracket-narrow">
                  <span>后面的节点 · 收窄</span>
                </div>
              </div>
              <p className="te-leafnote">
                <b>叶节点</b>
                <span>= 不再往下分的那层 = 对象所在位置</span>
              </p>
            </div>
          </div>
          <div className="te-c2-slot" aria-hidden="true" />
        </section>
      </div>

      <div className="te-takeaway">
        <p className="te-take-leaf">
          <b>叶节点</b>
          <span>= 对象所在的位置</span>
        </p>
        <div className="te-take-gate">
          <div className="te-gate-attrs">
            <div className="te-gate-tags">
              <b>规格</b>
              <b>批次</b>
            </div>
            <span>业务属性</span>
          </div>
          <div className="te-gate-bar">
            <em>不进</em>
          </div>
          <div className="te-gate-code">
            <div className="te-gate-dots">
              <i />
              <i />
              <i />
            </div>
            <span>编码</span>
          </div>
        </div>
      </div>
    </div>
  );
}
