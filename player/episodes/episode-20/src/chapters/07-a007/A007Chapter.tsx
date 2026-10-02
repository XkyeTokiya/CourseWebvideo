import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M003 from "./assets/M003.png";

/**
 * 07-a007 · 粒度与草案页（outline §7 · S-A007 · image-with-summary-rail）
 * 左图右栏读图：M003 场景图内三个粒度标记（型号/批次/单件）逐个点亮；
 * 右侧三张粒度卡按同序递进点亮，轨底挂「粒度决定字段，不是反过来」判断条；
 * 底部草案总结带首拍以空轨存在，第二拍在带内依次拼装五张要素卡后滑入
 * 尾卡「设计理由」，并内嵌来源条。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - granularity-laddered：图 + 三卡递进 + 轨底判断条弱权重
 *   （A007 · step 1，R017/R018 由三卡顺序与总结带相对位置承载）
 * - draft-banded：总结带拼装要素卡并挂注脚（A007 · step 2，
 *   R019/R020 由要素卡并列承载，R021 由带与来源条上下关系承载）
 * 护栏 C012：字段取舍取决于业务粒度，不补校验或接口字段；
 * 护栏 C013：不写具体字段取值、接口、校验算法或行业字段字典。
 */
const stateByStep = [
  "granularity-laddered",
  "draft-banded",
] as const;

type A007State = (typeof stateByStep)[number];

/** 图内三个粒度标记（x/y 为可视区百分比） */
const MARKS = [
  { key: "model", label: "型号", x: 18, y: 66 },
  { key: "batch", label: "批次", x: 48, y: 44 },
  { key: "unit", label: "单件", x: 77, y: 21 },
] as const;

/** 粒度递进卡（S036/S037/S038） */
const GRAINS = [
  { no: "1", goal: "管理产品型号", field: "靠产品代码承担差异" },
  { no: "2", goal: "追踪某次生产", field: "就需要批次号" },
  { no: "3", goal: "区分同批次的每一件", field: "再配序列号" },
] as const;

/** 草案要素卡（S039~S042，五卡并列等权） */
const DRAFT_CARDS = [
  "字段名称",
  "数据类型",
  "允许范围",
  "排列顺序与分隔",
  "必选或可选",
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state: A007State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad gr-root" data-state={state}>
      <header className="gr-head">
        <span className="gr-head-tick" aria-hidden="true" />
        <h1 className="gr-headline">先定粒度，再定字段</h1>
        <span className="gr-head-rule" aria-hidden="true" />
      </header>

      <div className="gr-main">
        <figure className="gr-media">
          <div className="gr-view">
            <img
              className="gr-media-img"
              src={M003}
              alt="匿名产品场景：型号、批次与单件的粒度（占位图，无编码与企业标识）"
            />
            {MARKS.map((mark, index) => (
              <span
                key={mark.key}
                className={`gr-mark gr-mark-${index + 1}`}
                style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
              >
                <i className="gr-mark-dot" aria-hidden="true" />
                <span className="gr-mark-label">{mark.label}</span>
              </span>
            ))}
          </div>
          <figcaption className="gr-media-note">
            <span className="gr-media-badge">匿名产品粒度场景</span>
            <span className="gr-media-tag">占位图</span>
          </figcaption>
        </figure>

        <div className="gr-rail">
          {GRAINS.map((grain, index) => (
            <div key={grain.no} className="gr-grain-wrap">
              <section
                className={`gr-grain gr-grain-${index + 1}`}
                aria-label={`粒度 ${grain.no}`}
              >
                <span className="gr-grain-no">{grain.no}</span>
                <div className="gr-grain-body">
                  <p className="gr-grain-goal">{grain.goal}</p>
                  <p className="gr-grain-field">{grain.field}</p>
                </div>
              </section>
              {index < 2 ? (
                <span className="gr-grain-arrow" aria-hidden="true" />
              ) : null}
            </div>
          ))}
          <div className="gr-verdict">
            <p className="gr-verdict-line">
              <b>粒度决定字段</b>，不是反过来
            </p>
          </div>
        </div>
      </div>

      <div className="gr-draft">
        <span className="gr-draft-label">规则草案</span>
        <div className="gr-draft-cards">
          {DRAFT_CARDS.map((card, index) => (
            <span
              key={card}
              className={`gr-dcard gr-dcard-${index + 1}`}
            >
              <i className="gr-dcard-no" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </i>
              {card}
            </span>
          ))}
          <span className="gr-dcard gr-dcard-reason">
            <i className="gr-dcard-no" aria-hidden="true">
              06
            </i>
            设计理由
            <span className="gr-dcard-note">区分授权值与企业约定</span>
          </span>
        </div>
        <p className="gr-draft-source">
          后来的人能分清：哪些值来自<b>授权体系</b>，哪些只是<b>企业内部的约定</b>
        </p>
      </div>
    </div>
  );
}
