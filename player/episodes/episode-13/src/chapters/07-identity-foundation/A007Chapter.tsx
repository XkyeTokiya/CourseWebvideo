import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "foundation-stated",
  "nodes-and-basics-built",
  "roles-explained",
  "accurate-matching",
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad if-root" data-state={state}>
      <header className="if-head">
        <h1 className="if-headline">统一标识与数据规范作为共同基础</h1>
        <p className="if-foundation">
          <span className="if-foundation-mark" aria-hidden="true" />
          这套方案以<em className="if-foundation-em">工业互联网标识解析体系</em>为基础
        </p>
      </header>

      <section className="if-condition" aria-label="对接的节点">
        <div className="if-node if-node-1">
          <span className="if-node-name">国家顶级节点</span>
        </div>
        <span className="if-node-sep if-node-sep-1" aria-hidden="true">、</span>
        <div className="if-node if-node-2">
          <span className="if-node-name">二级节点</span>
        </div>
        <span className="if-node-sep if-node-sep-2" aria-hidden="true">、</span>
        <div className="if-node if-node-3">
          <span className="if-node-name">企业节点</span>
        </div>
        <span className="if-ghost if-ghost-1" aria-hidden="true" />
        <span className="if-ghost if-ghost-2" aria-hidden="true" />
        <span className="if-ghost if-ghost-3" aria-hidden="true" />
      </section>

      <div className="if-pillars" aria-hidden="true">
        <span className="if-pillar if-pillar-1" />
        <span className="if-pillar if-pillar-2" />
        <span className="if-pillar if-pillar-3" />
      </div>

      <section className="if-key" aria-label="两项基础">
        <div className="if-key-head">
          <h2 className="if-base-title if-title-1">统一标识体系</h2>
          <span className="if-base-sep" aria-hidden="true">和</span>
          <h2 className="if-base-title if-title-2">数据规范</h2>
        </div>
        <div className="if-key-roles">
          <div className="if-base if-base-1">
            <p className="if-role-text">给跨系统、跨平台的数据确定共同身份</p>
            <div className="if-stamp-row" aria-hidden="true">
              <span className="if-data-chip">
                跨系统数据
                <span className="if-stamp if-stamp-1">共同身份</span>
              </span>
              <span className="if-data-chip">
                跨平台数据
                <span className="if-stamp if-stamp-2">共同身份</span>
              </span>
            </div>
          </div>
          <span className="if-key-spacer" aria-hidden="true" />
          <div className="if-base if-base-2">
            <p className="if-role-text">约定数据怎样描述、怎样交换</p>
            <span className="if-role-underline" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="if-goal" aria-label="目标">
        <div className="if-goal-body">
          <p className="if-goal-text">
            有了这两项基础，不同系统里的数据才有可能<em className="if-goal-em">准确对应</em>
          </p>
          <div className="if-match" aria-hidden="true">
            <span className="if-match-chip if-match-l">系统 A 的数据</span>
            <span className="if-match-node" aria-hidden="true" />
            <span className="if-match-chip if-match-r">系统 B 的数据</span>
          </div>
        </div>
      </section>
    </div>
  );
}
