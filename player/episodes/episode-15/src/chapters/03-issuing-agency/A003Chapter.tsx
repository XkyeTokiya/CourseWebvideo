import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

const stateByStep = [
  "first-segment-focused",
  "duties-established",
  "position-secured",
  "vaa-anchored",
] as const;

const DUTIES = [
  { no: "01", lead: "入口定位", text: "处在整套体系的入口" },
  { no: "02", lead: "前缀分配与管理", text: "负责 VAA 前缀的分配和管理" },
  { no: "03", lead: "规则应用指导", text: "为使用方提供编码规则上的指导" },
] as const;

function HierarchyGlyph() {
  return (
    <svg className="fda-hierarchy" viewBox="0 0 260 118" aria-hidden="true">
      <rect className="fda-hd-root" x="88" y="6" width="84" height="36" rx="4" />
      <text className="fda-hd-root-label" x="130" y="31">
        入口
      </text>
      <path className="fda-hd-link" d="M130 42v16M46 58h168M46 58v12M214 58v12" />
      <rect className="fda-hd-leaf fda-hd-leaf-1" x="8" y="70" width="76" height="34" rx="4" />
      <rect className="fda-hd-leaf fda-hd-leaf-2" x="176" y="70" width="76" height="34" rx="4" />
      <text className="fda-hd-leaf-label fda-hd-leaf-label-1" x="46" y="93">
        第二段
      </text>
      <text className="fda-hd-leaf-label fda-hd-leaf-label-2" x="214" y="93">
        第三段
      </text>
    </svg>
  );
}

export default function A003Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fda-root" data-state={state}>
      <header className="fda-header">
        <span className="fda-heading-mark" aria-hidden="true" />
        <h1 className="fda-headline">第一段：发码机构代码</h1>
      </header>

      <div className="fda-main">
        <div className="fda-media-col">
          <figure className="fda-media">
            <img className="fda-media-img" src={M001} alt="教材示例图：三段结构与分隔关系" />
            <span className="fda-media-tag">教材原图 · 占位</span>
          </figure>
          <p className="fda-media-caption">三段结构与分隔关系的读法依据</p>

          <div className="fda-reading">
            <div className="fda-reading-lines">
              <p className="fda-reading-negate">不是随手取一段字符</p>
              <p className="fda-reading-affirm">先取得一个由发码机构管理的位置</p>
            </div>
            <div className="fda-reading-figure">
              <HierarchyGlyph />
              <p className="fda-reading-caption">入口定下来，后面两段才有共同的上级</p>
            </div>
          </div>
        </div>

        <div className="fda-side-col">
          <div className="fda-duties">
            <p className="fda-duties-kicker">发码机构的职责</p>
            {DUTIES.map((duty) => (
              <div className="fda-duty" key={duty.no}>
                <span className="fda-duty-no">{duty.no}</span>
                <div className="fda-duty-copy">
                  <p className="fda-duty-lead">{duty.lead}</p>
                  <p className="fda-duty-text">{duty.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fda-entrance">
            <div className="fda-entrance-ghost" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="fda-entrance-card">
              <span className="fda-entrance-tag">入口</span>
              <div className="fda-vaa-tiles" aria-hidden="true">
                <span>V</span>
                <span>A</span>
                <span>A</span>
              </div>
              <p className="fda-entrance-main">
                在编码里，<em>VAA</em> 这三个字母就是发码机构代码
              </p>
              <div className="fda-entrance-negatives">
                <span className="fda-negate">不是产品型号</span>
                <span className="fda-negate">不是企业自己挑的品牌缩写</span>
              </div>
              <p className="fda-entrance-affirm">而是整套编码的入口</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
