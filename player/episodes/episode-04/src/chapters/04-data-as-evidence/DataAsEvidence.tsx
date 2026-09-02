import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DataAsEvidence.css";

const states = ["sources-carded", "analysis-carded", "evidence-formed"] as const;

type DataAsEvidenceState = (typeof states)[number];

const SOURCES = [
  "设备日志",
  "性能指标",
  "质量结果",
  "生产计划",
  "库存",
  "供应链信息",
];

const LINKS = ["设备状态", "质量结果", "生产计划"];

export default function DataAsEvidence({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const card2On = state !== "sources-carded";
  const card3On = state === "evidence-formed";

  return (
    <div className="de-scene scene-pad">
      <h1 className="de-title">
        数据围绕业务问题，形成<em>连续证据</em>
      </h1>

      <div className="de-grid">
        <article className="de-card card" data-on="on">
          <span className="de-idx hero-num">01</span>
          <h2 className="de-card-title">六类信息，记录生产经营的变化</h2>
          <div className="de-body">
            <ul className="de-sources">
              {SOURCES.map((item, i) => (
                <li
                  key={item}
                  style={{ "--de-i": String(i) } as CSSProperties}
                >
                  <i aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="de-lead">
              价值不在数量多，在能不能<em>回答业务问题</em>
            </p>
          </div>
        </article>

        <article
          className="de-card card"
          data-on={card2On ? "on" : "waiting"}
        >
          <span className="de-idx hero-num">02</span>
          <h2 className="de-card-title">分析，把记录变成依据</h2>
          <div className="de-body">
            <div className="de-ana">
              <p className="de-ana-label">实时监控 · 历史分析，发现</p>
              <p className="de-finds">异常 · 瓶颈 · 库存变化</p>
              <span className="de-down" aria-hidden="true" />
              <p className="de-ana-label">为以下工作提供依据</p>
              <p className="de-bases">维护 · 质量改进 · 生产优化</p>
            </div>
          </div>
        </article>

        <article
          className="de-card card"
          data-on={card3On ? "on" : "waiting"}
        >
          <span className="de-idx hero-num">03</span>
          <h2 className="de-card-title">三条记录，围绕同一异常关联</h2>
          <div className="de-body">
            <div className="de-linkcol">
              {LINKS.map((item, i) => (
                <span
                  key={item}
                  className="de-linkrow"
                  style={{ "--de-i": String(i) } as CSSProperties}
                >
                  {item}
                </span>
              ))}
              <p className="de-node">同一生产异常</p>
              <p className="de-outcome">
                管理者看到的不再是三份孤立报表，而是：
                <br />
                异常在哪里 · 影响什么 · 可以调整什么
              </p>
              <p className="de-landing">从零散记录到连续证据</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
