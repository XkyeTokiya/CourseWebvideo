import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M003 from "./assets/M003.png";

/**
 * 07-gs1-selection-start · A007（情境轨道页 · image-with-summary-rail）
 * step → semantic state 显式映射，末态兜底（outline S-A007）：
 * - three-contexts-mapped：标题区与现场图落位，三张情境卡依次落位
 *   （零售商品→GTIN、物流单元→SSCC、企业资产→GIAI），完成后三卡等权
 * - start-not-verdict：三卡保持等权，起点判断行落位（R021 conclusion）
 *
 * 视觉主体：一张"选型对号卡"——三类对象情境各自有一条自绘的对号箭头
 * 指向编码名牌；判断行收在底部说明"只是起点，不是最终决定"。
 */
const stateByStep = ["three-contexts-mapped", "start-not-verdict"] as const;

type A007State = (typeof stateByStep)[number];

const CONTEXTS = [
  { object: "进入零售交易的商品", lead: "对象是", code: "GTIN", action: "先从 GTIN 看起" },
  { object: "物流单元", lead: "是", code: "SSCC", action: "对照 SSCC" },
  { object: "企业资产", lead: "企业要管理自己的", code: "GIAI", action: "对应 GIAI" },
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state: A007State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad ss-root" data-state={state}>
      <header className="ss-header">
        <h1 className="ss-headline">从典型场景开始检查</h1>
        <p className="ss-lead">有了这份对应，选型就好走了</p>
      </header>

      <div className="ss-main">
        <figure className="ss-scene">
          <img
            className="ss-scene-img"
            src={M003}
            alt="商品、物流单元、企业资产三类匿名环境图（占位，待提供生成图）"
          />
          <figcaption className="ss-scene-caption">
            <span className="ss-scene-badge">三类对象的现场语境</span>
            <span className="ss-scene-note">匿名教学场景 · 占位</span>
          </figcaption>
        </figure>

        <div className="ss-lanes" aria-label="三类对象情境对号">
          {CONTEXTS.map((c) => (
            <article className="ss-lane" key={c.code}>
              <p className="ss-lane-object">
                <span className="ss-lane-object-lead">{c.lead}</span>
                <span className="ss-lane-object-name">{c.object}</span>
              </p>
              <svg className="ss-lane-arrow" viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true">
                <line className="ss-lane-arrow-line" x1="2" y1="12" x2="106" y2="12" />
                <path className="ss-lane-arrow-head" d="M106 12 L94 5 M106 12 L94 19" />
              </svg>
              <div className="ss-lane-code">
                <span className="ss-lane-code-chip">{c.code}</span>
                <span className="ss-lane-action">{c.action}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="ss-start">
        <p className="ss-start-text">
          <span className="ss-start-key">只是选型起点</span>
          <span className="ss-start-note">不替企业决定具体编码</span>
        </p>
      </div>
    </div>
  );
}
