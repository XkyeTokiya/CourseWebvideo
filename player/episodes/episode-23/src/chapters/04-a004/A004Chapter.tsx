import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004Chapter.css";

const stateByStep = ["tiers-ascending", "line-scope-focused"] as const;

const TIERS = ["产线内", "工厂内部", "企业层级", "产业链", "跨行业"] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const focus = state === "line-scope-focused";

  return (
    <div className="tf-scene scene-pad">
      <header className="tf-head">
        <h1 className="tf-headline">共享范围：五层阶梯</h1>
        <div className="tf-head-rule" />
      </header>

      <div className="tf-main">
        <div className="tf-bands">
          <p className="tf-index">
            五层：产线内、工厂内部、企业层级、产业链、跨行业
          </p>
          <ol className="tf-tiers" aria-label="共享范围五层">
          {TIERS.map((tier, i) => (
            <li
              key={tier}
              className={`tf-tier${focus && i === 0 ? " is-focus" : ""}${
                focus && i > 0 ? " is-dim" : ""
              }`}
              style={{ "--tf-i": i } as CSSProperties}
            >
              <span className="tf-tier-name">{tier}</span>
            </li>
          ))}
          </ol>
        </div>

        <div className="tf-rail">
          <section className="tf-note card is-on" aria-label="阶梯性质">
            <p className="tf-note-tag">关于这个阶梯</p>
            <p className="tf-note-main">
              观察范围的阶梯，<em>不是成熟度评分</em>
            </p>
            <p className="tf-note-sub">各层没有固定的系统清单或建设步骤。</p>
          </section>

          <section
            className={`tf-note tf-note-focus card${
              focus ? " is-on" : " is-pending"
            }`}
            aria-hidden={!focus}
            aria-label="产线内展开"
          >
            <p className="tf-note-tag">第一层 · 产线内</p>
            <p className="tf-note-main">
              范围最集中：相关记录<em>围绕一个问题</em>合起来用
            </p>
            <p className="tf-note-sub">
              几份记录来自同一段生产，说法也比较接近。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
