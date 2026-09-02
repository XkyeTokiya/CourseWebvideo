import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./BrokenChainCases.css";

const states = ["broken-cases-listed", "chain-confirmed"] as const;

type BrokenChainCasesState = (typeof states)[number];

const FULL_CHAIN = [
  { name: "连接", role: "提供来源" },
  { name: "数据", role: "形成依据" },
  { name: "智能", role: "支持判断" },
  { name: "行动", role: "落到业务变化" },
];

export default function BrokenChainCases({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const confirmed = state === "chain-confirmed";

  return (
    <div className="bc-scene scene-pad" data-phase={state}>
      <header className="bc-head">
        <p className="bc-kicker">反过来看 · 三项要素的依赖关系就清楚了</p>
        <h1 className="bc-title">
          三项要素必须<em>接续</em>，断开就只剩通道、堆积或演示
        </h1>
      </header>

      <div className="bc-split">
        <div className="bc-left">
          <div className="bc-case" style={{ "--case-i": "0" } as CSSProperties}>
            <p className="bc-cond">只有连接</p>
            <div className="bc-chain">
              <span className="bc-node">连接</span>
              <span className="bc-wire bc-wire-broken">
                <span className="bc-x" aria-hidden="true" />
              </span>
              <span className="bc-outcome">通道</span>
            </div>
          </div>

          <div className="bc-case" style={{ "--case-i": "1" } as CSSProperties}>
            <p className="bc-cond">有连接和数据，没有分析判断</p>
            <div className="bc-chain">
              <span className="bc-node">连接</span>
              <span className="bc-wire" />
              <span className="bc-node">数据</span>
              <span className="bc-wire bc-wire-broken">
                <span className="bc-x" aria-hidden="true" />
              </span>
              <span className="bc-outcome">堆积</span>
            </div>
          </div>

          <div className="bc-case" style={{ "--case-i": "2" } as CSSProperties}>
            <p className="bc-cond">有智能，缺稳定数据和业务行动</p>
            <div className="bc-chain">
              <span className="bc-node">智能</span>
              <span className="bc-wire bc-wire-broken">
                <span className="bc-x" aria-hidden="true" />
              </span>
              <span className="bc-outcome">演示</span>
            </div>
          </div>
        </div>

        <span className="bc-divider" aria-hidden="true" />

        <div className="bc-right card" data-on={confirmed ? "on" : "waiting"}>
          <div className="bc-right-body">
            <div className="bc-fullchain">
              {FULL_CHAIN.map((s, i) => (
                <p
                  key={s.name}
                  className="bc-fs"
                  style={{ "--bc-i": String(i) } as CSSProperties}
                >
                  <b>{s.name}</b>
                  {s.role}
                </p>
              ))}
            </div>
            <p className="bc-pivot">它们不是三个互不相干的标签</p>
          </div>
        </div>
      </div>
    </div>
  );
}
