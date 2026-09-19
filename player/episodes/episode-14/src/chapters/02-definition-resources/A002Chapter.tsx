import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "definition-anchored",
  "two-resources-placed",
  "resources-annotated",
  "silo-benefit-stated",
  "shared-foundation",
] as const;

const RESOURCES = [
  {
    id: "physical",
    kind: "物理资源",
    detail: "物理资源：机器、产品等实物对象",
    note: "看得见摸得着的实物",
  },
  {
    id: "virtual",
    kind: "虚拟资源",
    detail: "虚拟资源：算法、工序等方法与步骤",
    note: "生产过程里的方法和步骤",
  },
] as const;

function IdGlyph() {
  return (
    <svg className="dr-id-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 5 40 14.5v19L24 43 8 33.5v-19L24 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="7.4" fill="none" stroke="currentColor" strokeWidth="3.6" />
    </svg>
  );
}

function IslandsDiagram() {
  return (
    <svg className="dr-islands" viewBox="0 0 520 150" aria-hidden="true">
      <line className="dr-bridge dr-bridge-1" x1="260" y1="50" x2="75" y2="112" />
      <line className="dr-bridge dr-bridge-2" x1="260" y1="50" x2="260" y2="112" />
      <line className="dr-bridge dr-bridge-3" x1="260" y1="50" x2="445" y2="112" />
      <g className="dr-isle">
        <path d="M20 122 Q75 58 130 122 Z" />
        <rect x="61" y="96" width="28" height="6" rx="2" />
        <rect x="61" y="107" width="28" height="6" rx="2" />
        <text x="75" y="144" textAnchor="middle">
          系统
        </text>
      </g>
      <g className="dr-isle">
        <path d="M205 122 Q260 58 315 122 Z" />
        <rect x="246" y="96" width="28" height="6" rx="2" />
        <rect x="246" y="107" width="28" height="6" rx="2" />
        <text x="260" y="144" textAnchor="middle">
          部门
        </text>
      </g>
      <g className="dr-isle">
        <path d="M390 122 Q445 58 500 122 Z" />
        <rect x="431" y="96" width="28" height="6" rx="2" />
        <rect x="431" y="107" width="28" height="6" rx="2" />
        <text x="445" y="144" textAnchor="middle">
          系统
        </text>
      </g>
      <g className="dr-hub">
        <rect x="202" y="8" width="126" height="42" rx="7" />
        <path
          d="M233 15.5 245 22.5v14l-12 7-12-7v-14l12-6.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <text x="251" y="35" textAnchor="start">
          统一编码
        </text>
      </g>
    </svg>
  );
}

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad dr-root" data-state={state}>
      <header className="dr-header">
        <span className="dr-heading-mark" aria-hidden="true" />
        <h1 className="dr-headline">标识编码是什么</h1>
      </header>

      <div className="dr-main">
        <figure className="dr-media">
          <div className="dr-media-frame">
            <span className="dr-media-id" aria-hidden="true">
              <IdGlyph />
            </span>
            <p className="dr-media-placeholder">教材原图 · M001</p>
            <p className="dr-media-desc">两类资源与同一个身份符号的关系</p>
          </div>
          <figcaption className="dr-media-caption">教材原图 · M001 · 素材待提供</figcaption>
        </figure>

        <div className="dr-rail">
          {RESOURCES.map((resource) => (
            <div className="dr-resource" key={resource.id}>
              <div className="dr-resource-head">
                <span className="dr-resource-id" aria-hidden="true">
                  <IdGlyph />
                </span>
                <h2 className="dr-resource-kind">{resource.kind}</h2>
              </div>
              <p className="dr-resource-detail">{resource.detail}</p>
              <p className="dr-resource-note">{resource.note}</p>
            </div>
          ))}
          <p className="dr-rail-shared">它们同样需要在系统里被认出来</p>
        </div>
      </div>

      <div className="dr-takeaway">
        <IslandsDiagram />
        <div className="dr-takeaway-text">
          <p className="dr-takeaway-main">统一编码减少信息孤岛</p>
          <p className="dr-takeaway-silo">
            各个系统、各个部门各自保存着自己的数据，彼此对不上
          </p>
          <p className="dr-takeaway-share">
            跨企业、跨地域的管理 · 追踪溯源 · 多方协同 —— 都要靠这个共同基础
          </p>
        </div>
      </div>
    </div>
  );
}
