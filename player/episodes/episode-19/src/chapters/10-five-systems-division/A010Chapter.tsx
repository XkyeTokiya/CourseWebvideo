import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

/**
 * 10-five-systems-division · A010（锚点分工页 · common-anchor-association-groups）
 * step → semantic state 显式映射，末态兜底（outline S-A010）：
 * - anchor-recalled：零部件锚点卡建立并保持，锚点下五个记录环境标签依次点亮
 *   （贸易、仓储、生产、内部系统、工业网络）
 * - five-roles-mapped：锚点卡保持不卸载，分工区两行依次落位，五分工并列（R031 parallel）
 *
 * 视觉主体：一张"回指锚点单"——回到第 2 章同一件零部件（M001 占位延续），
 * 锚点下点亮它被记录的五个环境，右侧分工区是"谁管哪一段"的两行分工。
 */
const stateByStep = ["anchor-recalled", "five-roles-mapped"] as const;

type A010State = (typeof stateByStep)[number];

const ENV_TAGS = ["贸易", "仓储", "生产", "内部系统", "工业网络"] as const;

const DIVISION_ROWS = [
  {
    id: "a",
    cells: [
      { system: "GS1", role: "管贸易流通" },
      { system: "VAA", role: "管供应链和生命周期的跨环节关联" },
    ],
  },
  {
    id: "b",
    cells: [
      { system: "Handle", role: "管数字资产" },
      { system: "OID", role: "管网络资源" },
      { system: "Ecode", role: "接物联网的物流、仓储和生产制造" },
    ],
  },
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state: A010State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad dv-root" data-state={state}>
      <header className="dv-header">
        <h1 className="dv-headline">五类体系的分工</h1>
        <p className="dv-lead">回到开头那件零部件</p>
      </header>

      <div className="dv-main">
        <section className="dv-anchor" aria-label="零部件锚点">
          <figure className="dv-anchor-figure">
            <img
              className="dv-anchor-img"
              src={M001}
              alt="回到开头那件零部件（占位图，与第 2 章同一素材）"
            />
            <figcaption className="dv-anchor-caption">
              <span className="dv-anchor-badge">一件普通的工业零部件</span>
              <span className="dv-anchor-note">多环节都可能被记录 · 占位</span>
            </figcaption>
          </figure>
          <div className="dv-env-tags" aria-label="可能被记录的环境">
            {ENV_TAGS.map((tag) => (
              <span className="dv-env-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div className="dv-division" aria-label="五体系分工">
          {DIVISION_ROWS.map((row) => (
            <div className={`dv-division-row dv-division-${row.id}`} key={row.id}>
              {row.cells.map((cell) => (
                <article className="dv-cell" key={cell.system}>
                  <span className="dv-cell-system">{cell.system}</span>
                  <span className="dv-cell-role">{cell.role}</span>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
