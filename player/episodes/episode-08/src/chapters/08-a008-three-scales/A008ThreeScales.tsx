import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008ThreeScales.css";

const states = [
  "object-card-placed",
  "two-cards-placed",
  "three-cards-placed",
  "division-takeaway",
] as const;

type TsState = (typeof states)[number];

const CARDS = [
  { layer: "对象层", text: "身份把物理对象与数字资源对应起来" },
  { layer: "环节层", text: "不同系统的记录围绕对象形成生命周期线索" },
  { layer: "产业链层", text: "不同主体围绕同一个身份查询和共享信息" },
];

export default function A008ThreeScales({ step }: ChapterStepProps) {
  const state: TsState = states[step] ?? states[states.length - 1];
  const filled = state === "object-card-placed" ? 1 : state === "two-cards-placed" ? 2 : 3;
  const takeawayOn = state === "division-takeaway";

  return (
    <div className="ts-scene scene-pad">
      <h1 className="ts-title">三个尺度怎样衔接</h1>

      <div className="ts-cards">
        {CARDS.map((card, i) => (
          <article
            key={card.layer}
            className={`ts-card card${i < filled ? " is-filled" : ""}`}
            aria-hidden={i >= filled}
          >
            <span className="ts-card-no hero-num">{`0${i + 1}`}</span>
            <h2 className="ts-card-layer">{card.layer}</h2>
            <p className="ts-card-text">{card.text}</p>
          </article>
        ))}
      </div>

      <footer className="ts-takeaway">
        <p
          className={`ts-division${takeawayOn ? " is-on" : ""}`}
          aria-hidden={!takeawayOn}
        >
          <span><b>标识</b>负责稳定指向</span>
          <span><b>解析</b>负责寻找联系</span>
          <span><b>业务应用</b>再使用查到的信息</span>
        </p>
      </footer>
    </div>
  );
}
