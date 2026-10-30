import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DecisionLedger.css";

const states = ["object-row-set", "risk-row-set", "candidate-row-set", "reason-traceable"] as const;

const LEDGER_ROWS = [
  {
    no: "01",
    name: "描述对象",
    tag: "OBJECT",
    tone: "process",
    points: ["材质", "形状", "尺寸", "可接近位置"],
    reason: "对象允许什么",
  },
  {
    no: "02",
    name: "工艺与污染风险",
    tag: "RISK",
    tone: "warning",
    points: ["从制作到使用会经历什么"],
    reason: "风险来自哪里",
  },
  {
    no: "03",
    name: "确定候选",
    tag: "CANDIDATES",
    tone: "process",
    points: ["载体", "打印方式", "识读设备"],
    reason: "组合是否互相牵连成立",
  },
  {
    no: "04",
    name: "收尾检查",
    tag: "FINAL CHECK",
    tone: "structural",
    points: ["工艺前 · 识读一次", "工艺后 · 识读一次"],
    reason: "读不读得出，验证说了算",
  },
] as const;

function ReasonUnderline() {
  return (
    <svg viewBox="0 0 260 12" className="dl-reason-line" aria-hidden>
      <path d="M3 8 C 36 3 66 10 102 6 S 176 9 212 5 S 248 8 257 6" pathLength={100} />
    </svg>
  );
}

function ReasonCheck() {
  return (
    <span className="dl-reason-check" aria-hidden>
      <svg viewBox="0 0 24 24">
        <path d="M5.5 12.5 L10 17 L18.5 7.5" pathLength={100} />
      </svg>
    </span>
  );
}

export default function DecisionLedger({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const traceable = state === "reason-traceable";
  const setCount = states.indexOf(state) + 1;

  return (
    <div className={`dl-scene scene-pad${traceable ? " is-traceable" : ""}`}>
      <header className="dl-head">
        <div className="dl-head-main">
          <p className="dl-head-kicker">决策台账 · 现场照着走</p>
          <h1 className="dl-head-title">
            现场决策顺序<em>与</em>可回查理由
          </h1>
        </div>
        <p className="dl-head-side">
          <span className="dl-head-count hero-num">4</span>
          行决策 · 每行留一条理由
        </p>
      </header>

      <div className="dl-ledger">
        <div className="dl-cols" aria-hidden>
          <span>顺序</span>
          <span>决策</span>
          <span>要点</span>
          <span className="dl-cols-reason">可回查理由</span>
        </div>

        <ol className="dl-rows">
          {LEDGER_ROWS.map((row, i) => {
            const isSet = i < setCount;
            return (
              <li
                key={row.no}
                className={`dl-row card${isSet ? " is-set" : ""}`}
                data-tone={row.tone}
                style={{ "--dl-i": String(i) } as CSSProperties}
              >
                <span className="dl-row-no hero-num">{row.no}</span>
                <div className="dl-row-name">
                  <span className="dl-row-name-cn">{row.name}</span>
                  <span className="dl-row-name-tag">{row.tag}</span>
                </div>
                <div className="dl-row-points">
                  {row.points.map((p, j) => (
                    <span
                      key={p}
                      className="dl-chip"
                      style={{ "--dl-j": String(j) } as CSSProperties}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="dl-row-reason">
                  <span className="dl-reason-text">{row.reason}</span>
                  <ReasonUnderline />
                  <ReasonCheck />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="dl-close">
        <p className="dl-close-ghost">判断收束 · 待最后一步就位</p>
        <div className="dl-close-plate card-glass">
          <p className="dl-close-kicker">判断收束</p>
          <p className="dl-close-text">
            每一步留下<em>能回查的理由</em>
            <span>—— 换了材料或工艺，可定位要调整的那一项</span>
          </p>
        </div>
      </div>
    </div>
  );
}
