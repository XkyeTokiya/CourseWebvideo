import "./A013Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m005Image from "./assets/M005.png";

/** outline Step 映射：narration step → semantic state（S-A013，2 拍一一对应） */
const stateByStep = [
  "division-preserved",
  "collaboration-complete",
] as const;

/** division 区：四类信息仍保存在各自的系统里（S062，reference） */
const DIVISION_ITEMS = [
  { name: "生产计划" },
  { name: "设计文档" },
  { name: "客户信息" },
  { name: "物料采购信息" },
] as const;

/** summary-rail 区：协作注记三项（S064 / S065 / S066，reference） */
const COLLAB_NODES = [
  { role: "统一标识", duty: "为数据确定共同身份" },
  { role: "数据规范", duty: "约定交换规则" },
  { role: "连接器", duty: "转换、汇聚和传递" },
] as const;

export default function A013Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad dc-root" data-state={state}>
      {/* headline：S061 论点标题（可见标题：保留） */}
      <header className="dc-head">
        <h1 className="dc-headline">回到工厂：分工与协作</h1>
        <span className="rule dc-head-rule" aria-hidden="true" />
      </header>

      <div className="dc-main">
        {/* scene-image：M005 工厂情境回扣，作为持续锚点（anchor-and-context） */}
        <figure className="dc-media">
          <img
            className="dc-media-img"
            src={m005Image}
            alt="与开场一致的工厂情境图（M005 占位）"
          />
          <figcaption className="dc-media-caption">
            工厂情境回扣 · M005 · 素材待提供
          </figcaption>
        </figure>

        <div className="dc-right">
          {/* division：U031 四类信息仍存各自系统 + 正常业务分工 */}
          <section className="dc-division">
            <div className="dc-band-head">
              <span className="dc-band-mark" aria-hidden="true" />
              <h2 className="dc-band-title">分工保留</h2>
              <p className="dc-band-note">四类数据仍然保存在各自的系统里</p>
            </div>
            <div className="dc-tiles">
              {DIVISION_ITEMS.map((item, i) => (
                <div className={`dc-tile dc-tile-${i + 1}`} key={item.name}>
                  <span className="dc-tile-name">{item.name}</span>
                  <span className="dc-tile-tag">仍在各自系统</span>
                </div>
              ))}
            </div>
            <p className="dc-normal">
              <span className="dc-normal-mark" aria-hidden="true" />
              这是正常的业务分工
            </p>
          </section>

          {/* R015 分工依托协作：分工区 → 协作区的上下分层接口，拍 2 激活 */}
          <div className="dc-interface" aria-hidden="true">
            <span className="dc-interface-line" />
            <span className="dc-interface-arrow" />
            <span className="dc-interface-tag">协作通道</span>
            <span className="dc-drop-pkt" />
          </div>

          {/* summary-rail：U032 三项协作注记依次落位 */}
          <section className="dc-rail">
            <span className="dc-track" aria-hidden="true">
              <span className="dc-track-run" />
            </span>
            {COLLAB_NODES.map((node, i) => (
              <div className={`dc-node dc-node-${i + 1}`} key={node.role}>
                <span className="dc-node-role">{node.role}</span>
                <span className="dc-node-duty">{node.duty}</span>
              </div>
            ))}
            <span className="dc-elbow" aria-hidden="true" />
            <span className="dc-run-pkt" aria-hidden="true" />
          </section>

          {/* final-judgment：U033 收束 —— 数据被送到需要它的业务环节 */}
          <div className="dc-judgment">
            <span className="dc-judgment-port" aria-hidden="true" />
            <p className="dc-judgment-text">
              把数据送到
              <em className="dc-judgment-em">需要它的业务环节</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
