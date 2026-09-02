import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ValueRecap.css";

const states = [
  "value-cards-equal",
  "goal-driven-noted",
  "loop-returned",
  "episode-judged",
] as const;

type ValueRecapState = (typeof states)[number];

export default function ValueRecap({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const current = states.indexOf(state as ValueRecapState);
  const reached = (n: number) => current >= n;

  return (
    <div className="vr-scene scene-pad" data-phase={state}>
      <h1 className="vr-title">
        平台价值要由<em>业务目标</em>驱动，并在行动后继续改进
      </h1>

      <div className="vr-cards">
        <article className="vr-card card" data-on="on">
          <div className="vr-card-head">
            <span className="vr-idx hero-num">01</span>
            <h2 className="vr-card-title">可见落点</h2>
          </div>
          <div className="vr-body">
            <p className="vr-item">生产透明度</p>
            <p className="vr-item">流程瓶颈识别</p>
            <p className="vr-cap">平台可以帮助企业看得更清楚</p>
          </div>
        </article>

        <article className="vr-card card" data-on="on">
          <div className="vr-card-head">
            <span className="vr-idx hero-num">02</span>
            <h2 className="vr-card-title">更多可能</h2>
          </div>
          <div className="vr-body">
            <p className="vr-item">柔性化 · 个性化生产</p>
            <p className="vr-item">产品创新 · 服务创新 · 绿色制造创新</p>
            <p className="vr-cap">为创新提供数据依据</p>
          </div>
        </article>
      </div>

      <div className="vr-takeaway card">
        <p className="vr-tk-tag">收束</p>

        <section
          className={`vr-sec${reached(1) ? " is-on" : ""}`}
          style={{ "--vr-i": "0" } as CSSProperties}
        >
          <p className="vr-warn-line">价值不会因为接入平台就自动发生</p>
          <p className="vr-line">
            从业务目标出发，决定连接什么 · 使用什么数据 · 形成什么判断 · 怎样落实到流程
          </p>
        </section>

        <section
          className={`vr-sec${reached(2) ? " is-on" : ""}`}
          style={{ "--vr-i": "1" } as CSSProperties}
        >
          <p className="vr-callback">回到开头的工厂</p>
          <p className="vr-loop">
            围绕同一业务问题：让对象连接 → 信息变成数据 → 智能形成判断 → 落实为行动 →
            根据结果调整
          </p>
          <p className="vr-line-strong">
            过程会持续变化，技术只是条件，业务价值才是方向
          </p>
        </section>

        <section
          className={`vr-sec vr-sec-final${reached(3) ? " is-on" : ""}`}
          style={{ "--vr-i": "2" } as CSSProperties}
        >
          <p className="vr-final">
            判断是否完成数字化转型，不能只看部署了多少设备和软件，更要看有没有
            <em>持续改变业务</em>
          </p>
        </section>
      </div>
    </div>
  );
}
