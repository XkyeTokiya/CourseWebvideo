import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010FullCircle.css";

const states = [
  "callback-set",
  "roles-mapped",
  "chain-closed",
] as const;

type A010State = (typeof states)[number];

const STATE_CLASS: Record<A010State, string> = {
  "callback-set": "is-set",
  "roles-mapped": "is-mapped",
  "chain-closed": "is-closed",
};

/* U027 <- G024：并列列举各方分工，不画系统互连 */
const ROLES = [
  { term: "平台", duty: "负责关联、分析和管理" },
  { term: "注塑机", duty: "负责执行" },
];

/* U028 <- G025：模具主动报告的内容（R022 载体） */
const REPORTS = ["加工了多少次", "现在在哪里", "运行得是否正常"];

/* S051 收束链：能追踪 · 能反馈 · 能管理 */
const CHAIN = ["能追踪", "能反馈", "能管理"];

const varI = (i: number) => ({ "--fc-i": String(i) }) as CSSProperties;

export default function A010FullCircle({ step }: ChapterStepProps) {
  const state: A010State = states[step] ?? states[states.length - 1];
  const mapped = state !== "callback-set";
  const closed = state === "chain-closed";

  return (
    <div className={`fc-scene scene-pad ${STATE_CLASS[state]}`}>
      <header className="fc-head">
        <h1 className="fc-title">
          主动标识驱动的<em>双向管理</em>
        </h1>
        <div className="fc-head-rule rule" aria-hidden="true" />
      </header>

      <div className="fc-main">
        <figure className="fc-media">
          <div className="fc-frame">
            <div className="fc-ph">
              <span className="fc-ph-tag">IMAGE · 16:9</span>
              <span className="fc-ph-title">外协模具现场 · 回扣开场</span>
              <span className="fc-ph-note">素材待提供（photorealistic_ai）</span>
            </div>
            <div className="fc-stamp" aria-hidden="true">
              <svg className="fc-stamp-ring" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="53"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray="9 8"
                />
                <polygon points="96,15 112,24 94,36" fill="currentColor" />
              </svg>
              <span className="fc-stamp-text">回到起点</span>
            </div>
          </div>
          <figcaption className="fc-cap">
            <span>M004 · 外协模具现场 · 回扣开场（placeholder）</span>
            <span>图片不承担系统关系与数据展示</span>
          </figcaption>
        </figure>

        <div className="fc-rail">
          <article className={`fc-band card fc-band-roles${mapped ? " is-on" : ""}`}>
            <header className="fc-band-head">
              <span className="fc-no hero-num">01</span>
              <h2 className="fc-band-title">围绕模具 · 分工协同</h2>
            </header>
            <div className="fc-rows">
              {ROLES.map((role, i) => (
                <div className="fc-row" key={role.term} style={varI(i)}>
                  <p className="fc-row-body">
                    <b>{role.term}</b>
                    <span className="fc-row-duty">{role.duty}</span>
                  </p>
                </div>
              ))}
              <div className="fc-row" style={varI(2)}>
                <p className="fc-row-body">
                  <span className="fc-sys-group">
                    <span className="fc-sys">设计开发系统</span>
                    <span className="fc-sys">生产制造系统</span>
                  </span>
                  <span className="fc-link-tag">由标识解析连接</span>
                </p>
              </div>
            </div>
          </article>

          <article className={`fc-band card fc-band-report${mapped ? " is-on" : ""}`}>
            <header className="fc-band-head">
              <span className="fc-no hero-num">02</span>
              <h2 className="fc-band-title">主动标识 · 让模具主动报告</h2>
            </header>

            <div className="fc-speak">
              <div className="fc-mold">
                <span className="fc-mold-chip">模具</span>
                <span className="fc-mold-sub">生产对象</span>
              </div>
              <div className="fc-speak-chips">
                {REPORTS.map((text, i) => (
                  <span className="fc-speak-chip" key={text} style={varI(i)}>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className="fc-dir">
              <span className="fc-dir-lead">同一条通道</span>
              <span className="fc-dir-tag" style={varI(0)}>
                <i className="fc-arr fc-arr-down" aria-hidden="true" />
                接收工艺参数
              </span>
              <span className="fc-dir-tag fc-dir-up" style={varI(1)}>
                <i className="fc-arr fc-arr-up" aria-hidden="true" />
                反馈运行异常
              </span>
            </div>

            <div className={`fc-close${closed ? " is-on" : ""}`}>
              <p className="fc-close-lead">
                从<span className="fc-close-from">散落记录</span>走向
                <span className="fc-close-to">一条双向链路</span>
              </p>
              <div className="fc-close-chain">
                {CHAIN.map((text, i) => (
                  <Fragment key={text}>
                    {i > 0 && (
                      <i className="fc-close-link" style={varI(i)} aria-hidden="true" />
                    )}
                    <span className="fc-close-node" style={varI(i)}>
                      {text}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
