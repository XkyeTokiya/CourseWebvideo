import "./ExistingSystems.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/* S-A004 · layered-bands-with-side-notes
 * step → semantic state（与 outline step 表逐字一致，允许重复） */
const stateByStep = [
  "workshop-context",
  "qts-band-in",
  "systems-equal",
  "limits-visible",
  "chain-break-takeaway",
] as const;

type ExistingState = (typeof stateByStep)[number];

/* U003 · 两条系统带等权（S005 / S006 为 exact，名称段逐字上屏，职责作标注） */
const SYSTEMS = [
  {
    tag: "系统 1",
    name: "质量追踪系统",
    en: "（Quality Tracking System，QTS）",
    duty: "专门追踪质量相关的信息",
  },
  {
    tag: "系统 2",
    name: "制造执行系统",
    en: "（MES）",
    duty: "管生产执行环节的信息",
  },
] as const;

const STAGES = ["仓储", "运输", "装卸"];

export default function ExistingSystems({ step }: ChapterStepProps) {
  const state: ExistingState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene es-scene state-${state}`}>
      <div className="scene-pad es-pad">
        <h1 className="es-headline serif-cn">既有系统与单件身份缺口</h1>

        {/* 上带 · 既有系统记录带（U003）：step1 空槽待补 → step2/3 两条带等权补齐 */}
        <section className="es-band es-band-records card" aria-label="既有系统记录带">
          <aside className="es-rail" aria-hidden="true">
            <span className="es-rail-label mono">既有系统</span>
          </aside>
          <div className="es-band-body">
            {SYSTEMS.map((sys, i) => (
              <div className="es-syscell" key={sys.tag}>
                <div
                  className={`es-slot-empty ${i === 0 ? "es-slot-a" : "es-slot-b"}`}
                  aria-hidden="true"
                >
                  <span className="mono">系统带 · 待补</span>
                </div>
                <article className={`es-sys card ${i === 0 ? "es-qts" : "es-mes"}`}>
                  <span className="es-sys-tag mono">{sys.tag}</span>
                  <h2 className="es-sys-name serif-cn">
                    {sys.name}
                    <span className="es-sys-en">{sys.en}</span>
                  </h2>
                  <p className="es-sys-duty">
                    <span className="es-duty-label mono">职责</span>
                    {sys.duty}
                  </p>
                  <div className="es-slats" aria-hidden="true">
                    <i className="es-slat" />
                    <i className="es-slat" />
                    <i className="es-slat" />
                    <i className="es-slat" />
                    <i className="es-slat" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* R002 · 记录带 → 局限带（basis，由上下分带 + 承接连接线承载） */}
        <div className="es-link es-link-records" aria-hidden="true">
          <i className="es-link-line" />
          <span className="es-link-label mono">一直在采集 · 提供采集记录</span>
          <i className="es-link-line" />
          <i className="es-link-arrow" />
        </div>

        {/* 下带 · 局限带（U004）：step4 补齐采集局限与质量码损毁 */}
        <section className="es-band es-band-limits card" aria-label="局限带">
          <aside className="es-rail" aria-hidden="true">
            <span className="es-rail-label es-rail-label-limits mono">局限带</span>
          </aside>
          <div className="es-band-body es-limits-body">
            <div className="es-limit-cell">
              <p className="es-limit-lead">
                采集，有时候<span className="es-limit-warn">不够及时、不够准确</span>
              </p>
              <div className="es-ticks" aria-hidden="true">
                <i className="es-tick" />
                <i className="es-tick" />
                <i className="es-tick es-tick-miss" />
                <i className="es-tick" />
                <i className="es-tick es-tick-off" />
                <i className="es-tick" />
              </div>
            </div>
            <div className="es-limit-cell">
              <p className="es-limit-lead">
                质量码经过流转<span className="es-limit-warn">会磨花、脱落</span>
              </p>
              <div className="es-journey" aria-hidden="true">
                <i className="es-journey-line" />
                {STAGES.map((stage, i) => (
                  <span className={`es-stop es-stop-${i + 1}`} key={stage}>
                    <i className="es-stop-mark" />
                    <b className="mono">{stage}</b>
                  </span>
                ))}
                <span className="es-code">
                  <i className="es-code-stripes" />
                  <i className="es-code-scratch" />
                </span>
                <i className="es-code-flake" />
              </div>
            </div>
          </div>
        </section>

        {/* R003 · 局限带 → 结论行（causal，由指向结论行的承接排布承载） */}
        <div className="es-link es-link-take" aria-hidden="true">
          <i className="es-link-line" />
          <span className="es-link-label mono">导致</span>
          <i className="es-link-line" />
          <i className="es-link-arrow" />
        </div>

        {/* 结论行（U005 · takeaway）：收束为判断，身份链会断 */}
        <footer className="es-takeaway card">
          <div className="es-take-judge">
            <span className="es-take-lead mono">结果就是</span>
            <p className="es-take-hero serif-cn">
              有记录<em>≠</em>身份链连续
            </p>
          </div>
          <div className="es-take-demo">
            <span className="es-part-chip es-part-now serif-cn">眼前这件零件</span>
            <span className="es-chain" aria-hidden="true">
              <i className="es-chain-seg es-chain-l" />
              <i className="es-chain-link" />
              <i className="es-chain-seg es-chain-r" />
              <i className="es-chain-gap" />
            </span>
            <span className="es-part-chip es-part-record serif-cn">记录里那件零件</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
