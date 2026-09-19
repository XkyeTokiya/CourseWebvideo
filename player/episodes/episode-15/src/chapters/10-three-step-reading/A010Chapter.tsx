import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M004 from "./assets/M004.png";

const stateByStep = [
  "three-steps-laid",
  "shared-own-split",
  "misread-guarded",
  "autonomy-bounded",
] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad tsr-root" data-state={state}>
      <header className="tsr-header">
        <span className="tsr-heading-mark" aria-hidden="true" />
        <h1 className="tsr-headline">三步读法与边界</h1>
      </header>

      <div className="tsr-main">
        {/* 情境图（M004）：读法回扣的语境落点，全程持续；拍 3 在图上落误读防线判断 */}
        <figure className="tsr-media">
          <div className="tsr-media-frame">
            <img
              className="tsr-media-img"
              src={M004}
              alt="工业编码核对场景占位图"
            />
            <div className="tsr-guard">
              <p className="tsr-guard-text">
                <em className="tsr-guard-lead">分开看</em>
                ，就不会把企业内部编号误当成全球层级的代码
              </p>
            </div>
          </div>
          <figcaption className="tsr-media-cap">核对场景 · 占位</figcaption>
        </figure>

        {/* 洞察轨：三步读法按口播报到点依次点亮；轨侧分段标注共有/自治 */}
        <aside className="tsr-rail">
          <p className="tsr-rail-kicker">拿到一条 VAA 编码，三步就够了</p>

          <div className="tsr-zone tsr-zone-shared">
            <div className="tsr-row tsr-row-1">
              <span className="tsr-node" aria-hidden="true">
                <span className="tsr-node-core">01</span>
              </span>
              <div className="tsr-row-body">
                <p className="tsr-row-head">
                  <span className="tsr-pos">开头</span>
                  <span className="tsr-row-name">发码机构代码</span>
                </p>
                <div className="tsr-seg tsr-seg-head" aria-hidden="true">
                  <i />
                </div>
              </div>
            </div>

            <div className="tsr-row tsr-row-2">
              <span className="tsr-link" aria-hidden="true" />
              <span className="tsr-node" aria-hidden="true">
                <span className="tsr-node-core">02</span>
              </span>
              <div className="tsr-row-body">
                <p className="tsr-row-head">
                  <span className="tsr-pos">中段</span>
                  <span className="tsr-row-name">服务机构代码</span>
                </p>
                <div className="tsr-seg tsr-seg-mid" aria-hidden="true">
                  <i className="tsr-layer">国家</i>
                  <i className="tsr-layer">行业</i>
                  <i className="tsr-layer">企业</i>
                </div>
              </div>
            </div>

            <span className="tsr-zone-label">共有 · 体系与层级定位</span>
          </div>

          <div className="tsr-zone tsr-zone-own">
            <div className="tsr-row tsr-row-3">
              <span className="tsr-link" aria-hidden="true" />
              <span className="tsr-node" aria-hidden="true">
                <span className="tsr-node-core">03</span>
              </span>
              <div className="tsr-row-body">
                <p className="tsr-row-head">
                  <span className="tsr-pos">末段</span>
                  <span className="tsr-row-name">企业内部编码</span>
                </p>
                <div className="tsr-seg tsr-seg-tail" aria-hidden="true" />
                <div className="tsr-autonomy">
                  <div className="tsr-autonomy-tokens">
                    <span className="tsr-token">写什么字段</span>
                    <span className="tsr-token">多长</span>
                    <span className="tsr-token">要不要校验位</span>
                  </div>
                  <p className="tsr-autonomy-line">由企业按自身业务决定</p>
                </div>
              </div>
            </div>

            <span className="tsr-zone-label">自治 · 企业对象细分</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
