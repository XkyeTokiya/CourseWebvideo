import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DataIntoAction.css";

const states = [
  "data-chain-named",
  "judgment-examples-filled",
  "action-value-landed",
] as const;

type DataIntoActionState = (typeof states)[number];

const JUDGMENT_EXAMPLES = [
  { signal: "异常信息", action: "帮助维护人员判断问题" },
  { signal: "质量变化", action: "提醒生产环节检查过程" },
  { signal: "订单变化", action: "为计划调整提供依据" },
];

export default function DataIntoAction({ step }: ChapterStepProps) {
  const state: DataIntoActionState = states[step] ?? states[states.length - 1];
  const examplesOn = state !== "data-chain-named";
  const actionOn = state === "action-value-landed";

  return (
    <div className="da-scene scene-pad">
      <h1 className="da-thesis">
        数据的价值体现在<em>下一步运行调整</em>
      </h1>

      <div className="da-track">
        <section className="da-step" data-on="on" style={{ "--da-i": "0" } as CSSProperties}>
          <div className="da-step-body">
            <span className="da-step-index hero-num">1</span>
            <p className="da-step-kicker">汇聚信息</p>
            <div className="da-step-main">
              <div className="da-info-chips">
                <span>状态</span>
                <span>质量</span>
                <span>能耗</span>
                <span>业务信息</span>
              </div>
            </div>
            <p className="da-step-foot">进入同一问题语境</p>
          </div>
        </section>

        <span className="da-arrow hero-num" aria-hidden="true">
          →
        </span>

        <section className="da-step" data-on="on" style={{ "--da-i": "1" } as CSSProperties}>
          <div className="da-step-body">
            <span className="da-step-index hero-num">2</span>
            <p className="da-step-kicker">分析判断</p>
            <div className="da-step-main">
              <div
                className={`da-examples${examplesOn ? " is-on" : ""}`}
                aria-hidden={!examplesOn}
              >
                {JUDGMENT_EXAMPLES.map((ex, i) => (
                  <p
                    key={ex.signal}
                    className="da-example"
                    style={{ "--da-j": String(i) } as CSSProperties}
                  >
                    <b>{ex.signal}</b>
                    <span className="da-example-arrow hero-num" aria-hidden="true">
                      →
                    </span>
                    {ex.action}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <span className="da-arrow hero-num" aria-hidden="true">
          →
        </span>

        <section
          className={`da-step da-step--last${actionOn ? " is-landed" : ""}`}
          data-on="on"
          style={{ "--da-i": "2" } as CSSProperties}
        >
          <div className="da-step-body">
            <span className="da-step-index hero-num">3</span>
            <p className="da-step-kicker">采取行动</p>
            <div className="da-step-main">
              <div className={`da-action${actionOn ? " is-on" : ""}`} aria-hidden={!actionOn}>
                <p className="da-action-text">
                  判断进入下一步运行调整
                </p>
                <p className="da-action-note">
                  而不只是<em>被保存</em>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
