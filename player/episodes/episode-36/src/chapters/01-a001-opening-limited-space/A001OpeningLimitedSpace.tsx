import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001OpeningLimitedSpace.css";

const STATES = [
  "title-anchored",
  "scene-grounded",
  "size-tension-shown",
  "question-reframed",
  "episode-framed",
] as const;

export default function A001OpeningLimitedSpace({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const sceneIn = state !== "title-anchored";
  const tensionIn =
    state === "size-tension-shown" ||
    state === "question-reframed" ||
    state === "episode-framed";
  const reframeIn = state === "question-reframed" || state === "episode-framed";
  const closeIn = state === "episode-framed";

  return (
    <div className="a1-root scene-pad">
      <header className="a1-anchor">
        <p className="a1-kicker">标识载体要和附着物一起设计</p>
        <h1 className="a1-title">标识载体设计：尺寸、位置、耐久与信息层级</h1>
      </header>

      <div className="a1-body">
        <figure className={`a1-scene card${sceneIn ? " is-in" : ""}`}>
          <svg className="a1-bench" viewBox="0 0 900 560" aria-hidden>
            <rect className="a1-part" x="60" y="80" width="700" height="420" rx="26" />
            <text className="a1-svglabel a1-svglabel-part" x="96" y="142">
              零件
            </text>
            <rect className="a1-slice" x="480" y="150" width="180" height="120" rx="14" />
            <path className="a1-lead" d="M 570 150 C 590 130, 600 118, 614 108" pathLength="1" />
            <text className="a1-svglabel a1-svglabel-slice" x="624" y="102">
              可用 · 只有一小块
            </text>
          </svg>
          <figcaption className="a1-ph">M001 · 工业设计台现场图（待补入）</figcaption>
        </figure>

        <div className="a1-context">
          <div className={`a1-note${sceneIn ? " is-in" : ""}`}>
            <p className="a1-note-line">一枚标识，要贴到某个零件上。</p>
            <p className="a1-note-sub">
              零件表面，<strong>只有一小块</strong>地方能用。
            </p>
          </div>

          <div
            className={`a1-tension${tensionIn ? " is-in" : ""}${reframeIn ? " is-weak" : ""}`}
          >
            <div className="a1-side a1-side-big card">
              <p className="a1-side-head">做大了</p>
              <svg className="a1-demo" viewBox="0 0 300 150" aria-hidden>
                <rect className="a1-demo-region" x="70" y="22" width="150" height="106" rx="10" />
                <rect className="a1-demo-over" x="86" y="42" width="188" height="64" rx="8" />
              </svg>
              <p className="a1-side-note">装不上 · 还挡住别的东西</p>
            </div>
            <div className="a1-side a1-side-small card">
              <p className="a1-side-head">做小了</p>
              <svg className="a1-demo" viewBox="0 0 300 150" aria-hidden>
                <rect className="a1-demo-region" x="70" y="22" width="150" height="106" rx="10" />
                <rect className="a1-demo-tiny" x="112" y="56" width="66" height="38" rx="6" />
                <g className="a1-demo-micro">
                  <rect x="120" y="65" width="50" height="5" rx="2.5" />
                  <rect x="120" y="75" width="34" height="5" rx="2.5" />
                  <rect x="120" y="85" width="43" height="5" rx="2.5" />
                </g>
              </svg>
              <p className="a1-side-note">关键信息看不清</p>
            </div>
          </div>

          <div className={`a1-reframe${reframeIn ? " is-in" : ""}`}>
            <p className="a1-reframe-line">问题不是“把标识放上去”——</p>
            <p className="a1-reframe-strong">它得和所贴附的物件配合、一起设计。</p>
          </div>

          <p className={`a1-close${closeIn ? " is-in" : ""}`}>
            这一期，就把这两者<em>当成一件事</em>来设计。
          </p>
        </div>
      </div>
    </div>
  );
}
