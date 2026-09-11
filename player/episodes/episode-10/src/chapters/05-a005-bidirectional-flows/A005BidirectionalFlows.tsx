import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005BidirectionalFlows.css";

const states = [
  "two-directions-opened",
  "downlink-set",
  "uplink-set",
  "monitoring-closed",
] as const;

type A005State = (typeof states)[number];

export default function A005BidirectionalFlows({ step }: ChapterStepProps) {
  const state: A005State = states[step] ?? states[states.length - 1];

  // 语义态 → 槽位状态（不把 step 当 active 索引）
  const downOn = state !== "two-directions-opened";
  const upOn = state === "uplink-set" || state === "monitoring-closed";
  const pivotOn = state === "monitoring-closed";

  return (
    <div className={`bf-scene scene-pad is-${state}`}>
      <h1 className="bf-title">参数下发，状态上报</h1>

      <div className="bf-main">
        {/* 左栏 · 下行（R009：平台 → 下发 → 工艺参数，阅读方向由流向承载） */}
        <section className={`bf-lane bf-lane-down${downOn ? " is-set" : ""}`}>
          <div className="bf-lane-head">
            <span className="bf-lane-tag">下行</span>
            <span className="bf-lane-dir">平台 → 设备</span>
          </div>
          <p className="bf-lane-cap">平台把工艺参数下发给设备</p>
          <div className="bf-node">
            <b>平台</b>
            <i className="bf-node-role">下发工艺参数</i>
          </div>
          <div className="bf-track">
            <span className="bf-rail" aria-hidden="true" />
            <span className="bf-flow" aria-hidden="true" />
            <span className="bf-tip bf-tip-down" aria-hidden="true" />
            <span className="bf-chip bf-chip-param bf-chip-a">温度</span>
            <span className="bf-chip bf-chip-param bf-chip-b">压力</span>
          </div>
          <div className="bf-node">
            <b>设备 · 注塑机</b>
            <i>模具在这里被加工</i>
          </div>
        </section>

        {/* 中部判据（U013/S022）：同一副模具，双向监控收束 */}
        <aside className={`bf-pivot${pivotOn ? " is-closed" : ""}`}>
          <div className="bf-mold">
            <span className="bf-ring-wrap" aria-hidden="true">
              <span className="bf-ring" />
            </span>
            <b className="bf-mold-name">模具</b>
            <i className="bf-mold-note">设备上的加工对象</i>
          </div>
          <div className={`bf-verdict${pivotOn ? " is-on" : ""}`}>
            <span className="bf-verdict-chip">已立</span>
            <p className="bf-verdict-hero">双向监控</p>
            <p className="bf-verdict-text">
              工艺要求与现场状态围绕同一副模具来回流动
            </p>
          </div>
        </aside>

        {/* 右栏 · 上行（R010：设备运行状态 → 上行回传 → 平台，与左栏等权对照） */}
        <section className={`bf-lane bf-lane-up${upOn ? " is-set" : ""}`}>
          <div className="bf-lane-head">
            <span className="bf-lane-tag">上行</span>
            <span className="bf-lane-dir">设备 → 平台</span>
          </div>
          <p className="bf-lane-cap">设备把运行状态传回平台</p>
          <div className="bf-node">
            <b>平台</b>
            <i className="bf-node-role">接收运行状态</i>
          </div>
          <div className="bf-track">
            <span className="bf-rail" aria-hidden="true" />
            <span className="bf-flow" aria-hidden="true" />
            <span className="bf-tip bf-tip-up" aria-hidden="true" />
            <span className="bf-chip bf-chip-status">加工中的异常震动</span>
          </div>
          <div className="bf-node">
            <b>设备 · 注塑机</b>
            <i>模具在这里被加工</i>
          </div>
        </section>
      </div>
    </div>
  );
}
