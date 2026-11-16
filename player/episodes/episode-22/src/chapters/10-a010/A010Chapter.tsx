import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010Chapter.css";

const stateByStep = [
  "placed-on-device",
  "base-table-caveat",
  "stability-and-scope-caveats",
] as const;

/** S057–S058：设备维护情境的四项归位 */
const PLACEMENT = [
  { thing: "设备的身份", home: "主数据" },
  { thing: "维修工单", home: "业务数据" },
  { thing: "工单里字段含义、来源和业务关系", home: "元数据" },
  { thing: "数据库里字段的名称、类型和约束", home: "数据字典" },
] as const;

const TRAPS = [
  {
    id: "01",
    title: {
      main: "存在基础表里",
      rest: "不一定是主数据",
    },
    body: "关键看它是不是在描述核心业务实体、会不会被共享",
  },
  {
    id: "02",
    title: {
      main: "相对稳定",
      rest: "不等于静止不动",
    },
    body: "这个稳定是相对的，不等于说它永远不变",
  },
  {
    id: "03",
    title: {
      main: "数据字典",
      rest: "不是元数据的全部",
    },
    body: "它只管数据库这一块，字段长得再像，职责和范围也可能完全不同",
  },
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const trap1On = step >= 1;
  const trapRestOn = step >= 2;

  const rootCls = [
    "tr-scene",
    "scene-pad",
    trap1On && "is-trap-1",
    trapRestOn && "is-trap-rest",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="tr-head">
        <h1 className="tr-headline">
          设备情境<em>归位</em>与三处踩偏
        </h1>
        <div className="tr-head-rule rule" />
      </header>

      <section className="tr-placement">
        <div className="tr-placement-head">
          <p className="tr-placement-kicker">用这台设备的维护情境归位一遍</p>
        </div>

        <ul className="tr-rows">
          {PLACEMENT.map((row, index) => (
            <li
              key={row.thing}
              className="tr-row"
              style={{ "--tr-i": index } as CSSProperties}
            >
              <span className="tr-row-thing">{row.thing}</span>
              <span className="tr-row-lead" aria-hidden="true" />
              <span className="tr-row-home">{row.home}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="tr-traps">
        {TRAPS.map((trap, index) => {
          const pending =
            (index === 1 && !trapRestOn) || (index === 2 && !trapRestOn);
          return (
            <article
              key={trap.id}
              className={["tr-trap", pending && "is-pending"].filter(Boolean).join(" ")}
              style={{ "--tr-t": index } as CSSProperties}
            >
              <div className="tr-trap-top">
                <span className="tr-trap-no">踩偏 {trap.id}</span>
              </div>

              <p className="tr-trap-title">
                {trap.title.main}
                <br />
                <em>{trap.title.rest}</em>
              </p>

              <p className="tr-trap-body">{trap.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
