import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004ActiveIdPositioning.css";

const states = [
  "systems-unified",
  "carrier-embedded",
  "self-reporting-role",
] as const;

type A004State = (typeof states)[number];

const STATE_CLASS: Record<A004State, string> = {
  "systems-unified": "is-unified",
  "carrier-embedded": "is-embedded",
  "self-reporting-role": "is-reporting",
};

const varI = (i: number) => ({ "--ap-i": String(i) }) as CSSProperties;

export default function A004ActiveIdPositioning({ step }: ChapterStepProps) {
  const state: A004State = states[step] ?? states[states.length - 1];
  const embedded = state !== "systems-unified";
  const reporting = state === "self-reporting-role";

  return (
    <div className={`ap-scene scene-pad ${STATE_CLASS[state]}`}>
      <header className="ap-head">
        <h1 className="ap-title">让模具自己报状态</h1>
        <p className="ap-head-note">主动标识 · 在本案中的角色</p>
      </header>
      <div className="ap-head-rule rule" aria-hidden="true" />

      <div className="ap-main">
        <figure className="ap-media">
          <div className="ap-sheet">
            <i className="ap-corner ap-corner-tl" aria-hidden="true" />
            <i className="ap-corner ap-corner-tr" aria-hidden="true" />
            <i className="ap-corner ap-corner-bl" aria-hidden="true" />
            <i className="ap-corner ap-corner-br" aria-hidden="true" />

            <div className="ap-ph">
              <span className="ap-ph-tag">IMAGE · 16:9</span>
              <span className="ap-ph-title">注塑机与模具生产现场</span>
              <span className="ap-ph-note">素材待提供（photorealistic_ai）</span>
            </div>

            <div className="ap-titleblock">
              <span>M002</span>
              <span>注塑机与模具生产现场</span>
              <span>16:9</span>
            </div>
          </div>
          <figcaption className="ap-cap">
            <span>M002 · 注塑机与模具生产现场（placeholder）</span>
            <span>设备面板不显示可读参数</span>
          </figcaption>
        </figure>

        <aside className="ap-rail">
          <div className="ap-spine">
            <span className="ap-spine-lead">共同对象</span>

            <div className={`ap-report${reporting ? " is-on" : ""}`} aria-hidden={!reporting}>
              <i className="ap-report-arrow" aria-hidden="true" />
              <span>主动报告</span>
            </div>

            <div className="ap-mold">
              <span className="ap-mold-name">模具</span>
              <div className={`ap-chip${embedded ? " is-in" : ""}`} aria-hidden={!embedded}>
                <i />
                <i />
                <i />
              </div>
            </div>

            <p className={`ap-mold-legend${embedded ? " is-on" : ""}`} aria-hidden={!embedded}>
              <span>主动标识载体</span>
              <span>嵌入模具</span>
            </p>
          </div>

          <div className="ap-notes">
            <article className="ap-note card ap-note-1">
              <header className="ap-note-head">
                <span className="ap-no hero-num">01</span>
                <span className="ap-note-tag">统一管理 · 系统打通</span>
              </header>

              <p className="ap-claim">标识解析统一管理模具信息</p>

              <div className="ap-chain">
                <span className="ap-chain-node" style={varI(0)}>
                  标识解析
                </span>
                <span className="ap-chain-link" style={varI(1)} aria-hidden="true" />
                <span className="ap-chain-node is-mid" style={varI(2)}>
                  统一管理
                </span>
                <span className="ap-chain-link" style={varI(3)} aria-hidden="true" />
                <span className="ap-chain-node" style={varI(4)}>
                  模具信息
                </span>
              </div>

              <div className="ap-bridge">
                <span className="ap-sys">设计开发系统</span>
                <span className="ap-bridge-bar">
                  <em>打通</em>
                  <i aria-hidden="true" />
                </span>
                <span className="ap-sys">生产制造系统</span>
              </div>

              <div className={`ap-lineb${embedded ? " is-on" : ""}`}>
                <p className="ap-claim ap-claim-b">在模具中嵌入主动标识载体</p>
                <div className="ap-does">
                  <span>主动采集</span>
                  <span>传输数据</span>
                </div>
              </div>
            </article>

            <article className="ap-note card ap-note-2">
              <header className="ap-note-head">
                <span className="ap-no hero-num">02</span>
                <span className="ap-note-tag">互联 · 角色落点</span>
              </header>

              <p className="ap-claim">主动标识载体与注塑机管理系统互联</p>

              <div className={`ap-verdict${reporting ? " is-on" : ""}`}>
                <span className="ap-verdict-kicker">主动标识的角色</span>
                <p className="ap-verdict-text">
                  让模具这个对象，<em>主动报告自己的状态</em>
                </p>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
