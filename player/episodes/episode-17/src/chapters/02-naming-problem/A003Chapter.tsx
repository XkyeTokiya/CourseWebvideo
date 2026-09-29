import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 02-naming-problem · A003 命名难题（2 拍）
 * 配方 evidence-cards-with-provenance-boundary，关系机制 premise-to-question。
 * step → semantic state 显式映射，允许重复，末态兜底：
 * - problem-tagged：三张难题卡按口播报到点并列落位，汇入线与收束条建立（A003 · S-A003）
 * - question-dominant：问句升为视觉焦点，卡区权重弱化（A003 · S-A003）
 */
const stateByStep = [
  "problem-tagged",
  "question-dominant",
] as const;

type NamingState = (typeof stateByStep)[number];

/** 三张难题卡：口播第 1 拍逐项点名，并列等权，完成后不留下当前选中项 */
const PROBLEMS = [
  { index: "①", label: "重名", phrase: "名字可能和别处的重复" },
  { index: "②", label: "层级", phrase: "说不清落在哪个层级" },
  { index: "③", label: "分支", phrase: "说不清归哪个分支管" },
] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state: NamingState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad np-root" data-state={state}>
      <header className="np-header">
        <h1 className="np-headline">
          只写<span className="np-name-tag">“某企业的一块电池”</span>，还不够
        </h1>
      </header>

      <div className="np-cards">
        {PROBLEMS.map((problem) => (
          <article className="np-card" key={problem.label}>
            <p className="np-card-kicker">难题 {problem.index}</p>
            <div className="np-card-core">
              <p className="np-card-label">{problem.label}</p>
              <p className="np-card-phrase">{problem.phrase}</p>
            </div>
            <div className="np-card-demo">
              {problem.label === "重名" && (
                <div className="np-dup" aria-hidden="true">
                  <span className="np-dup-tag np-dup-back">某企业的一块电池</span>
                  <span className="np-dup-tag np-dup-front">某企业的一块电池</span>
                  <span className="np-dup-mark">!</span>
                </div>
              )}
              {problem.label === "层级" && (
                <svg
                  className="np-demo-svg"
                  viewBox="0 0 120 64"
                  aria-hidden="true"
                >
                  <rect className="np-demo-shape" x="6" y="5" width="86" height="14" />
                  <rect className="np-demo-shape np-demo-unknown" x="6" y="25" width="86" height="14" />
                  <rect className="np-demo-shape" x="6" y="45" width="86" height="14" />
                  <text className="np-demo-mark" x="108" y="42">?</text>
                </svg>
              )}
              {problem.label === "分支" && (
                <svg
                  className="np-demo-svg"
                  viewBox="0 0 120 64"
                  aria-hidden="true"
                >
                  <path className="np-demo-stroke" d="M60 4 V22" />
                  <path className="np-demo-stroke" d="M60 22 C60 40 26 38 26 58" />
                  <path className="np-demo-stroke" d="M60 22 C60 40 94 38 94 58" />
                  <text className="np-demo-mark" x="52" y="50">?</text>
                </svg>
              )}
            </div>
          </article>
        ))}
      </div>

      <svg
        className="np-merge-lines"
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="np-merge-line" pathLength="1" vectorEffect="non-scaling-stroke" d="M17 0 V14 Q17 30 34 36 L47 42" />
        <path className="np-merge-line" pathLength="1" vectorEffect="non-scaling-stroke" d="M50 0 V42" />
        <path className="np-merge-line" pathLength="1" vectorEffect="non-scaling-stroke" d="M83 0 V14 Q83 30 66 36 L53 42" />
      </svg>

      <div className="np-merge">
        <p className="np-boundary">
          引用它的地方越多，越需要一条<b>大家都能对上号</b>的命名路径
        </p>
        <p className="np-question">
          <span className="np-question-line">怎样把这样一件对象，</span>
          <span className="np-question-line">
            放进一条
            <span className="np-question-key">既能相互区分、又能继续往下扩展</span>
            的命名路径？
          </span>
        </p>
      </div>
    </div>
  );
}
