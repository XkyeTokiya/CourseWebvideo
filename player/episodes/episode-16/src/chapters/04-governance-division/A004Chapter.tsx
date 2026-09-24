import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M002 from "./assets/M002.png";

/**
 * A004 · 治理分工 —— image-with-reading-notes
 * 现场图像持续在场，读图序先 DONA 后 MPA 迁移阅读焦点，
 * 要点区补充 MPA 落点，takeaway 收束逐层分配链条。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "dona-established",
  "mpa-annotated",
  "chain-summarized",
] as const;

type A004State = (typeof stateByStep)[number];

export default function A004Chapter({ step }: ChapterStepProps) {
  const state: A004State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad gd-root" data-state={state}>
      <header className="gd-header">
        <span className="gd-header-mark" aria-hidden="true" />
        <h1 className="gd-headline">治理层与实际分配</h1>
        <span className="gd-header-sub">一级前缀之上的两级机构</span>
      </header>

      <div className="gd-main">
        <div className="gd-notes">
          <section className="gd-reading">
            <p className="gd-reading-title">读图序 · 先 DONA 后 MPA</p>
            <ol className="gd-stops">
              <li className="gd-stop gd-stop-dona">
                <span className="gd-stop-num">01</span>
                <div className="gd-stop-body">
                  <div className="gd-stop-name-row">
                    <p className="gd-stop-name">数字对象编码规范机构</p>
                    <span className="gd-stop-abbr">DONA</span>
                  </div>
                  <p className="gd-stop-duty">全球注册 · 解析服务</p>
                  <p className="gd-stop-verbs">运营 · 管理 · 维护 · 协调</p>
                </div>
                <span className="gd-stop-read">已读</span>
              </li>
              <li className="gd-stop gd-stop-mpa">
                <span className="gd-stop-num">02</span>
                <div className="gd-stop-body">
                  <div className="gd-stop-name-row">
                    <p className="gd-stop-name">全球并联顶级前缀管理机构</p>
                    <span className="gd-stop-abbr">MPA</span>
                  </div>
                  <p className="gd-stop-duty">一级前缀下面的子前缀</p>
                  <p className="gd-stop-verbs">分配 · 管理</p>
                </div>
                <span className="gd-stop-read">已读</span>
              </li>
            </ol>
          </section>

          <section className="gd-keypoints">
            <div className="gd-keypoints-text">
              <p className="gd-keypoints-kicker">要点</p>
              <p className="gd-keypoints-line">MPA 的落点：一级前缀下面的子前缀</p>
            </div>
            <div className="gd-nest-wrap">
              <span className="gd-nest" aria-hidden="true">
                <span className="gd-nest-outer-label">一级前缀</span>
                <span className="gd-nest-inner">子前缀</span>
                <span className="gd-nest-inner">子前缀</span>
              </span>
              <span className="gd-keypoints-note">结构示意</span>
            </div>
          </section>

          <section className="gd-takeaway">
            <p className="gd-takeaway-lead">分配逐层往下</p>
            <div className="gd-chain">
              <div className="gd-chain-node">
                <span className="gd-chain-tier">一级前缀</span>
                <span className="gd-chain-note">由上面分配下来</span>
              </div>
              <span className="gd-chain-arrow" aria-hidden="true" />
              <div className="gd-chain-node">
                <span className="gd-chain-tier">子前缀</span>
                <span className="gd-chain-note">一层一层往下走</span>
              </div>
              <span className="gd-chain-arrow" aria-hidden="true" />
              <div className="gd-chain-node">
                <span className="gd-chain-tier">企业 / 组织</span>
                <span className="gd-chain-note">在自己的前缀下区分对象</span>
              </div>
            </div>
          </section>
        </div>

        <figure className="gd-scene">
          <img
            className="gd-scene-img"
            src={M002}
            alt="两级治理职责的现场语境（占位图）"
          />
          <span className="gd-focus gd-focus-dona">
            <span className="gd-focus-tag">① DONA · 全球注册与解析服务</span>
          </span>
          <span className="gd-focus gd-focus-mpa">
            <span className="gd-focus-tag">② MPA · 一级前缀下的子前缀</span>
          </span>
          <span className="gd-reading-path" aria-hidden="true" />
          <figcaption className="gd-scene-caption">
            <span className="gd-scene-badge">治理现场</span>
            <span className="gd-scene-note">现场语境 · 占位图</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
