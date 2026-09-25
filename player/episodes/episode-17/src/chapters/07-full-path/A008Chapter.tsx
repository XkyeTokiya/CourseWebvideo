import { Fragment } from "react";
import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 07-full-path · A008 完整路径(3 拍,配方 common-anchor-association-groups)
 * 关系机制 ordered-progression:路径按根到叶顺序逐段点亮成共同锚点,
 * 后续说明在锚点之下分层补充,不重排已连成的路径。
 * step → semantic state 显式映射,允许重复,末态兜底(outline S-A008):
 * - path-assembled:标题建立,路径锚点六段按 1→2→156→3001→0501→1001.01 逐段点亮,
 *   关联组区呈现点号推进说明,整条路径在口播收尾处连成一体
 * - preservation-noted:保持路径锚点,分层保留区三行落位,
 *   呈现"下游节点不抹掉上级路径,在既有分支下继续细化"
 * - narrowing-confirmed:保持注记,补全"范围更窄、前面路径一直保留"的对照关系
 */
const stateByStep = [
  "path-assembled",
  "preservation-noted",
  "narrowing-confirmed",
] as const;

type FullPathState = (typeof stateByStep)[number];

/** 锚点六段:逐字来自批准口播第 1 拍的完整路径 1.2.156.3001.0501.1001.01,按根到叶顺序点亮 */
const PATH_SEGMENTS = ["1", "2", "156", "3001", "0501", "1001.01"] as const;

/** 分层保留区:每行=既有分支下继续细化的下游节点;累积路径为锚点串的前缀截取,不新增事实 */
const LAYERS = [
  { node: "3001", inherited: "1.2.156", width: "64%" },
  { node: "0501", inherited: "1.2.156.3001", width: "46%" },
  { node: "1001.01", inherited: "1.2.156.3001.0501", width: "32%" },
] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state: FullPathState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fp-root" data-state={state}>
      <header className="fp-header">
        <h1 className="fp-headline">从根到叶的完整路径</h1>
      </header>

      <div className="fp-anchor" aria-label="完整路径 1.2.156.3001.0501.1001.01">
        <span className="fp-end fp-end-root">根</span>
        <div className="fp-strip">
          {PATH_SEGMENTS.map((seg, i) => (
            <Fragment key={seg}>
              {i > 0 && (
                <span className="fp-anchor-dot" aria-hidden="true" data-dot={i} />
              )}
              <span className={`fp-anchor-cell fp-cell-${i + 1}`}>
                <span className="fp-anchor-num hero-num">{seg}</span>
              </span>
            </Fragment>
          ))}
          <span className="fp-anchor-underline" aria-hidden="true" />
        </div>
        <span className="fp-end fp-end-leaf">叶</span>
      </div>

      <div className="fp-dots">
        <div className="fp-dots-line" aria-hidden="true">
          <i />
          <b />
          <i />
          <b />
          <i />
          <b />
          <i />
          <b />
          <i />
        </div>
        <p className="fp-dots-note">
          每个点号 · <b>一次层级推进</b>
        </p>
      </div>

      <section className="fp-preserve" aria-label="层级保留">
        <p className="fp-preserve-head">支撑注记</p>
        <div className="fp-preserve-body">
          <div className="fp-claim-row">
            <span className="fp-claim-kicker">容易忽略的细节</span>
            <p className="fp-claim fp-claim-a">
              下游节点<b>不会抹掉上级路径</b>
            </p>
            <p className="fp-claim fp-claim-b">
              而是在既有分支下<b>继续细化</b>对象范围
            </p>
          </div>

          <div className="fp-layers">
            {LAYERS.map((layer) => (
              <div className="fp-layer" key={layer.node}>
                <span className="fp-layer-node hero-num">{layer.node}</span>
                <span className="fp-layer-path">
                  <span className="fp-inh">{layer.inherited}</span>
                  <span className="fp-new">.{layer.node}</span>
                </span>
                <span className="fp-scope" aria-hidden="true">
                  <i style={{ width: layer.width }} />
                </span>
              </div>
            ))}
          </div>

          <p className="fp-contrast">
            <span className="fp-contrast-narrow">
              每往下一层 · <b>范围更窄</b>
            </span>
            <span className="fp-contrast-sep" aria-hidden="true" />
            <span className="fp-contrast-keep">
              前面那段路径 · <b>一直保留</b>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
