import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M003 from "./assets/M003.png";

/**
 * 04-root-branches · A005 根分支(3 拍,配方 image-with-insight-rail)
 * 关系机制 equal-weight-accumulation:三分支要点行等权依次落位,完成后不产生当前选中项。
 * step → semantic state 显式映射,允许重复,末态兜底(outline S-A005):
 * - root-established:标题与树形示意图建立,根节点确立为视觉起点,三分支空轨画出
 * - branches-mapped:三行要点按口播报到点依次落位(ITU=0/ISO=1/联合=2),完成后等权
 * - branch-logic-set:说明区"管理分叉,不是产品类别"与收束区"沿分支继续展开"落位
 */
const stateByStep = [
  "root-established",
  "branches-mapped",
  "branch-logic-set",
] as const;

type RootBranchesState = (typeof stateByStep)[number];

/** 三分支要点行:编号与机构名全部来自批准口播第 2 拍,不补码表/位数/分配规则 */
const BRANCHES = [
  { num: "0", head: "ITU", sub: "国际电信联盟" },
  { num: "1", head: "ISO", sub: "国际标准化组织" },
  { num: "2", head: "联合管理", sub: "ITU 与 ISO 共同管理" },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state: RootBranchesState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad rb-root" data-state={state}>
      <header className="rb-header">
        <h1 className="rb-headline">根节点下的三个分支</h1>
      </header>

      <div className="rb-main">
        <div className="rb-rail" aria-label="根节点与三个分支">
          <div className="rb-root-node">
            <span className="rb-root-glyph">根</span>
            <span className="rb-root-label">根节点</span>
          </div>
          <span className="rb-spine" aria-hidden="true" />
          <div className="rb-rows">
            {BRANCHES.map((branch) => (
              <div className="rb-row" key={branch.num}>
                <span className="rb-stub" aria-hidden="true">
                  <span className="rb-stub-dot" />
                </span>
                <span className="rb-num hero-num">{branch.num}</span>
                <span className="rb-name">
                  <b>{branch.head}</b>
                  <span>{branch.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <figure className="rb-media">
          <img
            className="rb-media-img"
            src={M003}
            alt="匿名对象的树形层级示意图(占位图)"
          />
          <figcaption className="rb-media-caption">
            <span className="rb-media-badge">树形层级示意图</span>
            <span className="rb-media-note">占位图 · M003</span>
          </figcaption>
        </figure>
      </div>

      <div className="rb-foot">
        <div className="rb-support">
          <span className="rb-support-subject">这三个编号</span>
          <span className="rb-support-no">不是产品类别</span>
          <span className="rb-support-arrow" aria-hidden="true" />
          <span className="rb-support-yes">
            是<b>根部的管理和命名分叉</b>
          </span>
        </div>
        <div className="rb-boundary">
          <p className="rb-boundary-line">
            选定一条分支,节点<b>沿分支继续展开</b>
          </p>
          <span className="rb-continue" aria-hidden="true">
            <i />
            <b />
            <i />
            <b />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
