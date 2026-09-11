import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002InformationIslands.css";

/**
 * A002 · 信息连不起来 —— parallel-cards-with-takeaway
 * mechanism: equal-weight-accumulation —— 两张并列卡等权补齐，完成后不留当前选中项，
 *            底部 takeaway 结论条承载 R004 收束；不画断裂电缆或网络线。
 * states:    parties-isolated → breakpoints-listed → islands-concluded
 */
const states = [
  "parties-isolated",
  "breakpoints-listed",
  "islands-concluded",
] as const;

type A002State = (typeof states)[number];

const PARTIES = ["模具设计企业", "零部件加工企业", "模具代工企业", "客户方"];

const BREAKS = [
  { no: "01", title: "终端 IP 会暴露", note: "数据上传的时候", at: "0.8s" },
  { no: "02", title: "现场判断难直达设备", note: "数据要先汇总到物联平台", at: "4.6s" },
  { no: "03", title: "反向控制需再唤醒一次", note: "想反向控制设备的时候", at: "12.2s" },
];

const DOMAINS = ["生产管控", "加工质量", "企业运营"];

/** 口播报到点（秒），挂到元素的 transition/animation-delay 上 */
const vd = (d: string) => ({ "--ii-d": d }) as CSSProperties;

export default function A002InformationIslands({ step }: ChapterStepProps) {
  const state: A002State = states[step] ?? states[states.length - 1];
  const breaksOn = state !== "parties-isolated";
  const islandsOn = state === "islands-concluded";
  // 仅从 step 0 进入时播放整页装配动画；中途跳入直接落在稳定态
  const [fresh] = useState(step === 0);

  const sceneCls = [
    "ii-scene",
    "scene-pad",
    breaksOn ? "has-breaks" : "",
    islandsOn ? "has-islands" : "",
    fresh ? "is-fresh" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sceneCls}>
      <h1 className="ii-title">多个主体，信息却连不起来</h1>

      <div className="ii-cards">
        {/* 卡 1 · U003/S006 —— 四方主体各自握有信息，同级并列承载 R003 */}
        <section className="ii-card ii-card-parties">
          <p className="ii-lead">四方主体 · 各自握着信息</p>
          <div className="ii-party-grid">
            {PARTIES.map((name, i) => (
              <article key={name} className="ii-party" style={vd(`${2.4 + i * 1.2}s`)}>
                <span className="ii-slips" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <b>{name}</b>
              </article>
            ))}
          </div>
          <div className="ii-foot">
            <span className="ii-foot-lead" style={vd("7.6s")}>各自握着</span>
            <span className="ii-chip" style={vd("8.2s")}>设计信息</span>
            <span className="ii-chip" style={vd("8.9s")}>生产信息</span>
            <span className="ii-chip" style={vd("9.6s")}>安装信息</span>
            <span className="ii-foot-warn" style={vd("11.2s")}>很难共享</span>
          </div>
        </section>

        {/* 卡 2 · U004/S007 —— 信息难以共享的三个断点（step 1 依次补齐，与卡 1 等权） */}
        <section className="ii-card ii-card-breaks">
          <p className="ii-lead">信息难以共享 · 三个断点</p>
          <div className="ii-break-list">
            {BREAKS.map((b) => (
              <article key={b.no} className="ii-break" style={vd(b.at)}>
                <span className="ii-break-no hero-num">{b.no}</span>
                <div className="ii-break-body">
                  <h2>{b.title}</h2>
                  <p>{b.note}</p>
                </div>
                <span className="ii-break-mark" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* takeaway · U005/S008 —— R004（信息断点 → 依赖经验与信息孤岛）由结论条承载 */}
      <div className="ii-takeaway" aria-hidden={!islandsOn}>
        <span className="ii-take-label" style={vd("0.5s")}>问题叠在一起</span>
        <p className="ii-take-exp" style={vd("1.1s")}>
          运营往往只能依靠<b>熟练人员的经验</b>
        </p>
        <div className="ii-domains">
          {DOMAINS.map((d, i) => (
            <Fragment key={d}>
              {i > 0 && <span className="ii-gap" style={vd(`${2.6 + i * 0.6}s`)} aria-hidden="true" />}
              <span className="ii-domain" style={vd(`${2.6 + i * 0.6}s`)}>{d}</span>
            </Fragment>
          ))}
        </div>
        <p className="ii-islands-hero" style={vd("4.6s")}>信息孤岛</p>
      </div>
    </div>
  );
}
