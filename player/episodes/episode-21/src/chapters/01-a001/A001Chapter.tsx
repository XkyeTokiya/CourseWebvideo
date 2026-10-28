import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001Chapter.css";
import m001 from "./assets/m001.png";

/**
 * 01-opening-question · 标题与开场问题（outline §1 · S-A001 · time-anchor-opening）
 * mechanism: anchor-and-context — M001 现场图作为持续锚点，SVG 演示两条
 * 数据流（设备 / 生产系统·外部）汇入"同一工业对象"，记录层随累积判断
 * 逐层堆上，问题 plate 最后收束。R001（场景引出价值问题）由 SVG 流带区
 * 与底部问题收束区的上下排布承载。
 *
 * step → semantic state（0 基，末态兜底）。runtime 以批准口播 4 拍为边界：
 * - 拍 1【视频标题】：建立标题区、现场图与设备流带（device-recording）；
 * - 拍 2【开场导入】：设备流带信号补齐，仍是 device-recording（state 重复）；
 * - 拍 3：同一 step 内依次完成"生产系统·外部流带落位 → 汇流说明 →
 *   '数据是越来越多了'累积聚焦"，dual-streams-running 为过程中画面，
 *   终态为 data-accumulating；
 * - 拍 4：问题收束区出现两行问句，前区弱化（value-question-open）。
 *
 * 护栏 C001：不出现企业名称、真实编码、统计数字或软件界面；
 * 护栏 C002：开场只承担语境与问题引出，不承担教材证据。
 */
const stateByStep = [
  "device-recording",
  "device-recording",
  "data-accumulating",
  "value-question-open",
] as const;

/** 设备流带信号（nx 拍 2：温度在变化，负载在波动，工艺参数被一次次记录下来） */
const DEVICE_SIGNALS = ["温度变化", "负载波动", "工艺参数逐次记录"] as const;

/** 生产系统与外部流带信号（指导 S003：订单流转、物料移动、名单更新） */
const SYSTEM_SIGNALS = ["订单流转", "物料移动", "名单更新"] as const;

/** 记录堆积层宽度（示意"越来越多了"，非统计数值） */
const PILE_WIDTHS = [200, 244, 224, 264, 292] as const;

