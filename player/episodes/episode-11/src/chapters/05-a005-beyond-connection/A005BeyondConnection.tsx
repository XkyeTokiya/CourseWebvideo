import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005BeyondConnection.css";

/* S-A005 · condition-key-goal
   beat 1-3 → base-scene semantic states；beat 4 → K-A005-01 accent（step===3） */
const stateByStep = [
  "sharing-question-posed",
  "constraints-paired",
  "cooperation-conditions-settled",
] as const;

type A005State = (typeof stateByStep)[number];

const ACCENT_STEP = 3;

/* S021（exact，逐项保留）：信任机制、共享平台、标准流程、利益分配 */
const CONDITIONS = ["信任机制", "共享平台", "标准流程", "利益分配"];

function A005StatementFrame() {
  return (
    <div className="bc-statement scene-pad">
      <span className="bc-statement-rule" aria-hidden="true" />
      <p className="bc-statement-kicker">对接 ≠ 对齐</p>
      <h1 className="bc-statement-line">系统之间可以对接，</h1>
      <p className="bc-statement-line bc-statement-hard">利益和信任不容易对齐。</p>
    </div>
  );
}

function A005Scene({ state }: { state: A005State }) {
  const paired = state !== "sharing-question-posed";
  const settled = state === "cooperation-conditions-settled";

  return (
    <div className="bc-scene scene-pad">
      <header className="bc-head">
        <h1 className="bc-title">共享之外还缺什么</h1>
      </header>

      <div className={`bc-ask${paired ? " is-weakened" : ""}`}>
        <p className="bc-question">把数据都放到一起共享，就行了吗？</p>
        <p className="bc-turn">也没有这么简单。</p>
      </div>

      <div className={`bc-constraints${paired ? " is-on" : ""}${settled ? " is-past" : ""}`}>
        <article className="bc-constraint bc-constraint--data">
          <p className="bc-tag">共享本身的限制</p>
          <h2>数据安全与隐私保护</h2>
          <div className="bc-fig" aria-hidden="true">
            <svg viewBox="0 0 760 200" preserveAspectRatio="xMidYMax meet">
              <line className="bc-track" x1="134" y1="109" x2="636" y2="109" />
              <g>
                <rect className="bc-node" x="24" y="76" width="110" height="66" />
                <line className="bc-node-line" x1="42" y1="94" x2="116" y2="94" />
                <line className="bc-node-line" x1="42" y1="109" x2="116" y2="109" />
                <line className="bc-node-line" x1="42" y1="124" x2="116" y2="124" />
              </g>
              <g>
                <rect className="bc-node" x="636" y="76" width="110" height="66" />
                <line className="bc-node-line" x1="654" y1="94" x2="728" y2="94" />
                <line className="bc-node-line" x1="654" y1="109" x2="728" y2="109" />
                <line className="bc-node-line" x1="654" y1="124" x2="728" y2="124" />
              </g>
              <rect className="bc-pkt bc-pkt-3" x="138" y="101" width="16" height="16" />
              <rect className="bc-pkt bc-pkt-2" x="138" y="101" width="16" height="16" />
              <rect className="bc-pkt bc-pkt-1" x="138" y="101" width="16" height="16" />
              <g className="bc-wall">
                <rect x="300" y="30" width="28" height="158" fill="var(--theme-structural)" />
                <text className="bc-wall-label" x="314" y="96" textAnchor="middle">限</text>
                <text className="bc-wall-label" x="314" y="124" textAnchor="middle">制</text>
              </g>
            </svg>
          </div>
        </article>

        <article className="bc-constraint bc-constraint--env">
          <p className="bc-tag">外部环境的影响</p>
          <h2>需求波动 · 突发事件 · 外部不确定性</h2>
          <div className="bc-fig" aria-hidden="true">
            <svg viewBox="0 0 760 200" preserveAspectRatio="xMidYMax meet">
              <line className="bc-axis" x1="24" y1="158" x2="736" y2="158" />
              <path className="bc-cone" d="M496 172 C 560 154 640 134 736 112" />
              <path className="bc-cone" d="M496 172 C 560 182 640 192 736 198" />
              <path className="bc-wave" d="M24 158 C 100 108 170 200 250 156 C 310 126 340 132 380 152" pathLength={100} />
              <path className="bc-spike" d="M380 152 L 436 40 L 496 172" pathLength={100} />
            </svg>
          </div>
        </article>
      </div>

      <div className={`bc-pivot${settled ? " is-on" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 1660 44" preserveAspectRatio="xMidYMid meet">
          <circle className="bc-pivot-origin" cx="1330" cy="10" r="6" />
          <path className="bc-pivot-path" d="M1330 10 C 1080 12 620 18 190 36" pathLength={100} />
          <polyline className="bc-pivot-arrow" points="216,26 190,36 218,44" />
        </svg>
      </div>

      <div className={`bc-goal${settled ? " is-on" : ""}`}>
        <div className="bc-goal-caption">
          <p className="bc-goal-name">协同条件</p>
          <p className="bc-goal-note">一起支撑</p>
        </div>
        <div className="bc-goal-body">
          <div className="bc-slab"><span>多个主体 · 长期愿意共享</span></div>
          <div className="bc-pillars">
            {CONDITIONS.map((term) => (
              <div className="bc-pillar" key={term}><span>{term}</span></div>
            ))}
          </div>
          <div className="bc-ground" />
        </div>
      </div>
    </div>
  );
}

export default function A005BeyondConnection({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <A005StatementFrame />;
  const state: A005State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <A005Scene state={state} />;
}
