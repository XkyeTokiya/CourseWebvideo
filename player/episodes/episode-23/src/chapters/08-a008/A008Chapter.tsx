import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008Chapter.css";

const stateByStep = ["standard-defined", "management-defined"] as const;

const STANDARD_ITEMS = [
  "统一数据交换要求",
  "规范数据格式",
  "明确交换什么、如何组织和读写",
] as const;

const MANAGEMENT_ITEMS = [
  "数据使用办法",
  "版权和产权保护",
  "部门间使用协议",
] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const management = state === "management-defined";

  return (
    <div className="pl-scene scene-pad">
      <header className="pl-head">
        <h1 className="pl-headline">两类条件：标准与管理</h1>
        <div className="pl-head-rule" />
      </header>

      <div className="pl-main">
        <section className="pl-side card is-on" aria-label="条件一：标准">
          <p className="pl-side-tag">条件一 · 标准</p>
          <ul className="pl-items">
            {STANDARD_ITEMS.map((item, i) => (
              <li
                key={item}
                className="pl-item"
                style={{ "--pl-i": i } as CSSProperties}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="pl-side-note">
            标准不统一，同一份数据在两边就是两种说法。
          </p>
        </section>

        <section className="pl-pivot" aria-label="两类条件共同回答">
          <p className="pl-pivot-cap">三组问题</p>
          <p className="pl-pivot-main">
            <span>靠 标准</span>
            <b>+</b>
            <span>管理</span>
          </p>
          <p className="pl-pivot-foot">共同回答</p>
        </section>

        <section
          className={`pl-side pl-side-manage card${
            management ? " is-on" : " is-pending"
          }`}
          aria-hidden={!management}
          aria-label="条件二：管理"
        >
          <p className="pl-side-tag">条件二 · 管理</p>
          <ul className="pl-items">
            {MANAGEMENT_ITEMS.map((item, i) => (
              <li
                key={item}
                className="pl-item"
                style={{ "--pl-i": i } as CSSProperties}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="pl-exact">
            还包括数据产权、流通交易、收益分配、安全治理这些制度类别
          </p>
          <p className="pl-side-note">
            规则不一致时，先把能怎么用、不能怎么用讲清楚。
          </p>
        </section>
      </div>
    </div>
  );
}
