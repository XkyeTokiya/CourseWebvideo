import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SharedCarrier.css";
import m003 from "./assets/m003.png";

const states = ["legacy-side-read", "open-path-read"] as const;

type SharedCarrierState = (typeof states)[number];

const DIMENSIONS = ["新应用体系", "全互联互通", "统一数据湖", "智能新生产"];

export default function SharedCarrier({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const openRead = state === "open-path-read";

  return (
    <div className="sc-scene scene-pad" data-phase={state}>
      <h1 className="sc-title">
        从垂直孤岛，转向<em>共同承载</em>路径
      </h1>

      <div className="sc-main">
        <figure className="sc-media">
          <div className="sc-photo">
            <img src={m003} alt="M003 教材图 1-3 原图占位图" />
          </div>
        </figure>

        <div className="sc-reading">
          <section className="sc-block sc-block-legacy" style={{ "--sc-i": "0" } as CSSProperties}>
            <p className="sc-order-tag">先读 · 传统侧</p>
            <p className="sc-line-strong">
              按产业链、企业、工厂垂直分层，多套系统分别建设
            </p>
            <div className="sc-limits">
              <span>层级多</span>
              <span>数据孤岛</span>
              <span>垂直紧耦合</span>
              <span>知识分散</span>
            </div>
            <p className="sc-line">局部系统可以工作，跨层、跨环节的信息难以流动</p>
          </section>

          <section
            className={`sc-block sc-block-open${openRead ? " is-on" : ""}`}
            style={{ "--sc-i": "1" } as CSSProperties}
          >
            <p className="sc-order-tag sc-order-open">再读 · 新方向（参考性架构对照）</p>
            <p className="sc-line-strong">全互联开放方向，一条更容易互相连接的路径</p>
            <div className="sc-pathflow">
              {[
                "工业装备",
                "控制与感知",
                "边缘计算",
                "工业互联网平台",
                "工业软件与工业 APP",
              ].map((stage) => (
                <p key={stage} className="sc-pathstep">
                  {stage}
                </p>
              ))}
            </div>
          </section>
        </div>

        <aside className="sc-keys">
          <p className="sc-keys-lead">要点区 · 承载思路的四个维度</p>
          <ul className="sc-dims">
            {DIMENSIONS.map((d, i) => (
              <li
                key={d}
                className={openRead ? "is-on" : ""}
                style={{ "--sc-i": String(i) } as CSSProperties}
              >
                <i aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <footer className={`sc-takeaway${openRead ? " is-on" : ""}`}>
        <p className="sc-takeaway-line">
          重点不是记住固定方案——三项要素需要<em>共同承载</em>，才能减少孤岛，让判断进入业务
        </p>
      </footer>
    </div>
  );
}
