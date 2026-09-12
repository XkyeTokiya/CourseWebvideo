import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007InfoHierarchy.css";

const STATES = ["hierarchy-reframed", "priority-ranked", "no-template"] as const;

export default function A007InfoHierarchy({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const ranked = state !== "hierarchy-reframed";
  const noTemplate = state === "no-template";

  return (
    <div className="a7-root scene-pad">
      <header className="a7-head">
        <h1 className="a7-title">关键信息突出：是层级，不是整体放大</h1>
      </header>

      <div className="a7-body">
        <figure className="a7-image card">
          <svg
            className={`a7-wire${ranked ? " is-ranked" : ""}`}
            viewBox="0 0 720 430"
            aria-hidden
          >
            <rect className="a7-frame" x="90" y="48" width="540" height="334" rx="16" />
            <rect className="a7-block" x="130" y="88" width="300" height="110" rx="10" />
            <rect className="a7-ring" x="116" y="74" width="328" height="138" rx="16" pathLength="1" />
            <rect className="a7-block" x="462" y="88" width="138" height="48" rx="8" />
            <rect className="a7-block" x="462" y="150" width="138" height="48" rx="8" />
            <rect className="a7-block" x="130" y="232" width="470" height="26" rx="8" />
            <rect className="a7-block" x="130" y="274" width="382" height="26" rx="8" />
            <rect className="a7-block" x="130" y="316" width="298" height="26" rx="8" />
          </svg>
          <figcaption className="a7-ph">M003 · 版式评审现场图（待补入）</figcaption>
        </figure>

        <div className="a7-rail">
          <article className="a7-note card">
            <p className="a7-note-kicker">读图顺序</p>
            <p className="a7-reframe">
              <span className="a7-reframe-wrong">不是把所有字放大</span>
              <span className="a7-reframe-right">是排先后顺序</span>
            </p>
            <div className={`a7-pairs${ranked ? " is-in" : ""}`}>
              <p className="a7-pair a7-pair-main">重要的——先被看到</p>
              <p className="a7-pair a7-pair-aux">辅助的——说清楚就行，不抢镜</p>
            </div>
          </article>

          <article className={`a7-note card${noTemplate ? " is-in" : ""}`}>
            <p className="a7-note-kicker">具体规格</p>
            <ul className="a7-specs">
              <li>放哪些字段</li>
              <li>字号多大</li>
              <li>颜色占多大比例</li>
            </ul>
            <p className="a7-note-line">
              这些，<strong>都没有统一规定。</strong>
            </p>
          </article>

          <article className={`a7-note a7-take card${noTemplate ? " is-in is-late" : ""}`}>
            <p className="a7-take-line">也不该去套用现成的模板</p>
          </article>
        </div>
      </div>
    </div>
  );
}
