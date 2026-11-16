import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A011Chapter.css";

const stateByStep = [
  "clues-replayed",
  "conditions-paired",
  "core-judgment-set",
] as const;

const RECORDS = [
  { record: "设备记录", owner: "产线" },
  { record: "检验记录", owner: "质检" },
  { record: "订单信息", owner: "企业部门" },
  { record: "来源记录", owner: "上游供应商" },
] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const paired = state !== "clues-replayed";
  const settled = state === "core-judgment-set";

  return (
    <div className="sm-scene scene-pad">
      <header className="sm-head">
        <h1 className="sm-headline">本期总结：理解流通与按约使用</h1>
        <div className="sm-head-rule" />
      </header>

      <div className="sm-main">
        <section className="sm-recall" aria-label="记录回扣">
          <ul className="sm-records">
            {RECORDS.map((r, i) => (
              <li
                key={r.record}
                className="sm-record card"
                style={{ "--sm-i": i } as CSSProperties}
              >
                <span className="sm-record-name">{r.record}</span>
                <span className="sm-record-owner">{r.owner}</span>
              </li>
            ))}
          </ul>
          <div className="sm-merge">
            <svg
              className="sm-merge-lines"
              viewBox="0 0 1700 84"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M212 0 C 212 56 660 36 850 74" />
              <path d="M637 0 C 637 56 760 40 850 74" />
              <path d="M1062 0 C 1062 56 940 40 850 74" />
              <path d="M1487 0 C 1487 56 1040 36 850 74" />
            </svg>
            <p className="sm-merge-label">围绕同一批产品 · 不同记录</p>
          </div>
        </section>

        <section
          className={`sm-cond card${paired ? " is-on" : " is-pending"}`}
          aria-hidden={!paired}
          aria-label="两条件"
        >
          <p className="sm-cond-line">
            <span className="sm-cond-chip">共同表达与交换标准</span>
            <span className="sm-cond-text">
              帮助参与方理解数据、完成交换
            </span>
          </p>
          <p className="sm-cond-line">
            <span className="sm-cond-chip sm-cond-chip-navy">
              授权、协议、权属和安全治理
            </span>
            <span className="sm-cond-text">守住使用边界</span>
          </p>
        </section>

        <aside
          className={`sm-judgment card${settled ? " is-on" : ""}`}
          aria-hidden={!settled}
        >
          <p className="sm-j-main">
            共享不是把所有数据搬到一起，而是让合适的主体在约定条件下理解并使用合适的数据
          </p>
          <p className="sm-j-close">能传输是起点，按约使用才是共同利用的条件。</p>
        </aside>
      </div>
    </div>
  );
}
