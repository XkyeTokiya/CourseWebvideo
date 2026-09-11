import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006TrackableHistory.css";

const states = [
  "collection-banded",
  "history-layered",
  "guessing-replaced-by-tracking",
  "anchor-boundary-set",
] as const;

type A006State = (typeof states)[number];

const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function A006TrackableHistory({ step }: ChapterStepProps) {
  const state: A006State = states[step] ?? states[states.length - 1];
  const order = states.indexOf(state);
  const historyOn = order >= 1;
  const noteOn = order >= 2;
  const boundaryOn = order >= 3;

  return (
    <div className="th-scene scene-pad">
      <h1 className="th-title">模具履历变得可追踪</h1>

      <div className="th-main">
        <section className="th-bands" aria-label="从采集到履历的层带">
          <p className="th-lead">模具的使用情况，怎么被记下来？</p>

          <article className="th-band th-band-collect">
            <div className="th-band-idx">
              <span className="th-band-no hero-num">01</span>
              <span className="th-band-name">采集</span>
            </div>
            <div className="th-band-body">
              <div className="th-band-head">
                <p className="th-band-title">
                  传感器<em>采集</em>加工次数，同时监测<em>位置</em>
                </p>
                <span className="th-pos">
                  <i className="th-pos-dot" aria-hidden="true" />
                  位置 · 同时监测
                </span>
              </div>
              <div className="th-tally">
                {TICKS.map((i) => (
                  <i
                    key={i}
                    className="th-tick"
                    style={{ "--th-i": String(i) } as CSSProperties}
                    aria-hidden="true"
                  />
                ))}
                <span className="th-tally-note">加工次数 · 逐次累计</span>
              </div>
            </div>
          </article>

          <article className={`th-band th-band-history${historyOn ? " is-on" : ""}`}>
            <div className="th-band-idx">
              <span className="th-band-no hero-num">02</span>
              <span className="th-band-name">履历</span>
            </div>
            <div className="th-band-body">
              <p className="th-band-title">形成这副外发模具的</p>
              <div className="th-chips">
                {["履历", "模次", "单日生产信息"].map((chip, i) => (
                  <span
                    key={chip}
                    className="th-chip"
                    style={{ "--th-i": String(i) } as CSSProperties}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <aside className="th-notes">
          <p className="th-notes-lead">侧注 · 过去与现在</p>
          <article className={`th-note${noteOn ? " is-on" : ""}`}>
            <div className="th-note-row th-note-past">
              <span className="th-note-tag">过去</span>
              <p className="th-note-text">违规外放、私自调拨，只能事后猜测</p>
            </div>
            <i className="th-note-swap" aria-hidden="true" />
            <div className="th-note-row th-note-now">
              <span className="th-note-tag">现在</span>
              <p className="th-note-text">都变成了能被追踪的记录</p>
            </div>
          </article>
        </aside>
      </div>

      <div className={`th-boundary${boundaryOn ? " is-on" : ""}`} aria-hidden={!boundaryOn}>
        <div className="th-anchor-demo">
          <span className="th-node">统一标识</span>
          <span className="th-tie-wrap" aria-hidden="true">
            <i className="th-tie" />
            <b className="th-tie-label">锚定</b>
          </span>
          <span className="th-node">模具对象</span>
        </div>
        <i className="th-boundary-rule" aria-hidden="true" />
        <div className="th-boundary-neg">
          <span className="th-neq hero-num">≠</span>
          <p className="th-neg-text">把全部生产数据都装进去的一段编码</p>
        </div>
      </div>
    </div>
  );
}
