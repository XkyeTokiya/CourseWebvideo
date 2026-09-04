import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./IdentityAcrossStages.css";
import m003 from "./assets/m003.png";

/* states: outline 第 7 章 semantic states（2 narration beats 一一映射） */
const states = [
  "evidence-anchored",
  "four-stages-tracked",
] as const;
type IasState = (typeof states)[number];

/* 物理世界四环节（读图顺序沿原图方向推进） */
const STAGES = ["研发设计", "生产制造", "物流运输", "销售使用"];

export default function IdentityAcrossStages({ step }: ChapterStepProps) {
  const state: IasState = states[step] ?? states[states.length - 1];
  const tracked = state === "four-stages-tracked";

  return (
    <div className={`ias-scene scene-pad${tracked ? " is-tracked" : ""}`}>
      <h1 className="ias-title">
        <em>一个身份</em>，贯穿多个环节
      </h1>

      <div className="ias-main">
        {/* 证据锚点：教材图 1-4 原图完整落位，不裁切（M003 占位） */}
        <figure className="ias-figure card">
          <img
            src={m003}
            alt="教材图 1-4：物理世界四环节向数字世界的映射（占位图）"
            className="ias-photo"
          />
        </figure>

        {/* 侧位读图注：全局方向注（s1）+ 四环节行进（s2）+ 要点卡（s2） */}
        <aside className="ias-rail">
          <div className="ias-direction">
            <p className="ias-direction-tag">读图方向</p>
            <div className="ias-direction-flow">
              <span className="ias-direction-node">物理世界</span>
              <span className="ias-direction-arrow" aria-hidden />
              <span className="ias-direction-node is-digital">数字世界</span>
            </div>
          </div>

          <ol className="ias-stages">
            {STAGES.map((name, i) => (
              <li
                key={name}
                className="ias-stage"
                style={{ "--ias-i": String(i) } as CSSProperties}
              >
                <span className="ias-stage-idx hero-num">{i + 1}</span>
                <span className="ias-stage-name">{name}</span>
              </li>
            ))}
          </ol>

          <div className="ias-target">
            <span className="ias-target-label hero-num">ID</span>
            <span className="ias-target-text">同一对象的数字标识</span>
          </div>

          <div className="ias-points">
            <p className="ias-points-tag">要点 · 变与不变</p>
            <div className="ias-point">
              <span className="ias-point-mark is-var">变</span>
              <span className="ias-point-text">环节会变，叫法会变</span>
            </div>
            <div className="ias-point">
              <span className="ias-point-mark is-fix">不变</span>
              <span className="ias-point-text">身份联系，始终追得回来</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
