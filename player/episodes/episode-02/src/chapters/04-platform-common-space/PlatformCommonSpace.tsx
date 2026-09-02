import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./PlatformCommonSpace.css";

const stateByStep = [
  "common-space-established",
  "organizing-shown",
  "collaboration-shown",
] as const;

type State = (typeof stateByStep)[number];

const RAIL = [
  {
    no: "1",
    name: "先汇聚",
    desc: "把制造资源与分散能力承接到共同环境。",
  },
  {
    no: "2",
    name: "再组织",
    desc: "为数据处理和数字模型提供可共同使用的支撑。",
  },
  {
    no: "3",
    name: "可协同",
    desc: "应用服务与业务协同不再各自保存、各自处理。",
  },
] as const;

const BLOCKS = [0, 1, 2, 3] as const;

export default function PlatformCommonSpaceChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);

  return (
    <div className="pc-scene scene-pad">
      <header className="pc-title">
        <span className="pc-title-mark" />
        <h1 className="pc-title-text">
          平台不是数据仓库，而是组织制造资源与能力的<em>共同空间</em>
        </h1>
      </header>

      <div className="pc-main">
        <figure className="card pc-media">
          <div className="pc-canvas" aria-hidden="true">
            <div className="pc-zone">
              <span className="pc-zone-label">共同空间</span>
              {BLOCKS.map((i) => (
                <span key={i} className="pc-block" style={{ "--pc-i": i } as CSSProperties} />
              ))}
            </div>
          </div>
          <figcaption className="pc-cap">
            <span className="pc-cap-mark">image · 16:9</span>
            <span className="pc-cap-desc">统一生产运营环境 · M002（素材待提供）</span>
          </figcaption>
        </figure>

        <div className="pc-rail">
          {RAIL.map((r, i) => {
            const on = idx >= i;
            return (
              <article
                key={r.no}
                className={`pc-item${on ? " is-on" : " is-ghost"}`}
                style={{ "--pc-i": i } as CSSProperties}
              >
                <span className="pc-slot">阅读项 · {r.no}</span>
                <div className="pc-item-body">
                  <span className="hero-num pc-badge">{r.no}</span>
                  <div className="pc-item-text">
                    <span className="pc-item-name">{r.name}</span>
                    <p className="pc-item-desc">{r.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
