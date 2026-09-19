import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "minimum-bar-named",
  "failure-cases-shown",
  "judgment-dimensions",
  "five-principles-named",
] as const;

const FAILURES = ["跟旧系统完全不兼容", "现场人员看不懂、系统接不上"] as const;

const DIMENSIONS = [
  { no: "1", text: "面对已有的体系" },
  { no: "2", text: "适应真实的使用条件" },
  { no: "3", text: "为未来的变化留出什么" },
] as const;

const PRINCIPLES = ["唯一性", "兼容性", "实用性", "扩展性", "科学性"] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad bd-root" data-state={state}>
      <header className="bd-header">
        <span className="bd-heading-mark" aria-hidden="true" />
        <h1 className="bd-headline">能区分对象只是起点</h1>
      </header>

      <div className="bd-main">
        <section className="bd-card bd-card-condition">
          <span className="bd-tab">起点</span>
          <p className="bd-card-claim">
            能区分对象<small>只是最低要求</small>
          </p>
          <div className="bd-failures">
            {FAILURES.map((text) => (
              <p className="bd-failure" key={text}>
                {text}
              </p>
            ))}
            <p className="bd-verdict">仍然不是好设计</p>
          </div>
        </section>

        <span className="bd-chevron" aria-hidden="true">
          →
        </span>

        <section className="bd-card bd-card-judgment">
          <span className="bd-tab">判断</span>
          <p className="bd-card-kicker">值不值得长期用，还要看</p>
          <div className="bd-dimensions">
            {DIMENSIONS.map((item) => (
              <p className="bd-dimension" key={item.no}>
                <span className="bd-dimension-no">{item.no}</span>
                {item.text}
              </p>
            ))}
          </div>
        </section>

        <span className="bd-chevron" aria-hidden="true">
          →
        </span>

        <section className="bd-card bd-card-goal">
          <span className="bd-tab">原则</span>
          <p className="bd-card-kicker">常用的判断方式</p>
          <p className="bd-goal-title">五项原则</p>
          <p className="bd-principle-chain">
            {PRINCIPLES.map((name, index) => (
              <span key={name}>
                <span className="bd-principle">{name}</span>
                {index < PRINCIPLES.length - 1 ? (
                  <span className="bd-chain-sep">{index === PRINCIPLES.length - 2 ? "和" : "、"}</span>
                ) : null}
              </span>
            ))}
          </p>
        </section>
      </div>
    </div>
  );
}
