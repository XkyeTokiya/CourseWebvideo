import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./MoreToolsNotStronger.css";
import m001 from "./assets/m001.png";

const states = [
  "investments-visible",
  "info-scatter-visible",
  "capability-gap-stated",
] as const;

type MoreToolsState = (typeof states)[number];

const SCATTER_CHIPS = [
  { label: "质量记录", pos: "a" },
  { label: "设备状态", pos: "b" },
  { label: "能耗", pos: "c" },
  { label: "订单信息", pos: "d" },
];

export default function MoreToolsNotStronger({ step }: ChapterStepProps) {
  const state: MoreToolsState = states[step] ?? states[states.length - 1];
  const scatterOn = state !== "investments-visible";
  const gapOn = state === "capability-gap-stated";

  return (
    <div className="mt-scene scene-pad">
      <h1 className="mt-thesis">
        工具变多，<em>不自动带来</em>整体运行能力
      </h1>

      <div className="mt-main">
        <figure className="mt-media">
          <div className="mt-photo">
            <img src={m001} alt="设想的制造企业现场占位图" />
            <span className="mt-stamp" aria-hidden="true">
              教学设想 · 非真实企业
            </span>
          </div>
          <figcaption className="mt-media-cap">
            <span>制造现场 · 占位图</span>
            <span>新设备已添置 · 信息系统已增加</span>
          </figcaption>
        </figure>

        <div className="mt-cards">
          <p className="mt-cards-lead">一家制造企业的投入与信息现状</p>

          <article className="mt-card card" data-on="on">
            <div className="mt-card-body">
              <h2 className="mt-card-title">
                <span className="mt-index hero-num">1</span>
                新增投入
              </h2>
              <div className="mt-invest">
                <span className="mt-invest-item">
                  新增设备
                  <i className="mt-plus">＋新增</i>
                </span>
                <span className="mt-invest-item">
                  信息系统
                  <i className="mt-plus mt-plus--late">＋新增</i>
                </span>
              </div>
            </div>
          </article>

          <article className="mt-card card" data-on={scatterOn ? "on" : "waiting"}>
            <div className="mt-card-body">
              <h2 className="mt-card-title">
                <span className="mt-index hero-num">2</span>
                信息分散
              </h2>
              <div className="mt-scatter">
                {SCATTER_CHIPS.map((chip, i) => (
                  <span
                    key={chip.label}
                    className={`mt-chip mt-chip--${chip.pos}`}
                    style={{ "--mt-i": String(i) } as CSSProperties}
                  >
                    {chip.label}
                  </span>
                ))}
                <span className="mt-scatter-note">仍停在不同位置</span>
              </div>
            </div>
          </article>

          <article
            className="mt-card mt-card--gap card"
            data-on={gapOn ? "on" : "waiting"}
          >
            <div className="mt-card-body">
              <h2 className="mt-card-title">
                <span className="mt-index hero-num">3</span>
                能力断点
              </h2>
              <div className="mt-chain">
                <span className="mt-chain-from">设备和信息系统数量增加</span>
                <span className="mt-chain-link">
                  <i className="mt-chain-line" aria-hidden="true" />
                  不自动形成
                </span>
                <span className="mt-chain-to">更好的整体运行能力</span>
              </div>
              <p className="mt-chain-note">
                如果信息不能相互支持，企业可能只是增加了局部工具
              </p>
            </div>
          </article>
        </div>
      </div>

      <div className={`mt-take${gapOn ? " is-on" : ""}`} aria-hidden={!gapOn}>
        <p className="mt-take-kicker">理解新型工业化与工业互联网关系的入口</p>
        <p className="mt-take-hero">
          数量不是体系能力的<em>判据</em>
        </p>
      </div>
    </div>
  );
}
