import "./RepairTraceback.css";
import m004Url from "./assets/m004-repair.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A008 · 维修追溯页（S-A034 · image-with-summary-rail）
 * 关系机制 rail-cumulative-traceback：摘要栏逐栏累积（U020→U021，R013 由
 * 核对→调出→三类记录的先后排列承载），随后经 R014 延伸回查连线把焦点带向
 * 生产侧追溯要点，final-judgment 以“数据依据边界”收束（U022）。
 * 语境图 M004 自首拍持续在场，全程不卸载。
 */
const stateByStep = [
  "repair-stage-set",
  "verification-rail-open",
  "authenticity-judged",
  "entry-not-authority",
  "traceback-pivot",
  "traceback-mapped",
  "evidence-not-verdict",
] as const;

type RepairState = (typeof stateByStep)[number];

const RECORDS = ["装机档案", "配件流转", "质量记录"];

export default function RepairTraceback({ step }: ChapterStepProps) {
  const state: RepairState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene rt-scene state-${state}`}>
      <div className="scene-pad rt-pad">
        <header className="rt-head">
          <h1 className="rt-headline serif-cn">维修核验与质量追溯</h1>
          <hr className="rule rt-head-rule" />
        </header>

        <div className="rt-main">
          {/* M004 · 维修核验现场语境（编号占位卡，待替换正式素材），首拍起持续在场 */}
          <figure className="rt-media card">
            <img
              src={m004Url}
              alt="维修核验现场语境占位图（M004，待替换正式素材）"
            />
            <figcaption className="rt-media-caption mono">
              M004 · 维修核验现场（占位，待替换）
            </figcaption>
            {/* 核对演示：扫描线一次性扫过现场 + 标识签落位保持 */}
            <span className="rt-scan" aria-hidden="true" />
            <span className="rt-idtag">
              <i className="rt-idtag-code" aria-hidden="true" />
              零部件标识
            </span>
          </figure>

          <div className="rt-rail">
            {/* 摘要栏空槽（step1 待补，逐栏被内容补齐，非消失） */}
            <div className="rt-colbox">
              <div className="rt-slot rt-slot-1" aria-hidden="true">
                <span className="mono">记录摘要 · 待补</span>
              </div>

              {/* U020 · 前栏：核对与调档（R013 sequence：核对→调出→三类记录） */}
              <article className="rt-col rt-col-check card" aria-label="核对与调档">
                <span className="rt-col-tag mono">摘要 01 · 核对与调档</span>
                <div className="rt-check-row">
                  <span className="rt-chip rt-chip-id">
                    <i className="rt-idcode" aria-hidden="true" />
                    零部件标识
                  </span>
                  <span className="rt-check-link" aria-hidden="true">
                    <em className="mono">核对</em>
                    <i className="rt-link-line" />
                    <i className="rt-link-head" />
                  </span>
                  <span className="rt-chip rt-chip-target serif-cn">维修对象</span>
                </div>
                <div className="rt-pull" aria-hidden="true">
                  <span className="rt-pull-stem">
                    <i className="rt-pull-head" />
                  </span>
                  <em className="rt-pull-label mono">调出</em>
                </div>
                <div className="rt-records">
                  {RECORDS.map((rec) => (
                    <span className="rt-rec serif-cn" key={rec}>
                      {rec}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <div className="rt-colbox">
              <div className="rt-slot rt-slot-2" aria-hidden="true">
                <span className="mono">记录摘要 · 待补</span>
              </div>

              {/* U021 · 后栏：真实性判断 + 查询入口边界（S038 方向，step4 补入） */}
              <article className="rt-col rt-col-judge card" aria-label="真实性判断与入口边界">
                <span className="rt-col-tag mono">摘要 02 · 真实性判断</span>
                <p className="rt-judge-lead">几边一对</p>
                <p className="rt-judge-hero serif-cn">
                  维修真实性<em>有了依据</em>
                </p>
                <div className="rt-judge-chips">
                  <span className="rt-judge-chip serif-cn">
                    虚假索赔<b aria-hidden="true">↓</b>
                  </span>
                  <span className="rt-judge-chip serif-cn">
                    说不清的争议<b aria-hidden="true">↓</b>
                  </span>
                </div>
                <div className="rt-bound">
                  <hr className="rule rt-bound-rule" />
                  <p className="rt-bound-text">
                    <span className="rt-bound-chip mono">查询入口</span>
                    责任认定、索赔审批——<em>不单独完成</em>
                  </p>
                </div>
              </article>
            </div>

            {/* R014 · 延伸回查连接（step5 出现，向下指向生产侧追溯要点） */}
            <div className="rt-trace" aria-hidden="true">
              <span className="rt-trace-stem">
                <i className="rt-trace-dot" />
                <i className="rt-trace-head" />
              </span>
              <em className="rt-trace-label mono">延伸回查 · 带回生产侧</em>
            </div>
          </div>
        </div>

        {/* final-judgment（U022）：生产侧追溯要点（step6）+ 数据依据边界收束（step7） */}
        <footer className="rt-final" aria-label="追溯要点与数据依据边界">
          <div className="rt-verdict">
            <span className="rt-verdict-lead mono">追溯收束 · 数据依据</span>
            <p className="rt-verdict-hero serif-cn">
              更可核对的<em>数据依据</em>
            </p>
            <div className="rt-verdict-chips">
              <span className="rt-verdict-chip">不是自动的根因分析</span>
              <span className="rt-verdict-chip">更不是自动的处罚</span>
            </div>
          </div>

          <span className="rt-final-rule" aria-hidden="true" />

          <div className="rt-prod">
            <span className="rt-prod-tag mono">延伸回查 · 生产侧</span>
            <div className="rt-prod-slot" aria-hidden="true">
              <span className="mono">追溯要点 · 待补</span>
            </div>
            <div className="rt-chain">
              <div className="rt-chain-row">
                <span className="rt-node rt-node-warn serif-cn">质量问题</span>
                <span className="rt-chain-link" aria-hidden="true">
                  <em className="mono">回查</em>
                  <i className="rt-cl-line" />
                  <i className="rt-cl-head" />
                </span>
                <span className="rt-node serif-cn">具体安装工位</span>
                <span className="rt-chain-link" aria-hidden="true">
                  <em className="mono">对应</em>
                  <i className="rt-cl-line" />
                  <i className="rt-cl-head" />
                </span>
                <span className="rt-node serif-cn">供应商</span>
              </div>
              <div className="rt-chain-row">
                <span className="rt-node serif-cn">质量指标分析</span>
                <span className="rt-chain-link" aria-hidden="true">
                  <em className="mono">参考</em>
                  <i className="rt-cl-line" />
                  <i className="rt-cl-head" />
                </span>
                <span className="rt-node serif-cn">供应商绩效评价</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
