import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 10-a010 · 六步与落地判定页（outline §10 · S-A010 · split-compare-with-pivot）
 * 左侧六步流程轨按真实先后点亮（ordered 轨内连线），中缝判据竖标第二拍升起
 * 并保持到终态（两侧栏暂时压暗让位，第三拍左轨恢复），右侧两张反例卡第三拍
 * 等权并列；第四拍为低成本全屏强调（终判只在 accent 呈现）。
 * step → semantic state / accent 显式映射（0 基，末态兜底）：
 * - six-steps-lined：六步轨自上而下顺序点亮并串线（A010 · step 1，
 *   R027/R028 由步骤推进顺序与末步终点承载）
 * - criterion-raised：中缝判据竖标升起「可落地 ⟂ 看起来完整」，
 *   两侧压暗（A010 · step 2，R030 由判据标签承载）
 * - counterexamples-lined：左轨恢复，右栏两反例卡先后落位等权并列
 *   （A010 · step 3，R029 由并列排布承载）
 * - K-A010-01 · accent：低成本全屏强调，不重复 base-scene 结论
 *   （A010 · step 4）
 * 护栏 C017：流程不添加接口、标准编号或注册环节；
 * 护栏 C018：不把规则草案说成已注册或已通过核验（反例卡为否定式边界）。
 */
const stateByStep = [
  "six-steps-lined",
  "criterion-raised",
  "counterexamples-lined",
] as const;

type A010State = (typeof stateByStep)[number];

const ACCENT_STEP = 3;

/** 六步流程（S056/S057/S058；不添加接口/标准编号/注册环节） */
const STEPS = [
  "界定对象",
  "确认前缀来源",
  "组织后缀字段",
  "写清类型和分隔",
  "唯一、稳定、可扩展三项检查",
  "按适用规范复核",
] as const;

function A010StatementFrame() {
  return (
    <div className="scene-pad sx-statement">
      <span className="sx-statement-rule" aria-hidden="true" />
      <p className="sx-statement-kicker">一套规则要站得住</p>
      <h1 className="sx-statement-line">
        <em>对象责任、授权来源、字段语义、规范边界</em>，这四样必须对得上。
      </h1>
    </div>
  );
}

function A010Scene({ state }: { state: A010State }) {
  return (
    <div className="scene-pad sx-root" data-state={state}>
      <header className="sx-head">
        <span className="sx-head-tick" aria-hidden="true" />
        <h1 className="sx-headline">六步设计流程</h1>
        <span className="sx-head-rule" aria-hidden="true" />
      </header>

      <div className="sx-main">
        <div className="sx-steps">
          {STEPS.map((label, index) => (
            <div
              key={label}
              className={`sx-step sx-step-${index + 1}`}
            >
              <span className="sx-step-no">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="sx-step-text">{label}</span>
            </div>
          ))}
        </div>

        <div className="sx-pivot-col" aria-hidden="true">
          <span className="sx-pivot">
            可落地 <i className="sx-pivot-mark">⟂</i> 看起来完整
          </span>
        </div>

        <div className="sx-counter">
          <section className="sx-case sx-case-1" aria-label="反例一">
            <p className="sx-case-title">
              模板填码 <b>≠</b> 注册
            </p>
            <p className="sx-case-sub">
              国家码、行业码、企业码随手填进一个模板，代替不了注册
            </p>
          </section>
          <section className="sx-case sx-case-2" aria-label="反例二">
            <p className="sx-case-title">
              字段堆塞 <b>≠</b> 唯一性
            </p>
            <p className="sx-case-sub">
              属性、日期、随机字符全都塞进后缀，也不会自动换来唯一性
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function A010Chapter({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) {
    return <A010StatementFrame />;
  }
  const state: A010State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <A010Scene state={state} />;
}
