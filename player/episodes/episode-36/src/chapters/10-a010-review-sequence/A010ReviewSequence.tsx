import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010ReviewSequence.css";

const STATES = [
  "object-first",
  "layout-checked",
  "material-info-checked",
  "all-layers-hold",
  "missing-basis-warned",
  "three-questions-open",
] as const;

const QUESTIONS = ["它和附着物相称吗？", "贴的位置有依据吗？", "关键信息分出了主次吗？"] as const;

export default function A010ReviewSequence({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const doneCount = Math.min(STATES.indexOf(state), 3);
  const holdIn = doneCount >= 3;
  const warnIn = state === "missing-basis-warned" || state === "three-questions-open";
  const askIn = state === "three-questions-open";

  return (
    <div className="a10-root scene-pad">
      <header className="a10-head">
        <h1 className="a10-title">把三层关系，排成一条复核顺序</h1>
      </header>

      <div className="a10-band">
        <article
          className={`a10-step card${doneCount >= 1 ? " is-done" : ""}${
            doneCount === 0 ? " is-active" : ""
          }`}
        >
          <p className="a10-no hero-num">01</p>
          <p className="a10-lead">先看</p>
          <p className="a10-step-text">对象是什么，能用的区域在哪里</p>
        </article>

        <svg className={`a10-arrow${doneCount >= 1 ? " is-in" : ""}`} viewBox="0 0 48 24" aria-hidden>
          <line x1="4" y1="12" x2="36" y2="12" pathLength="1" />
          <path d="M 30 5 L 40 12 L 30 19" pathLength="1" />
        </svg>

        <article
          className={`a10-step card${doneCount >= 2 ? " is-done" : ""}${
            doneCount === 1 ? " is-active" : ""
          }`}
        >
          <p className="a10-no hero-num">02</p>
          <p className="a10-lead">再看</p>
          <p className="a10-step-text">版面排得顺不顺</p>
        </article>

        <svg className={`a10-arrow${doneCount >= 2 ? " is-in" : ""}`} viewBox="0 0 48 24" aria-hidden>
          <line x1="4" y1="12" x2="36" y2="12" pathLength="1" />
          <path d="M 30 5 L 40 12 L 30 19" pathLength="1" />
        </svg>

        <article
          className={`a10-step card${doneCount >= 3 ? " is-done" : ""}${
            doneCount === 2 ? " is-active" : ""
          }`}
        >
          <p className="a10-no hero-num">03</p>
          <p className="a10-lead">接着 · 最后</p>
          <p className="a10-step-text">核对材质和位置合不合适；看关键信息和整体协不协调</p>
        </article>
      </div>

      <aside className={`a10-recap card${holdIn ? " is-in" : ""}`}>
        <p className={`a10-verdict${holdIn ? " is-in" : ""}`}>
          三层都站得住，设计才不是简单贴一张码。
        </p>
        <p className={`a10-warn${warnIn ? " is-in" : ""}`}>
          只盯着那一个码，另外两层不管——用起来、维护起来就会缺依据。
        </p>
        <div className={`a10-ask${askIn ? " is-in" : ""}`}>
          <p className="a10-ask-lead">别只问好不好看，还要多问几句：</p>
          <div className="a10-questions">
            {QUESTIONS.map((q) => (
              <p key={q} className="a10-question">
                {q}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
