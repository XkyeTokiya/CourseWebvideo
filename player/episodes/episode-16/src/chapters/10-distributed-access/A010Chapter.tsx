import "./A010Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M005 from "./assets/M005.png";

const stateByStep = [
  "access-established",
  "distribution-clarified",
  "entry-anchored",
  "judgment-formed",
] as const;

type A010State = (typeof stateByStep)[number];

/** 教材示例串（E007），逐字原样上屏 */
const FULL_HANDLE = "86.100.12/00121336401058520109";

/** 信息容器：错落的高度本身表达“分布式保存、不集中一处” */
const CONTAINERS = [
  { type: "规格", left: 8, top: 340 },
  { type: "生产日期", left: 260, top: 396 },
  { type: "批次号", left: 512, top: 326 },
  { type: "序列号", left: 764, top: 402 },
] as const;

/** R010 载体：由标识节点指向多个信息容器的关联边（不画服务器拓扑） */
const EDGES = [
  { id: 1, d: "M482 132 C482 252 103 216 103 326", arrow: "M95 326 L111 326 L103 340 Z" },
  { id: 2, d: "M482 132 C482 270 355 272 355 382", arrow: "M347 382 L363 382 L355 396 Z" },
  { id: 3, d: "M482 132 C482 212 607 202 607 312", arrow: "M599 312 L615 312 L607 326 Z" },
  { id: 4, d: "M482 132 C482 284 859 278 859 388", arrow: "M851 388 L867 388 L859 402 Z" },
] as const;

const PULSE_DURS = ["2.2s", "2.6s", "2.4s", "2.8s"] as const;

const RAIL_CARS = [
  { label: "访问", text: "通过完整编码，访问分布式数据库中的电池产品信息" },
  { label: "分布", text: "信息不必集中在同一个地方，留在各自业务需要的位置" },
  { label: "入口", text: "完整标识是共同的查询入口，数据仍然放在原处" },
] as const;

/** 标题记号：一点三线的小扇形，呼应本章“一标识指向多容器”的关系图 */
function HubMark() {
  return (
    <svg className="da-mark" viewBox="0 0 46 46" aria-hidden="true">
      <circle className="da-mark-dot" cx="9" cy="23" r="5.5" />
      <path
        className="da-mark-line"
        d="M15 23h25M16 19.5 39 8M16 26.5 39 38"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 位置锚：信息容器“留在各自业务需要的位置” */
function AnchorPin() {
  return (
    <svg className="da-pin-glyph" viewBox="0 0 24 30" aria-hidden="true">
      <path d="M12 3v12" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="20" r="5.6" fill="none" />
      <path d="M4.5 27.5h15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function A010Chapter({ step }: ChapterStepProps) {
  const state: A010State = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad da-root" data-state={state}>
      <header className="da-header">
        <HubMark />
        <h1 className="da-headline">完整标识连接分布式信息</h1>
      </header>

      <div className="da-main">
        <figure className="da-figure">
          <img
            className="da-figure-img"
            src={M005}
            alt="教材 Handle 编码示例原图（占位图，正式版为教材扫描件）"
          />
          <figcaption className="da-figure-caption">
            <span className="da-figure-badge">教材示例原图</span>
            <span className="da-figure-note">占位图 · 正式版为教材扫描件</span>
          </figcaption>
        </figure>

        <div className="da-map">
          <svg className="da-edges" viewBox="0 0 964 560" aria-hidden="true">
            {EDGES.map((edge) => (
              <path
                key={edge.id}
                id={`da-edge-path-${edge.id}`}
                className={`da-edge da-edge-${edge.id}`}
                d={edge.d}
                pathLength={1}
              />
            ))}
            {EDGES.map((edge) => (
              <path key={`arrow-${edge.id}`} className={`da-arrow da-arrow-${edge.id}`} d={edge.arrow} />
            ))}
            <g className="da-pulses">
              {EDGES.map((edge, i) => (
                <circle key={`pulse-${edge.id}`} className="da-pulse" r={7}>
                  <animateMotion dur={PULSE_DURS[i]} repeatCount="indefinite">
                    <mpath href={`#da-edge-path-${edge.id}`} />
                  </animateMotion>
                </circle>
              ))}
            </g>
          </svg>

          <div className="da-node">
            <div className="da-node-top">
              <span className="da-node-name">完整标识</span>
              <span className="da-node-tag">Handle 编码</span>
            </div>
            <p className="da-node-code">{FULL_HANDLE}</p>
            <span className="da-badge">共同的查询入口</span>
          </div>

          {CONTAINERS.map((box, i) => (
            <div
              key={box.type}
              className={`da-box da-box-${i + 1}`}
              style={{ left: box.left, top: box.top }}
            >
              <span className="da-box-type">{box.type}</span>
              <span className="da-box-lines" aria-hidden="true" />
            </div>
          ))}

          {CONTAINERS.map((box, i) => (
            <span
              key={`pin-${box.type}`}
              className={`da-pin da-pin-${i + 1}`}
              style={{ left: box.left + 83, top: box.top + 122 }}
            >
              <AnchorPin />
            </span>
          ))}

          <span className="da-baseline" aria-hidden="true" />
          <span className="da-legend">
            <span className="da-legend-line" aria-hidden="true" />
            关联边 · 访问
          </span>
        </div>
      </div>

      <div className="da-bottom">
        <div className="da-rail">
          <span className="da-rail-line" aria-hidden="true" />
          {RAIL_CARS.map((car, i) => (
            <div key={car.label} className={`da-car da-car-${i + 1}`}>
              <span className="da-car-tick" aria-hidden="true" />
              <span className="da-car-label">{car.label}</span>
              <p className="da-car-text">{car.text}</p>
            </div>
          ))}
        </div>

        <div className="da-judgment">
          <p className="da-judgment-hero">编码不装数据</p>
          <span className="da-judgment-div" aria-hidden="true" />
          <div className="da-judgment-lines">
            <p>稳定地指认对象</p>
            <p>把查询引到信息真正所在的地方</p>
          </div>
        </div>
      </div>
    </div>
  );
}
