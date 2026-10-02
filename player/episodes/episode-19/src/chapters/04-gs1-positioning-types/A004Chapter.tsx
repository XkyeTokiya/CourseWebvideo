import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 04-gs1-positioning-types · A004（定位分层页 · parallel-cards-with-takeaway）
 * step → semantic state 显式映射，末态兜底（outline S-A004）：
 * - entry-focused：标题区与入口提示行落位，定位/授权卡占首拍空槽
 * - gs1-positioned：定位卡落位（R006 分层起点）
 * - authority-clarified：授权卡与定位卡并列分层落位
 * - three-types-mapped：焦点转入类型区，三张类型卡依次落位，完成后等权并列（R008/R009）
 * - type-principle-stated：三卡保持等权，原则收束行落位（R010 conclusion）
 *
 * 视觉主体：一张"体系档案卡"——定位/授权为左右并列的治理分层，
 * 三张类型卡是分档记录行，原则行是档案底部的收束批注。
 */
const stateByStep = [
  "entry-focused",
  "gs1-positioned",
  "authority-clarified",
  "three-types-mapped",
  "type-principle-stated",
] as const;

type A004State = (typeof stateByStep)[number];

const TYPES = [
  { code: "GTIN", scene: "零售结算", target: "对应零售交易中的商品" },
  { code: "SSCC", scene: "物流", target: "对应运输、周转中的物流单元" },
  { code: "GIAI", scene: "资产管理", target: "对应企业长期跟踪的资产" },
] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state: A004State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad pt-root" data-state={state}>
      <header className="pt-header">
        <h1 className="pt-headline">GS1 的定位与典型类型</h1>
      </header>
      <p className="pt-entry">
        <span className="pt-entry-index" aria-hidden="true">→</span>
        先从最贴近贸易流通的 GS1 看起
      </p>

      <div className="pt-gov">
        <article className="pt-gov-card pt-gov-position">
          <span className="pt-gov-tag">定位</span>
          <p className="pt-gov-body">
            <span className="pt-gov-code">GS1</span>
            <span className="pt-gov-text">
              由国际物品编码组织开发和维护的统一标识系统，用于全球商贸领域
            </span>
          </p>
        </article>
        <article className="pt-gov-card pt-gov-authority">
          <span className="pt-gov-tag">授权</span>
          <p className="pt-gov-body">
            <span className="pt-gov-code">中国物品编码中心</span>
            <span className="pt-gov-text">
              中国大陆授权管理：负责厂商识别代码分配与规范应用指导
            </span>
          </p>
        </article>
      </div>

      <div className="pt-types" aria-label="三种典型编码类型">
        {TYPES.map((t) => (
          <article className="pt-type-card" key={t.code}>
            <span className="pt-type-code">{t.code}</span>
            <p className="pt-type-body">
              <span className="pt-type-scene">{t.scene}</span>
              <span className="pt-type-target">{t.target}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="pt-principle">
        <p className="pt-principle-text">
          <span className="pt-principle-lead">哪怕同属 GS1</span>
          <span className="pt-principle-key">也要先看对象和业务动作再选类型，类型不是通用答案</span>
        </p>
      </div>
    </div>
  );
}
