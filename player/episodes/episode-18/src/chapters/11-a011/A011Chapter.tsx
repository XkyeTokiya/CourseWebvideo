import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 11-three-layer-summary · 三层收束页（outline §11 · S-A011 ·
 * common-anchor-association-groups，groups-compose-anchor）
 * 共同锚点承载开场回收：左侧小流转图回扣开场物品；三层分工组并列
 * 落位后等权保留；组合线把三层收进"合在一起"的构成判断；边界栏最后
 * 收束"靠协同，不靠复杂"。不引入新事实、不预告后续。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - object-recalled：标题与开场锚点落位，点出"编号不少，缺的是身份"
 *   （step 1）
 * - three-layers-mapped：三层分工组并列落位，完成后三组等权
 *   （step 2，R022 由三层分工组向共同构成栏的组合承载）
 * - composition-formed：组合线点亮，支撑注记呈现（step 3）
 * - identity-concluded：边界栏收束核心判断
 *   （step 4，R023 由共同构成栏向核心判断的收束承载）
 * 护栏：总结只回扣开场场景，不引入新事实；不预告、不比较其他编码
 * 体系，也不暗示下一主题。
 */
const stateByStep = [
  "object-recalled",
  "three-layers-mapped",
  "composition-formed",
  "identity-concluded",
] as const;

type A011State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A011State, number> = {
  "object-recalled": 0,
  "three-layers-mapped": 1,
  "composition-formed": 2,
  "identity-concluded": 3,
};

/** 三层分工（G037） */
const LAYERS = [
  { seg: "V", duty: "说明怎样读" },
  { seg: "NSI", duty: "说明在哪个体系里读" },
  { seg: "MD", duty: "说明对象编码是什么" },
] as const;

/** 开场流转（回扣开场场景，不新增事实） */
const JOURNEY = ["生产线", "仓库", "装车", "现场"] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state: A011State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  const layersOn = at >= 1;
  const composedOn = at >= 2;
  const concludedOn = at >= 3;

  return (
    <div className="zj-root" data-state={state}>
      <header className="zj-head">
        <h1 className="zj-headline">三层职责，协同构成身份</h1>
        <span className="zj-head-rule" aria-hidden="true" />
      </header>

      <section className="zj-anchor">
        <div className="zj-anchor-journey" aria-hidden="true">
          {JOURNEY.map((label, index) => (
            <span
              key={label}
              className="zj-dot-col"
              style={{ "--zj-i": index } as React.CSSProperties}
            >
              <i className="zj-dot" />
              <em>{label}</em>
            </span>
          ))}
        </div>
        <div className="zj-anchor-text">
          <p className="zj-anchor-line">
            回到开头那件在环节之间流转的物品——
          </p>
          <p className="zj-anchor-main">
            <b>编号不少</b>，真正缺的，是一个<b>解释得清楚、衔接得起来</b>的身份
          </p>
        </div>
      </section>

      <div className={`zj-layers${layersOn ? " is-on" : ""}`}>
        {LAYERS.map((node, index) => (
          <section
            key={node.seg}
            className="zj-layer"
            style={{ "--zj-i": index } as React.CSSProperties}
          >
            <span className="zj-layer-seg">{node.seg}</span>
            <span className="zj-layer-duty">{node.duty}</span>
          </section>
        ))}
      </div>

      <div className={`zj-compose${composedOn ? " is-on" : ""}`}>
        <span className="zj-compose-links" aria-hidden="true" />
        <p className="zj-compose-chip">
          合在一起 · 一条 <i>Ecode</i>
        </p>
        <p className="zj-compose-note">
          既能<b>说明结构</b>，又能<b>说明归属</b>，落到<i>具体的物品</i>上
        </p>
      </div>

      <div className={`zj-boundary${concludedOn ? " is-on" : ""}`}>
        <p className="zj-boundary-text">
          理解一个身份，靠的是 <b>三段的协同</b>——而不是把这串字符想得
          <i>越来越复杂</i>
        </p>
      </div>
    </div>
  );
}
