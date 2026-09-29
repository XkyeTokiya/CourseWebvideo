import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M005 from "./assets/M005.png";

/**
 * 10-no-autocorrect · A011 纠错边界（2 拍，配方 image-with-insight-rail）。
 * 关系机制 persistent-media-reading：匿名对象场景图持续在侧承载比较语境（M005），
 * insight 轨要点随口播自上而下迁移，媒体不反复卸载；R017 由图侧判据条（条件）
 * 与能力说明（路径轨）的先后关系承载。
 * 注意：本页 screen guidance 与口播系统性错位（实为 A010 内容），
 * 上屏文案以 outline 槽位文本（headline＝"字符串能力的边界"）与批准口播 beats 重组，
 * 不照抄 guidance 原文；C012：不把路径区分能力写成系统自动判重或数据永不重复。
 * step → semantic state 显式映射，允许重复，末态兜底（outline S-A011）：
 * - boundary-stated：标题区与场景图建立，insight 轨落位条件与"字符串不纠错"要点
 * - capability-scoped：保持场景图与要点轨，路径轨落位"能放在明确路径上／
 *   保证不了每个环节操作正确"的能力范围
 */
const stateByStep = [
  "boundary-stated",
  "capability-scoped",
] as const;

type NoAutocorrectState = (typeof stateByStep)[number];

/** 口播拍 1 的两个前提条件（逐字来自 beat 1） */
const CONDITIONS = ["分配边界没划清", "记录和采集出了问题"] as const;

/** 口播拍 2 的环节操作刻度：虚线框＝不保证，只示意"每一个环节"，不含数量声明 */
const GATES = [1, 2, 3] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state: NoAutocorrectState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad na-root" data-state={state}>
      <header className="na-header">
        <h1 className="na-headline">字符串能力的边界</h1>
      </header>

      <div className="na-main">
        <figure className="na-scene">
          <img
            className="na-scene-img"
            src={M005}
            alt="匿名对象场景，建立完整路径的比较语境（占位图）"
          />
          <figcaption className="na-scene-cap">
            <span className="na-scene-badge">匿名对象场景</span>
            <span className="na-scene-note">完整路径比较语境 · 占位图</span>
          </figcaption>
        </figure>

        <div className="na-rail">
          <span className="na-rail-line" aria-hidden="true" />

          <section className="na-entry na-conditions">
            <p className="na-entry-tag">条件</p>
            <div className="na-cond-list">
              {CONDITIONS.map((cond) => (
                <p className="na-cond-item" key={cond}>
                  {cond}
                </p>
              ))}
            </div>
          </section>

          <section className="na-entry na-verdict">
            <p className="na-entry-tag na-tag-warn">边界</p>
            <p className="na-verdict-text">
              OID 字符串本身<em>不会替你纠错</em>
            </p>
          </section>

          <section className="na-entry na-capability">
            <div className="na-track" aria-hidden="true">
              <span className="na-track-line" />
              <span className="na-track-dot">
                <i>对象</i>
              </span>
              <span className="na-gates-cap">环节操作</span>
              {GATES.map((gate) => (
                <span className="na-gate" key={gate} />
              ))}
            </div>
            <div className="na-cap-cells">
              <div className="na-cell na-cell-support">
                <p className="na-cell-kicker">能做</p>
                <p className="na-cell-text">把对象放在一条明确的路径上</p>
              </div>
              <div className="na-cell na-cell-boundary">
                <p className="na-cell-kicker na-kicker-warn">保证不了</p>
                <p className="na-cell-text">每一个环节的操作都正确</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
