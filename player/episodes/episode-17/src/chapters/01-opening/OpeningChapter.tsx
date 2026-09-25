import "./OpeningChapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

/**
 * 01-opening · A001+A002 合并章（Checkpoint Plan 确认的偏离：
 * A001 标题拍并入本章，封面保持独立静默）。
 * step → semantic state 显式映射，允许重复，末态兜底：
 * - title-established：标题落位，前提标签与问句弱化预置（A001 · S-A001）
 * - object-in-context：电池现场图像为焦点，引用登记栏出现组织/系统占位（A002 · S-A002）
 * - records-mapped：四类记录逐项落位，收束标签归并（A002 · S-A002）
 */
const stateByStep = [
  "title-established",
  "object-in-context",
  "records-mapped",
] as const;

type OpeningState = (typeof stateByStep)[number];

/** 四类记录场景：口播第 3 拍逐项点名；ghost 态承载第 2 拍的“不同组织和系统” */
const RECORDS = [
  { index: "①", stage: "出厂" },
  { index: "②", stage: "装配" },
  { index: "③", stage: "维护" },
  { index: "④", stage: "回收" },
] as const;

export default function OpeningChapter({ step }: ChapterStepProps) {
  const state: OpeningState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad op-root" data-state={state}>
      <header className="op-header">
        <h1 className="op-headline">OID 编码：树状命名如何保证唯一性</h1>
        <span className="op-oid-badge">对象标识符 · Object Identifier</span>
        <div className="op-premises">
          <span className="op-premise op-premise-object">
            一件工业电池，被反复引用
          </span>
          <span className="op-premise op-premise-naming">
            只写“某企业的一块电池”，说不清层级与分支
          </span>
        </div>
        <p className="op-question">
          怎样把这件对象，放进一条既能相互区分、又能继续扩展的命名路径？
        </p>
      </header>

      <div className="op-main">
        <figure className="op-object">
          <img
            className="op-object-img"
            src={M001}
            alt="匿名工业电池现场语境（占位图）"
          />
          <figcaption className="op-object-caption">
            <span className="op-object-badge">一件工业电池</span>
            <span className="op-object-note">现场语境 · 占位图</span>
          </figcaption>
        </figure>

        <div className="op-ledger">
          <p className="op-ledger-head">引用 · 登记栏</p>
          <div className="op-rows">
            {RECORDS.map((record) => (
              <div className="op-row" key={record.stage}>
                <span className="op-row-leader" aria-hidden="true" />
                <span className="op-row-index">{record.index}</span>
                <span className="op-row-slot">
                  <span className="op-row-ghost">组织 / 系统</span>
                  <span className="op-row-record">
                    <b>{record.stage}</b>
                    <span>记录</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="op-takeaway">
        <p className="op-takeaway-line">
          <b>同一对象</b>
          <span>多处引用</span>
        </p>
      </div>
    </div>
  );
}
