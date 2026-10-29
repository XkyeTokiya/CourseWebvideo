import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006Chapter.css";

/**
 * 06-industrial-features · 工业特征（outline §6 · S-A006 · parallel-cards-with-takeaway）
 * mechanism: equal-weight-accumulation — 四张特征卡在固定两行内依次落位并
 * 保持并列，每卡带解释行；底部结论条最后出现，由四卡共同支撑。R007（四
 * 特征解释处理方式差异）由特征卡两两并列与底部结论条的上下关系承载。
 *
 * step → semantic state：four-cards-explained → statistics-ruled-out。
 *
 * exact 义务：S034–S037 四条整句逐字渲染在四卡（卡名 + 解释行连续排布）。
 * 护栏 C008：特征不等于实时平台保证、零错误或自动闭环，不出现通过率或
 * 告警率——闭环卡用"回到…发挥作用"的回环示意，不画自动完成。
 */
const stateByStep = ["four-cards-explained", "statistics-ruled-out"] as const;

const FEATURES = [
  {
    no: "01",
    word: "时序性",
    lead: "记录有发生的",
    em: "先后顺序",
    glyph: "sequence",
  },
  {
    no: "02",
    word: "强关联性",
    lead: "设备、工艺、物料和结果之间",
    em: "彼此关联",
    glyph: "linked",
  },
  {
    no: "03",
    word: "准确性",
    lead: "采集到的记录",
    em: "尽量可靠",
    glyph: "reliable",
  },
  {
    no: "04",
    word: "闭环性",
    lead: "分析结果回到产品、经营或生产运作里",
    em: "继续发挥作用",
    glyph: "loop",
  },
] as const;

function FeatureGlyph({ kind }: { kind: "sequence" | "linked" | "reliable" | "loop" }) {
  if (kind === "sequence") {
    return (
      <svg viewBox="0 0 64 36" className="it-glyph" aria-hidden="true">
        <circle cx="7" cy="18" r="4.5" className="it-g-dot" />
        <path d="M13 18 H27" className="it-g-line" />
        <circle cx="34" cy="18" r="4.5" className="it-g-dot" />
        <path d="M40 18 H52" className="it-g-line" />
        <path d="M54 11 L62 18 L54 25" className="it-g-line" />
      </svg>
    );
  }
  if (kind === "linked") {
    return (
      <svg viewBox="0 0 64 36" className="it-glyph" aria-hidden="true">
        <circle cx="9" cy="18" r="5.5" className="it-g-dot" />
        <circle cx="32" cy="8" r="5.5" className="it-g-dot" />
        <circle cx="55" cy="18" r="5.5" className="it-g-dot" />
        <circle cx="32" cy="28" r="5.5" className="it-g-dot" />
        <path d="M14 16 L27 10 M37 10 L50 16 M50 20 L38 26 M27 26 L14 20 M15 18 L49 18" className="it-g-line" />
      </svg>
    );
  }
  if (kind === "reliable") {
    return (
      <svg viewBox="0 0 64 36" className="it-glyph" aria-hidden="true">
        <rect x="5" y="8" width="44" height="20" rx="6" className="it-g-line" />
        <path d="M30 26 V32 H49 V26" className="it-g-line" />
        <path d="M49 22 L55 15" className="it-g-line" />
        <path d="M53 26 L58 18" className="it-g-line" />
        <path d="M14 18 H18 M23 18 H27 M32 18 H36" className="it-g-line" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 36" className="it-glyph" aria-hidden="true">
      <path d="M50 6 A16 12 0 1 1 14 6" className="it-g-line" />
      <path d="M14 6 A16 12 0 1 1 50 6" className="it-g-line it-g-line--dim" />
      <path d="M46 3 L52 7 L45 11" className="it-g-line" />
      <rect x="26" y="12" width="12" height="10" rx="2" className="it-g-dot" />
    </svg>
  );
}

/* 对比示意：上层"大量记录" → 下层拣出"有价值的线索"…（见 A005）
   这里用回环箭头示意"分析结果回到现场"。 */

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const takeawayOn = step >= 1;

  const rootCls = ["it-scene", "scene-pad", takeawayOn && "is-takeaway"].filter(Boolean).join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="it-head">
        <h1 className="it-headline">
          工业数据强调的<em>四个特征</em>
        </h1>
        <div className="it-head-rule rule" />
      </header>

      {/* 四张特征卡：固定两行两列，依次落位保持并列 */}
      <div className="it-cards">
        {FEATURES.map((f, i) => (
          <section
            key={f.word}
            className={`it-card card${i >= 2 ? " it-card--row2" : ""}`}
            style={{ "--it-i": i } as CSSProperties}
          >
            <p className="it-card-no hero-num">{f.no}</p>
            <div className="it-card-time">
              <div className="it-card-head">
                <p className="it-card-word">{f.word}</p>
                <FeatureGlyph kind={f.glyph} />
              </div>
              <p className="it-card-line">
                {f.lead}
                <em>{f.em}</em>
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* 底部结论条：不能套用一次性统计（R007 收束） */}
      <div className="it-takeaway" aria-hidden={!takeawayOn}>
        <p className="it-takeaway-ghost">结论 · 待收束</p>
        <div className="it-takeaway-plate card-glass">
          <span className="it-takeaway-kicker">正因为这样</span>
          <p className="it-takeaway-hero">
            工业数据不能套用
            <span className="it-ruled-out">一次性统计</span>
            的处理方式
          </p>
        </div>
      </div>
    </div>
  );
}
