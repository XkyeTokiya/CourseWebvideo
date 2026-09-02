import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./OpenLoopLine.css";

const stateByStep = [
  "line-streaming",
  "manual-relay-shown",
  "path-gap-marked",
  "gap-takeaway-closed",
] as const;

type State = (typeof stateByStep)[number];

const CARDS = [
  {
    no: "01",
    name: "已经联网",
    desc: "产线设备持续上传运行状态，信息能够离开现场。",
  },
  {
    no: "02",
    name: "仍靠人工接力",
    desc: "异常由现场人员发现，再通过电话和不同人员、系统分头处置。",
  },
  {
    no: "03",
    name: "缺少返回路径",
    desc: "状态持续上行，却没有形成及时作用于生产现场的行动。",
  },
] as const;

const PINGS = [0, 1, 2, 3, 4] as const;

export default function OpenLoopLineChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const gapOn = idx >= 2;
  const closed = idx >= 3;

  return (
    <div className={`ol-scene scene-pad${closed ? " is-closed" : ""}`}>
      <div className="ol-main">
        <figure className="card ol-media">
          <div className="ol-canvas" aria-hidden="true">
            <div className="ol-pings">
              {PINGS.map((i) => (
                <span key={i} className="ol-ping" style={{ "--ol-i": i } as CSSProperties} />
              ))}
            </div>
            <div className="ol-edge">
              <span className="ol-edge-label">现场边界</span>
            </div>
            <div className="ol-rack">
              <span className="ol-machine" />
              <span className="ol-machine" />
              <span className="ol-machine" />
            </div>
          </div>
          <figcaption className="ol-cap">
            <span className="ol-cap-mark">image · 16:9</span>
            <span className="ol-cap-desc">已联网产线 · M001（素材待提供）</span>
          </figcaption>
          <div className="ol-mask" data-on={closed}>
            <span className="ol-mask-kicker">本页收束</span>
            <p className="ol-mask-text">
              传出信息，<strong>不等于形成闭环</strong>
            </p>
          </div>
        </figure>

        <div className="ol-cards">
          {CARDS.map((c, i) => {
            const on = idx >= i;
            return (
              <article
                key={c.no}
                className={`card ol-card${on ? " is-on" : " is-ghost"}`}
                style={{ "--ol-i": i } as CSSProperties}
              >
                <span className="ol-slot">观察卡 · {c.no}</span>
                <div className="ol-card-body">
                  <header className="ol-card-head">
                    <span className="hero-num ol-card-no">{c.no}</span>
                    <span className="ol-card-name">{c.name}</span>
                    {i === 0 && (
                      <span className="ol-flag ol-flag-up" data-on={gapOn}>
                        状态已上行
                      </span>
                    )}
                    {i === 2 && <span className="ol-flag ol-flag-gap">行动未返回</span>}
                  </header>
                  <p className="ol-card-desc">{c.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
