import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m003Image from "./assets/M003.png";

const stateByStep = [
  "risk-question-raised",
  "risks-mapped-with-judgment",
  "length-myth",
  "novelty-myth",
  "short-sight-myth",
  "myths-concluded",
  "five-questions-lit",
  "checklist-formed",
] as const;

const RISKS = [
  { name: "唯一性", risk: "防止对象混淆" },
  { name: "兼容性", risk: "降低迁移和协同的阻力" },
  { name: "实用性", risk: "保证现场真的能用" },
  { name: "扩展性", risk: "应对未来的变化" },
  { name: "科学性", risk: "让结构和校验有据可依" },
] as const;

const MYTHS = [
  { myth: "编号够长就一定唯一", fix: "长度和唯一性没有必然关系" },
  { myth: "结构越新越先进", fix: "全新的编码往往最难兼容旧记录" },
  { myth: "完全贴合今天的流程就够了", fix: "今天够用的短码，可能没有为将来出现的对象和业务留下容量" },
] as const;

const QUESTIONS = [
  "在适用范围内，是不是只指向这一件零部件？",
  "能不能跟已有的标识和相关标准协调？",
  "行业人员和现有系统用不用得起来？",
  "需求变化之后，还有没有合理的扩展空间？",
  "结构是否简洁规范，需要的时候能不能校验？",
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad jc-root" data-state={state}>
      <header className="jc-header">
        <h1 className="jc-headline">五项原则要一起检查</h1>
      </header>

      <div className="jc-main">
        <div className="jc-content">
          <section className="jc-band jc-band-a">
            <p className="jc-band-title">
              为什么要放在一起看？——因为它们应对的是不同的风险
            </p>
            <div className="jc-a-full">
              {RISKS.map((item) => (
                <p className="jc-risk-row" key={item.name}>
                  <span className="jc-risk-name">{item.name}</span>
                  <span className="jc-risk-arrow" aria-hidden="true">
                    →
                  </span>
                  {item.risk}
                </p>
              ))}
              <p className="jc-a-judgment">只满足其中一项，替代不了其余四项</p>
            </div>
            <div className="jc-a-compact">
              {RISKS.map((item) => (
                <span className="jc-compact-chip" key={item.name}>
                  {item.name}
                </span>
              ))}
              <span className="jc-compact-note">不可互相替代</span>
            </div>
          </section>

          <section className="jc-band jc-band-b">
            <p className="jc-band-title">这就带来三个常见的误解</p>
            <div className="jc-b-full">
              {MYTHS.map((item) => (
                <p className="jc-myth-row" key={item.myth}>
                  <span className="jc-chip jc-chip-myth">误</span>
                  {item.myth}
                  <span className="jc-myth-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="jc-chip jc-chip-fix">正</span>
                  {item.fix}
                </p>
              ))}
              <p className="jc-b-conclusion">长度、结构复杂度、新旧程度，都代替不了设计判断</p>
            </div>
            <div className="jc-b-compact">
              <span className="jc-compact-chip">三个常见误解</span>
              <span className="jc-compact-note">都代替不了设计判断</span>
            </div>
          </section>

          <section className="jc-band jc-band-c">
            <p className="jc-band-title">更实际的做法——沿着一件对象连续追问</p>
            <div className="jc-questions">
              {QUESTIONS.map((text, index) => (
                <p className="jc-question" key={text}>
                  <span className="jc-q-no">{`Q${index + 1}`}</span>
                  {text}
                </p>
              ))}
            </div>
            <p className="jc-closing">这五个问题连起来，就是一张可以反复使用的检查表</p>
          </section>
        </div>

        <figure className="jc-media">
          <img className="jc-media-img" src={m003Image} alt="评审现场情境占位图" />
          <figcaption className="jc-media-caption">
            评审现场 · M003 · 占位图，正式素材待替换
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
