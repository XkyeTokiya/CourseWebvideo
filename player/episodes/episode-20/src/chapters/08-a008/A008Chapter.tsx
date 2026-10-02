import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 08-a008 · 三项设计检查页（outline §8 · S-A008 · parallel-cards-with-takeaway）
 * 三张等宽检查卡横向并列（equal-weight-accumulation：逐张进入后保持等权，
 * 不留「当前选中项」），卡内各带一枚小示意（碰撞/流转连线/向后延伸空间）；
 * 底部收束带最后点亮为共同结论，并以三枚连接刻度贯穿卡底示意闭环归属。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - uniqueness-carded：唯一性卡落位，中/右卡为淡色空槽（A008 · step 1）
 * - stability-equalized：稳定性卡落位，三卡转完全等权（A008 · step 2）
 * - closed-loop-framed：可扩展性卡落位，收束带点亮「三项检查，构成闭环」
 *   （A008 · step 3，R022 等距排布 / R023 卡与收束带上下关系）
 * exact 逐字项（含全角冒号）：
 * - S045「唯一性:声明范围内不同对象编码不同」
 * - S046「稳定性:基本特征不变，身份不随意变化」
 * - S047「可扩展性:未来增加类别、属性、批次仍有空间」
 * 护栏 C014：检查不呈现为自动判定、通过率或性能结论。
 */
const stateByStep = [
  "uniqueness-carded",
  "stability-equalized",
  "closed-loop-framed",
] as const;

type A008State = (typeof stateByStep)[number];

export default function A008Chapter({ step }: ChapterStepProps) {
  const state: A008State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad pc-root" data-state={state}>
      <header className="pc-head">
        <span className="pc-head-tick" aria-hidden="true" />
        <h1 className="pc-headline">三项设计检查</h1>
        <span className="pc-head-rule" aria-hidden="true" />
      </header>

      <div className="pc-cards">
        <section className="pc-card pc-card-1" aria-label="唯一性检查">
          <svg
            className="pc-demo"
            viewBox="0 0 220 110"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <circle className="pc-obj" cx="42" cy="55" r="20" />
            <circle className="pc-obj" cx="178" cy="55" r="20" />
            <path className="pc-collide" d="M 96 40 L 124 70" pathLength="1" />
            <path className="pc-collide" d="M 124 40 L 96 70" pathLength="1" />
            <path className="pc-link-a" d="M 62 55 C 78 42, 142 42, 158 55" pathLength="1" />
            <path className="pc-link-b" d="M 62 55 C 78 68, 142 68, 158 55" pathLength="1" />
          </svg>
          <p className="pc-card-line">
            <b>唯一性</b>
            <span>:声明范围内不同对象编码不同</span>
          </p>
        </section>

        <section className="pc-card pc-card-2" aria-label="稳定性检查">
          <svg
            className="pc-demo"
            viewBox="0 0 220 110"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <rect className="pc-stage-sq" x="76" y="30" width="26" height="26" />
            <rect className="pc-stage-sq" x="118" y="30" width="26" height="26" />
            <circle className="pc-obj" cx="34" cy="43" r="15" />
            <path className="pc-flow-line" d="M 52 43 L 182 43" pathLength="1" />
            <path className="pc-flow-tip" d="M 174 36 L 186 43 L 174 50" />
          </svg>
          <p className="pc-card-line">
            <b>稳定性</b>
            <span>:基本特征不变，身份不随意变化</span>
          </p>
        </section>

        <section className="pc-card pc-card-3" aria-label="可扩展性检查">
          <svg
            className="pc-demo"
            viewBox="0 0 220 110"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <rect className="pc-ext-zone" x="128" y="28" width="70" height="54" />
            <path className="pc-ext-plus" d="M 163 44 L 163 66" />
            <path className="pc-ext-plus" d="M 152 55 L 174 55" />
            <path className="pc-ext-line" d="M 24 55 L 108 55" pathLength="1" />
            <path className="pc-flow-tip" d="M 100 48 L 112 55 L 100 62" />
          </svg>
          <p className="pc-card-line">
            <b>可扩展性</b>
            <span>:未来增加类别、属性、批次仍有空间</span>
          </p>
        </section>
      </div>

      <div className="pc-link" aria-hidden="true">
        <span className="pc-link-tick" />
        <span className="pc-link-tick" />
        <span className="pc-link-tick" />
      </div>

      <div className="pc-takeaway">
        <p className="pc-takeaway-line">
          三项检查，<b>构成闭环</b>
        </p>
      </div>
    </div>
  );
}
