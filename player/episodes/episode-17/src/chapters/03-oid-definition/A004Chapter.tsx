import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M002 from "./assets/M002.png";

/**
 * 03-oid-definition · A004 定义与体系（6 拍）
 * 配方 image-with-reading-notes，关系机制 cumulative-assembly。
 * step → semantic state 显式映射，允许重复，末态兜底：
 * - definition-established：标题与定义要点落位，OID 命名铭牌成立（A004 · S-A004）
 * - scope-enumerated：范围项逐词报到，对象托盘汇入铭牌（A004 · S-A004）
 * - single-explanation：组织/系统双语境汇入“同一份解释”（A004 · S-A004）
 * - system-framed：定义区弱化，体系四部分装配成条（A004 · S-A004）
 * - tree-shaped：教材根分支图（占位图）引入为树形状锚点（A004 · S-A004）
 * - focus-set：收束行“看清这棵树的形状”落位（A004 · S-A004）
 */
const stateByStep = [
  "definition-established",
  "scope-enumerated",
  "single-explanation",
  "system-framed",
  "tree-shaped",
  "focus-set",
] as const;

type OidState = (typeof stateByStep)[number];

/** 口播第 2 拍的范围项：阅读序列逐词报到，与右侧托盘同步落位 */
const SCOPE_ITEMS = ["产品", "算法", "文件", "数字对象"] as const;

/** 口播第 4 拍的体系四部分：同一拍内依次装配进同一根体系条 */
const SYSTEM_PARTS = [
  { index: "①", label: "命名规则" },
  { index: "②", label: "分配方案" },
  { index: "③", label: "编码规则" },
  { index: "④", label: "解析管理" },
] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state: OidState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad od-root" data-state={state}>
      <div className="od-main">
        <section className="od-notes">
          <header className="od-headline-block">
            <h1 className="od-headline">OID：对象标识符</h1>
            <span className="od-en-badge">Object Identifier</span>
          </header>
          <ol className="od-note-list">
            <li className="od-note od-note-def">
              <span className="od-note-index">①</span>
              <div className="od-note-body">
                <p className="od-note-lead">对任意类型的对象、概念或事物</p>
                <p className="od-note-strong od-note-def-key">
                  全球无歧义、唯一的命名
                </p>
              </div>
            </li>
            <li className="od-note od-note-scope">
              <span className="od-note-index">②</span>
              <div className="od-note-body">
                <p className="od-note-lead">对象范围很宽</p>
                <p className="od-scope-row">
                  {SCOPE_ITEMS.map((item) => (
                    <span className="od-scope-item" key={item}>
                      {item}
                    </span>
                  ))}
                </p>
              </div>
            </li>
            <li className="od-note od-note-single">
              <span className="od-note-index">③</span>
              <div className="od-note-body">
                <p className="od-note-lead">换到哪个组织、哪个系统</p>
                <p className="od-note-strong">都只对应这一份解释</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="od-stage">
          <div className="od-demo">
            <div className="od-tray">
              <p className="od-tray-head">任意对象 · 概念 · 事物</p>
              <div className="od-tray-shapes">
                <svg className="od-shape" viewBox="0 0 48 48" aria-hidden="true">
                  <rect x="8" y="8" width="32" height="32" />
                </svg>
                <svg className="od-shape" viewBox="0 0 48 48" aria-hidden="true">
                  <polygon points="24,6 44,42 4,42" />
                </svg>
                <svg className="od-shape" viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="24" r="17" />
                </svg>
                <svg className="od-shape" viewBox="0 0 48 48" aria-hidden="true">
                  <polygon points="24,4 44,24 24,44 4,24" />
                </svg>
              </div>
            </div>
            <svg
              className="od-flow od-flow-in"
              viewBox="0 0 100 48"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M12 0 C12 26 40 32 48 46" />
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M37 0 C37 22 46 30 49 46" />
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M63 0 C63 22 54 30 51 46" />
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M88 0 C88 26 60 32 52 46" />
            </svg>
            <div className="od-plate">
              <p className="od-plate-name">OID</p>
              <p className="od-plate-stamp">全球无歧义 · 唯一命名</p>
            </div>
            <svg
              className="od-flow od-flow-out"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M50 0 C50 18 28 20 26 38" />
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M50 0 C50 18 72 20 74 38" />
            </svg>
            <div className="od-contexts">
              <div className="od-context">组织</div>
              <div className="od-context">系统</div>
            </div>
            <svg
              className="od-flow od-flow-merge"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M26 0 C26 18 44 20 48 38" />
              <path pathLength="1" vectorEffect="non-scaling-stroke" d="M74 0 C74 18 56 20 52 38" />
            </svg>
            <div className="od-explain">同一份解释</div>
          </div>

          <div className="od-system">
            <div className="od-sysbar">
              <p className="od-sysbar-head">
                不只是数字串 —— <b>同一套命名体系</b>
              </p>
              <div className="od-sysbar-track">
                {SYSTEM_PARTS.map((part) => (
                  <div className="od-syspart" key={part.label}>
                    <span className="od-syspart-index">{part.index}</span>
                    <span className="od-syspart-label">{part.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <figure className="od-figure">
              <img
                className="od-figure-img"
                src={M002}
                alt="教材根节点分支关系（占位图）"
              />
              <figcaption className="od-figure-caption">
                <span className="od-figure-badge">教材根分支图 · 占位图</span>
                <span className="od-figure-note">
                  <span>先定从哪里分叉</span>
                  <span className="od-path-arrow">→</span>
                  <span>分支继续往下命名</span>
                  <span className="od-path-arrow">→</span>
                  <span>整条路径写成编码</span>
                </span>
              </figcaption>
            </figure>
            <p className="od-focus">
              学 OID，重点是看清<span className="od-focus-key">这棵树的形状</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
