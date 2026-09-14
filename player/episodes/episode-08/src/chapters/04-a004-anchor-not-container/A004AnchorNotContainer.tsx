import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004AnchorNotContainer.css";

const states = ["same-object-pointed", "query-from-one"] as const;

type AnState = (typeof states)[number];

const POINTS = ["现场设备", "设计型号", "制造记录", "服务档案"];

export default function A004AnchorNotContainer({ step }: ChapterStepProps) {
  const state: AnState = states[step] ?? states[states.length - 1];
  const queryOn = state === "query-from-one";

  return (
    <div className={`an-scene scene-pad${queryOn ? " is-query" : ""}`}>
      <header className="an-head">
        <h1 className="an-title">
          标识是<b>身份锚点</b>
        </h1>
        <p className="an-sub">它并不是一个装满资料的容器</p>
      </header>

      <div className="an-main">
        <aside className="an-rail">
          <article className={`an-insight card${queryOn ? " is-dim" : ""}`}>
            <span className="an-insight-no hero-num">01</span>
            <div className="an-insight-body">
              <ul className="an-points">
                {POINTS.map((item, i) => (
                  <li
                    key={item}
                    style={{ "--an-i": String(i) } as CSSProperties}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="an-points-verdict">指向<b>同一个对象</b></p>
            </div>
          </article>

          <article className={`an-insight card an-insight-query${queryOn ? " is-on" : ""}`}>
            <span className="an-insight-no hero-num">02</span>
            <div className="an-insight-body">
              <p className="an-query-lead">
                查询从<b>“这一台泵”</b>出发
              </p>
              <p className="an-query-note">
                不必在大量相似记录里<b>靠人工比对</b>
              </p>
            </div>
          </article>
        </aside>

        <figure className="an-media">
          <div className="an-frame">
            <div className="an-placeholder">
              <span className="label-mono">image · 16:9</span>
              <span className="an-ph-desc">
                M002 设备本体与标识区域特写（待生成）
              </span>
              <span className="an-ph-note">photorealistic_ai · 不含编码与界面</span>
            </div>
            <div className="an-tag-zone" aria-hidden="true">
              <i />
              <b>设备标识区域</b>
            </div>
          </div>
          <figcaption className="an-cap">
            <span>M002 · 设备与标识（placeholder）</span>
            <span>标识区域可见 · 不含数据</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
