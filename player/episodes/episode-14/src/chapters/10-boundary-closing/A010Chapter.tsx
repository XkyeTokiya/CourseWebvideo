import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m004Image from "./assets/M004.png";

const stateByStep = [
  "boundary-lines-set",
  "separation-matters",
  "framework-formed",
  "object-recap",
  "five-gates-lit",
  "identity-constant",
  "balanced-judgment",
  "comparison-basis",
] as const;

const BOUNDARIES = [
  "不等于某一种具体编码体系的结构",
  "不等于承载编码的标签载体",
  "不等于解析环节的设备与系统",
] as const;

const JOURNEY = ["工厂", "仓储", "装配", "维修"] as const;

const GATES = [
  { name: "唯一性", gate: "让它不被认错" },
  { name: "兼容性", gate: "让新旧记录接得上" },
  { name: "实用性", gate: "让现场用得起来" },
  { name: "扩展性", gate: "让以后的变化有地方安放" },
  { name: "科学性", gate: "让结构和校验站得住" },
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad bc-root" data-state={state}>
      <header className="bc-header">
        <span className="bc-recap-tag">本期总结</span>
        <h1 className="bc-headline">回到那件零部件</h1>
      </header>

      <div className="bc-main">
        <div className="bc-content">
          <section className="bc-zone bc-boundary">
            <p className="bc-zone-title">
              <span className="bc-zone-lead">还要分清一件事——我们讲的是编码设计原则：</span>
            </p>
            {BOUNDARIES.map((text) => (
              <p className="bc-boundary-row" key={text}>
                <span className="bc-neq" aria-hidden="true">
                  ≠
                </span>
                {text}
              </p>
            ))}
            <p className="bc-separation">原则和实现分开看，比较不同方案时才不会被表面的结构差异带偏</p>
          </section>

          <section className="bc-zone bc-summary">
            <p className="bc-zone-title">五项放到一起，是一整套判断的依据——管的是换环节、换年份还能不能用</p>
            <div className="bc-gates">
              {GATES.map((item) => (
                <p className="bc-gate" key={item.name}>
                  <span className="bc-gate-name">{item.name}</span>
                  <span className="bc-gate-text">{item.gate}</span>
                </p>
              ))}
            </div>
          </section>

          <section className="bc-zone bc-final">
            <p className="bc-final-line">同一个对象的身份，在不同环节、不同系统、不同企业之间始终认得出来</p>
            <p className="bc-final-line">不是越长越安全，也不是越新越先进——而是取得可以解释的平衡</p>
            <p className="bc-final-line">
              把对象身份稳定地带进生产、流通和服务环节，不同的编码方案之间才有比较和改进的依据
            </p>
          </section>
        </div>

        <figure className="bc-media">
          <img className="bc-media-img" src={m004Image} alt="对象身份收束场景占位图" />
          <figcaption className="bc-media-caption">
            收束场景 · M004 · 占位图，正式素材待替换
          </figcaption>
          <div className="bc-journey" aria-hidden="true">
            {JOURNEY.map((stop) => (
              <span className="bc-stop" key={stop}>
                {stop}
              </span>
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}
