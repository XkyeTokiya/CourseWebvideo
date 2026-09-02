import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SupportMapsToDirections.css";

const states = [
  "intelligence-mapping-set",
  "green-mapping-set",
  "fusion-mapping-set",
  "landing-judgment-stated",
] as const;

type SupportMapsState = (typeof states)[number];

const MAP_CARDS = [
  {
    key: "intelligence",
    title: "智能化",
    support: "连接 + 数据贯通",
    result: "连续的工业信息",
  },
  {
    key: "green",
    title: "绿色化",
    support: "过程数据 + 分析能力",
    result: "资源过程的观察与调整",
  },
  {
    key: "fusion",
    title: "融合化",
    support: "能力复用 + 跨主体协同",
    result: "共同基础",
  },
];

const REVEALED_BY_STATE: Record<SupportMapsState, number> = {
  "intelligence-mapping-set": 1,
  "green-mapping-set": 2,
  "fusion-mapping-set": 3,
  "landing-judgment-stated": 3,
};

export default function SupportMapsToDirections({ step }: ChapterStepProps) {
  const state: SupportMapsState = states[step] ?? states[states.length - 1];
  const revealed = REVEALED_BY_STATE[state];
  const landingOn = state === "landing-judgment-stated";

  return (
    <div className="md-scene scene-pad">
      <h1 className="md-thesis">工业互联网把发展方向接到日常工业运行</h1>

      <div className="md-grid">
        {MAP_CARDS.map((card, i) => {
          const on = i < revealed;
          return (
            <section
              key={card.key}
              className="md-map"
              data-on={on ? "on" : "waiting"}
            >
              <div className="md-map-body">
                <h2 className="md-map-title">{card.title}</h2>
                <p className="md-map-support">{card.support}</p>
                <p className="md-map-result">
                  <span className="md-map-arrow hero-num" aria-hidden="true">
                    →
                  </span>
                  {card.result}
                </p>
              </div>
            </section>
          );
        })}

        <section
          className={`md-landing${landingOn ? " is-on" : ""}`}
          aria-hidden={!landingOn}
        >
          <div className="md-landing-body">
            <p className="md-landing-kicker">共同落点</p>
            <p className="md-landing-text">
              三类方向通过工业互联网支撑，<i>进入工业运行</i>
            </p>
          </div>
        </section>
      </div>

      <div className={`md-take${landingOn ? " is-on" : ""}`} aria-hidden={!landingOn}>
        <p className="md-take-kicker">把这些支撑放回政策方向</p>
        <p className="md-take-hero">
          工业互联网的作用，是把发展方向<em>接到工业运行上</em>
        </p>
      </div>
    </div>
  );
}
