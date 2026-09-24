import "./A011Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "recap-established",
  "entry-card-set",
  "position-card-set",
  "segment-card-set",
  "judgment-converged",
  "anchor-returned",
] as const;

const STATIONS = ["运输", "销售", "维护", "回收"] as const;

function BatteryGlyph() {
  return (
    <svg className="tdr-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="5"
        y="14"
        width="33"
        height="22"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
      />
      <rect x="41" y="21" width="4.5" height="8" rx="1.4" fill="currentColor" />
      <path
        d="M24 18.5 17 27.5h4.8L20 34l7.6-9.6h-4.8L24 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function A011Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad tdr-root" data-state={state}>
      <header className="tdr-header">
        <span className="tdr-heading-mark" aria-hidden="true" />
        <h1 className="tdr-headline">三层职责的收束</h1>
      </header>

      {/* 回扣区：开场电池旅程带重现；拍 6 在带下补出共同落点 */}
      <div className="tdr-recap">
        <span className="tdr-route" aria-hidden="true" />
        <span className="tdr-battery" aria-hidden="true">
          <BatteryGlyph />
        </span>
        {STATIONS.map((name, index) => (
          <div className={`tdr-station tdr-st-${index + 1}`} key={name}>
            <span className="tdr-station-dot" aria-hidden="true" />
            <span className="tdr-station-name">{name}</span>
            <span className="tdr-record">
              <i aria-hidden="true" />
              记录
            </span>
            <span className="tdr-stub" aria-hidden="true" />
          </div>
        ))}
        <div className="tdr-preview">
          <div className="tdr-preview-layers" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p className="tdr-preview-text">VAA 给它的身份分了三层</p>
        </div>
        <span className="tdr-anchor-line" aria-hidden="true" />
        <div className="tdr-anchor-tip">
          <i aria-hidden="true" />
          共同的落点
        </div>
      </div>

      {/* 汇合连接：三卡 → 底部判断 */}
      <div className="tdr-join" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* 三张职责卡：并列等权，逐拍补齐 */}
      <div className="tdr-cards">
        <div className="tdr-slot tdr-slot-1">
          <div className="tdr-ghost" aria-hidden="true">
            <span>？</span>
          </div>
          <article className="tdr-card">
            <div className="tdr-card-top">
              <span className="tdr-card-kicker">入口</span>
              <span className="tdr-card-no">01</span>
            </div>
            <h2 className="tdr-card-title">发码机构代码</h2>
            <div className="tdr-card-diagram">
              <div className="tdr-entry" aria-hidden="true">
                <span className="tdr-entry-root">共同的上级</span>
                <span className="tdr-entry-stem" />
                <span className="tdr-entry-branch" />
                <div className="tdr-entry-slots">
                  <span />
                  <span />
                </div>
                <span className="tdr-entry-cap">后面的定位</span>
              </div>
            </div>
            <p className="tdr-card-body">指明这套身份由谁管理</p>
          </article>
        </div>

        <div className="tdr-slot tdr-slot-2">
          <div className="tdr-ghost" aria-hidden="true">
            <span>？</span>
          </div>
          <article className="tdr-card">
            <div className="tdr-card-top">
              <span className="tdr-card-kicker">定位</span>
              <span className="tdr-card-no">02</span>
            </div>
            <h2 className="tdr-card-title">服务机构代码</h2>
            <div className="tdr-card-diagram">
              <div className="tdr-tiers" aria-hidden="true">
                <span className="tdr-tier">国家</span>
                <span className="tdr-tier">行业</span>
                <span className="tdr-tier">企业</span>
              </div>
            </div>
            <p className="tdr-card-body">负责定位，用三层说清它属于谁</p>
          </article>
        </div>

        <div className="tdr-slot tdr-slot-3">
          <div className="tdr-ghost" aria-hidden="true">
            <span>？</span>
          </div>
          <article className="tdr-card">
            <div className="tdr-card-top">
              <span className="tdr-card-kicker">细分</span>
              <span className="tdr-card-no">03</span>
            </div>
            <h2 className="tdr-card-title">企业内部编码</h2>
            <div className="tdr-card-diagram">
              <div className="tdr-tiles" aria-hidden="true">
                <span className="tdr-tile">产品</span>
                <span className="tdr-tile">批次</span>
                <span className="tdr-tile">具体对象</span>
              </div>
            </div>
            <p className="tdr-card-body">由企业决定怎样区分开</p>
          </article>
        </div>
      </div>

      {/* takeaway 判断区：拍 5 汇合，拍 6 在下方补出身份落点 */}
      <div className="tdr-takeaway">
        <div className="tdr-take-ghost" aria-hidden="true">
          <span>？</span>
        </div>
        <p className="tdr-take-lead">三层合起来，就是这一集的核心判断</p>
        <p className="tdr-take-clause tdr-take-a">
          统一的上层结构提供可管理的位置
        </p>
        <p className="tdr-take-clause tdr-take-b">企业自己的那一段保留管理弹性</p>
        <p className="tdr-take-connect">
          两者连在一起，对象才能既被整个体系认出来，又不必放弃企业原有的管理方式
        </p>
      </div>

      <div className="tdr-final">
        <p className="tdr-final-line">
          身份在被管理的位置上，跨环节的记录有共同的落点
        </p>
        <p className="tdr-final-strong">
          <span>换系统、换流程，这个对象的身份不用跟着重来</span>
        </p>
      </div>
    </div>
  );
}
