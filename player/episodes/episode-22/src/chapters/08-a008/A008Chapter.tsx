import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008Chapter.css";

const stateByStep = ["shared-terms-admitted", "scope-split", "capacity-bounded"] as const;

/** S046：两边都常出现的三项共有描述 */
const SHARED = ["字段名称", "字段类型", "字段说明"] as const;

/** S047：元数据管辖的四类范围 */
const META_SCOPE = ["业务域", "来源", "关系", "规则"] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const splitOn = step >= 1;
  const capacityOn = step >= 2;

  const rootCls = [
    "rng-scene",
    "scene-pad",
    splitOn && "is-split",
    capacityOn && "is-capacity",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="rng-head">
        <h1 className="rng-headline">
          元数据与数据字典：<em>范围不同</em>
        </h1>
        <div className="rng-head-rule rule" />
      </header>

      <div className="rng-grid">
        <section className="rng-side rng-side--meta">
          <div className="rng-side-head">
            <p className="rng-side-name">元数据</p>
            <span className="rng-side-tag">更广的数据领域</span>
          </div>

          <ul className="rng-fields">
            {META_SCOPE.map((name, index) => (
              <li
                key={name}
                className="rng-field"
                style={{ "--rng-i": index } as CSSProperties}
              >
                {name}
              </li>
            ))}
          </ul>

          <p className="rng-side-note">归它管</p>
        </section>

        <section className="rng-pivot">
          <p className="rng-pivot-kicker">最容易混在一起</p>
          <p className="rng-pivot-hero">
            两边都常常出现
            <br />
            <em>同样的字段描述</em>
          </p>

          <ul className="rng-shared">
            {SHARED.map((name, index) => (
              <li
                key={name}
                className="rng-shared-item"
                style={{ "--rng-s": index } as CSSProperties}
              >
                {name}
              </li>
            ))}
          </ul>

          <div className="rng-branches" aria-hidden="true">
            <span className="rng-branch rng-branch--left" />
            <span className="rng-branch rng-branch--right" />
          </div>
        </section>

        <section className="rng-side rng-side--dict">
          <div className="rng-side-head">
            <p className="rng-side-name">数据字典</p>
            <span className="rng-side-tag">只看数据库这一块</span>
          </div>

          <div className="rng-dict-layer">
            <p className="rng-dict-kicker">看的是</p>
            <ul className="rng-dict-rows">
              <li className="rng-dict-row">数据库的结构</li>
              <li className="rng-dict-row">数据库的数据元素</li>
            </ul>
          </div>

          <div className="rng-capacity">
            <p className="rng-capacity-kicker">承载边界</p>
            <p className="rng-capacity-hero">
              可以承载<em>一部分</em>具体的描述
            </p>
            <p className="rng-capacity-note">
              但一张字段表
              <br />
              装不下全部的元数据
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
