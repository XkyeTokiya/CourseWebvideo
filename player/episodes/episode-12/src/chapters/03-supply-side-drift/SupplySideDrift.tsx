import "./SupplySideDrift.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/* S-A010 · supply-side-accumulation
 * step → semantic state（与 outline step 表逐字一致，允许重复） */
const stateByStep = [
  "supply-stage-set",
  "private-labels-card",
  "damage-error-cards",
  "multi-code-card",
  "mixed-object-cards",
  "anchor-missing-takeaway",
] as const;

type DriftState = (typeof stateByStep)[number];

/* U006 · 私有标识：供应商 A/B/C 为结构占位（非真实厂商），
 * 三种条纹示意各家“自成一套”的编码方案 */
const SUPPLIERS = [
  { tag: "供应商 A", stripes: "sd-stripes-a" },
  { tag: "供应商 B", stripes: "sd-stripes-b" },
  { tag: "供应商 C", stripes: "sd-stripes-c" },
] as const;

export default function SupplySideDrift({ step }: ChapterStepProps) {
  const state: DriftState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene sd-scene state-${state}`}>
      <div className="scene-pad sd-pad">
        {/* headline（S010） */}
        <h1 className="sd-headline serif-cn">身份断裂从供应端积累</h1>

        <div className="sd-cards">
          {/* U006 · 私有标识卡：step1 空槽待补 → step2 成立 */}
          <article
            className="sd-attrib sd-attrib-1 card"
            aria-label="归因一：各家供应商的私有标识"
          >
            <span className="sd-slot sd-slot-1" aria-hidden="true">
              归因卡 · 待补
            </span>
            <div className="sd-supply">
              <header className="sd-attrib-head">
                <span className="sd-attrib-tag mono">归因 1</span>
                <h2 className="sd-attrib-title serif-cn">私有标识</h2>
                <p className="sd-attrib-sub">各家供应商，大多用自己的一套</p>
              </header>
              <div className="sd-schemes">
                {SUPPLIERS.map((s) => (
                  <div className="sd-scheme" key={s.tag}>
                    <span className="sd-scheme-tag mono">{s.tag}</span>
                    <i className={`sd-stripes ${s.stripes}`} aria-hidden="true" />
                    <span className="sd-scheme-note mono">自己的一套</span>
                  </div>
                ))}
              </div>
              <p className="sd-supply-note">零件还没进厂，标识就已经各是各的</p>
            </div>
          </article>

          {/* R004 · 经物流链失真（causal 递进，由卡间次序连接承载） */}
          <div className="sd-conn sd-conn-a" aria-hidden="true">
            <span className="sd-conn-label mono">经物流链失真</span>
            <span className="sd-conn-arrow">
              <i className="sd-conn-line" />
              <i className="sd-conn-head" />
            </span>
          </div>

          {/* U007 · 流转失真与采集出错：step3 补齐 */}
          <article
            className="sd-attrib sd-attrib-2 card"
            aria-label="归因二：流转失真与采集出错"
          >
            <span className="sd-slot sd-slot-2" aria-hidden="true">
              归因卡 · 待补
            </span>
            <div className="sd-damage">
              <header className="sd-attrib-head">
                <span className="sd-attrib-tag mono">归因 2</span>
                <h2 className="sd-attrib-title serif-cn">流转失真 · 采集出错</h2>
              </header>
              <p className="sd-dmg-lead sd-dmg-lead-1">
                物流链一长，标识<em>被覆盖、弄丢、损毁</em>
              </p>
              <div className="sd-dmg-row" aria-hidden="true">
                <span className="sd-dmg-tile">
                  <i className="sd-code">
                    <i className="sd-code-bars" />
                    <i className="sd-sticker" />
                  </i>
                  <b className="mono">覆盖</b>
                </span>
                <span className="sd-dmg-tile">
                  <i className="sd-code sd-code-gone" />
                  <b className="mono">弄丢</b>
                </span>
                <span className="sd-dmg-tile">
                  <i className="sd-code sd-code-hurt">
                    <i className="sd-code-bars" />
                    <i className="sd-scratch" />
                  </i>
                  <b className="mono">损毁</b>
                </span>
                <span className="sd-dmg-tail mono">读不出来</span>
              </div>
              <p className="sd-dmg-lead sd-dmg-lead-2">
                进了主机厂，来源不一的标识<em>对不齐</em>
              </p>
              <div className="sd-misalign" aria-hidden="true">
                <span className="sd-mis-row sd-mis-a">
                  <i /><i /><i /><i /><i />
                </span>
                <span className="sd-mis-row sd-mis-b">
                  <i /><i /><i /><i /><i />
                </span>
                <span className="sd-mis-mark mono">采集出错</span>
              </div>
            </div>
          </article>

          {/* R005 · 叠加恶化（convergent 并置，由卡间次序连接承载） */}
          <div className="sd-conn sd-conn-b" aria-hidden="true">
            <span className="sd-conn-label mono">叠加恶化</span>
            <span className="sd-conn-arrow">
              <i className="sd-conn-line" />
              <i className="sd-conn-head" />
            </span>
          </div>

          {/* U008 · 两类混乱并置等权：step4 一物多码 → step5 一码多物补齐 */}
          <article
            className="sd-attrib sd-attrib-3 card"
            aria-label="归因三：一物多码与一码多物"
          >
            <span className="sd-slot sd-slot-3" aria-hidden="true">
              归因卡 · 待补
            </span>
            <div className="sd-confuse">
              <header className="sd-attrib-head">
                <span className="sd-attrib-tag mono">归因 3</span>
                <h2 className="sd-attrib-title serif-cn">两类混乱</h2>
              </header>
              <section className="sd-panel sd-panel-a">
                <h3 className="sd-panel-title serif-cn">
                  <b>一物多码</b>：同一对象记录难以合并
                </h3>
                <div className="sd-fan" aria-hidden="true">
                  <span className="sd-fan-top">
                    <i className="sd-ftag mono">码 A</i>
                    <i className="sd-ftag mono">码 B</i>
                    <i className="sd-ftag mono">码 C</i>
                  </span>
                  <span className="sd-fan-stubs"><i /><i /><i /></span>
                  <i className="sd-fan-bus" />
                  <i className="sd-fan-drop" />
                  <span className="sd-fan-one serif-cn">同一件东西</span>
                </div>
              </section>
              <section className="sd-panel sd-panel-b">
                <span className="sd-subslot" aria-hidden="true">另一半 · 待补</span>
                <div className="sd-panel-b-inner">
                  <h3 className="sd-panel-title serif-cn">
                    <b>一码多物</b>：对象边界混乱
                  </h3>
                  <div className="sd-fan" aria-hidden="true">
                    <span className="sd-fan-top">
                      <i className="sd-ftag sd-ftag-solo mono">同一个码</i>
                    </span>
                    <span className="sd-fan-stubs"><i /></span>
                    <i className="sd-fan-bus" />
                    <span className="sd-fan-stubs sd-fan-stubs-down"><i /><i /><i /></span>
                    <span className="sd-fan-objs">
                      <i className="sd-fobj serif-cn">物 1</i>
                      <i className="sd-fobj serif-cn">物 2</i>
                      <i className="sd-fobj serif-cn">物 3</i>
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>

        {/* R006 · 共同指向（root-cause 收拢，由三卡汇入结论行承载） */}
        <div className="sd-funnel" aria-hidden="true">
          <i className="sd-funnel-stub sd-funnel-stub-1" />
          <i className="sd-funnel-stub sd-funnel-stub-2" />
          <i className="sd-funnel-stub sd-funnel-stub-3" />
          <span className="sd-funnel-collect">
            <i className="sd-funnel-line" />
            <b className="sd-funnel-label mono">共同指向</b>
            <i className="sd-funnel-line" />
          </span>
        </div>

        {/* U009 · takeaway：病根是缺少身份锚点（step6 收拢） */}
        <footer
          className="sd-takeaway card"
          aria-label="结论：缺少稳定、唯一、跨环节都能对上的身份锚点"
        >
          <div className="sd-take-facts">
            <span className="sd-facts-lead mono">现象</span>
            <span className="sd-fact serif-cn">串货率高</span>
            <span className="sd-fact serif-cn">质量难追溯</span>
          </div>
          <i className="sd-take-rule" aria-hidden="true" />
          <div className="sd-take-judge">
            <span className="sd-take-lead mono">病根不在企业没有系统</span>
            <p className="sd-take-hero serif-cn">
              而在缺少<em>身份锚点</em>
            </p>
            <div className="sd-take-traits">
              <span className="sd-trait mono">稳定</span>
              <span className="sd-trait mono">唯一</span>
              <span className="sd-trait mono">跨环节都能对上</span>
            </div>
          </div>
          <div className="sd-take-anchor" aria-hidden="true">
            <span className="sd-anchor-node sd-anchor-node-l serif-cn">供应</span>
            <i className="sd-anchor-link sd-anchor-link-l" />
            <span className="sd-anchor-slot">
              <span className="sd-anchor-name mono">身份锚点</span>
              <i className="sd-anchor-miss mono">缺</i>
            </span>
            <i className="sd-anchor-link sd-anchor-link-r" />
            <span className="sd-anchor-node sd-anchor-node-r serif-cn">厂内</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
