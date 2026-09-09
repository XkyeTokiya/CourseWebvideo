import type { ChapterStepProps } from "../../../src/runtime/types";
import "./SiteQuestion.css";

// A001 · S-A001(单持续 base-scene)。
// narration step → semantic state(允许重复;此处四拍各落一态,见 outline 视觉步组)。
const stateByStep = [
  "scene-established",
  "questions-raised",
  "judgment-formed",
  "focus-shifted",
] as const;

type SceneState = (typeof stateByStep)[number];

// 追问卡内容:S003 guidance + A001 beat 2 的两问,原序不改写。
const QUESTIONS = [
  { tag: "质检 · 物流跟踪 · 售后", text: "有没有用上这个标识？" },
  { tag: "产业链上下游", text: "能不能围绕同一个身份协作？" },
] as const;

// 两阶段定位:A001 beat 4 原句词组;仅在 focus-shifted 揭示。
const PHASES = [
  { name: "建设阶段", items: "有没有 · 通不通 · 能不能提供服务", app: false },
  { name: "应用阶段", items: "谁在用 · 用在哪个环节 · 能不能形成持续价值", app: true },
] as const;

function ScanScene() {
  return (
    <svg
      className="sq-photo-svg"
      viewBox="0 0 640 360"
      role="img"
      aria-label="产线扫码情境示意图"
    >
      {/* 输送线 */}
      <line x1="52" y1="286" x2="588" y2="286" stroke="var(--theme-structural)" strokeWidth="4" />
      <line x1="118" y1="286" x2="118" y2="322" stroke="var(--theme-structural)" strokeWidth="4" />
      <line x1="522" y1="286" x2="522" y2="322" stroke="var(--theme-structural)" strokeWidth="4" />
      <circle cx="170" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="300" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <circle cx="430" cy="286" r="9" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      {/* 零件 */}
      <rect x="236" y="234" width="150" height="52" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
      <line x1="236" y1="252" x2="386" y2="252" stroke="var(--theme-dashed-line)" strokeWidth="2" strokeDasharray="7 6" />
      {/* 手持终端 */}
      <g transform="rotate(-14 462 152)">
        <rect x="430" y="104" width="64" height="98" rx="10" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3.5" />
        <rect x="440" y="116" width="44" height="52" rx="4" fill="var(--theme-process-surface)" stroke="var(--theme-structural)" strokeWidth="2.5" />
      </g>
      {/* 识读光束 */}
      <polygon points="446,206 466,206 382,234 322,234" fill="var(--theme-process)" opacity="0.16" />
      <line
        x1="452"
        y1="206"
        x2="352"
        y2="232"
        stroke="var(--theme-process)"
        strokeWidth="2.5"
        strokeDasharray="8 7"
      />
      {/* 扫描亮线:step 1 扫过零件一次后停驻 */}
      <rect className="sq-scanline" x="238" y="222" width="9" height="76" fill="var(--theme-process)" rx="2" />
    </svg>
  );
}

function SiteQuestionScene({ state }: { state: SceneState }) {
  return (
    <div className="scene sq" data-state={state}>
      <div className="scene-pad sq-pad">
        <header className="sq-head">
          <h1 className="sq-headline">能解析，还不等于业务在用</h1>
          <hr className="rule" />
        </header>

        <div className="sq-main">
          <figure className="sq-media">
            <div className="sq-photo">
              <ScanScene />
              <p className="sq-photo-plate">M001 · 工业产线扫码情境 · 待提供</p>
            </div>
            <figcaption className="sq-scene">
              <p className="sq-scene-text">
                汽车零部件生产线上，工程师用终端扫码，零件身份当场可查。
              </p>
              <p className="sq-scene-note">
                教学情境：场景用于建立本集问题，不对应真实企业或政策成效
              </p>
            </figcaption>
          </figure>

          <div className="sq-questions">
            {QUESTIONS.map((q) => (
              <article className="sq-qcard" key={q.tag}>
                <div className="sq-qghost" aria-hidden>
                  <span>?</span>
                </div>
                <div className="sq-qbody card">
                  <p className="sq-qtag">{q.tag}</p>
                  <p className="sq-qtext">{q.text}</p>
                  <span className="sq-qmark" aria-hidden>
                    ?
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="sq-takeaway">
          <div className="sq-plate">
            <span>体系可用</span>
            <span className="sq-neq">≠</span>
            <span>业务贯通</span>
          </div>

          <div className="sq-shift">
            <div className="sq-phases">
              {PHASES.map((phase) => (
                <article
                  className={phase.app ? "sq-phase is-app" : "sq-phase"}
                  key={phase.name}
                >
                  <p className="sq-phase-name">{phase.name}</p>
                  <p className="sq-phase-items">{phase.items}</p>
                </article>
              ))}
            </div>

            <div className="sq-meter">
              <p className="sq-meter-cap">基础能力建成后，评价重心向业务深处移动</p>
              <div className="sq-track">
                <span className="sq-node">建成能力</span>
                <span className="sq-line">
                  <span className="sq-marker" />
                </span>
                <span className="sq-node sq-node-end">业务使用</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function SiteQuestion({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <SiteQuestionScene state={state} />;
}
