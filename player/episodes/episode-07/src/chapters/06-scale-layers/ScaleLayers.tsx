import type { ChapterStepProps } from "../../../src/runtime/types";
import "./ScaleLayers.css";

// A006 · S-A006(单持续 base-scene,image-with-insight-rail)。
// narration step → semantic state(见 outline 视觉步组):
// media-anchored / flow-layered / chain-linked / value-and-support。
const stateByStep = [
  "media-anchored",
  "flow-layered",
  "chain-linked",
  "value-and-support",
] as const;

type SceneState = (typeof stateByStep)[number];

// 三层洞察短条:标题为 S037–S039 guidance 的箭头对;
// 明细行来自对应 beat 原句词组;第三层方向词用台账 S039 术语。
const FLOW_STEPS = ["生产", "加工", "运输", "检测", "服务", "回收"] as const;
const VALUE_DIRS =
  "消费品质量追溯 · 数字医疗 · 绿色低碳 · 安全管理 · 城市数字化 · 产业集群";
const SUPPORT_ITEMS = ["基础设施", "技术产品", "数据流通", "安全保障"] as const;

// M002 占位示意:生产与物流协同现场(无品牌、无编码、无软件界面)。
function SiteSketch() {
  return (
    <svg
      className="sl-sketch"
      viewBox="0 0 640 360"
      role="img"
      aria-label="生产与物流协同现场示意"
    >
      {/* 车间地面线 */}
      <line x1="40" y1="300" x2="600" y2="300" stroke="var(--theme-structural)" strokeWidth="4" />
      {/* 两个工作站 */}
      <rect x="86" y="196" width="150" height="104" rx="8" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
      <rect x="404" y="196" width="150" height="104" rx="8" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
      <rect x="106" y="216" width="52" height="40" rx="4" fill="var(--theme-process-surface)" stroke="var(--theme-process)" strokeWidth="2.5" />
      <rect x="484" y="216" width="52" height="40" rx="4" fill="var(--theme-process-surface)" stroke="var(--theme-process)" strokeWidth="2.5" />
      {/* 输送辊道与流转的箱体 */}
      <line x1="60" y1="252" x2="580" y2="252" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="150" cy="252" r="8" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <circle cx="320" cy="252" r="8" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <circle cx="470" cy="252" r="8" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <rect x="236" y="216" width="52" height="36" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3" />
      <line x1="236" y1="228" x2="288" y2="228" stroke="var(--theme-dashed-line)" strokeWidth="2" />
      {/* 站点间协同(同一标识衔接) */}
      <path d="M170 150 Q320 96 470 150" fill="none" stroke="var(--theme-process)" strokeWidth="3" strokeDasharray="10 8" />
      <polygon points="470,150 448,138 452,158" fill="var(--theme-process)" />
      <circle cx="320" cy="118" r="12" fill="var(--theme-process)" opacity="0.25" />
    </svg>
  );
}

// 第二层明细:关键企业带动上下游,围绕同一标识衔接(S038 + beat 3)。
function ChainSketch() {
  return (
    <svg
      className="sl-chain"
      viewBox="0 0 300 96"
      role="img"
      aria-label="关键企业带动上下游协同示意"
    >
      <line x1="34" y1="48" x2="112" y2="48" stroke="var(--theme-structural)" strokeWidth="3" />
      <line x1="188" y1="48" x2="266" y2="48" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="30" cy="48" r="15" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="150" cy="48" r="21" fill="var(--theme-process-surface)" stroke="var(--theme-process)" strokeWidth="4" />
      <circle cx="150" cy="48" r="7" fill="var(--theme-process)" />
      <circle cx="270" cy="48" r="15" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <line x1="150" y1="20" x2="150" y2="8" stroke="var(--theme-dashed-line)" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="150" y1="76" x2="150" y2="88" stroke="var(--theme-dashed-line)" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="150" cy="6" r="4" fill="var(--theme-dashed-line)" />
      <circle cx="150" cy="90" r="4" fill="var(--theme-dashed-line)" />
    </svg>
  );
}

function ScaleLayersScene({ state }: { state: SceneState }) {
  return (
    <div className="scene sl" data-state={state}>
      <div className="scene-pad sl-pad">
        <header className="sl-head">
          <h1 className="sl-headline">规模应用的三层变化</h1>
          <hr className="rule" />
        </header>

        <div className="sl-main">
          <figure className="sl-media">
            <div className="sl-photo">
              <SiteSketch />
              <p className="sl-photo-plate">M002 · 生产与物流协同现场 · 待提供</p>
            </div>
          </figure>

          <div className="sl-rail">
            <div className="sl-item sl-r1">
              <div className="sl-ghost" aria-hidden>
                <span>01</span>
              </div>
              <div className="sl-body card">
                <p className="sl-title">
                  <span className="sl-no">01</span>
                  服务可用 <span className="sl-arrow">→</span> 业务贯通
                </p>
                <div className="sl-detail">
                  <div className="sl-detail-in">
                    <p className="sl-detail-text">
                      标识进入实际环节，同一个身份沿流程持续发挥作用
                    </p>
                    <p className="sl-flow">
                      {FLOW_STEPS.map((step, i) => (
                        <span key={step}>
                          {step}
                          {i < FLOW_STEPS.length - 1 ? (
                            <span className="sl-flow-arrow"> → </span>
                          ) : null}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sl-item sl-r2">
              <div className="sl-ghost" aria-hidden>
                <span>02</span>
              </div>
              <div className="sl-body card">
                <p className="sl-title">
                  <span className="sl-no">02</span>
                  企业接入 <span className="sl-arrow">→</span> 产业链协同
                </p>
                <div className="sl-detail">
                  <div className="sl-detail-in">
                    <p className="sl-detail-text">
                      关键企业带动上下游接入，围绕同一个标识衔接
                    </p>
                    <ChainSketch />
                  </div>
                </div>
              </div>
            </div>

            <div className="sl-item sl-r3">
              <div className="sl-ghost" aria-hidden>
                <span>03</span>
              </div>
              <div className="sl-body card">
                <p className="sl-title">
                  <span className="sl-no">03</span>
                  调用规模 <span className="sl-arrow">→</span> 应用价值
                </p>
                <div className="sl-detail">
                  <div className="sl-detail-in">
                    <p className="sl-detail-text sl-dirs">{VALUE_DIRS}</p>
                    <p className="sl-dirs-note">计划关注方向，持续产生应用价值</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sl-support">
              <span className="sl-support-cap">支撑同步增强</span>
              <ul className="sl-support-list">
                {SUPPORT_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScaleLayers({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <ScaleLayersScene state={state} />;
}
