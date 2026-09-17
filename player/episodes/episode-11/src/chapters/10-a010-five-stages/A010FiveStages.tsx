import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010FiveStages.css";

/**
 * A010「阶段的铺开」· lifecycle-identity-continuity · ordered-progression
 * packet steps（1 起）→ semantic state（S-A010），一拍一态：
 *   1 拆出链条并点亮原料进厂 → raw-material-recorded
 *   2 生产加工留痕           → production-recorded
 *   3 仓储物流留痕           → warehousing-recorded
 *   4 终端销售接入           → retail-connected
 *   5 市场消费收尾           → consumption-observed
 */
const stateByStep = [
  "raw-material-recorded",
  "production-recorded",
  "warehousing-recorded",
  "retail-connected",
  "consumption-observed",
] as const;

type A010State = (typeof stateByStep)[number];

/**
 * 每个语义态下处于 active 的阶段带（每拍唯一一条从 upcoming 变 active）。
 * 阶段带的 active / past / upcoming 只由当前 state 推导，与 step 无关：
 *   index < active → past（越早越弱化，两级弱化但不消失）
 *   index = active → active
 *   index > active → upcoming（虚位，无文字内容）
 */
const ACTIVE_BY_STATE: Record<A010State, number> = {
  "raw-material-recorded": 0,
  "production-recorded": 1,
  "warehousing-recorded": 2,
  "retail-connected": 3,
  "consumption-observed": 4,
};

interface Stage {
  no: string;
  name: string;
  note?: string;
  end?: string;
  slips: string[];
}

const STAGES: Stage[] = [
  { no: "01", name: "原料进厂", slips: ["来源记录", "检验记录"] },
  { no: "02", name: "生产加工", slips: ["制造记录", "包装记录"] },
  { no: "03", name: "仓储物流", slips: ["出入库记录", "运输记录"] },
  { no: "04", name: "终端销售", note: "药店 · 医院", slips: ["销售信息", "配送信息"] },
  { no: "05", name: "市场消费", end: "链条末端 · 观察点", slips: [] },
];

export default function A010FiveStages({ step }: ChapterStepProps) {
  const state: A010State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const activeIndex = ACTIVE_BY_STATE[state];
  const settled = state === "consumption-observed";

  return (
    <div className={`fs-scene scene-pad${settled ? " is-settled" : ""}`}>
      <header className="fs-head">
        <h1 className="fs-title">五个观察阶段</h1>
      </header>

      <div className="fs-board">
        {/* 贯穿锚点（R017）：同一盒药 —— 一条标签从第一带贯穿到第五带，全章持续在场 */}
        <aside className="fs-anchor">
          <div className="fs-anchor-rail">
            <span className="fs-anchor-text">同一盒药</span>
            {STAGES.map((stage, i) => (
              <i
                key={stage.no}
                className="fs-anchor-tick"
                aria-hidden="true"
                style={{ "--fs-i": i } as CSSProperties}
              />
            ))}
          </div>
        </aside>

        {/* 五条阶段带：真实顺序过程，带与带之间只有空隙，不设连线 */}
        <div className="fs-bands">
          {STAGES.map((stage, i) => {
            const past = i < activeIndex;
            const active = i === activeIndex;
            const status = past ? "is-past" : active ? "is-active" : "is-upcoming";
            const deep = past && activeIndex - i >= 2 ? " is-past-deep" : "";
            return (
              <section
                key={stage.no}
                className={`fs-band fs-band--m${i + 1} ${status}${deep}`}
                style={{ "--fs-i": i } as CSSProperties}
              >
                <span className="fs-band-no hero-num">{stage.no}</span>
                <div className="fs-band-name">
                  <h2>{stage.name}</h2>
                  {stage.note ? <p>{stage.note}</p> : null}
                </div>
                <div className="fs-band-slips">
                  {stage.slips.map((slip, j) => (
                    <span key={slip} className="fs-slip" style={{ "--fs-s": j } as CSSProperties}>
                      <i className="fs-slip-mark" aria-hidden="true" />
                      {slip}
                    </span>
                  ))}
                </div>
                {stage.end ? <span className="fs-endcap">{stage.end}</span> : null}
              </section>
            );
          })}
        </div>
      </div>

      {/* 收束判断：仅末拍亮出，槽位从首拍起预留，不引起重排 */}
      <div className="fs-verdict">
        <p className="fs-verdict-text">
          <i className="fs-verdict-line" aria-hidden="true" />
          五个阶段各自留记录，指向<span className="fs-verdict-obj">同一盒药</span>。
          <i className="fs-verdict-line" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
