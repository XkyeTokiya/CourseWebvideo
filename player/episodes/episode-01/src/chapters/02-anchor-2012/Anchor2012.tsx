import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./Anchor2012.css";

const stateByStep = [
  "anchor-set",
  "anchor-qualified",
  "definition-framed",
] as const;

export default function Anchor2012Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const qualified = state !== "anchor-set";
  const framed = state === "definition-framed";

  return (
    <div className="an-scene scene-pad">
      <div className="an-body">
        <div className="an-left">
          <div className="an-year">
            <span className="hero-num an-year-num">2012</span>
            <span className="an-year-caption">时间坐标</span>
          </div>
          <div className="an-claim">
            通用电气 GE，正是在这一年提出
            <em>“工业互联网”</em>
          </div>
          <div className="an-media-ph">
            <span className="an-media-ph-mark">image · 16:9</span>
            <span className="an-media-ph-desc">2012 年前后的工业现场（素材待提供）</span>
          </div>
        </div>

        <div className="an-right">
          <div className="an-slot" data-on={qualified}>
            <span className="an-slot-tag">历史限定</span>
            <div className="an-context">
              <span className="an-context-row is-no">
                <b>×</b>不是要宣称全球唯一的首创
              </span>
              <span className="an-context-row is-yes">
                <b>→</b>为概念的出现确定一个重要的时间节点
              </span>
            </div>
          </div>

          <div className="an-slot" data-on={framed}>
            <span className="an-slot-tag">连接对象</span>
            <div className="an-def">
              <span className="an-def-lead">连接</span>
              <span className="an-def-group">
                <i>人</i>
                <i>数据</i>
                <i>机器</i>
              </span>
              <span className="an-def-lead">的开放、全球化网络</span>
            </div>
            <div className="an-def-key">
              关键不只是“互联网”三个字——原来分开管理的人、数据和机器，开始进入同一个工业问题框架。
            </div>
          </div>
        </div>
      </div>

      <div className="an-note">
        <span className="an-note-mark" />
        GE 提出的概念，把原本分开管理的人、数据和机器放进同一个工业问题框架。
      </div>
    </div>
  );
}
