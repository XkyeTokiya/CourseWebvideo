import "./A010Chapter.css";
import m004Src from "./assets/M004.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 10-three-step-method · 读法语境页（outline §10 · S-A010 ·
 * image-with-insight-rail，steps-with-boundary-rail）
 * 持续读法场景：三步读法主条在上按阅读顺序逐段点亮后等权保留，误读
 * 排除栏并列承载"别怎么读"，应用语境栏与身份需求收束行纳入同一主
 * 区域，工业语境图（M004）持续在侧。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - three-steps-framed：三步主条按序点亮（step 1）
 * - misreads-flagged：排除栏并列落位（step 2，R020 由三步主条与排除
 *   栏的并列承载）
 * - context-located：语境栏落位，语境图持续（step 3）
 * - identity-needed：收束行呈现身份需求（step 4，R021 由语境栏向身份
 *   需求的承接承载）
 * 护栏：三步读法不是解析操作步骤，不从数字外观推断字段规则；
 * 语境是教材列举，不声称覆盖全部行业。
 */
const stateByStep = [
  "three-steps-framed",
  "misreads-flagged",
  "context-located",
  "identity-needed",
] as const;

type A010State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A010State, number> = {
  "three-steps-framed": 0,
  "misreads-flagged": 1,
  "context-located": 2,
  "identity-needed": 3,
};

/** 三步读法（G032；不是解析操作步骤） */
const STEPS = [
  "先看 V，确认数据结构",
  "再看 NSI，确认体系语境",
  "然后把 MD 当作标准化主码",
] as const;

/** 误读排除（G033） */
const MISREADS = [
  "别把版本当成批次",
  "别把体系标识当成企业名称",
  "别凭主码的数字外观去猜字段",
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state: A010State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  const misreadsOn = at >= 1;
  const contextOn = at >= 2;
  const neededOn = at >= 3;

  return (
    <div className="xk-root" data-state={state}>
      <header className="xk-head">
        <h1 className="xk-headline">三步读法，与应用语境</h1>
        <span className="xk-head-rule" aria-hidden="true" />
      </header>

      <div className="xk-body">
        <div className="xk-main">
          <ol className="xk-steps">
            {STEPS.map((label, index) => (
              <li
                key={label}
                className="xk-step"
                style={{ "--xk-i": index } as React.CSSProperties}
              >
                <span className="xk-no">{index + 1}</span>
                <span className="xk-step-text">{label}</span>
              </li>
            ))}
          </ol>

          <ul className={`xk-misreads${misreadsOn ? " is-on" : ""}`}>
            <li className="xk-misreads-title">别这么读——</li>
            {MISREADS.map((row, index) => (
              <li
                key={row}
                className="xk-misread"
                style={{ "--xk-j": index } as React.CSSProperties}
              >
                <i>x</i>
                {row}
              </li>
            ))}
          </ul>

          <section className={`xk-context${contextOn ? " is-on" : ""}`}>
            <p className="xk-context-kicker">用武之地，主要在——</p>
            <p className="xk-context-text">
              <b>物联网领域</b>：物流、仓储、生产制造…（教材列举，不止于此）
            </p>
          </section>

          <div className={`xk-needed${neededOn ? " is-on" : ""}`}>
            <p className="xk-needed-text">
              这些环节里的物品被<b>好多套系统记录</b>——正需要能
              <i>串起三段职责</i>的身份
            </p>
          </div>
        </div>

        <figure className="xk-image">
          <img src={m004Src} alt="物流、仓储、生产制造的匿名工业语境场景" />
          <figcaption className="xk-image-note">
            素材占位 · 真实语境图待提供
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
