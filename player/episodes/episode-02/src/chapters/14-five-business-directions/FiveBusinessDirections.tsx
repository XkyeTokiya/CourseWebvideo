import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FiveBusinessDirections.css";

const stateByStep = [
  "common-base-shown",
  "production-collab-shown",
  "service-management-shown",
  "shared-conditions-settled",
] as const;

type State = (typeof stateByStep)[number];

const STATIONS = [0, 1, 2, 3] as const;

export default function FiveBusinessDirectionsChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const judged = idx >= 3;

  return (
    <div className="fv-scene scene-pad">
      <header className="fv-title">
        <span className="fv-title-mark" />
        <h1 className="fv-title-text">
          同一套数据闭环机制，可以服务<em>五种不同业务方向</em>
        </h1>
      </header>

      <div className="fv-main">
        <figure className="card fv-media">
          <div className="fv-canvas" aria-hidden="true">
            <div className="fv-line" />
            <div className="fv-stations">
              {STATIONS.map((i) => (
                <span key={i} className="fv-station" style={{ "--fv-s": i } as CSSProperties} />
              ))}
            </div>
          </div>
          <figcaption className="fv-cap">
            <span className="fv-cap-mark">image · 16:9</span>
            <span className="fv-cap-desc">柔性制造多业务落点 · M004（素材待提供）</span>
          </figcaption>
        </figure>

        <div className="fv-rail">
          {[
            {
              no: "01",
              name: "共同基础",
              desc: "完整数据闭环不是第五种业务，而是支持不同方向的共同机制。",
            },
            {
              no: "02",
              name: "生产与协同",
              desc: "智能化生产、网络化协同：生产得到更及时的理解和调整，不同环节围绕业务行动配合。",
            },
            {
              no: "03",
              name: "服务与经营",
              desc: "服务化延伸、个性化定制、数字化管理：产品服务延伸、面向需求组织、运营获得信息支持。",
            },
            {
              no: "04",
              name: "共同条件",
              desc: "数据跨环节流动，判断返回业务行动，新状态重新进入信息路径。",
            },
          ].map((r, i) => {
            const on = idx >= i;
            return (
              <article
                key={r.no}
                className={`fv-item${on ? " is-on" : " is-ghost"}`}
                style={{ "--fv-i": i } as CSSProperties}
              >
                <span className="fv-slot">summary · {r.no}</span>
                <div className="fv-item-body">
                  <span className="hero-num fv-item-no">{r.no}</span>
                  <div className="fv-item-text">
                    <span className="fv-item-name">{r.name}</span>
                    <p className="fv-item-desc">{r.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="fv-judgment" data-on={judged}>
        <span className="fv-judgment-slot">final judgment · 收束槽</span>
        <div className="fv-judgment-body">
          <span className="fv-judgment-mark" />
          <span className="fv-judgment-text">五种方向表现不同，闭环条件相同</span>
        </div>
      </aside>
    </div>
  );
}
