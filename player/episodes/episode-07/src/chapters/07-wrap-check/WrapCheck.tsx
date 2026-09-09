import type { ChapterStepProps } from "../../../src/runtime/types";
import "./WrapCheck.css";

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

// M003 占位示意:回扣 A001 开篇的产线扫码现场(同场景,静态驻留)。
function SiteEcho() {
  return (
    <svg
      className="wc-sketch"
      viewBox="0 0 640 360"
      role="img"
      aria-label="回扣开篇的产线扫码现场示意"
    >
      <line x1="52" y1="286" x2="588" y2="286" stroke="var(--theme-structural)" strokeWidth="4" />
      <line x1="118" y1="286" x2="118" y2="322" stroke="var(--theme-structural)" strokeWidth="4" />
      <line x1="522" y1="286" x2="522" y2="322" stroke="var(--theme-structural)" strokeWidth="4" />
      <circle cx="170" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="300" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="430" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <rect x="236" y="234" width="150" height="52" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
      <line x1="236" y1="252" x2="386" y2="252" stroke="var(--theme-dashed-line)" strokeWidth="2" strokeDasharray="7 6" />
      <g transform="rotate(-14 462 152)">
        <rect x="430" y="104" width="64" height="98" rx="10" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
        <rect x="440" y="116" width="44" height="52" rx="4" fill="var(--theme-process-surface)" stroke="var(--theme-structural)" strokeWidth="2.5" />
      </g>
      <polygon points="446,206 466,206 382,234 322,234" fill="var(--theme-process)" opacity="0.14" />
      <line
        x1="452"
        y1="206"
        x2="352"
        y2="232"
        stroke="var(--theme-process)"
        strokeWidth="2.5"
        strokeDasharray="8 7"
      />
    </svg>
  );
}

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
              <SiteEcho />
              <p className="wc-photo-plate">M003 · 回扣开篇工业现场 · 待提供</p>
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
