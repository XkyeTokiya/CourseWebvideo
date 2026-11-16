import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A012Chapter.css";
import m004 from "./assets/m004.png";

const stateByStep = ["recalled-and-placed", "entry-rule-restated", "four-questions-sealed"] as const;

/** S068：四项归位 */
const PLACEMENT = [
  { part: "身份", home: "主数据" },
  { part: "发生的事", home: "业务数据" },
  { part: "意思和来路", home: "元数据" },
  { part: "字段定义", home: "数据字典" },
] as const;

/** S070：四问短句 */
const FOUR = ["确认对象", "记录事件", "描述数据", "规范字段"] as const;

export default function A012Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const ruleOn = step >= 1;
  const sealedOn = step >= 2;

  const rootCls = [
    "sum-scene",
    "scene-pad",
    ruleOn && "is-rule",
    sealedOn && "is-sealed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="sum-head">
        <h1 className="sum-headline">
          本期总结：<em>四问归位</em>
        </h1>
        <div className="sum-head-rule rule" />
      </header>

      <div className="sum-body">
        <figure className="sum-media">
          <div className="sum-media-strip">
            <span className="sum-media-name">回到开头那张维修记录</span>
            <span className="sum-media-missing">M004 · 待提供</span>
          </div>
          <div className="sum-media-plate">
            <img
              className="sum-media-shot"
              src={m004}
              alt="回到设备维护情境的收束占位图（M004 待提供）"
            />
          </div>
        </figure>

        <div className="sum-rails">
          <section className="sum-rail sum-rail--place">
            <div className="sum-rail-head">
              <span className="sum-rail-idx">01</span>
              <p className="sum-rail-kicker">四项归位</p>
            </div>

            <ul className="sum-rows">
              {PLACEMENT.map((row, index) => (
                <li
                  key={row.part}
                  className="sum-row"
                  style={{ "--sum-i": index } as CSSProperties}
                >
                  <span className="sum-row-part">{row.part}</span>
                  <span className="sum-row-lead" aria-hidden="true" />
                  <span className="sum-row-home">{row.home}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="sum-rail sum-rail--rule">
            <div className="sum-rail-head">
              <span className="sum-rail-idx">02</span>
              <p className="sum-rail-kicker">同一个规律</p>
            </div>

            <div className="sum-rail-core">
              <p className="sum-rule-hero">
                先别盯它<em>在哪张表</em>
                <br />
                先问它<em>在回答什么</em>
              </p>

              <ul className="sum-four">
                {FOUR.map((name, index) => (
                  <li
                    key={name}
                    className="sum-four-item"
                    style={{ "--sum-f": index } as CSSProperties}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
