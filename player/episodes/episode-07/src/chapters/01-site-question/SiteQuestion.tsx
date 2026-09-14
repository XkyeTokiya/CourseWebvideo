import type { ChapterStepProps } from "../../../src/runtime/types";
import "./SiteQuestion.css";
import m001 from "./assets/m001.png";

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
              <img
                className="sq-photo-image"
                src={m001}
                alt="产线工作人员进行工业对象扫码作业"
              />
              <p className="sq-photo-plate">工业产线扫码情境</p>
            </div>
            <figcaption className="sq-scene">
              <p className="sq-scene-text">
                汽车零部件生产线上，工程师用终端扫码，零件身份当场可查。
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