function ChipRow({
  signals,
  tone,
  x,
  yStart,
  gap,
}: {
  signals: readonly string[];
  tone: "a" | "b";
  x: number;
  yStart: number;
  gap: number;
}) {
  return (
    <>
      {signals.map((label, i) => (
        <g
          key={label}
          className={`op-chip op-chip--${tone}`}
          style={{ "--op-i": i } as CSSProperties}
        >
          <rect x={x} y={yStart + i * gap} width="268" height="34" rx="8" />
          <text x={x + 16} y={yStart + i * gap + 24}>
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const signalsOn = step >= 1;
  const systemOn = step >= 2;
  const questionOn = step >= 3;

  const rootCls = [
    "op-scene",
    "scene-pad",
    signalsOn && "is-signals",
    systemOn && "is-system",
    questionOn && "is-question",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="op-head">
        <h1 className="op-headline">
          工业大数据<em>从哪里来</em>、<em>怎样产生价值</em>
        </h1>
        <div className="op-head-rule rule" />
      </header>

      <div className="op-main">
        <div className="op-side">
          <figure className="op-media card">
            <img
              className="op-media-shot"
              src={m001}
              alt="匿名车间设备持续记录现场（M001 占位图，现场图待提供）"
            />
            <figcaption className="op-media-cap">
              <span>匿名车间 · 设备持续记录现场</span>
              <span className="op-media-missing">M001 · 现场图待提供</span>
            </figcaption>
          </figure>

          <section className="op-live card" aria-label="现场状态">
            <div className="op-live-text">
              <p className="op-live-line">一台设备正常开着</p>
              <p className="op-live-q">车间里会发生什么？</p>
            </div>
            <span className="op-live-tag">
              <i className="op-pulse" aria-hidden="true" />
              持续记录中
            </span>
          </section>
        </div>

        <div className="op-stage">
          <svg
            viewBox="0 0 1000 470"
            className="op-svg"
            role="img"
            aria-label="设备与生产系统、外部两条数据流，汇入同一工业对象"
          >
            {/* 生产系统·外部源：未落位时保留虚线空槽 */}
            <g className="op-src-b-ghost">
              <rect x="6" y="280" width="316" height="180" rx="14" />
              <text x="164" y="378" textAnchor="middle">
                待落位
              </text>
            </g>
            <g className="op-src-b" aria-hidden="true">
              <rect x="14" y="288" width="316" height="180" rx="14" className="op-plate-shadow" />
              <rect x="6" y="280" width="316" height="180" rx="14" className="op-plate" />
              <text x="30" y="330" className="op-src-title">
                生产系统 · 外部
              </text>
              <ChipRow signals={SYSTEM_SIGNALS} tone="b" x={30} yStart={348} gap={38} />
            </g>

            {/* 设备源：常驻锚点侧的数据源头 */}
            <g className="op-src-a" aria-hidden="true">
              <rect x="14" y="24" width="316" height="196" rx="14" className="op-plate-shadow" />
              <rect x="6" y="16" width="316" height="196" rx="14" className="op-plate" />
              <text x="30" y="66" className="op-src-title">
                设备
              </text>
              <ChipRow signals={DEVICE_SIGNALS} tone="a" x={30} yStart={88} gap={38} />
            </g>

            {/* 两条流线：画线生长 + 持续流动 */}
            <path
              d="M 322 114 C 480 114, 470 228, 606 228"
              pathLength={1}
              className="op-stream-base op-stream-a-base"
            />
            <path
              d="M 322 114 C 480 114, 470 228, 606 228"
              className="op-stream-flow op-stream-a-flow"
            />
            <path
              d="M 322 370 C 480 370, 470 268, 606 268"
              pathLength={1}
              className="op-stream-base op-stream-b-base"
            />
            <path
              d="M 322 370 C 480 370, 470 268, 606 268"
              className="op-stream-flow op-stream-b-flow"
            />

            {/* 汇流节点：同一工业对象 */}
            <g className="op-node">
              <rect x="614" y="204" width="378" height="104" rx="14" className="op-node-shadow" />
              <rect x="606" y="196" width="378" height="104" rx="14" className="op-node-plate" />
              <text x="795" y="258" textAnchor="middle" className="op-node-label">
                同一工业对象
              </text>
            </g>

            {/* 记录堆积：累积判断落位时逐层堆上 */}
            <g className="op-pile" aria-hidden="true">
              <text x="640" y="324" className="op-pile-cap">
                记录越堆越多
              </text>
              {PILE_WIDTHS.map((w, i) => (
                <rect
                  key={w}
                  className="op-pile-layer"
                  x="640"
                  y={336 + i * 25}
                  width={w}
                  height="18"
                  rx="6"
                  style={{ "--op-i": i } as CSSProperties}
                />
              ))}
            </g>
          </svg>

          {/* 汇流说明区：拍 3 内先落说明行，再聚焦为累积标记 */}
          <div className="op-confluence">
            <p className="op-confluence-line">
              同一个工业对象，一个环节在出数据，另一个环节也在出数据——而且一直没停过。
            </p>
            <p className="op-hero">数据是越来越多了</p>
          </div>
        </div>
      </div>

      {/* 问题收束区：ghost 槽位常驻，末拍 plate 落位 */}
      <div className="op-question" aria-hidden={!questionOn}>
        <p className="op-question-ghost">本集问题 · 待收束</p>
        <div className="op-question-plate card-glass">
          <div className="op-question-main">
            <p className="op-question-kicker">本集问题</p>
            <p className="op-question-hero">
              数据多了 <span className="op-neq">≠</span> 价值来了
            </p>
          </div>
          <div className="op-question-asks">
            <p className="op-ask">这些来自不同环节的数据集合起来，叫什么？</p>
            <p className="op-ask">要经过怎样的过程，才可能变成能用的价值？</p>
          </div>
        </div>
      </div>
    </div>
  );
}
