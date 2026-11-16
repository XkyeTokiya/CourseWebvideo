import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003Chapter.css";

const stateByStep = [
  "reuse-expanded",
  "benefits-and-foundation",
  "gains-not-automatic",
] as const;

const BENEFITS = ["打破信息孤岛", "优化数据资源利用", "拓宽分析范围"] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const midOn = state !== "reuse-expanded";
  const rightOn = state === "gains-not-automatic";

  return (
    <div className="gf-scene scene-pad">
      <header className="gf-head">
        <h1 className="gf-headline">共享图什么</h1>
        <div className="gf-head-rule" />
      </header>

      <div className="gf-grid">
        <section className="gf-card" aria-label="复用方向">
          <p className="gf-card-cap">复用方向</p>
          <div className="gf-reuse" aria-hidden="true">
            <span className="gf-doc">
              <i />
              <i />
              <i />
            </span>
            <svg className="gf-links" viewBox="0 0 150 220">
              <path d="M4 110 C 70 110 78 13 140 13" />
              <path d="M4 110 C 70 110 78 110 140 110" />
              <path d="M4 110 C 70 110 78 207 140 207" />
            </svg>
            <span className="gf-sinks">
              <i />
              <i />
              <i />
            </span>
          </div>
          <p className="gf-lead">已有的数据，用得更充分</p>
          <ul className="gf-points">
            <li>同一份记录，多个环节一起用</li>
            <li>减少重复收集与采集，精力转向新应用开发和系统集成</li>
          </ul>
        </section>

        <section
          className={`gf-card${midOn ? " is-on" : " is-pending"}`}
          aria-hidden={!midOn}
          aria-label="机制意义"
        >
          <p className="gf-card-cap">机制意义</p>
          <ul className="gf-benefits">
            {BENEFITS.map((b, i) => (
              <li key={b} style={{ "--gf-i": i } as CSSProperties}>
                <svg viewBox="0 0 30 30" aria-hidden="true">
                  <path d="M5 16 L12 23 L25 7" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="gf-found">发挥工业数据价值的基础</p>
        </section>

        <section
          className={`gf-card gf-card-line${rightOn ? " is-on" : " is-pending"}`}
          aria-hidden={!rightOn}
          aria-label="方向边界"
        >
          <p className="gf-card-cap">方向边界</p>
          <div className="gf-channel" aria-hidden="true">
            <span className="gf-ch-node" />
            <span className="gf-ch-wire" />
            <span className="gf-ch-node" />
          </div>
          <p className="gf-channel-cap">通道只负责把路接通</p>
          <p className="gf-auto">
            <span className="gf-neq">≠</span>
            不会自动带来<em>效率</em>、<em>质量</em>或<em>创新</em>的提升
          </p>
          <div className="gf-depends">
            <span className="gf-dep-cap">结果还要看</span>
            <span className="gf-dep-chip">规则</span>
            <span className="gf-dep-chip">使用方式</span>
          </div>
        </section>
      </div>
    </div>
  );
}
