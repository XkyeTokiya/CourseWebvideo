import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M002 from "./assets/M002.png";

/**
 * 03-a003 · 编码作用页（outline §3 · S-A003 · image-with-insight-rail）
 * 左图右轨双区读图：左侧 M002 产线场景图持续在场，图内同一对象在三个环节
 * 位置逐一标记并连成一条线；右侧洞察轨三条自上而下逐层组装。
 * step → semantic state / accent 显式映射（0 基，末态兜底）：
 * - records-linked：M002 铺出 + 图内三环节标记连线，洞察条 1、2 依次落位
 *   （A003 · step 1，R005 由条 1/条 2 相邻次序承载）
 * - constraints-settled：洞察条 3 进入焦点，「唯一、稳定、可扩展」三点聚合，
 *   挂「设计约束」限定角标（A003 · step 2，R006 由三点约束标签承载）
 * - K-A003-01 · accent：低成本全屏强调「这三点是设计约束，不是编码已经合格
 *   的证明」（A003 · step 3，不重复 base-scene 结论）
 * exact S016「唯一、稳定、可扩展」自第 2 拍起在洞察条 3 逐字完整可见。
 * 护栏 C005：三点是设计约束，不呈现为合规证明或系统性能承诺。
 */
const stateByStep = [
  "records-linked",
  "constraints-settled",
] as const;

type A003State = (typeof stateByStep)[number];

const ACCENT_STEP = 2;

/** 图内三环节标记（beat 1：生产线上 / 仓库里 / 运输途中）；x/y 为可视区百分比 */
const STAGE_MARKS = [
  { key: "prod", label: "生产", x: 17, y: 63 },
  { key: "store", label: "仓库", x: 47, y: 41 },
  { key: "ship", label: "运输", x: 77, y: 20 },
] as const;

function A003StatementFrame() {
  return (
    <div className="scene-pad ir-statement">
      <span className="ir-statement-rule" aria-hidden="true" />
      <p className="ir-statement-kicker">记住</p>
      <h1 className="ir-statement-line">
        这三点是<em>设计约束</em>，不是编码已经合格的证明。
      </h1>
    </div>
  );
}

function A003Scene({ state }: { state: A003State }) {
  return (
    <div className="scene-pad ir-root" data-state={state}>
      <header className="ir-head">
        <span className="ir-head-tick" aria-hidden="true" />
        <h1 className="ir-headline">编码要干什么</h1>
        <span className="ir-head-rule" aria-hidden="true" />
      </header>

      <div className="ir-main">
        <figure className="ir-media">
          <div className="ir-view">
            <img
              className="ir-media-img"
              src={M002}
              alt="匿名产线场景：跨环节信息连成一条线（占位图，无编码与企业标识）"
            />
            <svg
              className="ir-marks"
              viewBox="0 0 100 62"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                className="ir-marks-line"
                points="17,39.1 47,25.4 77,12.4"
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {STAGE_MARKS.map((mark, index) => (
              <span
                key={mark.key}
                className={`ir-mark ir-mark-${index + 1}`}
                style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
              >
                <i className="ir-mark-dot" aria-hidden="true" />
                <span className="ir-mark-label">{mark.label}</span>
              </span>
            ))}
          </div>
          <figcaption className="ir-media-note">
            <span className="ir-media-badge">跨环节记录场景</span>
            <span className="ir-media-tag">占位图</span>
          </figcaption>
        </figure>

        <div className="ir-rail">
          <section className="ir-bar" aria-label="记录对上号">
            <span className="ir-bar-kicker">对上号</span>
            <p className="ir-bar-line">
              生产、仓库、运输，各记一条记录
            </p>
            <p className="ir-bar-sub">
              靠的就是<b>同一个编码</b>
            </p>
          </section>

          <section className="ir-bar" aria-label="全流程可视化">
            <span className="ir-bar-kicker">连成一条线</span>
            <p className="ir-bar-line">各环节信息连成一条线</p>
            <p className="ir-bar-sub">全流程可视化，有了可能</p>
          </section>

          <section className="ir-bar ir-bar-cstraints" aria-label="三点设计约束">
            <span className="ir-bar-badge">设计约束</span>
            <p className="ir-bar-cstraints-line">唯一、稳定、可扩展</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function A003Chapter({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) {
    return <A003StatementFrame />;
  }
  const state: A003State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <A003Scene state={state} />;
}
