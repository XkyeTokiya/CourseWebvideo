import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 11-a011 · 总结收束页（outline §11 · S-A011 · common-anchor-association-groups）
 * 中央共享锚卡整章持续在场（锚卡 = 开场记录线：多条记录 → 同一个对象），
 * 锚下分工关联卡与支撑注脚条在固定区域先后补充；右缘收束竖卡承载最终判断。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - anchor-restated：锚卡居中点亮（顶部挂回环角标），锚下两张分工关联卡
 *   先后落位（A011 · step 1，R031 由锚卡与分工卡的上下排布承载）
 * - close-settled：第三条支撑注脚条滑入，随后右缘收束竖卡点亮为最终判断
 *   （A011 · step 2，R032 由末条收束卡承载）
 * 护栏 C019：总结不预告注册、解析、数据或载体等后续主题；
 * 护栏 C020：结尾不扩大为工具或体系结论。
 */
const stateByStep = [
  "anchor-restated",
  "close-settled",
] as const;

type A011State = (typeof stateByStep)[number];

export default function A011Chapter({ step }: ChapterStepProps) {
  const state: A011State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad an-root" data-state={state}>
      <header className="an-head">
        <span className="an-head-tick" aria-hidden="true" />
        <h1 className="an-headline">回到开场的问题</h1>
        <span className="an-head-rule" aria-hidden="true" />
      </header>

      <div className="an-main">
        <div className="an-center">
          <section className="an-anchor" aria-label="共享锚卡">
            <span className="an-anchor-loop">回环 · 开场之问</span>
            <p className="an-anchor-kicker">同一条记录线</p>
            <p className="an-anchor-line">
              多条记录 <i className="an-anchor-arrow" aria-hidden="true" /> 同一个对象
            </p>
          </section>

          <div className="an-assoc">
            <section className="an-assoc-card" aria-label="前缀分工">
              <p className="an-assoc-name">前缀</p>
              <p className="an-assoc-duty">交代管理范围</p>
            </section>
            <section className="an-assoc-card" aria-label="后缀分工">
              <p className="an-assoc-name">后缀</p>
              <p className="an-assoc-duty">承载对象差异</p>
            </section>
          </div>

          <div className="an-support">
            <p className="an-support-line">
              分隔和类型让编码<b>读得懂</b> · 检查清单让编码<b>经得起核对</b>
            </p>
          </div>
        </div>

        <aside className="an-close" aria-label="最终判断">
          <span className="an-close-kicker">收束</span>
          <p className="an-close-main">一套可落地的编码规则</p>
          <p className="an-close-def">
            = 能被<b>解释</b>、<b>核对</b>和<b>扩展</b>的结构说明
          </p>
          <p className="an-close-not">不是越长越安全的字符</p>
        </aside>
      </div>
    </div>
  );
}
