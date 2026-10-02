import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 06-five-systems-matrix · A006（场景矩阵页 · layered-bands-with-side-notes）
 * step → semantic state 显式映射，末态兜底（outline S-A006）：
 * - matrix-opened：标题区与矩阵骨架落位，承接语"看完了 GS1，再对照"作为引导行
 * - five-rows-mapped：五行体系带依次落位，完成后五行等权（R014–R017 parallel）
 * - context-boundary-noted：五行保持等权，底部边界行落位（R018 context）
 *
 * 视觉主体：一张"五格记录册"——五行体系带是记录册的横格行，
 * 每行 = 体系名（mono 编号感）+ 主要语境；边界行是册底的批注。
 */
const stateByStep = [
  "matrix-opened",
  "five-rows-mapped",
  "context-boundary-noted",
] as const;

type A006State = (typeof stateByStep)[number];

const ROWS = [
  { system: "VAA", scene: "供应链管理、生命周期管理" },
  { system: "Handle", scene: "数字资产管理" },
  { system: "OID", scene: "网络资源管理" },
  { system: "Ecode", scene: "物联网，含物流、仓储、生产制造" },
  { system: "GS1", scene: "产品与服务的贸易流通" },
] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state: A006State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad mx-root" data-state={state}>
      <header className="mx-header">
        <h1 className="mx-headline">五类体系的典型场景</h1>
        <p className="mx-lead">看完了 GS1，再把五类体系的典型场景放在一起对照</p>
      </header>

      <div className="mx-bands" aria-label="五类体系的场景矩阵">
        {ROWS.map((row) => (
          <div className="mx-band" key={row.system}>
            <span className="mx-band-system">{row.system}</span>
            <svg className="mx-band-divider" viewBox="0 0 6 40" preserveAspectRatio="none" aria-hidden="true">
              <line className="mx-band-divider-line" x1="3" y1="4" x2="3" y2="36" />
            </svg>
            <span className="mx-band-scene">{row.scene}</span>
          </div>
        ))}
      </div>

      <div className="mx-boundary">
        <p className="mx-boundary-text">
          <span className="mx-boundary-key">主要语境</span>
          <span className="mx-boundary-note">不是说一套体系只能待在一个行业里</span>
        </p>
      </div>
    </div>
  );
}
