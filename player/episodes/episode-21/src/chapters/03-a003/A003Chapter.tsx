import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003Chapter.css";

/**
 * 03-three-sources · 三类来源与汇合（outline §3 · S-A003 · condition-key-goal）
 * mechanism: equal-weight-accumulation — 来源问题卡先行落位，三张来源卡在
 * 固定三栏内按序补齐且保持等权（不产生当前选中项）；末拍三股汇流线自卡底
 * 画出、汇合判断条收束。R004（转向问题引出来源分层）由问题卡与三卡的先后
 * 位置承载，R005（两类来源并列）由第二、三卡并列排布承载，R006（来源汇合
 * 支撑覆盖）由卡区与判断条的相邻次序承载。
 *
 * step → semantic state（0 基，末态兜底，与 outline step 一一对应）：
 * question-framed → business-sourced → device-sourced → external-sourced →
 * confluence-judged。
 *
 * exact 义务：S018/S019/S020（ERP/PLM/SCM 全称标签）、S026（孤立记录否定
 * 句）整句逐字渲染；S022 以"第二类是设备作业数据"标题行 + "由生产设备和
 * 监测设备在运行中持续产生"导语行连续逐字承载。护栏 C004：系统名只作来源
 * 名称，不画软件界面；C005：设备侧只表现运行记录，不虚构参数数值或品牌。
 */
const stateByStep = [
  "question-framed",
  "business-sourced",
  "device-sourced",
  "external-sourced",
  "confluence-judged",
] as const;

/** 第一类系统名标签（exact：S018/S019/S020 全称逐字） */
const SYSTEM_TAGS = [
  "企业资源计划系统 ERP",
  "产品生命周期管理系统 PLM",
  "供应链管理系统 SCM",
] as const;

/** 第二类运行记录行（指导 S023，不虚构数值） */
const DEVICE_RECORDS = ["加工负载", "焊接", "拧紧", "环境温湿度"] as const;

/** 第三类示例（指导 S024） */
const EXTERNAL_LISTS = ["客户名单", "供应商名单"] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const businessOn = step >= 1;
  const deviceOn = step >= 2;
  const externalOn = step >= 3;
  const judgedOn = step >= 4;

  const rootCls = [
    "ts-scene",
    "scene-pad",
    businessOn && "is-business",
    deviceOn && "is-device",
    externalOn && "is-external",
    judgedOn && "is-judged",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="ts-head">
        <h1 className="ts-headline">
          来源分成<em>三类</em>
        </h1>
        <div className="ts-head-rule rule" />
      </header>

      {/* 条件卡：来源问题（S016），R004 的先后位置起点 */}
      <section className="ts-question card" aria-label="来源问题">
        <p className="ts-question-text">
          这么多数据，具体<em>从哪儿来</em>？
        </p>
        <span className="ts-question-arrow" aria-hidden="true">
          <svg viewBox="0 0 56 24" width="56" height="24">
            <path d="M2 12 H44" className="ts-arrow-line" />
            <path d="M40 4 L52 12 L40 20" className="ts-arrow-line" />
          </svg>
        </span>
        <span className="ts-question-tag">大致可以分成三类</span>
      </section>

      {/* 三栏来源卡：等权并列，逐卡补齐（U007） */}
      <div className="ts-cards">
        <section
          className={`ts-card card ts-card--business${businessOn ? " is-on" : ""}`}
          data-tone="structural"
          aria-label="第一类来源"
        >
          <p className="ts-card-no hero-num">01</p>
          <p className="ts-card-title">
            <span className="ts-card-ord">第一类是</span>生产经营业务数据
          </p>
          <p className="ts-card-lead">来自企业里的业务系统</p>
          <div className="ts-sys-tags">
            {SYSTEM_TAGS.map((t, i) => (
              <span
                key={t}
                className="ts-sys-tag"
                style={{ "--ts-j": i } as CSSProperties}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="ts-card-foot">记录企业在研发、生产经营和供应协同里的业务活动</p>
        </section>

        <section
          className={`ts-card card ts-card--device${deviceOn ? " is-on" : ""}`}
          data-tone="process"
          aria-label="第二类来源"
        >
          <p className="ts-card-no hero-num">02</p>
          <p className="ts-card-title">
            <span className="ts-card-ord">第二类是</span>设备作业数据
          </p>
          <p className="ts-card-lead">
            由生产设备和监测设备在运行中持续产生
          </p>
          <div className="ts-record-chips">
            {DEVICE_RECORDS.map((r, i) => (
              <span
                key={r}
                className="ts-record-chip"
                style={{ "--ts-j": i } as CSSProperties}
              >
                {r}
              </span>
            ))}
          </div>
          <p className="ts-card-foot">都属于这类运行记录</p>
        </section>

        <section
          className={`ts-card card ts-card--external${externalOn ? " is-on" : ""}`}
          data-tone="warning"
          aria-label="第三类来源"
        >
          <p className="ts-card-no hero-num">03</p>
          <p className="ts-card-title">
            <span className="ts-card-ord">第三类是</span>外部数据
          </p>
          <div className="ts-record-chips">
            {EXTERNAL_LISTS.map((r, i) => (
              <span
                key={r}
                className="ts-record-chip"
                style={{ "--ts-j": i } as CSSProperties}
              >
                {r}
              </span>
            ))}
          </div>
          <p className="ts-card-lead ts-card-lead--foot">它们来自企业外部</p>
        </section>
      </div>

      {/* 汇合判断条：三股汇流线 + 判断（U008） */}
      <div className={`ts-judge${judgedOn ? " is-on" : ""}`} aria-hidden={!judgedOn}>
        <svg viewBox="0 0 1700 56" className="ts-merge-svg" aria-hidden="true">
          <path d="M283 4 C283 40 500 40 850 40" pathLength={1} className="ts-merge-line" />
          <path d="M850 4 V40" pathLength={1} className="ts-merge-line" />
          <path d="M1427 4 C1427 40 1200 40 850 40" pathLength={1} className="ts-merge-line" />
          <circle cx="850" cy="44" r="7" className="ts-merge-dot" />
        </svg>
        <div className="ts-judge-plate card-glass">
          <span className="ts-judge-kicker">汇合判断</span>
          <div className="ts-judge-lines">
            <p className="ts-judge-positive">
              三类来源汇合到一起，才有机会覆盖
              <span className="ts-cover-chip">对象</span>
              <span className="ts-cover-chip">过程</span>
              <span className="ts-cover-chip">外部关系</span>
            </p>
            <p className="ts-judge-negative">
              只剩单一环节的孤立记录，<strong>谈不上工业大数据</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
