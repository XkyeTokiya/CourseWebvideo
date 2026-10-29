import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A010Chapter.css";
import m004 from "./assets/m004.png";

/**
 * 10-summary-anchor · 总结（outline §10 · S-A010 · image-with-summary-rail）
 * mechanism: cumulative-assembly — M004 设备图作为开场回扣锚点贯穿三拍，
 * 汇总导轨自上而下逐层收束："局部记录"三源卡（拍 1 落位，拍 2 起弱化为
 * 已汇集）→ "汇集处理"带（拍 2 落位，带出结果行）→ 末行判断（拍 3，
 * 上方内容权重弱化）。R013（局部记录汇合成依据）由局部卡与处理带的上下
 * 排布承载，R014（处理链收束到集合定义）由处理带到末行判断的推进位置承载。
 *
 * step → semantic state：locals-recalled → assembly-processed →
 * boundary-drawn。
 *
 * exact 义务：S058（把多源、异构的记录汇集起来，经过采集、存储、治理和
 * 分析，保持在相应语境里的关联）与 S060（今天界定的，是工业大数据这个
 * 数据集合本身）整句逐字渲染。护栏 C012：总结不展开数据类型区分、共享、
 * 数据要素或标识数据模型——三条信号行仅回扣"局部"认知，不新增口径。
 */
const stateByStep = ["locals-recalled", "assembly-processed", "boundary-drawn"] as const;

/** 局部记录三行（指导 S057，回扣开场认知） */
const LOCALS = [
  { no: "01", src: "设备", give: "给出状态" },
  { no: "02", src: "业务系统", give: "给出流程" },
  { no: "03", src: "外部", give: "给出关系" },
] as const;

/** 汇集处理带阶段链（exact S058 前段逐字） */
const STAGES = ["采集", "存储", "治理", "分析"] as const;

export default function A010Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const assemblyOn = step >= 1;
  const boundaryOn = step >= 2;

  const rootCls = ["sm-scene", "scene-pad", assemblyOn && "is-assembly", boundaryOn && "is-boundary"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="sm-head">
        <h1 className="sm-headline">
          本期<em>总结</em>
        </h1>
        <p className="sm-head-side">从记录 → 可解释依据</p>
      </header>

      <div className="sm-main">
        <figure className="sm-media card">
          <img
            className="sm-media-shot"
            src={m004}
            alt="开头车间里的那台设备（M004 占位图，现场图待提供）"
          />
          <figcaption className="sm-media-cap">
            <span>回到开头 · 车间里的那台设备</span>
            <span className="sm-media-missing">M004 · 现场图待提供</span>
          </figcaption>
        </figure>

        <div className="sm-rail">
          {/* 汇总导轨 1：局部记录卡（拍 1 落位，拍 2 起弱化） */}
          <section className="sm-locals card">
            <p className="sm-locals-lead">
              单独看任何一条，都只是现场的<em>局部</em>
            </p>
            <div className="sm-local-rows">
              {LOCALS.map((row, i) => (
                <div
                  key={row.no}
                  className="sm-local-row"
                  style={{ "--sm-i": i } as CSSProperties}
                >
                  <span className="sm-local-no hero-num">{row.no}</span>
                  <span className="sm-local-src">{row.src}</span>
                  <span className="sm-local-give">{row.give}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 汇总导轨 2：汇集处理带（拍 2 落位，exact S058） */}
          <section className={`sm-assembly card${assemblyOn ? " is-on" : ""}`} aria-hidden={!assemblyOn}>
            <p className="sm-assembly-ghost-text">局部记录之后 · 待落位</p>
            {assemblyOn && (
              <>
                <p className="sm-assembly-line">
                  把<strong>多源、异构</strong>的记录<strong>汇集</strong>起来，
                </p>
                <div className="sm-stages">
                  {STAGES.map((s, i) => (
                    <span
                      key={s}
                      className="sm-stage-chip"
                      style={{ "--sm-j": i } as CSSProperties}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="sm-assembly-line">
                  保持在相应<strong>语境里的关联</strong>，
                </p>
                <p className="sm-assembly-result">
                  才有可能从一堆记录<strong>变成可解释的依据</strong>
                </p>
              </>
            )}
          </section>

          {/* 末行判断（拍 3，exact S060） */}
          <div className={`sm-final${boundaryOn ? " is-on" : ""}`} aria-hidden={!boundaryOn}>
            <p className="sm-final-ghost-text">末行判断 · 待收束</p>
            {boundaryOn && (
              <div className="sm-final-plate card-glass">
                <span className="sm-final-kicker">今天我们界定的</span>
                <p className="sm-final-hero">
                  是工业大数据这个<strong>数据集合本身</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
