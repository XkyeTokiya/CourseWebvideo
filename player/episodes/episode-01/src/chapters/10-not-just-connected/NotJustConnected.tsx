import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./NotJustConnected.css";

const stateByStep = [
  "boundary-one-set",
  "boundary-two-set",
  "positive-condition",
] as const;

export default function NotJustConnectedChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const rightOn = state !== "boundary-one-set";
  const positive = state === "positive-condition";

  return (
    <div className="nj-scene scene-pad">
      <div className="nj-body">
        <div className="nj-card">
          <span className="nj-card-tag">边界一</span>
          <div className="nj-card-headline">
            <span className="nj-card-claim">设备接入网络</span>
            <span className="nj-card-neq hero-num">≠</span>
            <span className="nj-card-claim">工业互联网</span>
          </div>
          <span className="nj-card-desc">
            如果数据仍然停留在一个孤立系统里，跨环节的协同没有发生，原来的问题就还在。
          </span>
        </div>

        <div className="nj-card" data-on={rightOn}>
          <span className="nj-card-tag">边界二</span>
          <div className="nj-card-headline">
            <span className="nj-card-claim">消费互联网做法</span>
            <span className="nj-card-neq hero-num">≠</span>
            <span className="nj-card-claim">直接搬进工厂</span>
          </div>
          <span className="nj-card-desc">
            工业现场有真实的设备、生产流程和运行目标。
          </span>
        </div>
      </div>

      <div className="nj-bottom" data-strong={positive}>
        <span className="nj-bottom-mark" />
        连接必须围绕真实设备、生产流程和运行目标发生——不能只停留在“连上了”这个动作上。
      </div>
    </div>
  );
}
