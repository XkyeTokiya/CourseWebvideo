import type { ChapterStepProps } from "../../../src/runtime/types";
import "./WrapCheck.css";
import m003 from "./assets/m003.png";

// A007 · S-A007(单持续 base-scene,image-with-summary-rail)。
// narration step → semantic state(见 outline 视觉步组):
// summary-anchored / criteria-shown / chain-checked / judgment-settled。
const stateByStep = [
  "summary-anchored",
  "criteria-shown",
  "chain-checked",
  "judgment-settled",
] as const;

type SceneState = (typeof stateByStep)[number];

// 继续推进项:S043 guidance;下一集入口词:S045(C013 只显示词,不画机制)。
const CONTINUE_ITEMS = ["节点能力", "技术和标准", "数据流通与安全保障"] as const;
const CHAIN_NODES = ["编码设计", "数据建模", "载体选择", "节点建设与运营"] as const;
const ENTRY_WORDS = ["对象", "环节", "产业链"] as const;
const CRITERIA = ["是否进入流程？", "是否连接不同主体？", "能否持续运行？"] as const;

function WrapCheckScene({ state }: { state: SceneState }) {
  return (
    <div className="scene wc" data-state={state}>
      <div className="scene-pad wc-pad">
        <header className="wc-head">
          <h1 className="wc-headline">建设不停，应用加深</h1>
          <hr className="rule" />
        </header>

        <div className="wc-main">
          <figure className="wc-media">
            <div className="wc-photo">
              <img
                className="wc-photo-image"
                src={m003}
                alt="回扣开篇工业现场的生产与质检协作"
              />
              <p className="wc-photo-plate">回扣开篇工业现场</p>
            </div>
          </figure>

          <div className="wc-rail">
            <section className="wc-summary">
              <p className="wc-judgment">
                <span>从建设走向应用</span>
                <span className="wc-neq">≠</span>
                <span>建设任务结束</span>
              </p>
              <ul className="wc-continue">
                {CONTINUE_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="wc-shift">评价重心：建起来 <span className="wc-shift-arrow">→</span> 用起来</p>
            </section>

            <section className="wc-check card">
              <p className="wc-check-cap">完整应用链检验</p>
              <ul className="wc-criteria">
                {CRITERIA.map((c) => (
                  <li className="wc-criterion" key={c}>
                    <span className="wc-ring" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="wc-chain">
                {CHAIN_NODES.map((node, i) => (
                  <span className="wc-node" key={node}>
                    {node}
                    {i < CHAIN_NODES.length - 1 ? (
                      <span className="wc-node-arrow" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </span>
                ))}
                <span className="wc-verdict">能否支撑真实业务贯通</span>
              </div>
            </section>

            <section className="wc-entry">
              <span className="wc-entry-cap">下一集入口</span>
              <ul className="wc-entry-list">
                {ENTRY_WORDS.map((word) => (
                  <li className="wc-entry-word" key={word}>
                    {word}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WrapCheck({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <WrapCheckScene state={state} />;
}
