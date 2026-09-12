import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A011UseEnvironment.css";

const STATES = ["issues-raised", "visibility-questioned", "answer-located"] as const;

export default function A011UseEnvironment({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const secondIn = state !== "issues-raised";
  const answerIn = state === "answer-located";

  return (
    <div className="a11-root scene-pad">
      <header className="a11-head">
        <h1 className="a11-title">设计判断，要回到使用环境</h1>
      </header>

      <div className="a11-body">
        <div className="a11-cards">
          <article className="a11-issue card">
            <p className="a11-q">标签会不会被挡住？</p>
            <p className="a11-q">会不会和操作面打架？</p>
          </article>

          <article className={`a11-issue card${secondIn ? " is-in" : ""}`}>
            <p className="a11-q">维护的时候，还看得见吗？</p>
          </article>
        </div>

        <figure className="a11-image card">
          <svg className="a11-scene" viewBox="0 0 720 400" aria-hidden>
            <rect className="a11-machine" x="60" y="60" width="420" height="280" rx="20" />
            <rect className="a11-face" x="110" y="110" width="320" height="180" rx="12" />
            <rect className="a11-labelpos" x="180" y="150" width="150" height="96" rx="10" />
            <rect className="a11-blocker" x="262" y="138" width="128" height="120" rx="12" />
            <g className="a11-opface">
              <line x1="540" y1="120" x2="600" y2="60" />
              <line x1="540" y1="170" x2="640" y2="70" />
              <line x1="540" y1="220" x2="640" y2="120" />
              <line x1="540" y1="270" x2="640" y2="170" />
            </g>
          </svg>
          <figcaption className="a11-ph">M005 · 使用环境附着位置实景图（待补入）</figcaption>
        </figure>
      </div>

      <aside className={`a11-answer${answerIn ? " is-in" : ""}`}>
        <p className="a11-answer-line">
          答案不在标签本身——<strong>而在具体的对象和位置上。</strong>
        </p>
      </aside>
    </div>
  );
}
