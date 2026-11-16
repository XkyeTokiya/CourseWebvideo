import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003Chapter.css";

const states = [
  "release-framed",
  "features-lined",
  "multiplier-expanded",
  "direction-bounded",
] as const;

const RAIL = ["收集", "处理", "分析", "应用"] as const;

const ROW_1 = [
  { t: "稀缺性", k: "f", i: 0 },
  { t: "、", k: "c", i: 1 },
  { t: "价值性", k: "f", i: 2 },
  { t: "、", k: "c", i: 3 },
  { t: "流动性", k: "f", i: 4 },
] as const;

const ROW_2 = [
  { t: "基础性", k: "f", i: 5 },
  { t: "、", k: "c", i: 6 },
  { t: "通用性", k: "f", i: 7 },
  { t: "、", k: "c", i: 8 },
  { t: "乘数效应", k: "f", i: 9, mult: true },
  { t: "、", k: "c", i: 10 },
  { t: "价值释放", k: "f", i: 11 },
] as const;

function FeatureRow({
  tokens,
  multOn,
}: {
  tokens: readonly { t: string; k: string; i: number; mult?: boolean }[];
  multOn: boolean;
}) {
  return (
    <p className="a3-feat-row">
      {tokens.map((tok) => (
        <span
          key={tok.i}
          className={`${tok.k === "c" ? "a3-comma" : "a3-tok"}${
            tok.mult ? ` a3-mult${multOn ? " is-on" : ""}` : ""
          }`}
          style={{ "--a3-i": String(tok.i) } as CSSProperties}
        >
          {tok.t}
        </span>
      ))}
    </p>
  );
}

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const featuresOn = step >= 1;
  const multOn = step >= 2;
  const takeOn = step >= 3;

  return (
    <div
      className={`a3-scene scene-pad${featuresOn ? " is-features" : ""}${
        multOn ? " is-mult" : ""
      }${takeOn ? " is-take" : ""}`}
      data-state={state}
    >
      <header className="a3-head">
        <p className="a3-kicker">数据要素 · 价值与特性</p>
        <h1 className="a3-title">
          价值在<em>过程</em>中释放
        </h1>
      </header>

      <section className="a3-release">
        <div className="a3-rail" aria-label="价值释放过程">
          {RAIL.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && (
                <span
                  className="a3-seg"
                  style={{ "--a3-i": String(i) } as CSSProperties}
                  aria-hidden="true"
                />
              )}
              <span
                className="a3-node"
                style={{ "--a3-i": String(i) } as CSSProperties}
              >
                {n}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="a3-cond">
          <span className="a3-cond-tag">条件</span>
          <p className="a3-cond-text">
            在合适的业务关系中被<strong>找到、组合、复用</strong>
          </p>
          <span className="a3-cond-not">而不是</span>
          <span className="a3-iso">留在孤立记录里</span>
        </div>
      </section>

      <section className="a3-features">
        <p
          className={`a3-ghost a3-feat-ghost${featuresOn ? " is-off" : ""}`}
          aria-hidden="true"
        >
          七项特性 · 待落位
        </p>

        <div className="a3-feat-band card">
          <FeatureRow tokens={ROW_1} multOn={multOn} />
          <FeatureRow tokens={ROW_2} multOn={multOn} />
        </div>

        <div className="a3-mult-slot" aria-hidden={!multOn}>
          <div className="a3-mult-clip">
            <div className="a3-mult-note">
              <p className="a3-mult-cap">乘数效应 · 说明</p>
              <p className="a3-mult-text">
                一份数据可以在不同用途里反复组合，带出新的价值
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="a3-footer">
        <p className="a3-ghost a3-take-ghost" aria-hidden="true">
          方向判断 · 待落位
        </p>
        <div className="a3-take-plate card">
          <p className="a3-take-lead">这些特性概括的是</p>
          <p className="a3-take-line">
            价值释放的<em>方向</em>
            <span className="a3-take-sep">——</span>不是
            <s className="a3-strike">估值或交易收益的计算公式</s>
          </p>
        </div>
      </footer>
    </div>
  );
}
