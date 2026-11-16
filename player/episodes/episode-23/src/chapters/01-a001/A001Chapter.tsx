import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001Chapter.css";
import m001 from "./assets/m001.png";

const stateByStep = ["clues-scattered", "question-dominant"] as const;

const CLUES = [
  { record: "设备记录", owner: "产线" },
  { record: "检验记录", owner: "质检" },
  { record: "订单信息", owner: "企业部门" },
  { record: "来源记录", owner: "上游供应商" },
] as const;

const RANGE_STEPS = ["产线", "工厂", "企业", "产业链", "跨行业"] as const;

const CONDITIONS = ["共同规则", "统一表达", "使用管理"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const questionOn = state === "question-dominant";

  return (
    <div className="op-scene scene-pad">
      <header className="op-head">
        <h1 className="op-headline">
          工业数据共享如何<em>跨越</em>产线、工厂与产业链
        </h1>
        <div className="op-head-rule" />
      </header>

      <div className="op-main">
        <figure className="op-anchor card">
          <img
            className="op-anchor-img"
            src={m001}
            alt="产线质量追查场景占位图（M001，原图待提供）"
          />
          <figcaption className="op-anchor-cap">
            <span className="op-anchor-cap-main">一批产品 · 质量追查场景</span>
            <span className="op-anchor-cap-state">M001 占位图 · 待提供</span>
          </figcaption>
        </figure>

        <section
          className={`op-clues${questionOn ? " is-weak" : ""}`}
          aria-label="四条记录线索与归属"
        >
          <ul className="op-clue-list">
            {CLUES.map((clue, i) => (
              <li
                key={clue.record}
                className="op-clue"
                style={{ "--op-i": i } as CSSProperties}
              >
                <span className="op-clue-dot" />
                <span className="op-clue-record">{clue.record}</span>
                <span className="op-clue-link" />
                <span className="op-clue-owner">{clue.owner}</span>
              </li>
            ))}
          </ul>
          <p className="op-note">
            数据都在，<em>却分属不同参与方</em>
          </p>
        </section>
      </div>

      <aside
        className={`op-question card${questionOn ? " is-on" : ""}`}
        aria-hidden={!questionOn}
      >
        <p className="op-q-main">
          数据都在，<span className="op-q-em">为什么不能直接拿来用？</span>
        </p>
        <ol className="op-q-chain">
          {RANGE_STEPS.map((range, i) => (
            <li
              key={range}
              className="op-q-range"
              style={{ "--op-r": i } as CSSProperties}
            >
              {range}
            </li>
          ))}
        </ol>
        <div className="op-q-cond">
          <span className="op-q-cond-cap">范围越大，</span>
          {CONDITIONS.map((cond, i) => (
            <span
              key={cond}
              className="op-q-chip"
              style={{ "--op-c": i } as CSSProperties}
            >
              {cond}
            </span>
          ))}
          <span className="op-q-tail">为什么也要跟着变化？</span>
        </div>
        <p className="op-q-cta">
          顺着这批产品的质量线索，往外看
          <span className="op-q-arrow" aria-hidden="true">
            →
          </span>
        </p>
      </aside>
    </div>
  );
}
