import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007ConditionMonitoring.css";

const states = [
  "condition-focus-opened",
  "anomaly-capture-read",
  "systems-linked",
  "scheme-rotating",
  "security-noted",
] as const;

type A007State = (typeof states)[number];

const STATE_CLASS: Record<A007State, string> = {
  "condition-focus-opened": "is-opened",
  "anomaly-capture-read": "is-capture",
  "systems-linked": "is-linked",
  "scheme-rotating": "is-rotating",
  "security-noted": "is-noted",
};

const SIGNALS = [
  { key: "temp", label: "异常温度", glyph: "cm-g-temp" },
  { key: "noise", label: "异常噪音", glyph: "cm-g-noise" },
  { key: "vib", label: "异常震动", glyph: "cm-g-vib" },
];

const FLOWS = [
  { verb: "下发", label: "工艺要求", glyph: "cm-g-down" },
  { verb: "上传", label: "运行状态", glyph: "cm-g-up" },
  { verb: "持续沉淀", label: "履历与日志", glyph: "cm-g-settle" },
];

const varI = (i: number) => ({ "--cm-i": String(i) }) as CSSProperties;

export default function A007ConditionMonitoring({ step }: ChapterStepProps) {
  const state: A007State = states[step] ?? states[states.length - 1];
  const captureOn = state !== "condition-focus-opened";
  const linkedOn =
    state === "systems-linked" ||
    state === "scheme-rotating" ||
    state === "security-noted";
  const rotatingOn = state === "scheme-rotating" || state === "security-noted";
  const notedOn = state === "security-noted";

  return (
    <div className={`cm-scene scene-pad ${STATE_CLASS[state]}`}>
      <header className="cm-head">
        <h1 className="cm-title">异常反馈进入设备监测</h1>
      </header>
      <div className="cm-head-rule rule" aria-hidden="true" />

      <div className="cm-main">
        <figure className="cm-media">
          <div className="cm-frame">
            <div className="cm-ph-wrap">
              <div className="cm-ph">
                <span className="cm-ph-tag">IMAGE · 16:9</span>
                <span className="cm-ph-title">模具维护与传感器采集现场</span>
                <span className="cm-ph-note">素材待提供(photorealistic_ai)</span>
              </div>
              <div className="cm-focus">
                <span className="cm-focus-label">加工过程 · 状态进入视野</span>
              </div>
            </div>
          </div>
          <figcaption className="cm-cap">
            <span>M003 · 模具维护与传感器采集现场(placeholder)</span>
            <span>现场图不显示仪表盘与阈值</span>
          </figcaption>
        </figure>

        <aside className="cm-rail">
          <article className={`cm-band${captureOn ? " is-on" : ""}`}>
            <span className="cm-band-no hero-num">01</span>
            <div className="cm-band-body">
              <header className="cm-band-head">
                <h2 className="cm-band-title">主动标识网关 · 采集异常信号</h2>
                <span className="cm-band-ref">R014</span>
              </header>
              <div className="cm-capture">
                <span className="cm-gw">主动标识网关</span>
                <span className="cm-gw-verb">
                  采集
                  <i className="cm-gw-tip" aria-hidden="true" />
                </span>
                <div className="cm-sigs">
                  {SIGNALS.map((s, i) => (
                    <span
                      key={s.key}
                      className={`cm-sig${captureOn ? " is-lit" : ""}`}
                      style={varI(i)}
                    >
                      <i className={`cm-g ${s.glyph}`} aria-hidden="true">
                        {s.key === "noise" ? <b /> : null}
                        {s.key === "noise" ? <b /> : null}
                        {s.key === "noise" ? <b /> : null}
                      </i>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cm-monitor">
                <p className="cm-monitor-line">
                  平台据此做<b>设备监测</b>
                </p>
                <p className="cm-monitor-line cm-monitor-sub">
                  结合机器学习与深度学习，支持<b>预测性维护</b>
                </p>
              </div>
            </div>
          </article>

          <article className={`cm-band${linkedOn ? " is-on" : ""}`}>
            <span className="cm-band-no hero-num">02</span>
            <div className="cm-band-body">
              <header className="cm-band-head">
                <h2 className="cm-band-title">标识解析 · 接通两套系统</h2>
                <span className="cm-band-ref">R015</span>
              </header>
              <div className="cm-systems">
                <span className="cm-sys" style={varI(0)}>
                  设计开发系统
                </span>
                <span className="cm-sys" style={varI(1)}>
                  生产制造系统
                </span>
              </div>
              <div className={`cm-rotate${rotatingOn ? " is-on" : ""}`}>
                <span className="cm-rotate-kicker">互联之后</span>
                <div className="cm-flows">
                  {FLOWS.map((f, i) => (
                    <span key={f.verb} className="cm-flow" style={varI(i)}>
                      <i className={`cm-g ${f.glyph}`} aria-hidden="true" />
                      {f.label}
                      <em>{f.verb}</em>
                    </span>
                  ))}
                </div>
                <p className="cm-verdict">
                  <i className="cm-cycle" aria-hidden="true" />
                  整套方案，<em>转了起来</em>
                </p>
              </div>
            </div>
          </article>
        </aside>
      </div>

      <div className="cm-judge-wrap">
        <section className={`cm-judge${notedOn ? " is-on" : ""}`} aria-hidden={!notedOn}>
          <span className="cm-judge-tag">案例中的安全考虑</span>
          <div className="cm-judge-main">
            <span className="cm-judge-node">主动标识载体</span>
            <span className="cm-judge-enc">
              <i className="cm-tri cm-tri-l" aria-hidden="true" />
              <i className="cm-lock" aria-hidden="true" />
              加密通信
              <i className="cm-tri cm-tri-r" aria-hidden="true" />
            </span>
            <span className="cm-judge-node">平台</span>
          </div>
          <div className="cm-judge-reduce">
            <span className="cm-cut">
              <i className="cm-cut-mark" aria-hidden="true" />
              减少&nbsp;中间环节的篡改
            </span>
            <span className="cm-cut">
              <i className="cm-cut-mark" aria-hidden="true" />
              减少&nbsp;终端 IP 暴露
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
