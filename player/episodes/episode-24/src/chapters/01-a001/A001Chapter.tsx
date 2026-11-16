import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001Chapter.css";
import m001 from "./assets/m001.png";

const states = [
  "premise-recalled",
  "records-scattered",
  "mismatch-exposed",
  "identity-question",
] as const;

const SYSTEMS = [
  { id: "production", name: "生产系统", record: "加工时间", cells: 3 },
  { id: "quality", name: "质量系统", record: "检测结果", cells: 2 },
  { id: "supply", name: "供应链系统", record: "零部件批次", cells: 4 },
] as const;

/* 抽象字符块：代表“这套系统里的名称 / 编号”，不写真实字段与数值 */
function CodeCells({ n }: { n: number }) {
  return (
    <span className="a1-cells" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className="a1-cell">
          <b />
          <b />
        </i>
      ))}
    </span>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const recordsOn = step >= 1;
  const mismatchOn = step >= 2;
  const questionOn = step >= 3;

  return (
    <div
      className={`a1-scene scene-pad${recordsOn ? " is-records" : ""}${
        mismatchOn ? " is-mismatch" : ""
      }${questionOn ? " is-question" : ""}`}
      data-state={state}
    >
      <header className="a1-head">
        <p className="a1-kicker">同一台设备 · 三套记录</p>
        <h1 className="a1-title">
          数据要素为什么需要<em>标识体系</em>
        </h1>
      </header>

      <section className="a1-premise" aria-label="共享的前提">
        <p className="a1-premise-tag">共享的前提</p>
        <p className="a1-premise-text">
          跨系统、跨环节利用，在<strong>规则或协议</strong>下共享，不同参与方共同利用数据
        </p>
        <div className="a1-range" aria-hidden="true">
          <span className="a1-range-cap">范围</span>
          <span className="a1-range-node">一条产线</span>
          <span className="a1-range-line">
            <i className="a1-range-dot" />
          </span>
          <span className="a1-range-node">产业链</span>
        </div>
      </section>

      <div className="a1-main">
        <figure className="a1-media">
          <div className="a1-photo-wrap">
            <p className={`a1-ghost a1-media-ghost${recordsOn ? " is-off" : ""}`} aria-hidden="true">
              现场语境图 · 待落位
            </p>
            <div className="a1-photo card">
              <img src={m001} alt="设备与多系统记录核对现场（占位图，原图待提供）" />
              <span className="a1-photo-tag">现场图 · 原图待提供</span>
            </div>
          </div>
          <figcaption className="a1-device">
            <span className="a1-device-name">同一台设备</span>
            <span className="a1-device-sub">三套系统 · 各留记录</span>
          </figcaption>
        </figure>

        <div className="a1-records">
          <p className={`a1-ghost a1-records-ghost${recordsOn ? " is-off" : ""}`} aria-hidden="true">
            同一台设备的三套记录 · 待落位
          </p>

          <div className="a1-compare">
            {SYSTEMS.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 && (
                  <span
                    className="a1-neq"
                    style={{ "--a1-i": String(i) } as CSSProperties}
                    aria-hidden="true"
                  >
                    ≠
                  </span>
                )}
                <article
                  className="a1-card card"
                  style={{ "--a1-i": String(i) } as CSSProperties}
                >
                  <span className="a1-sys">{s.name}</span>
                  <span className="a1-rec">{s.record}</span>
                  <div className="a1-token-row" aria-hidden={!mismatchOn}>
                    <div>
                      <span className="rule a1-token-rule" />
                      <CodeCells n={s.cells} />
                      <span className="a1-token-cap">名称 · 编号</span>
                    </div>
                  </div>
                </article>
              </Fragment>
            ))}
          </div>

          <p className="a1-caption">
            各系统的名称和编号<em className="a1-bad">对不上</em>，把这些记录关联起来就更困难
          </p>
        </div>
      </div>

      <footer className="a1-footer">
        <p className="a1-ghost a1-q-ghost" aria-hidden="true">
          问题收束 · 待落位
        </p>
        <div className="a1-q-plate card">
          <p className="a1-q-lead">
            数据已经采集，为什么还不能自然成为可以跨系统、跨企业利用的数据要素？
          </p>
          <p className="a1-q-line">
            中间缺的，到底是<span className="a1-slot">哪一层</span>？
          </p>
        </div>
      </footer>
    </div>
  );
}
