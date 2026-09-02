import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./LocalVsSynergy.css";

const stateByStep = [
  "contrast-left",
  "contrast-both",
  "question-raised",
  "thesis-formed",
] as const;

export default function LocalVsSynergyChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const rightOn = state !== "contrast-left";
  const chainOn = state === "question-raised" || state === "thesis-formed";
  const thesisOn = state === "thesis-formed";

  return (
    <div className={`vs-scene scene-pad is-${state}`}>
      <div className="vs-body">
        <div className="vs-card is-left">
          <span className="vs-card-label">单点信息技术应用</span>
          <span className="vs-card-title">局部改善</span>
          <span className="vs-card-desc">单个环节的任务更快、更准</span>
        </div>

        <div className="vs-divider">
          <span className="vs-divider-badge">VS</span>
        </div>

        <div className="vs-card is-right" data-on={rightOn}>
          <span className="vs-card-label">工业互联网</span>
          <span className="vs-card-title">跨环节协同</span>
          <div className="vs-chain" data-on={chainOn}>
            <i>接住</i>
            <i>理解</i>
            <i>使用</i>
          </div>
          <span className="vs-card-desc">数据被其他环节接住、理解和使用</span>
        </div>
      </div>

      <div className="vs-thesis" data-strong={thesisOn}>
        <span className="vs-thesis-tag">分界标准</span>
        <div className="vs-thesis-body">
          <span className="vs-thesis-main">
            能否围绕同一目标持续配合，决定局部工具能否成为共同支撑。
          </span>
          {thesisOn && (
            <span className="vs-thesis-ext">
              问题从“单台设备能不能工作得更好”扩展成“不同工业要素能不能围绕同一个目标持续配合”。
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
