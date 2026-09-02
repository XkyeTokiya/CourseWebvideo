import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DirectionsToSiteDemands.css";

const states = [
  "intelligence-demand-shown",
  "green-demand-shown",
  "fusion-demand-shown",
  "shared-breakpoint-stated",
] as const;

type DirectionsState = (typeof states)[number];

const REVEALED_BY_STATE: Record<DirectionsState, number> = {
  "intelligence-demand-shown": 1,
  "green-demand-shown": 2,
  "fusion-demand-shown": 3,
  "shared-breakpoint-stated": 3,
};

const DIRECTION_CARDS = [
  { key: "intelligence", title: "智能化", body: "真实、连续的运行信息", foot: "来支持判断" },
  { key: "green", title: "绿色化", body: "看见能源、物料和排放", foot: "随着生产过程怎样变化" },
  { key: "fusion", title: "融合化", body: "设备、系统、部门和上下游企业", foot: "能够配合行动" },
];

export default function DirectionsToSiteDemands({ step }: ChapterStepProps) {
  const state: DirectionsState = states[step] ?? states[states.length - 1];
  const revealed = REVEALED_BY_STATE[state];
  const breakpointOn = state === "shared-breakpoint-stated";

  return (
    <div className="ds-scene scene-pad">
      <h1 className="ds-thesis">
        信息封闭会让方向停在<em>局部工具</em>上
      </h1>

      <div className="ds-row">
        {DIRECTION_CARDS.map((card, i) => {
          const on = i < revealed;
          return (
            <section
              key={card.key}
              className={`ds-dir ds-dir--${card.key}`}
              data-on={on ? "on" : "waiting"}
            >
              <div className="ds-dir-body">
                <p className="ds-dir-kicker">现场要求</p>
                <h2 className="ds-dir-title">{card.title}</h2>
                <p className="ds-dir-text">{card.body}</p>
                <p className="ds-dir-foot">{card.foot}</p>
              </div>
            </section>
          );
        })}
      </div>

      <section
        className={`ds-break${breakpointOn ? " is-on" : ""}`}
        aria-hidden={!breakpointOn}
      >
        <div className="ds-break-body">
          <p className="ds-break-kicker">共同断点</p>
          <p className="ds-break-text">
            如果信息被锁在<i>一台机器、一个系统或一家企业</i>内部
          </p>
          <p className="ds-break-em">宏观方向就很难转成稳定的运行能力</p>
        </div>
      </section>
    </div>
  );
}
