import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./EngineDataPath.css";

const BANDS = [
  { no: "01", title: "采集飞行数据", desc: "发动机传感器记录真实运行状态" },
  { no: "02", title: "传回并分析", desc: "飞行数据进入数据中心形成设备状态判断" },
  { no: "03", title: "支持预测性维护", desc: "维护人员依据分析结果安排维护" },
] as const;

const stateByStep = [
  "capture-shown",
  "analysis-serving-maintenance",
  "collaboration-trackable",
] as const;

export default function EngineDataPathChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const activeEnd = step >= 2 ? 3 : step + 2;
  const bridge = step >= 1;

  return (
    <div className="ed-scene scene-pad">
      <div className="ed-body">
        <div className="ed-rail">
          <span
            className="ed-rail-progress"
            style={{ height: `${(Math.min(step + 1, 3) / 3) * 100}%` }}
          />
          {BANDS.map((b, i) => {
            const st =
              i < activeEnd - 1 ? "past" : i === activeEnd - 1 ? "active" : "upcoming";
            return (
              <div className={`ed-band is-${st}`} key={b.no}>
                <div className="ed-band-no hero-num">{b.no}</div>
                <div className="ed-band-body">
                  <div className="ed-band-title">{b.title}</div>
                  <div className="ed-band-desc">{b.desc}</div>
                  {i === 1 && bridge && (
                    <div className="ed-band-note">
                      这样一来，发动机的运行状态不再只留在机器内部。
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ed-media">
          <span className="ed-media-mark">image · 16:9</span>
          <span className="ed-media-desc">航空发动机运行与维护场景（素材待提供）</span>
        </div>
      </div>

      <div className="ed-bottom" data-strong={state === "collaboration-trackable"}>
        <span className="ed-bottom-mark" />
        航空发动机案例让人、机器和数据之间的协作变得可追踪。
      </div>
    </div>
  );
}
