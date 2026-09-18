import "./SummaryAnchor.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A010 · 总结页（S-A048 · lifecycle-identity-continuity）
 * 关系机制 invariant-anchor-continuity：不变锚点（U026）承载“同一个可关联身份”，
 * 阶段链（U026）按供应→装配→配件流转→维修核验展示贯通，职责区（U027）补充
 * 各系统分工并经 R016 回指锚点，末拍 continuity-judgment（U028）收束最终判断。
 * 首拍总装工位为本章自绘的情境回访意象，不引用其他章节素材。
 */
const stateByStep = [
  "opening-revisited",
  "identity-continuous",
  "roles-anchored",
  "continuity-judged",
] as const;

type SummaryState = (typeof stateByStep)[number];

const STAGES = ["供应", "装配", "配件流转", "维修核验"];

const ROLES = [
  { sys: "QTS", duty: "质量追踪" },
  { sys: "MES", duty: "生产执行" },
  { sys: "质量追溯系统", duty: "质量记录的回查" },
];

export default function SummaryAnchor({ step }: ChapterStepProps) {
  const state: SummaryState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene sa-scene state-${state}`}>
      <div className="scene-pad sa-pad">
        {/* headline（S048，可见标题：保留） */}
        <header className="sa-head">
          <h1 className="sa-headline serif-cn">本期总结：共同身份是精益管理的起点</h1>
          <span className="sa-head-note mono">本期总结 · 一物一码</span>
          <hr className="rule sa-head-rule" />
        </header>

        <div className="sa-body">
          {/* 左列：总装工位回访意象 + invariant-anchor（U026） */}
          <div className="sa-left">
            <figure className="sa-station card" aria-label="回到开头的总装工位（情境回访）">
              <div className="sa-station-stage" aria-hidden="true">
                <span className="sa-gantry" />
                <span className="sa-belt" />
                <span className="sa-part sa-part-a">
                  <i className="sa-part-mark" />
                </span>
                <span className="sa-part sa-part-b">
                  <i className="sa-part-mark" />
                </span>
              </div>
              <figcaption className="sa-station-cap mono">回到开头 · 总装工位</figcaption>
            </figure>

            <section className="sa-anchor card" aria-label="不变锚点：同一个可关联身份">
              <div className="sa-slot mono" aria-hidden="true">
                待补
              </div>
              <p className="sa-not-tag">
                <span className="sa-tag-chip mono">多贴一个标签</span>
                <span className="sa-not-tag-text serif-cn">不靠多贴一个标签</span>
              </p>
              <div className="sa-anchor-face">
                <div className="sa-anchor-row">
                  <span className="sa-glyph" aria-hidden="true">
                    <i className="sa-glyph-ring" />
                    <i className="sa-glyph-core" />
                  </span>
                  <p className="sa-hero-id serif-cn">
                    <span>同一个</span>
                    <span>可关联身份</span>
                  </p>
                </div>
                <p className="sa-anchor-sub mono">一物一码 · 一路不变</p>
              </div>
            </section>
          </div>

          {/* 右列上：ordered-stages（U026）——真实顺序，按先后点亮后整体保持 */}
          <section className="sa-stages" aria-label="四阶段贯通：供应、装配、配件流转、维修核验">
            <span className="sa-stages-cap mono">同一身份贯通</span>
            <span className="sa-thread" aria-hidden="true" />
            <div className="sa-stage-row">
              {STAGES.map((name, i) => (
                <span className="sa-stage" key={name}>
                  <span className="sa-stage-node" aria-hidden="true">
                    <i className="sa-stage-dot" />
                  </span>
                  <span className="sa-stage-name serif-cn">{name}</span>
                  <span className="sa-stage-idx mono">{`0${i + 1}`}</span>
                </span>
              ))}
            </div>
          </section>

          {/* 右列下：stage-purpose（U027）+ R016 回指锚点 */}
          <section className="sa-roles" aria-label="各系统职责与唯一标识的连接">
            <span className="sa-link" aria-hidden="true">
              <i className="sa-link-head" />
              <span className="sa-link-chip mono">共同身份</span>
            </span>
            <header className="sa-roles-head">
              <span className="sa-roles-tag mono">职责分工</span>
              <h2 className="sa-roles-title serif-cn">各司其职</h2>
            </header>
            <ul className="sa-role-list">
              {ROLES.map((role) => (
                <li className="sa-role" key={role.sys}>
                  <span className="sa-role-sys mono">{role.sys}</span>
                  <span className="sa-role-duty serif-cn">{role.duty}</span>
                </li>
              ))}
            </ul>
            <p className="sa-connect serif-cn">
              唯一标识做的事：把<em>零部件这个对象</em>和<em>各环节的记录</em>连起来
            </p>
          </section>
        </div>

        {/* continuity-judgment（U028）：末拍收束，此前不出现 */}
        <footer className="sa-judgment" aria-label="收束判断">
          <span className="sa-judgment-label mono">收束判断</span>
          <p className="sa-judgment-text serif-cn">
            先把零部件<em className="sa-em-aim">认准</em>，再把跨环节的记录
            <em className="sa-em-link">连准</em>
            <span className="sa-judgment-dash" aria-hidden="true">
              ——
            </span>
            精益管理才有可靠的起点
          </p>
        </footer>
      </div>
    </div>
  );
}
