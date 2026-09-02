import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./JudgmentToAction.css";
import m002 from "./assets/m002.png";

const states = ["judgment-rail-set", "action-loop-closed"] as const;

type JudgmentToActionState = (typeof states)[number];

export default function JudgmentToAction({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const loopClosed = state === "action-loop-closed";

  return (
    <div className="jt-scene scene-pad">
      <h1 className="jt-title">
        智能把相关数据带入判断，行动才让<em>价值</em>出现
      </h1>

      <div className="jt-main">
        <figure className="jt-media">
          <div className="jt-photo">
            <img src={m002} alt="M002 无品牌生产现场占位图" />
          </div>
          <figcaption className="jt-cap">
            <span>判断与行动，落回这片现场</span>
          </figcaption>
        </figure>

        <div className="jt-rail">
          <span className="jt-spine" aria-hidden="true" />
          <span
            className={`jt-return${loopClosed ? " is-on" : ""}`}
            aria-hidden="true"
          />

          <section className="jt-stage" style={{ "--jt-i": "0" } as CSSProperties}>
            <p className="jt-line-strong">
              有了相关数据，智能才有发挥作用的条件
            </p>
            <p className="jt-line">
              处理手段：人工智能 · 机器学习 · 数据分析 · 优化算法
            </p>
          </section>

          <section className="jt-stage" style={{ "--jt-i": "1" } as CSSProperties}>
            <p className="jt-line">从数据中提取有用信息，支持判断</p>
            <p className="jt-line-strong">
              预测性维护 · 质量控制 · 能源管理 · 生产调度
            </p>
            <p className="jt-note">智能解决的是：怎样从数据走向更合适的判断</p>
          </section>

          <section
            className={`jt-stage jt-stage-gated${loopClosed ? " is-on" : ""}`}
            style={{ "--jt-i": "2" } as CSSProperties}
          >
            <p className="jt-line-strong">判断进入行动，价值才真正出现</p>
            <p className="jt-line">
              可能落实为：调整生产节奏 · 安排维护 · 修改物料计划 · 优化服务方式
            </p>
          </section>

          <section
            className={`jt-stage jt-stage-gated${loopClosed ? " is-on" : ""}`}
            style={{ "--jt-i": "3" } as CSSProperties}
          >
            <p className="jt-line">
              行动改变现场状态，新的状态又被连接感知，成为后续数据
            </p>
            <p className="jt-close">技术、信息和业务行动，连成持续改进的过程</p>
          </section>
        </div>
      </div>
    </div>
  );
}
