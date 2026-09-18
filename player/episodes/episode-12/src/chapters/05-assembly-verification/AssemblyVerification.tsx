import "./AssemblyVerification.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A005 · 装配校验页（S-A021 · linear-steps-to-result）
 * 关系机制 ordered-progression：采集 → 两道校验 → 结果按真实先后点亮，
 * 完成后各槽并排保持等权，不轮播。
 */
const stateByStep = [
  "production-stage-set",
  "order-check-in",
  "product-check-paired",
  "result-exposed",
  "shift-boundary-noted",
] as const;

type AssemblyState = (typeof stateByStep)[number];

export default function AssemblyVerification({ step }: ChapterStepProps) {
  const state: AssemblyState = stateByStep[step] ?? stateByStep[stateByStep.length - 1];

  return (
    <div className={`scene av-scene state-${state}`}>
      <div className="scene-pad av-pad">
        <header className="av-head">
          <h1 className="av-headline serif-cn">装配前的两类一致性校验</h1>
          <hr className="rule av-head-rule" />
        </header>

        <div className="av-track fill">
          {/* 01 · 采集槽（U012 · G013） */}
          <section className="av-station av-station-capture">
            <span className="av-node av-node-capture" aria-hidden="true" />
            <div className="av-card card av-capture">
              <span className="av-tag mono">01 · 采集</span>
              <p className="av-capture-title serif-cn">实时采集</p>
              <p className="av-capture-sub">每一件待装零件的信息</p>
              <div className="av-readout">
                <div className="av-readout-empty mono">待补</div>
                <div className="av-readout-live" aria-hidden="true">
                  <span className="av-bar av-bar-1" />
                  <span className="av-bar av-bar-2" />
                  <span className="av-bar av-bar-3" />
                </div>
                <span className="av-scanline" aria-hidden="true" />
                <span className="av-part" aria-hidden="true">
                  <i className="av-part-code" />
                  <span className="av-part-name mono">待装件</span>
                </span>
              </div>
            </div>
          </section>

          {/* R009 · 采集供给核对（sequence） */}
          <div className="av-conn av-conn-supply" aria-hidden="true">
            <span className="av-conn-label mono">供给核对</span>
            <span className="av-conn-track">
              <span className="av-conn-line" />
              <span className="av-conn-head" />
            </span>
          </div>

          {/* 02 · 订单一致性（U013 · S023 exact） */}
          <section className="av-station av-station-check1">
            <span className="av-node av-node-check1" aria-hidden="true" />
            <div className="av-card card av-check av-check-order">
              <span className="av-tag mono">02 · 核对</span>
              <div className="av-check-body">
                <p className="av-check-title serif-cn">
                  <b className="av-check-name">订单一致性：</b>
                  <span className="av-check-q">核对当前订单</span>
                </p>
                <span className="av-check-underline" aria-hidden="true" />
              </div>
            </div>
          </section>

          {/* 03 · 产品一致性（U013 · S024 exact） */}
          <section className="av-station av-station-check2">
            <span className="av-node av-node-check2" aria-hidden="true" />
            <div className="av-card card av-check av-check-product">
              <span className="av-tag mono">03 · 核对</span>
              <div className="av-check-body">
                <p className="av-check-title serif-cn">
                  <b className="av-check-name">产品一致性：</b>
                  <span className="av-check-q">核对当前装配对象</span>
                </p>
                <span className="av-check-underline" aria-hidden="true" />
              </div>
            </div>
          </section>

          {/* R010 · 校验作用产生结果（causal） */}
          <div className="av-conn av-conn-effect" aria-hidden="true">
            <span className="av-conn-label mono">作用结果</span>
            <span className="av-conn-track">
              <span className="av-conn-line" />
              <span className="av-conn-head" />
            </span>
          </div>

          {/* 04 · 结果槽（U014 · G015 · terminal-result） */}
          <section className="av-station av-station-result">
            <span className="av-node av-node-result" aria-hidden="true" />
            <div className="av-card card av-result">
              <span className="av-tag mono">04 · 结果</span>
              <p className="av-result-hero serif-cn">装配之前</p>
              <p className="av-result-line">不一致大多在这里暴露，错装、漏装提前规避</p>
              <div className="av-risks">
                <span className="av-risk serif-cn">错装</span>
                <span className="av-risk serif-cn">漏装</span>
                <span className="av-risk-note mono">提前规避</span>
              </div>
              <div className="av-shift">
                <hr className="rule" />
                <div className="av-shift-head">
                  <span className="av-shift-label mono">检查位置 · 前移</span>
                  <span className="av-shift-arrow mono" aria-hidden="true">← 前移</span>
                </div>
                <div className="av-shift-strip">
                  <span className="av-shift-zone av-shift-zone-before serif-cn">装配之前</span>
                  <span className="av-shift-zone av-shift-zone-after serif-cn">事后查找</span>
                  <span className="av-shift-pin mono">检查</span>
                </div>
                <p className="av-shift-note">改变的是检查的位置</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
