import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001Chapter.css";
import m001 from "./assets/m001.png";

const stateByStep = ["record-in-hand", "four-terms-open", "entry-question-set"] as const;

const TERMS = ["主数据", "业务数据", "元数据", "数据字典"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const termsOn = step >= 1;
  const entryOn = step >= 2;

  const rootCls = [
    "rq-scene",
    "scene-pad",
    termsOn && "is-terms",
    entryOn && "is-entry",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="rq-head">
        <h1 className="rq-headline">
          主数据、业务数据、元数据与数据字典的<em>边界</em>
        </h1>
        <div className="rq-head-rule rule" />
      </header>

      <div className="rq-main">
        <div className="rq-left">
          <figure className="rq-photo">
            <img
              className="rq-photo-shot"
              src={m001}
              alt="匿名设备维修现场（M001 占位图，现场图待提供）"
            />
            <figcaption className="rq-photo-cap">
              <span className="rq-photo-name">设备故障现场</span>
              <span className="rq-photo-missing">M001 · 待提供</span>
            </figcaption>
          </figure>

          <figure className="rq-record">
            <div className="rq-record-top">
              <span className="rq-record-title">设备维修记录</span>
              <span className="rq-record-stamp">故障</span>
            </div>
            <div className="rq-record-body">
              <div className="rq-record-row">
                <span className="rq-record-label">设备故障</span>
                <span className="rq-record-line" />
              </div>
              <div className="rq-record-row">
                <span className="rq-record-label">维修记录</span>
                <span className="rq-record-lines">
                  <i />
                  <i />
                </span>
              </div>
            </div>
            <div className="rq-record-foot">
              <span className="rq-record-rule" />
              <span className="rq-record-mark">一张记录</span>
            </div>
          </figure>
        </div>

        <div className="rq-right">
          <div className="rq-question">
            <p className="rq-question-hero">
              这张记录<em>算哪一种？</em>
            </p>
            <p className="rq-question-sub">先别急着下结论</p>
          </div>

          <div className="rq-map">
            <span className="rq-spine" aria-hidden="true" />
            <ul className="rq-terms" aria-label="四个待判断的名词">
              {TERMS.map((term, index) => (
                <li
                  key={term}
                  className="rq-term"
                  style={{ "--rq-i": index } as CSSProperties}
                >
                  {termsOn && (
                    <>
                      <span className="rq-term-no">{String(index + 1).padStart(2, "0")}</span>
                      <span className="rq-term-name">{term}</span>
                      <span className="rq-term-verdict">待判定</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <p className="rq-negation">
            它们说的<em>不是</em>同一个东西
          </p>
        </div>
      </div>

      <div className="rq-entry">
        <span className="rq-entry-reserve" aria-hidden="true">
          判断入口
        </span>
        <div className="rq-entry-plate">
          <div className="rq-entry-cues">
            <p className="rq-cue">
              <span className="rq-cue-text">数据躺在哪个系统里</span>
              <span className="rq-cue-bar" aria-hidden="true" />
            </p>
            <p className="rq-cue rq-cue--second">
              <span className="rq-cue-text">是不是一张很简单的基础表</span>
              <span className="rq-cue-bar" aria-hidden="true" />
            </p>
          </div>
          <div className="rq-entry-ask">
            <p className="rq-entry-hero">
              <span className="rq-entry-kicker">判断入口</span>
              先问自己一句：这条数据到底在回答什么问题
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
