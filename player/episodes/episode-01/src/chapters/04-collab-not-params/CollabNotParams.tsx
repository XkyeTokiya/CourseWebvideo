import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./CollabNotParams.css";

const CARDS = [
  { no: "01", title: "机器产生信息", desc: "真实运行状态不再只留在机器内部" },
  { no: "02", title: "信息被采集分析", desc: "数据帮助人理解设备状态" },
  { no: "03", title: "服务维护行动", desc: "判断进入实际维护安排" },
  { no: "04", title: "形成协作关系", desc: "机器、数据和人进入同一个工作过程" },
] as const;

const stateByStep = [
  "info-collected",
  "action-serving",
  "boundary-crossed",
  "concept-clear",
] as const;

export default function CollabNotParamsChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const activeEnd = Math.min(step + 2, 4);
  const sceneNote = step >= 1 && step < 3;

  return (
    <div className="cp-scene scene-pad">
      <div className={`cp-chain${state === "concept-clear" ? " is-settled" : ""}`}>
        {CARDS.map((c, i) => {
          const st =
            i < activeEnd - 1 ? "past" : i === activeEnd - 1 ? "active" : "upcoming";
          return (
            <div className="cp-cell" key={c.no}>
              <div className={`cp-card is-${st}`}>
                <div className="cp-card-no hero-num">{c.no}</div>
                <div className="cp-card-title">{c.title}</div>
                <div className="cp-card-desc">{c.desc}</div>
                {i === 2 && sceneNote && (
                  <div className="cp-card-note">工业现场不再只是“机器自己运行”</div>
                )}
              </div>
              {i < CARDS.length - 1 && (
                <span className={`cp-arrow${i < activeEnd - 1 ? " is-on" : ""}`}>→</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="cp-boundary" data-strong={state === "concept-clear"}>
        <span className="cp-boundary-tag">边界</span>
        <span className="cp-boundary-text">
          不补写工程参数：具体机型、传感器数量和算法先放在一边
        </span>
        {state === "concept-clear" && (
          <span className="cp-boundary-tail">重点是信息进入更大的工作过程。</span>
        )}
      </div>
    </div>
  );
}
