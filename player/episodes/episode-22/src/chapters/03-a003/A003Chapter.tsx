import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003Chapter.css";

const stateByStep = ["product-defined", "flow-coupled", "event-question-closed"] as const;

/** S014：教材列举的三类例项，不出现真实订单号或数值 */
const CASES = [
  { name: "订单", note: "客户要什么、要多少" },
  { name: "物料清单", note: "一件产品需要哪些原料和零部件、各用多少" },
  { name: "质检记录", note: "这一批过没过" },
] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const flowOn = step >= 1;
  const answerOn = step >= 2;

  const rootCls = [
    "bd-scene",
    "scene-pad",
    flowOn && "is-flow",
    answerOn && "is-answer",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="bd-head">
        <h1 className="bd-headline">
          业务数据：<em>流程的直接产物</em>
        </h1>
        <div className="bd-head-rule rule" />
      </header>

      <div className="bd-cols">
        <section className="bd-def">
          <p className="bd-def-kicker">定义</p>
          <p className="bd-def-eq">
            <span className="bd-def-term">工业业务数据</span>
            <span className="bd-def-arrow" aria-hidden="true">
              =
            </span>
            <span className="bd-def-value">
              工业业务运转
              <br />
              的<em>直接产物</em>
            </span>
          </p>
          <div className="bd-def-rule rule" />
          <p className="bd-def-where">
            产生在研发、生产、供应链这些环节
            <br />
            一路跑下来的过程里
          </p>
        </section>

        <section className="bd-cases" aria-label="业务数据的例子">
          {CASES.map((item, index) => (
            <article
              key={item.name}
              className="bd-case"
              style={{ "--bd-i": index } as CSSProperties}
            >
              <span className="bd-case-idx">{String(index + 1).padStart(2, "0")}</span>
              <p className="bd-case-name">{item.name}</p>
              <p className="bd-case-note">{item.note}</p>
            </article>
          ))}
        </section>

        <div className="bd-live">
          <span className="bd-live-track" aria-hidden="true" />
          <span className="bd-live-reserve" aria-hidden="true" />

          <section className="bd-live-block bd-live-block--flow">
            <p className="bd-live-kicker">流程关联</p>
            <p className="bd-live-hero">业务一动，它就变</p>
            <p className="bd-live-sub">业务不停，它就不断产生</p>
            <span className="bd-flow-line" aria-hidden="true" />
          </section>

          <section className="bd-live-block bd-live-block--use">
            <p className="bd-live-kicker">用途</p>
            <p className="bd-live-hero">支撑业务执行</p>
            <p className="bd-live-sub">也给管理决策提供依据</p>
          </section>
        </div>
      </div>

      <div className="bd-answer">
        <span className="bd-answer-reserve" aria-hidden="true">
          业务数据回答的三个问题
        </span>
        <div className="bd-answer-plate">
          <span className="bd-answer-lead">业务数据回答</span>
          <ul className="bd-answer-list">
            <li>事情发生了没有</li>
            <li>过程怎么样</li>
            <li>结果如何</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
