import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009ReturnOnsite.css";

const states = [
  "object-confirmed-found",
  "upstream-pointed",
  "workline-formed",
] as const;

type RoState = (typeof states)[number];

export default function A009ReturnOnsite({ step }: ChapterStepProps) {
  const state: RoState = states[step] ?? states[states.length - 1];
  const upstreamOn = state !== "object-confirmed-found";
  const worklineOn = state === "workline-formed";

  return (
    <div className={`ro-scene scene-pad${worklineOn ? " is-workline" : ""}`}>
      <h1 className="ro-title">一次检修沿三层关系走完</h1>

      <div className="ro-main">
        <aside className="ro-rail">
          <article className={`ro-item card${!worklineOn && upstreamOn ? " is-dim" : ""}`}>
            <span className="ro-item-no hero-num">01</span>
            <div className="ro-item-body">
              <p className="ro-item-lead">从现场标识<b>确认对象</b></p>
              <p className="ro-item-note">
                沿可用的查询关系，找到与这台设备关联的
                <b>型号、制造、交付或维护信息</b>
              </p>
            </div>
          </article>

          <article
            className={`ro-item card ro-item-late${upstreamOn ? " is-on" : ""}${worklineOn ? "" : " is-focus"}`}
            aria-hidden={!upstreamOn}
          >
            <span className="ro-item-no hero-num">02</span>
            <div className="ro-item-body">
              <p className="ro-item-lead">
                上游主体提供时，<b>解析关系继续指向</b>
              </p>
              <p className="ro-item-note">相应的信息或访问入口</p>
            </div>
          </article>

          <article
            className={`ro-item card ro-item-late ro-item-workline${worklineOn ? " is-on" : ""}`}
            aria-hidden={!worklineOn}
          >
            <span className="ro-item-no hero-num">03</span>
            <div className="ro-item-body">
              <p className="ro-item-lead">围绕<b>同一个对象</b>，连成<b>同一条工作线索</b></p>
              <p className="ro-item-note">现场的故障 · 历史记录 · 协作各方</p>
            </div>
          </article>
        </aside>

        <figure className="ro-media">
          <div className="ro-frame">
            <div className="ro-placeholder">
              <span className="label-mono">image · 16:9</span>
              <span className="ro-ph-desc">M004 回到开场的检修现场（待生成）</span>
              <span className="ro-ph-note">photorealistic_ai · 不含界面、字段与诊断结论</span>
            </div>
          </div>
          <figcaption className="ro-cap">
            <span>M004 · 开场现场回扣（placeholder）</span>
            <span>三层机制落回同一对象</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
