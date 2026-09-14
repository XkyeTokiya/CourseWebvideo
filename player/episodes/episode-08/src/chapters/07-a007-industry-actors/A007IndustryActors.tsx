import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007IndustryActors.css";
import m003 from "./assets/m003.png";

const states = ["actors-local-systems", "align-then-resolve"] as const;

type IaState = (typeof states)[number];

const ACTORS = ["供应商", "制造企业", "物流服务商", "经销或使用单位"];

export default function A007IndustryActors({ step }: ChapterStepProps) {
  const state: IaState = states[step] ?? states[states.length - 1];
  const resolveOn = state === "align-then-resolve";

  return (
    <div className={`ia-scene scene-pad${resolveOn ? " is-resolve" : ""}`}>
      <h1 className="ia-title">上下游各自保留本地系统</h1>

      <div className="ia-main">
        <figure className="ia-media">
          <div className="ia-frame">
            <img
              className="ia-shot"
              src={m003}
              alt="跨主体实物交接与核验现场"
            />
          </div>
          <figcaption className="ia-cap">
            <span>跨主体实物交接与核验现场</span>
            <span>多方各自系统 · 无自动共享</span>
          </figcaption>
        </figure>

        <aside className="ia-rail">
          <p className="ia-rail-lead">各自维护自己的系统和数据</p>
          <ul className="ia-actors">
            {ACTORS.map((actor, i) => (
              <li
                key={actor}
                className="ia-actor card"
                style={{ "--ia-i": String(i) } as CSSProperties}
              >
                <span className="ia-actor-name">{actor}</span>
              </li>
            ))}
          </ul>
          <p className="ia-exact">供应商、制造企业、物流服务商、经销或使用单位</p>

          <div
            className={`ia-act${resolveOn ? " is-on" : ""}`}
            aria-hidden={!resolveOn}
          >
            <p className="ia-act-lead">标识解析在这里的作用</p>
            <div className="ia-boundary">
              <p>不要求各方换成同一套软件</p>
            </div>
            <div className="ia-seq ia-seq-1">
              <span className="ia-seq-no hero-num">01</span>
              <p>
                跨地域、跨行业、跨企业协作时，
                <b>先对齐说的是同一个对象</b>
              </p>
            </div>
            <div className="ia-seq ia-seq-2">
              <span className="ia-seq-no hero-num">02</span>
              <p>
                再通过<b>解析关系</b>找到对应的<b>信息服务范围</b>
              </p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="ia-judgment">
        <p
          className={`ia-judgment-line${resolveOn ? " is-on" : ""}`}
          aria-hidden={!resolveOn}
        >
          各自保留本地系统，通过<b>共同对象身份</b>对齐后再找
          <b>信息服务范围</b>。
        </p>
      </footer>
    </div>
  );
}
