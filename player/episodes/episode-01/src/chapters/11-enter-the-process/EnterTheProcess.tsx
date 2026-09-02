import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./EnterTheProcess.css";

const BANDS = [
  { no: "01", title: "从单点工具出发", desc: "局部系统已经能够完成各自任务" },
  { no: "02", title: "走向持续协同", desc: "跨设备、跨系统、跨环节形成更广范围联系" },
  { no: "03", title: "服务真实行动", desc: "机器信息被看见、理解并进入工业工作" },
] as const;

const ACCENT_STEP = 3;

const stateByStep = [
  "callback-opened",
  "synergy-needed",
  "value-formed",
] as const;

export default function EnterTheProcessChapter({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) {
    return (
      <div className="ep-accent scene-pad">
        <span className="ep-accent-kicker">最终判断</span>
        <p className="ep-accent-statement">
          判断一个系统是不是工业互联网，
          <br />
          不能只看设备有没有<em>联网</em>，
          <br />
          还要看连接是否<strong>真正进入了工业过程</strong>。
        </p>
      </div>
    );
  }

  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const activeEnd = Math.min(step + 1, 3);

  return (
    <div className="ep-scene scene-pad">
      <div className="ep-body">
        <div className="ep-media">
          <span className="ep-media-mark">image · 16:9</span>
          <span className="ep-media-desc">工业协同工作场景（素材待提供）</span>
        </div>

        <div className="ep-rail">
          <span className="ep-recall">回到开场的问题——</span>
          {BANDS.map((b, i) => {
            const st = i < activeEnd - 1 ? "past" : i === activeEnd - 1 ? "active" : "upcoming";
            return (
              <div className={`ep-band is-${st}`} key={b.no}>
                <span className="ep-band-no hero-num">{b.no}</span>
                <div className="ep-band-body">
                  <span className="ep-band-title">{b.title}</span>
                  <span className="ep-band-desc">{b.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
