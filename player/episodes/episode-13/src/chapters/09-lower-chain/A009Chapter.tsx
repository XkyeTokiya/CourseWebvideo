import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A009 · 下层链路 —— linear-steps-to-result / ordered-progression
 * 功能带（MES 内部分区）→ 设备带（五类现场设备）→ 链路汇总条，
 * 按真实层次自上而下推进：前层保持，后层落位，末拍汇成收束。
 */
const stateByStep = [
  "mes-internals-shown",
  "devices-connected",
  "chain-summarized",
] as const;

const MES_FUNCTIONS = ["生产管控", "质量管控", "物流管控"] as const;
const FIELD_DEVICES = ["现场终端", "安灯系统", "数据采集装置", "DNC 设备", "打码机"] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad lc-root" data-state={state}>
      <header className="lc-header">
        <span className="lc-heading-mark" aria-hidden="true" />
        <h1 className="lc-headline">MES 功能分区与现场设备</h1>
      </header>

      <div className="lc-stack">
        <div className="lc-bridge">
          <span className="lc-hub-chip">数据 HUB</span>
          <span className="lc-bridge-link" aria-hidden="true" />
          <span className="lc-bridge-tag">下方</span>
        </div>

        <section className="lc-mes" aria-label="MES 制造执行系统">
          <div className="lc-mes-id">
            <span className="lc-mes-abbr">MES</span>
            <span className="lc-mes-name">制造执行系统</span>
          </div>
          <div className="lc-mes-body">
            <span className="lc-mes-label">内部功能</span>
            <div className="lc-functions">
              {MES_FUNCTIONS.map((name, i) => (
                <span className="lc-fn-item" key={name}>
                  {i > 0 ? <span className="lc-fn-sep">、</span> : null}
                  <span className="lc-fn-chip">{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="lc-terminal">
            <span className="lc-terminal-tag">配有</span>
            <span className="lc-terminal-chip">展示终端</span>
          </div>
        </section>

        <div className="lc-trunks" aria-hidden="true">
          {FIELD_DEVICES.map((name) => (
            <span className="lc-trunk" key={name} />
          ))}
          <span className="lc-trunk-tag">驱动</span>
        </div>

        <section className="lc-devices" aria-label="现场设备">
          {FIELD_DEVICES.map((name) => (
            <div className="lc-device" key={name}>
              <span className="lc-device-tick" aria-hidden="true" />
              <span className="lc-device-name">{name}</span>
            </div>
          ))}
        </section>

        <div className="lc-collect" aria-hidden="true">
          <svg className="lc-collect-svg" viewBox="0 0 100 46" preserveAspectRatio="none">
            {FIELD_DEVICES.map((_, i) => (
              <path
                key={i}
                className="lc-collect-path"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                d={`M${10 + i * 20} 0 V 19`}
              />
            ))}
            <path
              className="lc-collect-path"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              d="M10 19 H 90"
            />
            <path
              className="lc-collect-path"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              d="M50 19 V 46"
            />
          </svg>
          <span className="lc-collect-tag">汇成</span>
        </div>

        <section className="lc-chain" aria-label="完整数据链路">
          <span className="lc-chain-tag">数据链路</span>
          <span className="lc-seg lc-seg-1">业务系统</span>
          <span className="lc-hop lc-hop-1">
            <em>经</em>
            <b>→</b>
          </span>
          <span className="lc-seg lc-seg-2">接口与制造执行系统</span>
          <span className="lc-hop lc-hop-2">
            <em>再到</em>
            <b>→</b>
          </span>
          <span className="lc-seg lc-seg-3">现场设备</span>
        </section>
      </div>
    </div>
  );
}
