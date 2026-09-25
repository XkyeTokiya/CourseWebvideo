import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 09-uniqueness-path · A010 唯一性判断（2 拍，配方 parallel-cards-self-contained）。
 * 关系机制 compare-and-reweight：两卡自足对照，边界线承载"不能只看末段"（R016），
 * 权重随口播从判据移向结果。
 * 注意：本页 screen guidance 与口播系统性错位（实为 A009 第 2 拍内容），
 * 上屏文案全部以 outline 槽位文本与批准口播 beats 重组，不照抄 guidance 原文。
 * step → semantic state 显式映射，允许重复，末态兜底（outline S-A010）：
 * - criterion-stated：标题区与两卡位建立，边界线立起，左卡（只看末段→无法判断）落位
 * - distinction-shown：右卡（完整路径→能区分开）落位，两卡自足对照完成
 */
const stateByStep = [
  "criterion-stated",
  "distinction-shown",
] as const;

type UniquenessPathState = (typeof stateByStep)[number];

/** 对照路径：分支/企业为示意标签，两段相同末段编号来自口播"相似的内部编号" */
const PATHS = [
  { key: "jia", branch: "分支甲", company: "企业甲", tail: "102" },
  { key: "yi", branch: "分支乙", company: "企业乙", tail: "102" },
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state: UniquenessPathState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad up-root" data-state={state}>
      <header className="up-header">
        <h1 className="up-headline">完整路径与末段的区别</h1>
      </header>

      <div className="up-cards">
        <section className="up-card up-card-left">
          <p className="up-kicker up-kicker-left">只看末段</p>
          <div className="up-demo">
            {PATHS.map((path) => (
              <div className="up-row" key={path.key}>
                <span className="up-mask">
                  <i aria-hidden="true">⋯</i>
                </span>
                <span className="up-sep">·</span>
                <span className="up-tail">{path.tail}</span>
              </div>
            ))}
            <p className="up-rowcap">相似的内部编号</p>
            <p className="up-question">是不是同一个对象？</p>
          </div>
          <p className="up-verdict up-verdict-left">无法判断</p>
        </section>

        <div className="up-boundary">
          <span className="up-boundline" aria-hidden="true" />
          <span className="up-boundtag">不能只看末段</span>
        </div>

        <section className="up-card up-card-right">
          <p className="up-kicker up-kicker-right">完整路径</p>
          <div className="up-demo">
            {PATHS.map((path) => (
              <div className="up-row" key={path.key}>
                <span className="up-front">{path.branch}</span>
                <span className="up-front">{path.company}</span>
                <span className="up-sep">·</span>
                <span className="up-tail">{path.tail}</span>
              </div>
            ))}
            <p className="up-rowcap up-frontcap">位于不同的上级分支</p>
          </div>
          <p className="up-verdict up-verdict-right">能区分开</p>
        </section>
      </div>
    </div>
  );
}
