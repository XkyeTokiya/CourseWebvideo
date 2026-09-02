import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./EvidenceBoundary.css";

/* A009 · evidence-cards-with-provenance-boundary
   semantic states（固定证据结构按阅读顺序组装，见 outline §9）：
   step0 provenance-first-result  来源带先立案例归属 + 首张证据卡（精度提升 40%）
   step1 second-result            第二张证据卡（人力成本降低 15% 以上）
   step2 three-results-complete   第三张证据卡（满意度提升 15% 以上），三卡齐
   step3 extrapolation-limited    外推限定浮现，阅读焦点移向边界区（三卡弱化让位）
   step4 gap-and-boundary-stated  gap-row 出现，boundary-row（R021）补齐
   可见标题：none——归属由来源带承载，不可外推判断由缺口组与边界组承载 */

const stateByStep = [
  "provenance-first-result",
  "second-result",
  "three-results-complete",
  "extrapolation-limited",
  "gap-and-boundary-stated",
] as const;

type EvidenceState = (typeof stateByStep)[number];

/* 三项案例结果（visual rough 上屏内容组 2，原文不动，仅拆进排版槽位）：
   三卡共用同一证据标签「案例结果」，hero 承载数字，说明行承载指标与方向 */
const EVIDENCE_CARDS = [
  { value: "40%", suffix: "", lead: "产品质量精度", verb: "提升" },
  { value: "15%", suffix: "以上", lead: "质量追溯与质量分析人力成本", verb: "降低" },
  { value: "15%", suffix: "以上", lead: "经销商及客户质量追溯满意度", verb: "提升" },
] as const;

type EvidenceCardDef = (typeof EVIDENCE_CARDS)[number];

/* 统计缺口（上屏内容组 3）：课程资料未提供的三项，虚线空位示其缺席 */
const GAP_ITEMS = ["统计周期", "样本规模", "计算方法"] as const;

function EvidenceCard({
  card,
  variant,
}: {
  card: EvidenceCardDef;
  variant: "first" | "later";
}) {
  return (
    <article className={`eb-card card eb-card-${variant}`}>
      <span className="eb-evi-tag">案例结果</span>
      <div className="eb-card-hero">
        <span className="eb-hero-num hero-num">{card.value}</span>
        {card.suffix ? <span className="eb-hero-suffix">{card.suffix}</span> : null}
      </div>
      <p className="eb-card-metric">
        {card.lead}
        <em>{card.verb}</em>
      </p>
    </article>
  );
}

function EvidenceScene({ state }: { state: EvidenceState }) {
  const hasSecond = state !== "provenance-first-result";
  const hasThird =
    state === "three-results-complete" ||
    state === "extrapolation-limited" ||
    state === "gap-and-boundary-stated";

  return (
    <div className="eb-scene scene-pad" data-state={state}>
      {/* provenance band：案例归属固定在此，数字不脱离来源单独陈列 */}
      <section className="eb-band">
        <span className="eb-evi-tag">案例来源</span>
        <p className="eb-band-text">
          <em>课程资料所述</em>的某集团发动机质量追溯案例
        </p>
      </section>

      {/* 三张同标签证据卡：槽位固定，按口播顺序逐张就位，等权并列 */}
      <div className="eb-cards">
        <div className="eb-slot">
          <EvidenceCard card={EVIDENCE_CARDS[0]} variant="first" />
        </div>
        <div className="eb-slot">
          {hasSecond ? (
            <EvidenceCard card={EVIDENCE_CARDS[1]} variant="later" />
          ) : null}
        </div>
        <div className="eb-slot">
          {hasThird ? (
            <EvidenceCard card={EVIDENCE_CARDS[2]} variant="later" />
          ) : null}
        </div>
      </div>

      {/*
      evidence gap 组 | inference boundary 组：最后组装的两个定界组
      暂时注释，隐藏统计缺口与推断边界信息。
      <div className="eb-bottom">
        <section className="eb-zone eb-zone-gap">
          <header className="eb-zone-head">
            <span className="eb-zone-cn">统计缺口</span>
            <span className="eb-zone-en">GAP</span>
          </header>
          <div className="eb-zone-rule rule" />
          {gapStated ? (
            <div className="eb-gap-row">
              <span className="eb-gap-lead">课程资料未提供</span>
              <span className="eb-gap-chips">
                {GAP_ITEMS.map((item, i) => (
                  <span
                    key={item}
                    className="eb-gap-chip"
                    style={{ "--eb-g": String(i) } as CSSProperties}
                  >
                    {item}
                  </span>
                ))}
              </span>
            </div>
          ) : null}
        </section>

        <section className="eb-zone eb-zone-boundary">
          <header className="eb-zone-head">
            <span className="eb-zone-cn">推断边界</span>
            <span className="eb-zone-en">BOUNDARY</span>
          </header>
          <div className="eb-zone-rule rule" />
          {focusOnBoundary ? (
            <p className="eb-boundary-row eb-boundary-limit">
              这些数字<em>只说明</em>课程资料案例中的变化，
              <em>不代表</em>所有企业都会自动得到同样结果
            </p>
          ) : null}
          {gapStated ? (
            <p className="eb-boundary-row eb-boundary-final">
              这些数字<em>不是</em>行业平均值，也<em>不构成</em>
              对任何企业的结果承诺
            </p>
          ) : null}
        </section>
      </div>
      */}
    </div>
  );
}

export default function EvidenceBoundary({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <EvidenceScene state={state} />;
}
