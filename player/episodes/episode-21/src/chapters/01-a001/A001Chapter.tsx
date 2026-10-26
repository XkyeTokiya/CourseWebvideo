import "./A001Chapter.css";
import type {
  ChapterStepProps,
} from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 01-opening-question · 标题与开场问题页（outline §1 · S-A001 · time-anchor-opening）
 * mechanism: anchor-and-context — 车间设备现场作为持续锚点，双源数据流带
 * 依次补齐，汇流说明收进"一直没停"，问题行最后占据收束区。
 *
 * 左侧 SVG 场景负责"演"：设备与生产系统/外部两条脉冲流持续向上汇入
 * "同一工业对象"节点，节点上方记录层逐层堆积；M001 占位条按 16:9 比例
 * 留位。右侧 rail 负责"讲"：两条数据流卡、汇流句、累积判断。
 *
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - device-recording：标题、左侧场景与设备流带就位（step 1）
 * - dual-streams-running：生产系统/外部源与第二条流带落位，汇流句出现
 *   （step 2；R001 由数据流带区与问题收束区的上下排布承载）
 * - data-accumulating：记录层开始堆积，"数据是越来越多了"成为焦点，
 *   汇流句让位（step 3）
 * - value-question-open：问题 plate 升起，前区整体退后（step 4）
 *
 * 护栏 C001：不出现企业名称、真实编码、统计数字或软件界面；
 * 护栏 C002：开场场景只承担语境与问题引出，不承担教材证据。
 */
const states = [
  "device-recording",
  "dual-streams-running",
  "data-accumulating",
  "value-question-open",
] as const;

type BqState = (typeof states)[number];

/** 设备侧持续记录项（指导 S002）；SVG 流线标签与右侧卡共用语义 */
const DEVICE_SIGNALS = ["温度", "负载", "工艺参数"] as const;

/** 生产系统与外部侧（指导 S003） */
const SYSTEM_SIGNALS = ["订单", "物料", "名单"] as const;

/** 记录堆积层（step 3 逐层堆上，示意"越来越多了"） */
const PILE_LAYERS = [0, 1, 2, 3, 4] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const at = states.indexOf(state);

  // is-on 门控：元素在其所属 step 起持续保留，动画只在新进入时播一遍
  const deviceOn = true; // 锚点从第一步起常驻
  const systemOn = at >= states.indexOf("dual-streams-running");
  const accumulatingOn = at >= states.indexOf("data-accumulating");
  const questionOn = at >= states.indexOf("value-question-open");

  return (
    <div className="bq-scene scene-pad" data-state={state}>
      <header className="bq-head">
        <h1 className="bq-headline">
          工业大数据<em>从哪里来</em>、怎样产生价值
        </h1>
        <span className="bq-head-rule" aria-hidden="true" />
      </header>

      <div className="bq-main">
        {/* 图侧：SVG 演示 + M001 占位条 */}
        <figure className={`bq-scene-card card${deviceOn ? " is-on" : ""}`}>
          <svg
            viewBox="0 0 880 430"
            className="bq-svg"
            aria-hidden="true"
            role="presentation"
          >
            {/* 汇合节点：同一工业对象 */}
            <g className="bq-node">
              <rect x="330" y="196" width="220" height="64" rx="10" />
              <text x="440" y="236" textAnchor="middle">
                同一工业对象
              </text>
            </g>

            {/* 设备侧流线：三条并行脉冲，向上汇入节点 */}
            <g className={`bq-source bq-source--device${deviceOn ? " is-on" : ""}`}>
              <rect x="70" y="330" width="210" height="74" rx="10" />
              <text x="175" y="376" textAnchor="middle">
                车间设备 · 持续运行
              </text>
              {DEVICE_SIGNALS.map((label, i) => (
                <g key={label} className="bq-line" style={{ "--bq-i": i } as React.CSSProperties}>
                  <path
                    d={`M ${140 + i * 36} 330 C ${140 + i * 36} 270, ${350 + i * 10} 250, 352 ${216 + i * 12}`}
                  />
                  <text x={96 + i * 36} y={300 - i * 26}>
                    {label}
                  </text>
                </g>
              ))}
            </g>

            {/* 生产系统与外部侧流线：step 2 落位 */}
            <g className={`bq-source bq-source--system${systemOn ? " is-on" : ""}`}>
              <rect x="600" y="330" width="210" height="74" rx="10" />
              <text x="705" y="376" textAnchor="middle">
                生产系统 · 外部
              </text>
              {SYSTEM_SIGNALS.map((label, i) => (
                <g key={label} className="bq-line" style={{ "--bq-i": i } as React.CSSProperties}>
                  <path
                    d={`M ${670 + i * 36} 330 C ${670 + i * 36} 270, ${532 - i * 10} 250, 528 ${216 + i * 12}`}
                  />
                  <text x={736 + i * 30} y={300 - i * 26}>
                    {label}
                  </text>
                </g>
              ))}
            </g>

            {/* 记录堆积：step 3 逐层堆上，持续示意数据变多 */}
            <g className={`bq-pile${accumulatingOn ? " is-on" : ""}`}>
              {PILE_LAYERS.map((i) => (
                <rect
                  key={i}
                  className="bq-pile-layer"
                  x={392 - i * 7}
                  y={168 - i * 26}
                  width={96 + i * 14}
                  height={18}
                  rx={4}
                  style={{ "--bq-i": i } as React.CSSProperties}
                />
              ))}
              <text x="500" y="96" className="bq-pile-plus">
                还在增加 …
              </text>
            </g>
          </svg>

          <figcaption className="bq-media-slot">
            <span className="bq-media-tag">scene-image · M001 · 16:9</span>
            <span className="bq-media-desc">匿名车间设备持续记录现场（待提供）</span>
          </figcaption>
        </figure>

        {/* 文侧：两条流带 → 汇流句 → 累积判断 */}
        <div className="bq-rail">
          <div className="bq-streamcard is-on" data-tone="device">
            <p className="bq-stream-title">车间现场 · 一台设备正常开着</p>
            <p className="bq-stream-line">
              温度在变化，负载在波动，
              <br />
              工艺参数被一次次记录下来
            </p>
          </div>

          <div className={`bq-streamcard${systemOn ? " is-on" : ""}`} data-tone="system">
            <p className="bq-stream-title">生产系统与外部 · 同一对象的其他环节</p>
            <p className="bq-stream-line">
              订单在流转，物料在移动；
              <br />
              供应商名单和客户信息也在更新
            </p>
          </div>

          <div className={`bq-flow${systemOn ? " is-on" : ""}`}>
            <span className="bq-flow-mark" aria-hidden="true" />
            <p className="bq-flow-line">
              一个环节在出数据，另一个环节也在出数据，
              <strong>而且一直没停过</strong>
            </p>
          </div>

          <p className={`bq-accum${accumulatingOn ? " is-on" : ""}`}>
            数据是越来越多了
          </p>
        </div>
      </div>

      {/* 问题收束区：step 4 升起 */}
      <div className={`bq-plate${questionOn ? " is-on" : ""}`}>
        <p className="bq-plate-challenge">
          可数据多了，就代表价值来了吗？<strong>不一定。</strong>
        </p>
        <p className="bq-plate-line">
          这些来自不同环节的数据集合起来<strong>叫什么</strong>？
          又要经过怎样的过程，才可能变成<strong>能用的价值</strong>？
        </p>
      </div>
    </div>
  );
}
