import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./QuantityToQuality.css";

const states = [
  "quantity-column-set",
  "quality-column-set",
  "pivot-criterion-stated",
] as const;

type QuantityToQualityState = (typeof states)[number];

const QUANTITY_ROWS = [
  { label: "工业规模", mark: "扩大" },
  { label: "设备投入", mark: "继续增加" },
  { label: "系统投入", mark: "继续增加" },
  { label: "其他投入", mark: "继续增加" },
];

const QUALITY_ROWS = ["创新", "生产", "资源利用", "协同"];

export default function QuantityToQuality({ step }: ChapterStepProps) {
  const state: QuantityToQualityState = states[step] ?? states[states.length - 1];
  const qualityOn = state !== "quantity-column-set";
  const pivotOn = state === "pivot-criterion-stated";

  return (
    <div className="qq-scene scene-pad">
      <h1 className="qq-thesis">
        新型工业化关注的是<em>工业发展质量</em>
      </h1>

      <div className="qq-main">
        <section
          className={`qq-col qq-col--quantity${qualityOn ? " is-muted" : ""}`}
          data-on="on"
        >
          <p className="qq-col-kicker">规模 · 投入</p>
          <h2 className="qq-col-title">量的积累</h2>
          <div className="qq-rows">
            {QUANTITY_ROWS.map((row, i) => (
              <div
                key={row.label}
                className="qq-row"
                style={{ "--qq-i": String(i) } as CSSProperties}
              >
                <span className="qq-row-mark hero-num">＋</span>
                <span className="qq-row-label">{row.label}</span>
                <span className="qq-row-note">{row.mark}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={`qq-pivot${pivotOn ? " is-on" : ""}`} aria-hidden={!pivotOn}>
          <div className="qq-pivot-card card">
            <p className="qq-pivot-kicker">区分判据</p>
            <p className="qq-pivot-hero">
              是否形成
              <em>更好的整体运行能力</em>
            </p>
            <p className="qq-pivot-note">投入是否真正服务于工业发展质量</p>
          </div>
        </div>

        <section className="qq-col qq-col--quality" data-on={qualityOn ? "on" : "waiting"}>
          <div className="qq-col-body">
            <p className="qq-col-kicker">四个方面 · 质量</p>
            <h2 className="qq-col-title">质的提升</h2>
            <div className="qq-rows">
              {QUALITY_ROWS.map((row, i) => (
                <div
                  key={row}
                  className="qq-row qq-row--quality"
                  style={{ "--qq-i": String(i) } as CSSProperties}
                >
                  <span className="qq-row-dot" aria-hidden="true" />
                  <span className="qq-row-label">{row}</span>
                </div>
              ))}
            </div>
            <p className="qq-col-result">形成更好的整体运行能力</p>
          </div>
        </section>
      </div>
    </div>
  );
}
