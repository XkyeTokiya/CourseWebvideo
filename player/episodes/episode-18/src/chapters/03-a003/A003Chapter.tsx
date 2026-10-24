import "./A003Chapter.css";
import m002Src from "./assets/M002.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 03-ecode-definition · 定义语境页（outline §3 · S-A003 · image-with-summary-rail）
 * 单一持续定义场景：标题区在上；左列定义要点 + 目标标识聚合（其余会持续
 * 保留），右列物联网语境注记沿 summary 轨落位，下方收束行归拢全页；匿名
 * 物品场景图（M002）自首拍以低权重持续在侧，第三拍恢复权重。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - definition-established：定义要点落位，目标标识在下方聚合（step 1，
 *   R005 由定义到目标标识的上下聚合承载）
 * - iot-scoped：保持定义区，语境注记落进 summary 轨（step 2，
 *   R006 由语境界定服务对象承载）
 * - service-scoped：保持语境注记与场景图，收束行呈现"正是这个环境里的
 *   物品"（step 3）
 * 护栏 C004：定义句不携带提出机构、年份、标准编号与现行有效性断言。
 */
const stateByStep = [
  "definition-established",
  "iot-scoped",
  "service-scoped",
] as const;

type A003State = (typeof stateByStep)[number];

type A003Phase = "def" | "rail" | "scoped";

const phaseByState: Record<A003State, A003Phase> = {
  "definition-established": "def",
  "iot-scoped": "rail",
  "service-scoped": "scoped",
};

export default function A003Chapter({ step }: ChapterStepProps) {
  const state: A003State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const phase = phaseByState[state];

  return (
    <div className="ve-root" data-state={state} data-phase={phase}>
      <header className="ve-head">
        <h1 className="ve-headline">
          <em>Ecode</em>：物联网中的物品编码体系
        </h1>
        <span className="ve-head-rule" aria-hidden="true" />
      </header>

      <div className="ve-main">
        <div className="ve-defcol">
          <section className="ve-def">
            <p className="ve-def-label">Ecode，是</p>
            <p className="ve-def-word">为物联网中的物品设计的</p>
            <p className="ve-def-word ve-def-word-strong">一种编码体系</p>
          </section>

          <section className="ve-target">
            <p className="ve-target-label">目标</p>
            <p className="ve-target-line">
              给每一件物品一个<b>唯一的身份标识</b>
            </p>
          </section>
        </div>

        <figure className={`ve-image${phase === "scoped" ? " is-focus" : ""}`}>
          <img
            src={m002Src}
            alt="物联网环境中连在一起的匿名物品教学场景"
          />
          <figcaption className="ve-image-note">
            素材占位 · 真实语境图待提供
          </figcaption>
        </figure>
      </div>

      <aside className={`ve-rail${phase === "rail" || phase === "scoped" ? " is-on" : ""}`}>
        <p className="ve-rail-title">物联网是——</p>
        <p className="ve-rail-text">
          许多物品<b>连在一起</b>，需要<b>统一标识</b>和<b>相互关联</b>的网络环境
        </p>
      </aside>

      <div className={`ve-than${phase === "scoped" ? " is-on" : ""}`}>
        <span className="ve-than-line" aria-hidden="true" />
        <p className="ve-than-text">
          Ecode 要服务的，正是<i>这个环境里的物品</i>
        </p>
      </div>
    </div>
  );
}
