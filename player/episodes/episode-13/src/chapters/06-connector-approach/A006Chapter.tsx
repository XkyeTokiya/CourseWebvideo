import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m002Image from "./assets/M002.png";

const stateByStep = [
  "new-approach-standardized",
  "roles-preserved",
  "connector-handles-transfer",
  "judgment-stated",
] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad ck-root" data-state={state}>
      <header className="ck-head">
        <h1 className="ck-headline">连接器改变连接方式</h1>
        <span className="ck-head-mark" aria-hidden="true" />
      </header>

      <div className="ck-main">
        <figure className="ck-media">
          <img
            className="ck-media-img"
            src={m002Image}
            alt="研发、生产、供应链协同情境占位图"
          />
          <figcaption className="ck-media-caption">
            协同情境 · M002 · 素材待提供
          </figcaption>
        </figure>

        <aside className="ck-rail">
          <div className="ck-areas">
            <span className="ck-areas-label">环节之间</span>
            <div className="ck-areas-row">
              <span className="ck-chip ck-chip-1">研发设计</span>
              <span className="ck-areas-sep ck-areas-sep-1" aria-hidden="true">、</span>
              <span className="ck-chip ck-chip-2">生产制造</span>
              <span className="ck-areas-sep ck-areas-sep-2" aria-hidden="true">、</span>
              <span className="ck-chip ck-chip-3">供应链管理</span>
            </div>
          </div>

          <div className="ck-funnel-wrap">
            <svg className="ck-funnel" viewBox="0 0 780 96" aria-hidden="true">
              <path className="ck-funnel-line ck-funnel-a" d="M150 0 L390 88" pathLength={1} />
              <path className="ck-funnel-line ck-funnel-b" d="M372 0 L390 88 L390 96" pathLength={1} />
              <path className="ck-funnel-line ck-funnel-c" d="M611 0 L390 88" pathLength={1} />
              <circle className="ck-pulse ck-pulse-a" cx="150" cy="0" r="6.5" />
              <circle className="ck-pulse ck-pulse-b" cx="372" cy="0" r="6.5" />
              <circle className="ck-pulse ck-pulse-c" cx="611" cy="0" r="6.5" />
            </svg>
            <span className="ck-conn-tag">连接器</span>
          </div>

          <div className="ck-norm">
            <span className="ck-norm-label">统一规范衔接</span>
            <div className="ck-norm-row">
              <span className="ck-half ck-half-1">标准化的数据连接方式</span>
              <span className="ck-half-sep" aria-hidden="true">与</span>
              <span className="ck-half ck-half-2">统一的数据交互规范</span>
            </div>
          </div>

          <div className="ck-points">
            <div className="ck-point ck-point-1">
              <span className="ck-point-mark" aria-hidden="true" />
              <p className="ck-point-text">原有系统<em className="ck-point-em">保留原有业务职责</em></p>
            </div>
            <div className="ck-point ck-point-2">
              <span className="ck-point-mark" aria-hidden="true" />
              <p className="ck-point-text">跨系统数据转换和交换<em className="ck-point-em">交给连接器处理</em></p>
            </div>
          </div>
        </aside>
      </div>

      <div className="ck-judge">
        <p className="ck-judge-main">连接器改变的是<em className="ck-judge-em">系统之间的连接方式</em></p>
        <span className="ck-judge-div" aria-hidden="true" />
        <p className="ck-judge-neg">
          <b className="ck-judge-not">不是</b>把<span className="ck-judge-mono">MES、ERP、PLM</span>合并成一套大系统
        </p>
      </div>
    </div>
  );
}
