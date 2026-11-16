import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009Chapter.css";
import m003 from "./assets/m003.png";

const states = [
  "device-revisited",
  "three-questions-posed",
  "division-matched",
  "foundation-laid",
  "governance-kept",
] as const;

const QUESTIONS = [
  "数据属于哪个对象？",
  "对象的相关信息在哪里？",
  "不同环节的记录，怎么围绕同一个对象关联起来？",
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const questionsOn = step >= 1;
  const divisionOn = step >= 2;
  const foundOn = step >= 3;
  const govOn = step >= 4;

  return (
    <div
      className={`a9-scene scene-pad${questionsOn ? " is-q" : ""}${
        divisionOn ? " is-div" : ""
      }${foundOn ? " is-found" : ""}${govOn ? " is-gov" : ""}`}
      data-state={state}
    >
      <header className="a9-head">
        <p className="a9-kicker">总结 · 三问与一层基础</p>
        <h1 className="a9-title">
          三个问题，<em>一层基础</em>
        </h1>
      </header>

      <section className="a9-lead-band">
        <p className="a9-lead-cap">本期总结</p>
        <p className="a9-lead-text">数据要素为什么需要标识体系？</p>
        <p className="a9-lead-sub">
          不是因为缺一个更醒目的编号，而是要稳定回答三个问题
        </p>
      </section>

      <div className="a9-mid">
        <figure className="a9-media">
          <div className="a9-photo-wrap">
            <div className="a9-photo card">
              <img src={m003} alt="回到开场设备场景（占位图，原图待提供）" />
              <span className="a9-photo-tag">现场图 · 原图待提供</span>
            </div>
          </div>
          <figcaption className="a9-media-cap">回到开头那台设备</figcaption>
        </figure>

        <div className="a9-q-panel">
          <p
            className={`a9-q-ghost${questionsOn ? " is-off" : ""}`}
            aria-hidden="true"
          >
            三个问题 · 待落位
          </p>
          <ol className="a9-questions">
            {QUESTIONS.map((q, i) => (
              <li key={q} style={{ "--a9-i": String(i) } as CSSProperties}>
                <span className="a9-q-idx">{`0${i + 1}`}</span>
                <span className="a9-q-text">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="a9-division">
        <div className="a9-band-clip">
          <div className="a9-div-inner">
            <p className="a9-div-row">
              <span className="a9-div-key">标识 · 管身份</span>
              回答数据在说谁
            </p>
            <span className="a9-div-sep" aria-hidden="true" />
            <p className="a9-div-row">
              <span className="a9-div-key">解析 · 管入口</span>
              回答到哪里找相关信息
            </p>
          </div>
        </div>
      </section>

      <section className="a9-found">
        <div className="a9-band-clip">
          <div className="a9-found-inner">
            <p className="a9-found-text">
              两者一起为查找和关联分散记录提供基础，帮助减少对象认不准、记录连不上的障碍
            </p>
            <p className="a9-found-line">
              这是标识体系补上的<strong>那一层基础关系</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="a9-gov">
        <div className="a9-band-clip">
          <div className="a9-gov-inner">
            <p className="a9-gov-cap">但这个基础不是全部</p>
            <p className="a9-gov-text">
              数据质量、语义标准、授权与安全、权属与流通规则，每一项都有自己的治理要求；条件不具备，数据的持续利用就可能受到限制
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
